import { db } from "@modules/shared/infrastructure/db/drizzle";
import { catalogItems } from "@modules/catalog/infrastructure/db/schema";
export async function GET(){
  const rows = await db.select().from(catalogItems);
  return new Response(JSON.stringify(rows), { headers:{ "Content-Type":"application/json" } });
}
