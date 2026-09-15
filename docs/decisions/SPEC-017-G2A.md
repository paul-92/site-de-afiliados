# HUMAN Decision — SPEC-017 G2A

**Decision date:** 2026-09-15

**G2A evidence package:** APPROVED

**Supabase environment decision:** TEMPORARY PREVIEW/PRODUCTION SHARING APPROVED FOR MVP

The HUMAN approves the G2A evidence package and explicitly accepts the risks of sharing database, Auth, Analytics, and state between Vercel Preview and Production in exchange for lower cost and operational complexity.

From Production preparation onward, the shared Garimora Supabase project is Production-sensitive. Preview must not run destructive tests, indiscriminate data generation, or any operation that could compromise real Production data. A future need for isolation must be evaluated through a separate decision.

This gate authorizes only:

- final G2A documentation and its documentation-only commit;
- preparation-only G2B diagnostics and an exact schema/migration/RLS/grant/Data API/backup/recovery plan;
- preparation-only G2C redacted Vercel/Supabase Production configuration, monitoring, rollback, and retention plan.

This gate does not authorize remote SQL, migration execution, environment-variable or secret changes, Auth changes, RLS/grant/Data API changes, backup or restore actions, scheduler changes, deployment, redeployment, promotion, Production data creation, HSTS, or launch.

Fail-closed behavior remains mandatory. Execution must stop at the next HUMAN gate before any external mutation.
