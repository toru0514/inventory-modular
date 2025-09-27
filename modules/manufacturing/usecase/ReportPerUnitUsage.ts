import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { workConsume, workOutput, workOrders } from "../infrastructure/db/schema.ts";
import { eq } from "drizzle-orm";

export class ReportPerUnitUsage {
  async exec(productId: string, from?: Date, to?: Date){
    // naive aggregation in JS using selected rows
    const outs = await db.select().from(workOutput).where(eq(workOutput.productItemId, productId)) as any[];
    const wos = await db.select().from(workOrders) as any[];
    const postedSet = new Set(wos.filter(w=>w.postedAt).map(w=>w.id));
    const outsPosted = outs.filter(o=>postedSet.has(o.woId)).filter(o=>{
      if (from && new Date(o.postedAt||o.startedAt) < from) return false;
      return !(to && new Date(o.postedAt || o.startedAt) > to);

    });

    const woIds = new Set(outsPosted.map(o=>o.woId));
    const cons = await db.select().from(workConsume) as any[];
    const consFiltered = cons.filter(c=>woIds.has(c.woId));

    // sum per material
    const outTotal = outsPosted.reduce((s,o)=>s + Number(o.qty), 0);
    const map: Record<string, { materialItemId: string, consSum: number }> = {};
    for (const c of consFiltered){
      const k = c.materialItemId;
      map[k] = map[k] || { materialItemId: k, consSum: 0 };
      map[k].consSum += Number(c.qty);
    }
    const rows = Object.values(map).map(r=>({
      materialItemId: r.materialItemId,
      unitPerProduct_actual: outTotal ? r.consSum / outTotal : 0
    }));
    return { productId, outTotal, rows };
  }
}
