// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./modules/**/infrastructure/db/schema.ts", // スキーマのglob
  out: "./drizzle",                                   // 生成物の出力先
  dialect: "postgresql",                              // ★ これが必須（旧: driver は不要）
  dbCredentials: {
    url: process.env.DATABASE_URL!,                   // Supabaseの接続文字列
  },
} satisfies Config;
