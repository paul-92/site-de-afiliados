# GARIMORA RC-1 release candidate report

**Candidate status:** CREATED · AWAITING HUMAN G3/G4

**Baseline:** `3f6000fa0703ac8f4413968fb4d5fc9f3c576540`

**RC-1 functional HEAD:** `bfea580c3298046ba8ca4d49fa49f33f43607448`

## Results

- Vitest: 81/81 PASS, 16/16 files; the existing 80-test floor was preserved.
- Playwright development/DEMO: 5/5 PASS using Chrome at 1440×900 and 390×844.
- Production-like Playwright smoke: 1/1 PASS after real build/start, with `GARIMORA_DEMO=1` and no database.
- Production isolation: PASS; no catalog, analytics, SEO, sitemap or metadata DEMO fallback surfaced.
- Public journeys: Home → Category → Product; Home → Search → Result → Product; collections; legal pages; and product CTA → `/go` → safe `.example` 307 all PASS.
- Admin: unauthenticated and Analytics routes redirect fail-closed. Real Auth scenarios are SPEC-012 VALIDATION REQUIRED.
- SEO: canonicals, JSON-LD regression, breadcrumbs, noindex, robots and sitemap exclusions PASS.
- Security/privacy: input, XSS, redirects, headers, secrets and PageView invariants PASS.
- Accessibility/responsive: skip link, landmarks, labels, alt text, headings, reduced-motion CSS and desktop/mobile navigation PASS.
- Console: zero material browser console/page errors after fixes. Production's deliberately missing database emitted an internal server diagnostic while public UI remained controlled and stack-free.
- Migration readiness: order/journal, additive SQL, indexes, Drizzle check, snapshot and deterministic regeneration PASS. Clean database application could not be run without local PostgreSQL/Docker and is assigned to SPEC-012.
- Runtime dependency audit: 0 vulnerabilities. Known development-only `drizzle-kit` chain: 4 moderate advisories accepted from SPEC-010.

No schema/migration, Auth bypass, material tracking, Publication Gate, business model or architecture change was made. RC-1 does not mean production readiness without SPEC-012 validation.
