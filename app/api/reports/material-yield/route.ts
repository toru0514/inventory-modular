import { ReportMaterialYield } from "@modules/manufacturing/usecase/ReportMaterialYield.ts";

export async function GET(req: Request){
  const url = new URL(req.url);
  const material = url.searchParams.get("material");
  if(!material) return new Response("material required", { status: 400 });
  const data = await new ReportMaterialYield().exec(material);
  return new Response(JSON.stringify(data), { headers:{ "Content-Type":"application/json" } });
}
