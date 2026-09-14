# PLAN-011 — Final QA, E2E & Release Readiness

**Status:** COMPLETED · G3 PASS · G4 HUMAN APPROVED

**Baseline/branch:** `3f6000fa0703ac8f4413968fb4d5fc9f3c576540` / `feature/spec-011-release-readiness`

**Accepted GARIMORA RC-1 functional baseline:** `cb031c233d7084e63c1f6d864afd47060557535c`

1. Audit tests, runtime, migrations and accepted governance.
2. Add the authorized Playwright-only E2E tooling.
3. Exercise public, affiliate, SEO, Admin boundary, desktop and mobile journeys in development/DEMO.
4. Build and smoke the production runtime with DEMO requested and no database.
5. Fix only P2 defects within approved contracts and rerun affected/full gates.
6. Record the deployment validation matrix and exact RC-1 candidate HEAD.

Completion evidence: unit/integration 81/81 PASS; development E2E 5/5 PASS; production-like E2E 1/1 PASS; production build/smoke, security/privacy, DEMO isolation and migration readiness PASS; runtime vulnerabilities = 0; P0 = 0, P1 = 0 and P2 = 0. P3 retains the pre-existing Vite native config-loader warning and harmless `NO_COLOR` tooling notice. Four moderate development-only `drizzle-kit` advisories remain an accepted risk.

SPEC-012 owns every real deployment validation recorded in the deployment validation matrix. None was marked PASS during SPEC-011 finalization.
