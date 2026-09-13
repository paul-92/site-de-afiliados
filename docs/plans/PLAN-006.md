# PLAN-006 — Administration Cockpit

Status: G2 APPROVED; AUTHORIZED; EXECUTED; AWAITING HUMAN G3/G4.

1. Audit the accepted SPEC-005 baseline, schema and frozen ADRs.
2. Materialize the HUMAN G2 decision without changing the approved domain.
3. Preserve the ADR-004 server boundary and enforce authorization in every mutation.
4. Build operational dashboard and product list/search/filter/pagination.
5. Build product create/edit/detail and category, tag, marketplace, affiliate-link and append-only price workflows.
6. Derive Publication Gate health and lifecycle actions exclusively from `src/catalog/domain.ts`.
7. Add validation, accessible feedback and deny-by-default behavior.
8. Run unit, integration/security/regression, build, migration and secret verification.

## Schema audit

The accepted additive schema already supports the complete plan. No migration or material domain/ADR change is required. `price_observations` remains append-only.
