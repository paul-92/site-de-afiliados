CREATE TYPE "public"."link_origin" AS ENUM('HUMAN_PROVIDED', 'AFFILIATE_PANEL_ASSISTED');--> statement-breakpoint
CREATE TYPE "public"."reconciliation_status" AS ENUM('EXACT_MATCH', 'EQUIVALENT', 'MATERIAL_MISMATCH', 'INCONCLUSIVE', 'DESTINATION_UNAVAILABLE');--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "destination_shop_id" text;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "destination_item_id" text;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "destination_canonical_url" text;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "reconciliation_status" "reconciliation_status" DEFAULT 'INCONCLUSIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "link_origin" "link_origin" DEFAULT 'HUMAN_PROVIDED' NOT NULL;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "reconciled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discovery_marketplace_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discovery_shop_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discovery_item_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "discovery_canonical_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_discovery_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("discovery_marketplace_id") REFERENCES "public"."marketplaces"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_links_reconciliation_idx" ON "affiliate_links" USING btree ("reconciliation_status");