"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function CatalogNewPage(){
  const [form, setForm] = useState({ name:"", type:"product", uom:"pcs", defaultPrice:0, defaultCost:0 });
  async function save(){
    await fetch("/catalog/api/new", { method:"POST", body: JSON.stringify(form) });
    alert("登録しました");
  }
  return <div className="space-y-3 max-w-md">
    <h1 className="text-xl font-semibold">商品（品目）新規登録</h1>
    <Input placeholder="名称" onChange={e=>setForm({...form, name:e.target.value})}/>
    <Input placeholder="UoM (例: pcs)" defaultValue="pcs" onChange={e=>setForm({...form, uom:e.target.value})}/>
    <Input type="number" placeholder="defaultPrice" onChange={e=>setForm({...form, defaultPrice:Number(e.target.value||0)})}/>
    <Input type="number" placeholder="defaultCost (任意)" onChange={e=>setForm({...form, defaultCost:Number(e.target.value||0)})}/>
    <Button onClick={save}>登録</Button>
  </div>;
}
