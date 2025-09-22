import { db } from "@modules/shared/infrastructure/db/drizzle";
import { movements } from "@modules/inventory/infrastructure/db/schema";
import { catalogItems } from "@modules/catalog/infrastructure/db/schema";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export default async function InventoryPage(){
  const mvs = await db.select().from(movements) as any[];
  const agg = new Map<string, { qty: number, amount: number }>();
  for (const m of mvs) {
    const qty = Number(m.qty)||0;
    const amt = Number(m.amount)||0;
    const cur = agg.get(m.itemId) || { qty: 0, amount: 0 };
    agg.set(m.itemId, { qty: cur.qty + qty, amount: cur.amount + amt });
  }
  const items = await db.select().from(catalogItems) as any[];
  const nameById = new Map(items.map(i=>[i.id, i.name]));
  const rows = Array.from(agg.entries()).map(([itemId, v]) => {
    const avg = v.qty !== 0 ? v.amount / v.qty : 0;
    return { itemId, name: nameById.get(itemId) ?? itemId, qty: v.qty, avgUnitCost: avg, valuation: v.qty * avg };
  }).sort((a,b)=>a.name.localeCompare(b.name));

  return <div className="space-y-4">
    <h1 className="text-xl font-semibold">在庫（数量・単価・評価額）</h1>
    <p className="text-sm text-neutral-600">movements の数量・金額を集計して平均単価を算出しています（簡易的な移動平均相当）。</p>
    <Table>
      <THead>
        <TR><TH>品目</TH><TH>在庫数量</TH><TH>平均単価</TH><TH>評価額</TH></TR>
      </THead>
      <TBody>
        {rows.map(r => (<TR key={r.itemId}>
          <TD>{r.name}</TD>
          <TD>{r.qty}</TD>
          <TD>{r.avgUnitCost.toFixed(2)}</TD>
          <TD>{r.valuation.toFixed(2)}</TD>
        </TR>))}
      </TBody>
    </Table>
  </div>;
}
