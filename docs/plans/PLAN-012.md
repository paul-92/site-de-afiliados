# PLAN-012 — Runtime correction and Preview validation recovery

**Status:** COMPLETED · G4 HUMAN APPROVED · PREVIEW FUNCTIONAL VALIDATION ACCEPTED

**Branch:** `feature/spec-012-runtime-timeout-correction`

**HUMAN-validated functional HEAD:** `88491f09204ef373514fddea904c1451d16530e9`

Recovered execution sequence:

1. Diagnose the original 300-second Vercel runtime failure without exposing secrets.
2. Bound PostgreSQL connection, statement, application-work, and teardown behavior and add sanitized timing telemetry in `d82c8c4`.
3. Observe PostgreSQL `28P01`; keep the code correction distinct from the invalid Preview database credential.
4. Apply the HUMAN operational correction to the Preview `DATABASE_URL` credential outside the repository.
5. Validate real Auth, allowlist authorization, `/admin`, PostgreSQL dashboard counts, PageView collection, logout, and protected access in Preview.
6. Diagnose the Analytics navigation/rendering integration issue.
7. Bound sequential Analytics snapshot execution and add accessible loading feedback in `88491f0`.
8. HUMAN-validate Admin/Analytics navigation, the cockpit, all 7/30/90-day periods, remaining Admin sections, and return navigation.
9. Recover and reconcile documentation after the interrupted evidence-recording run.

Governance note: neighboring accepted specs use a SPEC, PLAN, and separate HUMAN decision. The missing SPEC and PLAN were restored as minimum governance records. No historical G2 decision or date was fabricated because no recoverable G2 artifact exists. The final HUMAN G4 decision is recorded separately and accepts the supplied, HUMAN-observed Preview results.

No functional implementation, instrumentation change, schema/migration/dependency change, remote operation, or Production promotion is part of this recovery plan.
