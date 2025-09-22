"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

type Line = { itemId: string; qty: number; unitCost: number; note?: string };
export default function NewReceipt(){
  const [supplier,setSupplier]=useState(""); const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [lines,setLines]=useState<Line[]>([{ itemId:"", qty:0, unitCost:0 }]);
  const [msg,setMsg]=useState<string|undefined>(); const [busy,setBusy]=useState(false);

  function add(){ setLines([...lines, { itemId:"", qty:0, unitCost:0 }]); }
  function update(i:number, patch: Partial<Line>){ const next=[...lines]; next[i]={...next[i], ...patch}; setLines(next); }
  function remove(i:number){ const next=[...lines]; next.splice(i,1); setLines(next); }

  async function save(){
    setBusy(true); setMsg(undefined);
    const body = { supplier, receivedAt: new Date(date), lines: lines.filter(l=>l.itemId && l.qty>0) };
    const r = await fetch("/procurement/receipt/new/api", { method:"POST", body: JSON.stringify(body) });
    setBusy(false);
    if(!r.ok){ setMsg("保存に失敗しました"); return; }
    const d = await r.json(); setMsg(`登録しました（伝票ID: ${d.id}, 明細 ${d.lines} 行）`);
  }

  return <div className="space-y-4 max-w-3xl">
    <h1 className="text-xl font-semibold">仕込み登録（購入入庫）</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div><label className="text-sm">仕入日</label><Input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
      <div><label className="text-sm">仕入先</label><Input value={supplier} onChange={e=>setSupplier(e.target.value)} placeholder="任意" /></div>
    </div>
    <Table>
      <THead>
        <TR><TH style={{width: '30%'}}>品目ID</TH><TH>数量</TH><TH>単価</TH><TH>金額</TH><TH></TH></TR>
      </THead>
      <TBody>
        {lines.map((l, i) => (
          <TR key={i}>
            <TD><Input placeholder="itemId" value={l.itemId} onChange={e=>update(i,{itemId:e.target.value})} /></TD>
            <TD><Input type="number" value={l.qty} onChange={e=>update(i,{qty: Number(e.target.value||0)})} /></TD>
            <TD><Input type="number" value={l.unitCost} onChange={e=>update(i,{unitCost: Number(e.target.value||0)})} /></TD>
            <TD>{(l.qty*l.unitCost).toFixed(2)}</TD>
            <TD><Button type="button" onClick={()=>remove(i)}>削除</Button></TD>
          </TR>
        ))}
      </TBody>
    </Table>
    <div className="flex gap-2">
      <Button type="button" onClick={add}>明細を追加</Button>
      <Button type="button" onClick={save} disabled={busy}>登録</Button>
    </div>
    {msg && <p className="text-sm text-green-700">{msg}</p>}
    <p className="text-xs text-neutral-500">※ 今は品目IDを直接入力する簡易版です。後で検索/選択UIに置き換え可能。</p>
  </div>;
}
