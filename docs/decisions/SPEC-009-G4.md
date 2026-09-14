# HUMAN Decision — SPEC-009 G4

**Decision date:** 2026-09-14

**G3:** PASS

**G4:** HUMAN APPROVED

**SPEC-009:** ACCEPTED/DONE

**PLAN-009:** COMPLETED

**Accepted functional baseline:** `85929bbea5d23e9cdff776b874994f295d3dba57`

**Branch authorized for publication:** `feature/spec-009-analytics`

Acceptance includes 72/72 passing tests, a passing production build, passing privacy/security checks, and deterministic additive migration `drizzle/0002_third_sebastian_shaw.sql`. The migration creates only `page_views` and authorized indexes, contains no destructive change, and was not applied remotely; future application is reserved for the appropriate infrastructure/Supabase stage.

`ClickEvent` remains the unique source of Affiliate Clicks. CTR is `Affiliate Clicks / eligible Page Views`. Revenue is not inferred, and the R$ 7.000/month managerial target remains separate from revenue. PageView retention is 90 days through the implemented boundary; no scheduler/cron is configured, and operational activation remains an infrastructure responsibility.

This decision authorizes documentary finalization and publication of the accepted branch to `origin`. It does not authorize a PR, merge, deployment, `main` change, remote Supabase/Vercel operation, scheduler implementation, SPEC-010 implementation, Google Analytics, or BACKLOG work.
