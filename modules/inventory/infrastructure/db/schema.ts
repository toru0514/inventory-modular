import { pgTable, varchar, timestamp, numeric, text } from "drizzle-orm/pg-core";
export const movements = pgTable("movements", {
  id: varchar("id",{length:36}).primaryKey(),
  itemId: varchar("item_id",{length:36}).notNull(),
  ts: timestamp("ts",{withTimezone:true}).notNull(),
  type: varchar("type",{length:32}).notNull(), // purchase_receipt, sales_issue, consume, manufact_consume, manufact_output, stock_adjust, transfer_in/out
  qty: numeric("qty",{precision:18, scale:6}).notNull(),
  unitCost: numeric("unit_cost",{precision:18, scale:6}).notNull().default("0"),
  amount: numeric("amount",{precision:18, scale:6}).notNull().default("0"),
  refBc: varchar("ref_bc",{length:32}),
  refId: varchar("ref_id",{length:36}),
  note: text("note"),
});
