# PLAN-004 — Product Catalog

Status: COMPLETED.

1. Audit the SPEC-003 schema and stop on destructive or materially conflicting evolution.
2. Extend the schema additively with `PriceObservation` and generate a versioned Drizzle migration.
3. Implement the product lifecycle and Publication Gate as framework-independent domain rules.
4. Define a catalog repository boundary and implement it with Drizzle/PostgreSQL.
5. Implement lifecycle and public query use cases, including normalized search and filters.
6. Connect public home, category and product routes without implementing SPEC-005 tracking.
7. Expand the fictitious seed and add unit, integration-boundary and regression tests.
8. Run lint, type-check, tests, production build, migration validation and repository safety checks.
9. Record evidence and stop at HUMAN G3/G4.
