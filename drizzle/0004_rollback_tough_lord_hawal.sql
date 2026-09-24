-- ======================================================================
-- GARIMORA SPEC-019 ROLLBACK SCRIPT FOR MIGRATION 0004
-- ======================================================================
-- Reverses: drizzle/0004_tough_lord_hawal.sql
-- Purely removes added Two-Stage Identity columns and enums without data destruction.

DROP INDEX IF EXISTS "affiliate_links_reconciliation_idx";
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_discovery_marketplace_id_marketplaces_id_fk";
ALTER TABLE "products" DROP COLUMN IF EXISTS "discovery_canonical_url";
ALTER TABLE "products" DROP COLUMN IF EXISTS "discovery_item_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "discovery_shop_id";
ALTER TABLE "products" DROP COLUMN IF EXISTS "discovery_marketplace_id";

ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "reconciled_at";
ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "link_origin";
ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "reconciliation_status";
ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "destination_canonical_url";
ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "destination_item_id";
ALTER TABLE "affiliate_links" DROP COLUMN IF EXISTS "destination_shop_id";

DROP TYPE IF EXISTS "public"."reconciliation_status";
DROP TYPE IF EXISTS "public"."link_origin";
