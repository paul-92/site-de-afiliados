# SPEC-009 — Analytics & Business Metrics

**Status:** ACCEPTED/DONE · G3 PASS · G4 HUMAN APPROVED

**Starting baseline:** `3089b8606757d63fd51cec8733182c2ef0608883`

**Accepted functional baseline:** `85929bbea5d23e9cdff776b874994f295d3dba57`

Privacy-first analytics measures performance without identifying people. `PageView` stores only time, controlled page type/key and normalized attribution. Existing `ClickEvent` remains the exclusive click source. The protected `/admin/analytics` cockpit provides 7/30/90-day KPIs, CTR, rankings and trends; revenue is explicitly unavailable and the R$ 7.000/month target remains a separate managerial reference. DEMO analytics is structurally limited to development.

Retention is exactly 90 days through the implemented `enforcePageViewRetention` boundary. Scheduler/cron is not configured; operational activation belongs to the appropriate future infrastructure/Supabase stage. No remote migration, third-party tracker, session identity, raw referrer/query string or PII is included.

The accepted additive migration is `drizzle/0002_third_sebastian_shaw.sql`. It creates only `page_views` and the authorized indexes, contains no destructive change, and has not been applied remotely. `ClickEvent` remains the unique source of Affiliate Clicks. CTR remains `Affiliate Clicks / eligible Page Views`; revenue is not inferred, and the R$ 7.000/month target remains separate from revenue.
