"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function OpeningImportPage(){
  const [msg,setMsg]=useState<string|undefined>(); const [busy,setBusy]=useState(false);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    setBusy(true); setMsg(undefined);
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch("/inventory/opening-import/api", { method: "POST", body: fd });
    setBusy(false);
    if(!r.ok){ setMsg("取込に失敗しました"); return; }
    const d = await r.json(); setMsg(`取り込み完了: ${d.inserted} 行`);
  }
  return <div className="space-y-4 max-w-xl">
    <h1 className="text-xl font-semibold">期首在庫インポート</h1>
    <p className="text-sm text-neutral-600">CSV列: <code>itemId,qty,unitCost</code></p>
    <input type="file" accept=".csv" onChange={onFile} disabled={busy} />
    {msg && <p className="text-sm text-green-700">{msg}</p>}
    <p className="text-xs text-neutral-500">※ 期首は <code>stock_adjust</code> として movements に一括登録します。</p>
  </div>;
}
