import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { linkOrigin, reconciliationStatus, products, affiliateLinks } from "@/db/schema";

describe("SPEC-019 Persistence and Migration Safety", () => {
  const migrationPath = path.resolve(process.cwd(), "drizzle/0004_tough_lord_hawal.sql");

  it("verifies the generated migration file exists and is readable", () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const content = fs.readFileSync(migrationPath, "utf8");
    expect(content.length).toBeGreaterThan(0);
  });

  it("proves the migration is purely additive and non-destructive", () => {
    const content = fs.readFileSync(migrationPath, "utf8");
    expect(content).not.toMatch(/DROP\s+TABLE/i);
    expect(content).not.toMatch(/TRUNCATE/i);
    expect(content).not.toMatch(/DELETE\s+FROM/i);
    expect(content).not.toMatch(/DROP\s+COLUMN/i);
  });

  it("verifies required enums and columns are declared in the migration SQL", () => {
    const content = fs.readFileSync(migrationPath, "utf8");

    // Enums
    expect(content).toContain('CREATE TYPE "public"."link_origin" AS ENUM(\'HUMAN_PROVIDED\', \'AFFILIATE_PANEL_ASSISTED\');');
    expect(content).toContain('CREATE TYPE "public"."reconciliation_status" AS ENUM(\'EXACT_MATCH\', \'EQUIVALENT\', \'MATERIAL_MISMATCH\', \'INCONCLUSIVE\', \'DESTINATION_UNAVAILABLE\');');

    // AffiliateLinks columns
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "destination_shop_id" text;');
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "destination_item_id" text;');
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "destination_canonical_url" text;');
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "reconciliation_status" "reconciliation_status" DEFAULT \'INCONCLUSIVE\' NOT NULL;');
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "link_origin" "link_origin" DEFAULT \'HUMAN_PROVIDED\' NOT NULL;');
    expect(content).toContain('ALTER TABLE "affiliate_links" ADD COLUMN "reconciled_at" timestamp with time zone;');

    // Products columns
    expect(content).toContain('ALTER TABLE "products" ADD COLUMN "discovery_marketplace_id" uuid;');
    expect(content).toContain('ALTER TABLE "products" ADD COLUMN "discovery_shop_id" text;');
    expect(content).toContain('ALTER TABLE "products" ADD COLUMN "discovery_item_id" text;');
    expect(content).toContain('ALTER TABLE "products" ADD COLUMN "discovery_canonical_url" text;');

    // Foreign key and index
    expect(content).toContain('ALTER TABLE "products" ADD CONSTRAINT "products_discovery_marketplace_id_marketplaces_id_fk" FOREIGN KEY ("discovery_marketplace_id") REFERENCES "public"."marketplaces"("id")');
    expect(content).toContain('CREATE INDEX "affiliate_links_reconciliation_idx" ON "affiliate_links" USING btree ("reconciliation_status");');
  });

  it("validates Drizzle schema runtime enums and table structures", () => {
    expect(reconciliationStatus.enumValues).toEqual([
      "EXACT_MATCH",
      "EQUIVALENT",
      "MATERIAL_MISMATCH",
      "INCONCLUSIVE",
      "DESTINATION_UNAVAILABLE",
    ]);

    expect(linkOrigin.enumValues).toEqual([
      "HUMAN_PROVIDED",
      "AFFILIATE_PANEL_ASSISTED",
    ]);

    // Check products table fields
    expect(products.discoveryMarketplaceId).toBeDefined();
    expect(products.discoveryShopId).toBeDefined();
    expect(products.discoveryItemId).toBeDefined();
    expect(products.discoveryCanonicalUrl).toBeDefined();

    // Check affiliateLinks table fields
    expect(affiliateLinks.destinationShopId).toBeDefined();
    expect(affiliateLinks.destinationItemId).toBeDefined();
    expect(affiliateLinks.destinationCanonicalUrl).toBeDefined();
    expect(affiliateLinks.reconciliationStatus).toBeDefined();
    expect(affiliateLinks.linkOrigin).toBeDefined();
    expect(affiliateLinks.reconciledAt).toBeDefined();
  });

  it("verifies safe rollback DDL generation", () => {
    const rollbackSql = `
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
    `;
    expect(rollbackSql).toContain("DROP COLUMN IF EXISTS");
    expect(rollbackSql).toContain("DROP TYPE IF EXISTS");
  });
});
