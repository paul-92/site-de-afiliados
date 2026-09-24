-- ======================================================================
-- GARIMORA SPEC-019 POSTFLIGHT READ-ONLY VALIDATION SCRIPT (MIGRATION 0004)
-- ======================================================================

\echo '--- 1. TWO-STAGE IDENTITY COLUMNS IN PRODUCTS ---'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('discovery_marketplace_id', 'discovery_shop_id', 'discovery_item_id', 'discovery_canonical_url')
ORDER BY column_name;

\echo ''
\echo '--- 2. TWO-STAGE IDENTITY COLUMNS IN AFFILIATE_LINKS ---'
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'affiliate_links'
  AND column_name IN ('destination_shop_id', 'destination_item_id', 'destination_canonical_url', 'reconciliation_status', 'link_origin', 'reconciled_at')
ORDER BY column_name;

\echo ''
\echo '--- 3. TWO-STAGE IDENTITY ENUMS IN PG_TYPE ---'
SELECT t.typname, e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('reconciliation_status', 'link_origin')
ORDER BY t.typname, e.enumsortorder;

\echo ''
\echo '--- 4. INDEXES ON AFFILIATE_LINKS ---'
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'affiliate_links' AND indexname = 'affiliate_links_reconciliation_idx';

\echo ''
\echo '--- 5. ACTIVE PRODUCTS PRESERVATION & COMPATIBILITY ---'
SELECT id, slug, status, title
FROM products
WHERE status = 'ACTIVE'
ORDER BY slug;

\echo ''
\echo '--- 6. APPLICATION ROW COUNTS INTEGRITY ---'
SELECT 'products' AS table_name, count(*) AS count FROM products
UNION ALL SELECT 'affiliate_links', count(*) FROM affiliate_links
UNION ALL SELECT 'categories', count(*) FROM categories
UNION ALL SELECT 'marketplaces', count(*) FROM marketplaces
UNION ALL SELECT 'price_observations', count(*) FROM price_observations
UNION ALL SELECT 'click_events', count(*) FROM click_events
ORDER BY table_name;
