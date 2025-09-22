// app/manufacturing/post/page.tsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostWOPage(){
  const [woId,setWoId]=useState("");
  const [msg,setMsg]=useState("");
  async function run(){
    const r = await fetch(`/api/manufacturing/post-wo?woId=${encodeURIComponent(woId)}`, { method:"POST" });
    setMsg(r.ok ? await r.text() : `Error ${r.status}`);
  }
  return <div className="space-y-3 max-w-md">
    <h1 className="text-xl font-semibold">WorkOrder Post</h1>
    <Input placeholder="woId" value={woId} onChange={e=>setWoId(e.target.value)} />
    <Button onClick={run}>POST</Button>
    {msg && <pre className="text-xs p-2 bg-neutral-50 border rounded">{msg}</pre>}
  </div>;
}
