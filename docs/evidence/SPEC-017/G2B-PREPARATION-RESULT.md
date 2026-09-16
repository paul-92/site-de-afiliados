# SPEC-017 — G2B preparation result

**Decision:** NO-GO for remote mutation; fail closed pending the next HUMAN database-mutation gate

**Executed:** 2026-09-16

**Repository commit inspected:** `5fa4d4d1f5e95254e0c8cbbcf227db563ee6a38c`

## Scope and non-mutation attestation

Only local/read-only preparation was performed. No remote SQL, migration, RLS, grant, Data API, Production data, Auth, secret, environment, scheduler, deployment, promotion, backup, restore, or launch mutation was performed. The comparison below uses the previously captured G2A remote evidence.

## Clean replay evidence

The ordered Drizzle journal was replayed into a fresh in-memory PostgreSQL 17.5-compatible PGlite target. The target was discarded after the process exited.

| Assertion | Result |
|---|---|
| Migration order | PASS — `0000`, `0001`, `0002` |
| Migration hashes | PASS — `013955…a353`, `1814cc…425`, `244b49…c1ce` |
| Migration history | PASS — 3 rows with hashes and journal timestamps matching the files |
| Tables | PASS — all 9 expected application tables |
| Enum | PASS — `product_status`: DRAFT, READY, ACTIVE, PAUSED, ARCHIVED |
| Constraints | PASS — 12 foreign keys and 8 primary keys |
| Indexes | PASS — 21 total, including PK indexes and the 13 explicit migration indexes |
| RLS in clean replay | OFF on all 9 tables |
| Drizzle consistency | PASS — `npm run db:check` |
| Application verification | PASS — lint, type-check, 96/96 tests, Production build, db:check |

The first sandboxed `npm run verify` attempt stopped before Vitest with Windows `spawn EPERM`. The same command passed outside that spawn restriction. This is a harness limitation, not an application or database failure.

## Clean versus previously inspected remote

| Area | Clean replay | Remote at G2A | Classification |
|---|---|---|---|
| Migration names/order | `0000`–`0002` | Same three names/order | MATCH |
| Application objects | 9 expected tables | Same 9 tables | MATCH |
| RLS | Disabled on all 9 | Enabled on all 9 | MATERIAL SECURITY DRIFT, expected and fail-closed remotely |
| Public RLS policies | None | None | MATCH; remote browser rows deny by default |
| `anon`/`authenticated` grants | Plain PostgreSQL clean target has no Supabase automatic grants | Broad remote table grants | MATERIAL SECURITY POSTURE DIFFERENCE |
| Data API exposed schemas | Not applicable to the local engine | UNKNOWN | MATERIAL UNKNOWN / G2C dependency |
| Data | Empty | Catalog-related tables empty; `page_views` count 13 | EXPECTED ENVIRONMENT DATA DIFFERENCE; do not reconcile or delete |
| Scheduler | None in migrations | `pg_cron`/`pg_net` absent, no job | MATCH for launch scope; retention scheduling deferred |
| Backup/recovery | Disposable target | Plan, retention, latest point and restore eligibility UNKNOWN | RELEASE-BLOCKING UNKNOWN |
| Ownership/default ACL | Local synthetic owner | Exact remote owner/default-ACL model UNKNOWN | MIGRATION-BLOCKING UNKNOWN |

No unforeseen schema divergence was found in the available evidence. The unresolved remote ownership/default ACL, Data API, and recovery facts were already identified in G2A/G2B planning, remain material, and therefore keep the mutation decision fail-closed.

## Schema and advisor classification

- The eight uncovered foreign-key access paths are: `affiliate_links.marketplace_id`; `click_events.affiliate_link_id`, `marketplace_id`, and `category_id`; `product_tags.tag_id`; `products.marketplace_id` and `category_id`; and `price_observations.marketplace_id`.
- `product_tags` has no primary key but does have a unique `(product_id, tag_id)` index. This preserves pair uniqueness but is not catalog-equivalent to a primary key.
- Four remote indexes were reported unused, but the captured evidence does not identify them and the database has almost no representative traffic.

These are P2/P3 performance and maintainability findings, not launch-blocking correctness defects for the current empty/minimal dataset. Index additions, primary-key conversion, and index removals must be separate reviewed migrations. No index should be dropped from low-traffic statistics.

## Locally validated security posture

A synthetic local security migration enabled RLS on all nine tables; revoked all table and sequence privileges from synthetic `anon` and `authenticated` roles; revoked their future default table, sequence, and function privileges; and revoked default function execution from `PUBLIC`.

- PASS: 72 denial checks (`2 roles × 9 tables × SELECT/INSERT/UPDATE/DELETE`).
- PASS: a synthetic direct server role retained 36 required table privileges (`9 × 4`).

