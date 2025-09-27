"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx"; import { Button } from "@/components/ui/button.tsx";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table.tsx";

export default function EfficiencyDashboard(){
  const [product, setProduct] = useState(""); const [material, setMaterial] = useState("");
  const [perUnit, setPerUnit] = useState<any[]>([]); const [yieldRows, setYieldRows] = useState<any[]>([]);
  const [outTotal, setOutTotal] = useState(0); const [consTotal, setConsTotal] = useState(0);

  async function run(){
    const r1 = await fetch(`/api/reports/per-unit-usage?product=${encodeURIComponent(product)}`);
    if (r1.ok) { const d = await r1.json(); setPerUnit(d.rows||[]); setOutTotal(d.outTotal||0); }
    const r2 = await fetch(`/api/reports/material-yield?material=${encodeURIComponent(material)}`);
    if (r2.ok) { const d = await r2.json(); setYieldRows(d.rows||[]); setConsTotal(d.consTotal||0); }
  }

  return <div className="space-y-6">
    <h1 className="text-xl font-semibold">効率ダッシュボード</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 className="font-medium">製品1個あたり材料使用量</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="productItemId" value={product} onChange={e=>setProduct(e.target.value)}/>
          <Button onClick={run}>更新</Button>
        </div>
        <p className="text-sm text-neutral-600">総生産量: {outTotal}</p>
        <Table><THead><TR><TH>materialItemId</TH><TH>実績使用量/個</TH></TR></THead>
          <TBody>{perUnit.map((r:any)=>(<TR key={r.materialItemId}><TD>{r.materialItemId}</TD><TD>{Number(r.unitPerProduct_actual).toFixed(4)}</TD></TR>))}</TBody>
        </Table>
      </div>
      <div className="space-y-3">
        <h2 className="font-medium">材料1単位あたりの出来高</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="materialItemId" value={material} onChange={e=>setMaterial(e.target.value)}/>
          <Button onClick={run}>更新</Button>
        </div>
        <p className="text-sm text-neutral-600">総消費量: {consTotal}</p>
        <Table><THead><TR><TH>productItemId</TH><TH>出来高（個/材料単位）</TH></TR></THead>
          <TBody>{yieldRows.map((r:any)=>(<TR key={r.productItemId}><TD>{r.productItemId}</TD><TD>{Number(r.unitsPerMaterial).toFixed(4)}</TD></TR>))}</TBody>
        </Table>
      </div>
    </div>
  </div>;
}
