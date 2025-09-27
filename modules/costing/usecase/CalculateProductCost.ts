import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { overheads } from "../infrastructure/db/schema.ts";
import { movements } from "@modules/inventory/infrastructure/db/schema.ts";
import { eq, and } from "drizzle-orm";

export class CalculateProductCost {
  async exec(productItemId: string) {
    const consumes = await db.select().from(movements).where(eq(movements.type, "manufact_consume")) as any[];
    const outputs = await db.select().from(movements).where(and(eq(movements.type, "manufact_output"), eq(movements.itemId, productItemId))) as any[];
    const totalConsumed = consumes.reduce((s,c)=>s+Number(c.amount||0),0);
    const totalOutput = outputs.reduce((s,o)=>s+Number(o.qty||0),0) || 1;
    const materialPerUnit = Math.abs(totalConsumed) / totalOutput;
    const ovs = await db.select().from(overheads) as any[];
    const overheadPerUnit = ovs.reduce((s,o)=>s+Number(o.perUnit||0),0);
    const totalCostPerUnit = materialPerUnit + overheadPerUnit;
    return { materialPerUnit, overheadPerUnit, totalCostPerUnit };
  }
}
