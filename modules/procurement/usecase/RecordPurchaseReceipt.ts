import { v4 as uuid } from "uuid";
import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { purchaseReceipts, purchaseLines } from "../infrastructure/db/schema.ts";
import { MovementRepository } from "@modules/inventory/infrastructure/db/MovementRepository.drizzle.ts";

export type PurchaseLineInput = { itemId: string; qty: number; unitCost: number; note?: string };
export class RecordPurchaseReceipt {
  async exec(input: { receivedAt?: Date; supplier?: string; note?: string; lines: PurchaseLineInput[] }) {
    const id = uuid();
    const ts = input.receivedAt ?? new Date();
    await db.insert(purchaseReceipts).values({ id, receivedAt: ts, supplier: input.supplier ?? null, note: input.note ?? null });

    const lines = input.lines.map(l => ({
      receiptId: id,
      itemId: l.itemId,
      qty: l.qty as any,
      unitCost: l.unitCost as any,
      amount: (l.qty * l.unitCost) as any,
      note: l.note ?? null,
    }));
    if (lines.length) await db.insert(purchaseLines).values(lines);

    // Create movements
    const repo = new MovementRepository();
    await repo.insertMany(lines.map(l => ({
      itemId: l.itemId,
      ts,
      type: "purchase_receipt",
      qty: l.qty,
      unitCost: l.unitCost,
      amount: l.amount,
      refBc: "procurement",
      refId: id,
      note: l.note ?? undefined,
    })));
    return { id, lines: lines.length };
  }
}
