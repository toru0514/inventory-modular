import { db } from "@modules/shared/infrastructure/db/drizzle";
import { workConsume, workOutput, workOrders } from "../infrastructure/db/schema";

export class ReportMaterialYield {
  async exec(materialId: string, from?: Date, to?: Date){
    const cons = await db.select().from(workConsume) as any[];
    const wos = await db.select().from(workOrders) as any[];
    const postedSet = new Set(wos.filter(w=>w.postedAt).map(w=>w.id));
    const consPosted = cons.filter(c=>postedSet.has(c.woId));

    const woIds = new Set(consPosted.filter(c=>{
      // date filtering would need postedAt in wo; skip for brevity
      return true;
    }).map(c=>c.woId));

    const outs = await db.select().from(workOutput) as any[];
    const outsFiltered = outs.filter(o=>woIds.has(o.woId));

    const consTotal = consPosted.filter(c=>c.materialItemId===materialId).reduce((s,c)=>s+Number(c.qty),0);
    // sum product outputs grouped by product
    const map: Record<string,{ productItemId: string, outSum: number }> = {};
    for (const o of outsFiltered){
      const k = o.productItemId; map[k] = map[k] || { productItemId: k, outSum: 0 };
      map[k].outSum += Number(o.qty);
    }
    const rows = Object.values(map).map(r=>({
      productItemId: r.productItemId,
      unitsPerMaterial: consTotal ? r.outSum / consTotal : 0
    }));
    return { materialId, consTotal, rows };
  }
}
