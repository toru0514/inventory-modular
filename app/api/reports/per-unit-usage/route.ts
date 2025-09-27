import { ReportPerUnitUsage } from "@modules/manufacturing/usecase/ReportPerUnitUsage.ts";

export async function GET(req: Request){
  const url = new URL(req.url);
  const product = url.searchParams.get("product");
  if(!product) return new Response("product required", { status: 400 });
  const data = await new ReportPerUnitUsage().exec(product);
  return new Response(JSON.stringify(data), { headers:{ "Content-Type":"application/json" } });
}
