# PLAN-009 — Analytics & Business Metrics

**Status:** COMPLETED · G3 PASS · G4 HUMAN APPROVED

**Starting baseline:** `3089b8606757d63fd51cec8733182c2ef0608883`

**Accepted functional baseline/branch:** `85929bbea5d23e9cdff776b874994f295d3dba57` / `feature/spec-009-analytics`

1. Audit persistence, tracking, public pages, Admin auth and DEMO boundaries.
2. Add the minimal additive `page_views` table and justified query indexes.
3. Collect mounted public page views through a minimal client boundary and validate server-side.
4. Aggregate existing `click_events` with page views for the protected cockpit.
5. Enforce controlled attribution, 90-day retention boundary and development-only DEMO.
6. Prove privacy, revenue/target semantics, authorization, regression and quality gates.

Completion evidence: 72/72 tests PASS, production build PASS, privacy/security PASS, and migration determinism PASS. The accepted migration is additive and remains unapplied remotely. The 90-day retention boundary is implemented; scheduler/cron activation is reserved for the appropriate infrastructure stage.
