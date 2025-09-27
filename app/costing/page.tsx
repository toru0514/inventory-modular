"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function CostingPage(){
  const [product,setProduct]=useState("");
  const [res,setRes]=useState<any>();

  async function run(){
    const r=await fetch(`/api/costing?product=${product}`);
    if(r.ok) setRes(await r.json());
  }

  return <div className="space-y-4 max-w-xl">
    <h1 className="text-xl font-semibold">簡易 原価計算</h1>
    <div className="flex gap-2">
      <Input placeholder="productItemId" value={product} onChange={e=>setProduct(e.target.value)} />
      <Button onClick={run}>計算</Button>
    </div>
    {res && <div className="text-sm space-y-1">
      <p>材料費/個: {res.materialPerUnit.toFixed(2)}円</p>
      <p>間接費/個: {res.overheadPerUnit.toFixed(2)}円</p>
      <p className="font-semibold">合計: {res.totalCostPerUnit.toFixed(2)}円</p>
    </div>}
  </div>;
}
