import { db } from "@modules/shared/infrastructure/db/drizzle";
import { workOrders, workConsume, workOutput } from "@modules/manufacturing/infrastructure/db/schema";
import { MovementRepository } from "@modules/inventory/infrastructure/db/MovementRepository.drizzle";
import { catalogItems } from "@modules/catalog/infrastructure/db/schema";
import { movements } from "@modules/inventory/infrastructure/db/schema";
import { eq, inArray } from "drizzle-orm";

// 指定 item の現時点の在庫平均単価（amount合計 ÷ qty合計）を返す
async function avgCostFor(itemId: string): Promise<number> {
  const rows = await db.select().from(movements).where(eq(movements.itemId, itemId)) as any[];
  const qtySum = rows.reduce((s, r) => s + Number(r.qty || 0), 0);
  const amtSum = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  return qtySum !== 0 ? amtSum / qtySum : 0;
}

export async function POST(req: Request){
  const url = new URL(req.url);
  const woId = url.searchParams.get("woId");
  if(!woId) return new Response("woId required", { status: 400 });

  const consumes = await db.select().from(workConsume).where(eq(workConsume.woId, woId)) as any[];
  const outputs  = await db.select().from(workOutput).where(eq(workOutput.woId, woId)) as any[];
  if (consumes.length===0 && outputs.length===0) return new Response("no data", { status: 400 });

  // catalog から defaultCost を取得（平均単価が0のときのフォールバック用）
  const matIds = Array.from(new Set(consumes.map(c=>c.materialItemId)));
  const prodIds = Array.from(new Set(outputs.map(o=>o.productItemId)));
  const ids = Array.from(new Set([...matIds, ...prodIds]));
  const items = ids.length
    ? await db.select().from(catalogItems).where(inArray(catalogItems.id, ids as any)) as any[]
    : [];
  const defaultCostById = new Map(items.map(i => [i.id, Number(i.defaultCost || 0)]));

  // 材料ごとの消費単価＝在庫平均単価（0 の場合のみ defaultCost を使用）
  const matUnitCost = new Map<string, number>();
  for (const c of consumes) {
    if (!matUnitCost.has(c.materialItemId)) {
      const avg = await avgCostFor(c.materialItemId); // movements から算出
      const fallback = defaultCostById.get(c.materialItemId) || 0;
      matUnitCost.set(c.materialItemId, avg || fallback);
    }
  }

  // 消費 movements（単価 × 数量で金額、符号は消費なのでマイナス）
  const consumeMovs = consumes.map(c => {
    const unitCost = matUnitCost.get(c.materialItemId) ?? 0;
    const qty = Math.abs(Number(c.qty));
    const amount = unitCost * qty;
    return {
      itemId: c.materialItemId,
      type: "manufact_consume",
      qty: -qty,
      unitCost,
      amount: -amount,
      refBc: "manufacturing",
      refId: woId
    };
  });

  // 消費合計（負値）を、出来高で按分して完成品の金額を設定
  const totalConsumed = consumeMovs.reduce((s,m)=> s + (Number(m.amount) || 0), 0); // negative
  const totalOutputQty = outputs.reduce((s,o)=> s + Math.abs(Number(o.qty)), 0) || 1;

  const outputMovs = outputs.map(o => {
    const qty = Math.abs(Number(o.qty));
    const allocatedAmountPos = Math.abs(totalConsumed) * (qty / totalOutputQty); // 完成は正の金額
    const unitCost = qty !== 0 ? allocatedAmountPos / qty : 0;
    return {
      itemId: o.productItemId,
      type: "manufact_output",
      qty,
      unitCost,
      amount: allocatedAmountPos,
      refBc: "manufacturing",
      refId: woId
    };
  });

  const repo = new MovementRepository();
  await repo.insertMany([...consumeMovs, ...outputMovs]);

  // best-effort: 仕訳済みタイムスタンプ
  await db.update(workOrders).set({ postedAt: new Date() }).where(eq(workOrders.id, woId));

  return new Response(
    JSON.stringify({ movements: consumeMovs.length + outputMovs.length, consumedAmount: totalConsumed }),
    { headers:{ "Content-Type":"application/json" } }
  );
}
