"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export default function CatalogPage(){
  const [rows,setRows]=useState<any[]>([]);
  const [saving,setSaving]=useState(false);

  async function load(){
    const r=await fetch("/catalog/api/list"); if(!r.ok) return; setRows(await r.json());
  }
  async function save(row:any){
    setSaving(true);
    await fetch("/catalog/api/save", { method:"POST", body: JSON.stringify(row) });
    setSaving(false); await load();
  }
  useEffect(()=>{ load(); },[]);

  return <div className="space-y-4">
    <h1 className="text-xl font-semibold">品目マスター（価格）</h1>
    <Table><THead><TR><TH>ID</TH><TH>名称</TH><TH>type</TH><TH>UoM</TH><TH>材料原価(defaultCost)</TH><TH>製品価格(defaultPrice)</TH><TH></TH></TR></THead>
    <TBody>
      {rows.map((r:any,i:number)=> (<TR key={r.id}>
        <TD>{r.id}</TD><TD>{r.name}</TD><TD>{r.type}</TD><TD>{r.uom}</TD>
        <TD><Input type="number" defaultValue={r.defaultCost||0} onChange={e=>rows[i]={...r, defaultCost: Number(e.target.value||0)}}/></TD>
        <TD><Input type="number" defaultValue={r.defaultPrice||0} onChange={e=>rows[i]={...r, defaultPrice: Number(e.target.value||0)}}/></TD>
        <TD><Button disabled={saving} onClick={()=>save(rows[i])}>保存</Button></TD>
      </TR>))}
    </TBody></Table>
  </div>;
}
