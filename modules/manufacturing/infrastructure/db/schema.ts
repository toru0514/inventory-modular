import { pgTable, varchar, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";

export const boms = pgTable("boms", {
  id: varchar("id",{length:36}).primaryKey(),
  productItemId: varchar("product_item_id",{length:36}).notNull(),
  version: integer("version").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at",{withTimezone:true}).defaultNow(),
});

export const bomItems = pgTable("bom_items", {
  bomId: varchar("bom_id",{length:36}).notNull(),
  materialItemId: varchar("material_item_id",{length:36}).notNull(),
  qtyPerUnit: numeric("qty_per_unit",{precision:18, scale:6}).notNull(),
  wasteRate: numeric("waste_rate",{precision:5, scale:2}),
});

export const workOrders = pgTable("work_orders", {
  id: varchar("id",{length:36}).primaryKey(),
  productItemId: varchar("product_item_id",{length:36}).notNull(),
  planQty: numeric("plan_qty",{precision:18, scale:6}).notNull(),
  startedAt: timestamp("started_at",{withTimezone:true}).defaultNow(),
  postedAt: timestamp("posted_at",{withTimezone:true}),
});

export const workConsume = pgTable("work_consume", {
  woId: varchar("wo_id",{length:36}).notNull(),
  materialItemId: varchar("material_item_id",{length:36}).notNull(),
  qty: numeric("qty",{precision:18, scale:6}).notNull(),
});

export const workOutput = pgTable("work_output", {
  woId: varchar("wo_id",{length:36}).notNull(),
  productItemId: varchar("product_item_id",{length:36}).notNull(),
  qty: numeric("qty",{precision:18, scale:6}).notNull(),
});
