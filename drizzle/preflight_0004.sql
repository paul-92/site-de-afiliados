-- ======================================================================
-- GARIMORA SPEC-019 PREFLIGHT READ-ONLY VALIDATION SCRIPT (BEFORE 0004)
-- ======================================================================

\echo '=== 1. DATABASE ENVIRONMENT & CONNECTION INFO ==='
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();

\echo ''
\echo '=== 2. APPLICATION TABLES EXISTENCE ==='
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('products', 'affiliate_links', 'categories', 'marketplaces', 'price_observations', 'click_events', 'page_views')
ORDER BY table_name;

\echo ''
\echo '=== 3. CHECK IF ANY 0004 ENUMS ALREADY EXIST (SHOULD BE 0 ROWS) ==='
SELECT t.typname, e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('reconciliation_status', 'link_origin');

\echo ''
\echo '=== 4. CHECK IF ANY 0004 PRODUCTS COLUMNS ALREADY EXIST (SHOULD BE 0 ROWS) ==='
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('discovery_marketplace_id', 'discovery_shop_id', 'discovery_item_id', 'discovery_canonical_url');

\echo ''
\echo '=== 5. CHECK IF ANY 0004 AFFILIATE_LINKS COLUMNS ALREADY EXIST (SHOULD BE 0 ROWS) ==='
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'affiliate_links'
  AND column_name IN ('destination_shop_id', 'destination_item_id', 'destination_canonical_url', 'reconciliation_status', 'link_origin', 'reconciled_at');

\echo ''
\echo '=== 6. CHECK IF 0004 INDEX ALREADY EXISTS (SHOULD BE 0 ROWS) ==='
SELECT indexname
FROM pg_indexes
WHERE tablename = 'affiliate_links'
  AND indexname = 'affiliate_links_reconciliation_idx';

\echo ''
\echo '=== 7. EXISTING ACTIVE PRODUCTS (EXPECTED: 4 ACTIVE) ==='
SELECT id, slug, status, title
FROM products
WHERE status = 'ACTIVE'
ORDER BY slug;

\echo ''
\echo '=== 8. EXISTING TABLE ROW COUNTS ==='
SELECT 'products' AS table_name, count(*) AS count FROM products
UNION ALL SELECT 'affiliate_links', count(*) FROM affiliate_links
UNION ALL SELECT 'categories', count(*) FROM categories
UNION ALL SELECT 'marketplaces', count(*) FROM marketplaces
UNION ALL SELECT 'price_observations', count(*) FROM price_observations
UNION ALL SELECT 'click_events', count(*) FROM click_events
UNION ALL SELECT 'page_views', count(*) FROM page_views
ORDER BY table_name;
