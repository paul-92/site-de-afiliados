# PLAN-009 — Analytics & Business Metrics

**Status:** IMPLEMENTED · AWAITING HUMAN G3/G4

**Baseline/branch:** `3089b8606757d63fd51cec8733182c2ef0608883` / `feature/spec-009-analytics`

1. Audit persistence, tracking, public pages, Admin auth and DEMO boundaries.
2. Add the minimal additive `page_views` table and justified query indexes.
3. Collect mounted public page views through a minimal client boundary and validate server-side.
4. Aggregate existing `click_events` with page views for the protected cockpit.
5. Enforce controlled attribution, 90-day retention boundary and development-only DEMO.
6. Prove privacy, revenue/target semantics, authorization, regression and quality gates.
