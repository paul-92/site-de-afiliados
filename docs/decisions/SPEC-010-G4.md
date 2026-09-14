# HUMAN Decision — SPEC-010 G4

**Decision date:** 2026-09-14

**G3:** PASS

**G4:** HUMAN APPROVED

**SPEC-010:** ACCEPTED/DONE

**PLAN-010:** COMPLETED

**Accepted functional baseline:** `aa927b2c05559df63dc1904580abfe3e9f356495`

**Branch authorized for publication:** `feature/spec-010-security-compliance`

Acceptance includes 80/80 passing tests, a passing production build, passing security/privacy checks, zero runtime vulnerabilities, and unchanged schema/migrations. The four moderate development-only advisories in the known `drizzle-kit` toolchain remain an accepted risk.

SPEC-012 must configure business identity/privacy contact, configure and validate real environment variables, revalidate CSP against real origins, confirm HTTPS end-to-end, activate HSTS only after confirmation, activate the PageView 90-day retention scheduler, and apply approved migrations to remote Supabase only during its authorized window.

Non-blocking finding assigned to SPEC-011 QA/E2E Final: Next.js warning `missing-data-scroll-behavior`, caused by `scroll-behavior: smooth` on `html` without `data-scroll-behavior="smooth"`. No code change is authorized during this finalization.

This decision authorizes documentary finalization and publication of the accepted branch to `origin`. It does not authorize a PR, merge, deployment, `main` change, remote Supabase/Vercel operation, remote migration, scheduler activation, SPEC-011 implementation, warning correction, or BACKLOG work.
