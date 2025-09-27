import { CalculateProductCost } from "@modules/costing/usecase/CalculateProductCost.ts";

export async function GET(req: Request){
  const url = new URL(req.url);
  const product = url.searchParams.get("product");
  if(!product) return new Response("product required", { status: 400 });
  const svc = new CalculateProductCost();
  const res = await svc.exec(product);
  return new Response(JSON.stringify(res), { headers:{ "Content-Type":"application/json" } });
}
