CREATE TABLE "catalog_items" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(16) DEFAULT 'product' NOT NULL,
	"uom" varchar(16) DEFAULT 'pcs' NOT NULL,
	"cost_method" varchar(16) DEFAULT 'weighted_avg' NOT NULL,
	"tax_code" varchar(16),
	"notes" text,
	"default_cost" numeric(18, 6),
	"default_price" numeric(18, 6)
);
--> statement-breakpoint
CREATE TABLE "overheads" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"per_unit" numeric(18, 2)
);
--> statement-breakpoint
CREATE TABLE "movements" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"item_id" varchar(36) NOT NULL,
	"ts" timestamp with time zone NOT NULL,
	"type" varchar(32) NOT NULL,
	"qty" numeric(18, 6) NOT NULL,
	"unit_cost" numeric(18, 6) DEFAULT '0' NOT NULL,
	"amount" numeric(18, 6) DEFAULT '0' NOT NULL,
	"ref_bc" varchar(32),
	"ref_id" varchar(36),
	"note" text
);
--> statement-breakpoint
CREATE TABLE "bom_items" (
	"bom_id" varchar(36) NOT NULL,
	"material_item_id" varchar(36) NOT NULL,
	"qty_per_unit" numeric(18, 6) NOT NULL,
	"waste_rate" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "boms" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"product_item_id" varchar(36) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_consume" (
	"wo_id" varchar(36) NOT NULL,
	"material_item_id" varchar(36) NOT NULL,
	"qty" numeric(18, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"product_item_id" varchar(36) NOT NULL,
	"plan_qty" numeric(18, 6) NOT NULL,
	"started_at" timestamp with time zone DEFAULT now(),
	"posted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_output" (
	"wo_id" varchar(36) NOT NULL,
	"product_item_id" varchar(36) NOT NULL,
	"qty" numeric(18, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_lines" (
	"receipt_id" varchar(36) NOT NULL,
	"item_id" varchar(36) NOT NULL,
	"qty" numeric(18, 6) NOT NULL,
	"unit_cost" numeric(18, 6) NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "purchase_receipts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"supplier" varchar(128),
	"note" text,
	"created_at" timestamp with time zone DEFAULT now()
);
