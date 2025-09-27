import { MovementRepository } from "@modules/inventory/infrastructure/db/MovementRepository.drizzle.ts";

export async function POST(req: Request){
  const form = await req.formData(); const file = form.get("file") as File | null;
  if(!file) return new Response("file required", { status: 400 });
  const text = await file.text();
  const rows = text.trim().split(/\r?\n/).map(l=>l.split(",")).map(a=>({ itemId:a[0], qty:Number(a[1]||0), unitCost:Number(a[2]||0) }));
  const repo = new MovementRepository();
  const data = rows.filter(r=>r.itemId && r.qty).map(r=>({ itemId:r.itemId, type:"stock_adjust", qty:r.qty, unitCost:r.unitCost, amount:r.qty*r.unitCost, refBc:"opening", refId:"YYYYMM" }));
  if (data.length) await repo.insertMany(data);
  return new Response(JSON.stringify({ inserted: data.length }), { headers:{ "Content-Type":"application/json" } });
}
