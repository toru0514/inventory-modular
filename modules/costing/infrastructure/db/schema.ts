import { pgTable, varchar, numeric } from "drizzle-orm/pg-core";

export const overheads = pgTable("overheads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  perUnit: numeric("per_unit", { precision: 18, scale: 2 }),
});
