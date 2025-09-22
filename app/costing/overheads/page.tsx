"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";

type Row = { id: string; name: string; perUnit: number; _tmpId?: string };

export default function OverheadsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null); // どの行を保存中か

  async function load() {
    setLoading(true);
    const r = await fetch("/api/costing/overheads");
    if (r.ok) {
      const data: Row[] = await r.json();
      // 取得した既存行には _tmpId は不要
      setRows(data.map((d) => ({ ...d, _tmpId: undefined })));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: uuid(), name: "", perUnit: 0 },
    ]);
  }

  function updateRow(idx: number, patch: Partial<Row>) {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    );
  }

  async function saveRow(idx: number) {
    const row = rows[idx];
    setSaving(row.id || row._tmpId || "");
    await fetch("/api/costing/overheads", {
      method: "POST",
      body: JSON.stringify({
        id: row.id || "", // 空ならAPI側で採番
        name: row.name,
        perUnit: Number(row.perUnit || 0),
      }),
    });
    setSaving(null);
    await load();
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">間接費（Overheads）登録</h1>

      <table className="w-full border-collapse">
        <thead>
        <tr className="border-b">
          <th className="text-left px-2 py-2">ID</th>
          <th className="text-left px-2 py-2">名称</th>
          <th className="text-left px-2 py-2">1個あたり金額</th>
          <th className="text-left px-2 py-2"></th>
        </tr>
        </thead>
        <tbody>
        {rows.map((r, i) => {
          const key = r.id || r._tmpId!; // ★ ユニークな key（id 未確定時は _tmpId）
          return (
            <tr key={key} className="border-b">
              <td className="px-2 py-1 text-xs text-neutral-500">
                {r.id || "(new)"}
              </td>
              <td className="px-2 py-1">
                <Input
                  value={r.name}
                  onChange={(e) => updateRow(i, { name: e.target.value })}
                  placeholder="例：工賃"
                />
              </td>
              <td className="px-2 py-1">
                <Input
                  type="number"
                  value={Number(r.perUnit ?? 0)}
                  onChange={(e) =>
                    updateRow(i, { perUnit: Number(e.target.value || 0) })
                  }
                />
              </td>
              <td className="px-2 py-1">
                <Button onClick={() => saveRow(i)} disabled={saving === (r.id || r._tmpId)}>
                  {saving === (r.id || r._tmpId) ? "保存中…" : "保存"}
                </Button>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>

      <Button onClick={addRow} disabled={loading}>
        追加
      </Button>
    </div>
  );
}
