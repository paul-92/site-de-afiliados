# SPEC-010 — Security, Privacy & Compliance

**Status:** ACCEPTED/DONE · G3 PASS · G4 HUMAN APPROVED

**Starting baseline:** `a7f9af548ad106b317fd4ba20e0252234889564c`

**Accepted functional baseline:** `aa927b2c05559df63dc1904580abfe3e9f356495`

Garimora now applies server-side administrator authorization, scoped browser security headers, strict URL validation, privacy transparency, commercial disclosures and versioned institutional pages. The implementation preserves SPEC-003–009 boundaries, collects no new personal data, introduces no schema or dependency change, and leaves the accepted PageView migration intact and unapplied remotely.

Acceptance includes 80/80 tests, a passing production build, passing security/privacy checks, zero runtime vulnerabilities, and unchanged schema/migrations. The four moderate development-only advisories in the known `drizzle-kit` toolchain remain an accepted risk.

SPEC-012 deployment prerequisites are: configure business identity/privacy contact; configure and validate real environment variables; revalidate CSP against real origins; confirm end-to-end HTTPS; activate HSTS only after that confirmation; activate the 90-day PageView retention scheduler; and apply approved migrations to remote Supabase only in the SPEC-012 authorized window.

Non-blocking SPEC-011 QA finding: Next.js warning `missing-data-scroll-behavior`. The `html` element currently uses `scroll-behavior: smooth` without `data-scroll-behavior="smooth"`; address and validate it in SPEC-011 QA/E2E Final.