This validates the intended behavior, not the exact remote SQL. Exact remote SQL cannot be approved until the owning role(s), default ACL grantors, and actual Vercel database role are re-proven read-only. `ALTER DEFAULT PRIVILEGES` is owner-specific; issuing it under the wrong role would give false assurance.

## Required before launch

1. Reconfirm project identity, PostgreSQL version, migration history, object inventory, row counts only, RLS, policies, grants, object owners, default ACL grantors, exposed schemas, scheduler state, and advisors.
2. Prove the Vercel `DATABASE_URL` role and connection mode without exposing the connection string; verify it is neither `anon`, `authenticated`, nor a client-visible service credential.
3. Prove a current provider-supported recovery point, retention, restore eligibility, named operator, expected downtime, and rollback decision-maker.
4. Decide the Data API posture at the separate G2C gate: disable it when no data API surface is needed, or remove `public` from exposed schemas/use a dedicated minimal schema.
5. Generate one migration with the installed Drizzle generator only after items 1–3 resolve exact ownership. It must only enable RLS and revoke current/future browser-role privileges; it must contain no policies, DML, seed, scheduler, extension, destructive object change, or `service_role` broadening.
6. Re-run the clean replay and 72 denial checks with the generated artifact, then review its hash, locks, duration estimate, verification queries, and forward repair.

## Exact gated remediation procedure

1. Freeze commit, project ref, migration hashes, operator, window, communication channel, recovery point, and rollback decision-maker.
2. Abort on any mismatch in target, history, unexpected nonempty catalog table, ownership/default ACL, recovery evidence, active incident, or G2A assumptions.
3. Use read-only catalog queries to enumerate `relowner`, sequence owners, `pg_default_acl.defaclrole`, current grants, RLS and policies. Record role names, not secrets.
4. Create the migration via `npm run db:generate` after representing the approved posture in the authoritative schema/migration workflow; do not invent a migration identifier.
5. Review that the artifact contains, for each of the nine named tables, idempotent RLS enablement and explicit revocation from `anon` and `authenticated`; include owner-qualified default-privilege revocations for every proven object-creating role; revoke function execution from browser roles and `PUBLIC` only for the proven scope.
6. Replay `0000` through the candidate migration on a fresh target. Run catalog assertions, all 72 browser-role denial checks, minimum server-role checks, `npm run verify`, and migration-history/hash assertions.
7. At the next HUMAN gate, present the exact generated SQL and hash, target/project, operator/window, recovery evidence, postflight queries, and forward-repair SQL. Do not execute it yet.
8. Only after explicit mutation approval: re-run preflight, apply the single approved hash once, and run read-only postflight. Stop on the first mismatch.

## Rollback and forward repair

- Before mutation: no-op; correct the plan.
- Additive application incompatibility: revert the application deployment when safe; do not rewrite migration history.
- Security revocation defect: apply a pre-reviewed forward repair granting only the specifically proven operation(s) to the specifically proven server role. Never grant `ALL` to `anon` or `authenticated`.
- Migration partially applied or catalog mismatch: stop, preserve evidence, and use a reviewed forward repair; do not improvise a down migration.
- Corruption or incompatible shared state: stop traffic-changing work and request a separate HUMAN recovery decision. Restore is last resort because it causes downtime and can discard newer Production/Preview data.

## Risks and decision

- **P1 / blocker:** backup/PITR and restore eligibility are unknown.
- **P1 / blocker:** exact remote owners/default ACL grantors and application database role are unknown, so the final migration cannot yet be exact.
- **P1 / blocker:** Data API exposed-schema state is unknown and requires a separate configuration decision.
- **P2:** remote RLS state is not represented in repository migrations, creating reproducibility drift.
- **P2:** broad browser-role grants are unnecessary defense-in-depth exposure even though zero policies currently deny rows.
- **P2:** eight foreign keys lack supporting leading-column indexes; low current volume reduces immediate launch impact.
- **P3:** `product_tags` lacks a formal primary key; its unique pair index prevents duplicates.
- **P3:** unused-index findings are not actionable without representative workload evidence.

**Recommendation: NO-GO for any G2B remote mutation now.** The clean schema is internally consistent and the proposed security behavior is locally validated, but the exact migration artifact and recovery gate cannot be completed truthfully with the remaining remote unknowns.

## Next HUMAN gate

Authorize a narrowly scoped, read-only G2B preflight to re-inspect the Production-sensitive Supabase target and provider backup page/API, plus read-only confirmation of the Vercel database role/connection mode. That gate must still prohibit all SQL mutation, migration execution, RLS/grant/Data API changes, restore, secret changes, deployment, promotion, and launch. After those facts are captured, a separate HUMAN database-mutation gate must approve the exact migration hash and recovery/forward-repair package before any external change.
