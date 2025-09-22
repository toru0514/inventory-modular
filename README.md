# Manufacturing Reports Starter (Modular DDD)

- `modules/manufacturing/*` を追加し、**2つのレポート**を実装:
  - 製品1個あたりの材料使用量: `/reports/per-unit-usage`
  - 材料1単位あたりの出来高: `/reports/material-yield`
- API:
  - `GET /api/reports/per-unit-usage?product=PRODUCT_ID`
  - `GET /api/reports/material-yield?material=MATERIAL_ID`

## セットアップ
1) 依存: `pnpm i`
2) `.env` で `DATABASE_URL` を設定
3) Drizzleで以下のテーブルを作成: `catalog_items`, `movements`, `boms`, `bom_items`, `work_orders`, `work_consume`, `work_output`
4) `pnpm dev`

生成日: 2025-09-22
\

      ## 追加（在庫と効率の可視化）
      - **/inventory**: movements の合計からオンハンド在庫を表示
      - **/dashboard/efficiency**: 2つのレポートを一画面で確認
      - **POST /api/manufacturing/post-wo?woId=**: WorkOrder の実績から movements を自動生成（在庫連動）

      ### 使い方（例）
      1) DBに `catalog_items` と `manufacturing` のテーブルへデータ投入（work_orders, work_consume, work_output）
      2) `POST /api/manufacturing/post-wo?woId=xxxx` を実行 → movements に記録
      3) `/inventory` で在庫、`/dashboard/efficiency` で効率を確認

      生成日: 2025-09-22

## 価格対応の追加
- `catalog_items` に **default_cost**（材料原価）と **default_price**（製品価格）を追加
- **/catalog** で価格の閲覧・編集が可能
- **POST /api/manufacturing/post-wo?woId=** は、
  - 材料消費：`default_cost × qty` を金額に採用（負の movement.amount）
  - 製品完成：消費合計金額を出来高で按分して unitCost/amount を設定（簡易移動平均）
- **/inventory** は 数量・平均単価・評価額 を表示

※ 簡易実装です。厳密な移動平均/FIFOや期首在庫の単価設定は、次フェーズで導入してください。

生成日: 2025-09-22

## 仕込み登録UI & 期首在庫インポート
- **仕込み登録（購入入庫）**: `/procurement/receipt/new`
  - 入力: 仕入日・仕入先・明細（itemId, qty, unitCost）
  - 保存すると `purchase_receipts / purchase_lines` を作成し、Movementsに `purchase_receipt` を自動登録
- **期首在庫CSVインポート**: `/inventory/opening-import`
  - CSV列: `itemId,qty,unitCost`
  - Movementsに `stock_adjust` として一括登録

生成日: 2025-09-22

## 簡易 原価計算モジュール
- **テーブル**: `overheads`（工賃・試作費など1個あたりの固定金額を登録）
- **ユースケース**: `CalculateProductCost`（材料費/個 + 間接費/個 を合算）
- **API**: `/api/costing?product=...`
- **UI**: `/costing` ページで製品IDを指定し、材料費/個・間接費/個・合計を表示

生成日: 2025-09-22

## 間接費 入力UI
- **ページ**: `/costing/overheads`
  - 間接費を一覧・追加・更新
- **API**: `/api/costing/overheads`
  - GET: 登録済み overheads を返す
  - POST: 新規追加 or 更新

生成日: 2025-09-22
