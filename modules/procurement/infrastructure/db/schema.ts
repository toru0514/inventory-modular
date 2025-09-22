import { pgTable, varchar, timestamp, numeric, text } from "drizzle-orm/pg-core";

export const purchaseReceipts = pgTable("purchase_receipts", {
  id: varchar("id",{length:36}).primaryKey(),
  receivedAt: timestamp("received_at",{withTimezone:true}).notNull(),
  supplier: varchar("supplier",{length:128}),
  note: text("note"),
  createdAt: timestamp("created_at",{withTimezone:true}).defaultNow(),
});

export const purchaseLines = pgTable("purchase_lines", {
  receiptId: varchar("receipt_id",{length:36}).notNull(),
  itemId: varchar("item_id",{length:36}).notNull(),
  qty: numeric("qty",{precision:18, scale:6}).notNull(),
  unitCost: numeric("unit_cost",{precision:18, scale:6}).notNull(),
  amount: numeric("amount",{precision:18, scale:6}).notNull(),
  note: text("note"),
});
