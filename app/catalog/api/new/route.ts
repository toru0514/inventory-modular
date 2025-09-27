import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { catalogItems } from "@modules/catalog/infrastructure/db/schema.ts";
import { randomUUID } from "crypto";

export async function POST(req: Request){
  const b = await req.json();
  await db.insert(catalogItems).values({
    id: randomUUID(),
    name: b.name,
    type: "product",
    uom: b.uom ?? "pcs",
    defaultPrice: (b.defaultPrice ?? null) as any,
    defaultCost: (b.defaultCost ?? null) as any,
    costMethod: "weighted_avg",
  });
  return new Response(JSON.stringify({ ok:true }), { headers:{ "Content-Type":"application/json" } });
}
