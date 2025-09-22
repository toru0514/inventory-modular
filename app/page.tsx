import Link from "next/link";
export default function Home(){
  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">在庫 & 製造効率ミニダッシュボード</h1>
    <ul className="list-disc pl-6 text-blue-700">
      <li><Link href="/inventory">在庫（オンハンド）</Link></li>
      <li><Link href="/dashboard/efficiency">効率ダッシュボード</Link></li>
      <li><Link href="/reports/per-unit-usage">製品1個あたりの材料使用量（詳細）</Link></li>
      <li><Link href="/reports/material-yield">材料1単位あたりの出来高（詳細）</Link></li>
      <li><a className="text-blue-700" href="/catalog">品目マスター（価格）</a></li>
        <li><a className="text-blue-700" href="/procurement/receipt/new">仕込み登録（購入入庫）</a></li>
        <li><a className="text-blue-700" href="/inventory/opening-import">期首在庫インポート</a></li>
        <li><a className="text-blue-700" href="/costing">簡易 原価計算</a></li>
        <li><a className="text-blue-700" href="/costing/overheads">間接費 登録</a></li>
      </ul>
    <p className="text-sm text-neutral-600">※ WorkOrderの実績を入れ、POSTすれば在庫も追従します。</p>
  </div>;
}
