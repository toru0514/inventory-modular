import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

export const db = drizzle(
  new Pool({
    connectionString: process.env.DATABASE_URL
  })
);
