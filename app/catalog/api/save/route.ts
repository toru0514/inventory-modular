import { db } from "@modules/shared/infrastructure/db/drizzle.ts";
import { catalogItems } from "@modules/catalog/infrastructure/db/schema.ts";
import { eq } from "drizzle-orm";
export async function POST(req: Request){
  const body = await req.json();
  await db.update(catalogItems).set({
    defaultCost: (body.defaultCost ?? null) as any,
    defaultPrice: (body.defaultPrice ?? null) as any
  }).where(eq(catalogItems.id, body.id));
  return new Response(JSON.stringify({ ok:true }), { headers:{ "Content-Type":"application/json" } });
}
