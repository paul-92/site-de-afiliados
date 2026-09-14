# PLAN-010 — Security, Privacy & Compliance

**Status:** COMPLETED · G3 PASS · G4 HUMAN APPROVED

**Starting baseline:** `a7f9af548ad106b317fd4ba20e0252234889564c`

**Accepted functional baseline/branch:** `aa927b2c05559df63dc1904580abfe3e9f356495` / `feature/spec-010-security-compliance`

1. Audit Auth, Admin, tracking, analytics, cookies, secrets, errors, dependencies, SEO and migrations.
2. Harden browser headers and unsafe administrative URL rejection.
3. Add minimal versioned Privacy, Terms and Affiliate transparency surfaces.
4. Clarify affiliate, observed-price, availability and purchase-processing boundaries.
5. Prove authorization, privacy, DEMO, input/output, redirect and disclosure contracts.
6. Run the complete security, dependency, regression, build and migration quality gates.

Completion evidence: 80/80 tests PASS, production build PASS, security/privacy checks PASS, runtime vulnerabilities = 0, and schema/migrations unchanged. Four moderate development-only `drizzle-kit` advisories remain an accepted known risk.

Handoff: SPEC-012 owns real identity/privacy contact, environment validation, CSP revalidation with real origins, end-to-end HTTPS confirmation, subsequent HSTS activation, the 90-day PageView retention scheduler, and remote application of approved migrations within its authorized window. SPEC-011 QA/E2E Final owns the non-blocking `missing-data-scroll-behavior` warning; no code correction was made during finalization.
