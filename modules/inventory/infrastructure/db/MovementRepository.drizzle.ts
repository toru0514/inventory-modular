import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { movements } from "./schema.ts";
import { v4 as uuid } from "uuid";

export interface NewMovement {
  itemId: string;
  ts?: Date;
  type: string;
  qty: number | string;
  unitCost?: number | string;
  amount?: number | string;
  refBc?: string;
  refId?: string;
  note?: string;
}

export class MovementRepository {
  async insertMany(rows: NewMovement[]) {
    const now = new Date();
    await db.insert(movements).values(rows.map(r => ({
      id: uuid(),
      itemId: r.itemId,
      ts: r.ts ?? now,
      type: r.type,
      qty: r.qty as any,
      unitCost: (r.unitCost ?? 0) as any,
      amount: (r.amount ?? 0) as any,
      refBc: r.refBc,
      refId: r.refId,
      note: r.note
    })));
  }
}
