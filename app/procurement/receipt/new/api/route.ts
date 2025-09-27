import { RecordPurchaseReceipt } from "@modules/procurement/usecase/RecordPurchaseReceipt.ts";

export async function POST(req: Request){
  const body = await req.json();
  const svc = new RecordPurchaseReceipt();
  const res = await svc.exec({
    receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
    supplier: body.supplier,
    lines: (body.lines||[]).map((l:any)=>({ itemId:l.itemId, qty:Number(l.qty||0), unitCost:Number(l.unitCost||0), note:l.note }))
  });
  return new Response(JSON.stringify(res), { headers:{ "Content-Type":"application/json" } });
}
