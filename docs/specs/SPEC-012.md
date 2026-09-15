# SPEC-012 — Runtime correction and Preview validation

**Status:** ACCEPTED/DONE · G4 HUMAN APPROVED · PREVIEW FUNCTIONAL VALIDATION ACCEPTED

**Starting baseline:** `85e89c888380b314dc86c2fbf338ecbe9a1c5967`

**HUMAN-validated functional HEAD:** `88491f09204ef373514fddea904c1451d16530e9`

SPEC-012 covers the bounded serverless PostgreSQL/runtime correction, the Analytics runtime integration correction, and real Preview validation of the combined branch state. Commit `d82c8c4` hardened runtime behavior; a separate HUMAN correction of the Preview `DATABASE_URL` credential resolved PostgreSQL `28P01`; commit `88491f0` corrected Analytics snapshot execution; and final HUMAN Preview validation passed across the public PageView endpoint, real Auth/allowlist, Admin, Analytics periods/navigation, logout, and protected access.

No schema, migration, dependency, service-role, Auth-bypass, product-behavior, or privacy weakening was introduced by these code corrections. Production remained untouched.

P0 = 0, P1 = 0, and P2 = 0 identified. P3/debt consists of temporary `runtime_timing` disposition, previously accepted tooling warnings, and the accepted development-only `drizzle-kit` advisories.

Production-specific environment validation, approved migration/clean-database evidence, final-origin CSP validation, end-to-end HTTPS, subsequent HSTS activation, PageView retention scheduling, real business/privacy contact validation, and Production monitoring remain separate prerequisites and HUMAN-controlled operations. Preview validation does not authorize Production promotion.

The repository lacked a recoverable SPEC-012 G2 decision record. This specification records only the executed and HUMAN-observed scope supplied during recovery; it does not invent a historical approval, date, or gate result. The final HUMAN G4 decision accepts this correction and Preview-validation scope at `88491f0` while preserving every Production operation as a separate gate.
