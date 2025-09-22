import { pgTable, varchar, text, numeric } from "drizzle-orm/pg-core";
export const catalogItems = pgTable("catalog_items", {
  id: varchar("id",{length:36}).primaryKey(),
  name: varchar("name",{length:255}).notNull(),
  type: varchar("type",{length:16}).notNull().default("product"), // material|consumable|product
  uom: varchar("uom",{length:16}).notNull().default("pcs"),
  costMethod: varchar("cost_method",{length:16}).notNull().default("weighted_avg"),
  taxCode: varchar("tax_code",{length:16}),
  notes: text("notes"),
    defaultCost: numeric("default_cost",{precision:18, scale:6}),
    defaultPrice: numeric("default_price",{precision:18, scale:6}),
});
