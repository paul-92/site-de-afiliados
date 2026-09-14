# PLAN-007 — Public Frontend & Discovery

**Status:** COMPLETED · G3 PASS · G4 HUMAN APPROVED

**Baseline:** `724cb845d7e7c24903428a21b5a7739653beffe9`

**Accepted completion baseline:** `d9efadf08cad10cefc8cc3e5ff2983382c0ce08e`
**Branch:** `feature/spec-007-public-frontend`

1. Confirm the clean, local-only SPEC-006 accepted baseline and create the feature branch without push.
2. Record the HUMAN G1/G2 decisions and scope boundaries.
3. Extend existing catalog queries compatibly for categories, latest-price ceilings, deterministic newest ordering, and category/tag search without changing schema.
4. Build reusable public UI, Home, navigation, category, product, search, featured, price-bucket, and newest routes.
5. Preserve Publication Gate rules and server-side affiliate resolution; add allowlisted sourcePage contexts only.
6. Add public loading, empty, query-error, and not-found handling, mobile-first presentation, and accessibility behavior.
7. Cover formatting, cards, CTA mapping, eligibility/query normalization, empty states, affiliate non-exposure, landmarks, labels, and focus behavior.
8. Run lint, type-check, full regression, production build, migration validation, secret scan, dependency/security audit, and document evidence.
9. Commit locally and stop at G3/G4. G3 passed and G4 received HUMAN approval; the accepted branch is authorized for publication only. PR, merge, and deploy remain HUMAN protected.
