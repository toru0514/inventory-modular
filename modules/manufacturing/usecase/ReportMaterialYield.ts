import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { workConsume, workOutput, workOrders } from "../infrastructure/db/schema.ts";

export class ReportMaterialYield {
  async exec(materialId: string, from?: Date, to?: Date){
    const [cons, wos, outs] = await Promise.all([
      db.select().from(workConsume) as Promise<any[]>,
      db.select().from(workOrders) as Promise<any[]>,
      db.select().from(workOutput) as Promise<any[]>,
    ]);

    const postedInRangeIds = new Set(
      wos
        .filter(wo => {
          if (!wo.postedAt) return false;
          const postedAt = new Date(wo.postedAt);
          if (from && postedAt < from) return false;
          return !(to && postedAt > to);

        })
        .map(wo => wo.id)
    );

    if (!postedInRangeIds.size) {
      return { materialId, consTotal: 0, rows: [] };
    }

    const consInRange = cons.filter(c => postedInRangeIds.has(c.woId));
    const targetWoIds = new Set(
      consInRange
        .filter(c => c.materialItemId === materialId)
        .map(c => c.woId)
    );

    if (!targetWoIds.size) {
      return { materialId, consTotal: 0, rows: [] };
    }

    const consTotal = consInRange
      .filter(c => c.materialItemId === materialId)
      .reduce((sum, c) => sum + Number(c.qty || 0), 0);
    const outsFiltered = outs.filter(o => targetWoIds.has(o.woId));

    // sum product outputs grouped by product
    const map: Record<string,{ productItemId: string, outSum: number }> = {};
    for (const o of outsFiltered){
      const k = o.productItemId; map[k] = map[k] || { productItemId: k, outSum: 0 };
      map[k].outSum += Number(o.qty || 0);
    }
    const rows = Object.values(map).map(r=>({
      productItemId: r.productItemId,
      unitsPerMaterial: consTotal ? r.outSum / consTotal : 0
    }));
    return { materialId, consTotal, rows };
  }
}
