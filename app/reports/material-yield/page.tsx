"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export default function MaterialYieldPage(){
  const [material, setMaterial] = useState(""); const [rows,setRows]=useState<any[]>([]); const [consTotal,setConsTotal]=useState(0);
  async function load(){
    const r = await fetch(`/api/reports/material-yield?material=${encodeURIComponent(material)}`);
    if(!r.ok) return;
    const data = await r.json(); setRows(data.rows||[]); setConsTotal(data.consTotal||0);
  }
  return <div className="space-y-4">
    <h1 className="text-xl font-semibold">材料1単位あたりの出来高（実績）</h1>
    <div className="flex items-center gap-2">
      <Input placeholder="materialItemId" value={material} onChange={e=>setMaterial(e.target.value)}/>
      <Button onClick={load}>表示</Button>
    </div>
    <p className="text-sm text-neutral-600">対象材料を消費した確定ワークオーダーから、各製品の出来高/材料単位を集計します。</p>
    <p className="text-sm">総消費量: {consTotal}</p>
    <Table><THead><TR><TH>productItemId</TH><TH>出来高（個/材料単位）</TH></TR></THead>
      <TBody>{rows.map((r:any)=> <TR key={r.productItemId}><TD>{r.productItemId}</TD><TD>{Number(r.unitsPerMaterial).toFixed(4)}</TD></TR>)}</TBody>
    </Table>
  </div>;
}
