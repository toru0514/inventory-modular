import { db } from "@modules/shared/infrastructure/db/drizzle";
import { overheads } from "@modules/costing/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function GET(){
  const rows = await db.select().from(overheads);
  return new Response(JSON.stringify(rows), { headers:{ "Content-Type":"application/json" } });
}

export async function POST(req:Request){
  const body = await req.json();
  const id = body.id && body.id !== "" ? body.id : uuid();
  await db.insert(overheads).values({ id, name: body.name, perUnit: body.perUnit }).onConflictDoUpdate({
    target: overheads.id,
    set: { name: body.name, perUnit: body.perUnit }
  });
  return new Response(JSON.stringify({ ok:true, id }));
}
