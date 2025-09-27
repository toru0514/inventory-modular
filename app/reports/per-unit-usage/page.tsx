"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table.tsx";

export default function PerUnitUsagePage(){
  const [product, setProduct] = useState(""); const [rows,setRows]=useState<any[]>([]); const [total,setTotal]=useState(0);
  async function load(){
    const r = await fetch(`/api/reports/per-unit-usage?product=${encodeURIComponent(product)}`);
    if(!r.ok) return;
    const data = await r.json(); setRows(data.rows||[]); setTotal(data.outTotal||0);
  }
  return <div className="space-y-4">
    <h1 className="text-xl font-semibold">製品1個あたり使用量（実績）</h1>
    <div className="flex items-center gap-2">
      <Input placeholder="productItemId" value={product} onChange={e=>setProduct(e.target.value)}/>
      <Button onClick={load}>表示</Button>
    </div>
    <p className="text-sm text-neutral-600">対象製品の確定ワークオーダーから、材料ごとの「実績：1個あたり使用量」を集計します。（標準BOMとの比較は次段）</p>
    <p className="text-sm">総生産量: {total}</p>
    <Table><THead><TR><TH>materialItemId</TH><TH>実績使用量/個</TH></TR></THead>
      <TBody>{rows.map((r:any)=> <TR key={r.materialItemId}><TD>{r.materialItemId}</TD><TD>{Number(r.unitPerProduct_actual).toFixed(4)}</TD></TR>)}</TBody>
    </Table>
  </div>;
}
