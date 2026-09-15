# SPEC-017 — G2B database preparation

**Status:** PREPARATION COMPLETE · AWAITING HUMAN DATABASE-MUTATION GATE

**Prepared:** 2026-09-15

**Target:** the validated shared Garimora Supabase project, now Production-sensitive

## Boundaries

This is a diagnostic and exact execution plan only. It does not authorize remote SQL, migration execution, schema or data changes, RLS/grant/Data API changes, backup/restore actions, scheduler changes, or test-data creation. Existing rows must be treated as Production data.

## Read-only diagnosis

- Repository migration journal contains `0000_worried_wallop`, `0001_melodic_roughhouse`, and `0002_third_sebastian_shaw` in order.
- Remote migration history matched those three names and their order at G2A.
- All nine expected application tables exist remotely. Catalog-related tables were empty; `page_views` contained 13 rows. No row content was selected.
- RLS is enabled on all nine application tables, but this remote state is not represented in repository migrations.
- There are zero public-schema RLS policies. With RLS enabled, current browser roles fail closed.
- `anon` and `authenticated` retain broad table grants. RLS currently blocks rows, but grants and RLS are separate layers; the broad grants are unnecessary because application data access uses the server-side direct database connection, not the Supabase Data API.
- The Data API exposed-schema setting remains UNKNOWN.
- No scheduler extension/job was found. The 90-day PageView purge exists only as an application boundary and is not scheduled.
- Backup/PITR plan, retention, latest recovery point, and restoration entitlement remain UNKNOWN.
- Advisor findings: eight unindexed foreign keys, `product_tags` has no primary key (but has a unique pair index), and four indexes were reported unused. These are review findings, not authorization to change them.
- Relevant platform change: Supabase is moving Data API table exposure toward explicit opt-in. The plan therefore must not rely on implicit default grants.

## Proposed authoritative database posture

For the current server-only data architecture:

1. Keep RLS enabled on every application table.
2. Create no `anon` or `authenticated` data policies; deny browser-role row access by design.
3. Revoke all privileges on the nine application tables and their sequences from `anon` and `authenticated`, plus remove automatic default privileges for future tables/sequences/functions in `public` for those roles.
4. Do not use `service_role` in the application. Preserve provider-managed privileges until read-only inspection proves the exact ownership/default-ACL model; never expose the key to the client.
5. Prefer disabling the Data API if the project exposes no other required API surface. If provider constraints require it to remain enabled, remove `public` from exposed schemas or expose a dedicated empty/minimal API schema. This provider setting is a G2C mutation and must be approved together with the SQL posture.
6. Do not add RLS policies merely to make tests pass. Any future browser data access requires a separately reviewed authorization model with allow/deny tests.
7. Do not enable or schedule retention in G2B. Scheduler activation is a separate G2C/retention authorization.

## Exact gated work order

### Phase 0 — freeze and abort criteria

- Freeze the exact release commit, migration hashes, project ref, region, operator, window, and communication channel.
- Require a current recoverable backup/recovery point and recorded rollback decision-maker before any DDL.
- Abort on project mismatch, migration-history mismatch, unexpected nonempty catalog tables, unknown owner/default privileges, backup not recoverable, active incident, or any query result inconsistent with G2A.

### Phase 1 — read-only preflight

- Reconfirm PostgreSQL version, project identity, migration history, table/column/constraint/index inventory, row counts only, RLS flags, policies, grants, default ACLs, exposed schemas, extensions, cron jobs, database roles used by Vercel, and advisor results.
- Compare repository schema snapshots and migration hashes with the remote catalog. Classify every difference before proposing SQL.
- Confirm the Vercel `DATABASE_URL` role and connection mode without recording its secret. Confirm that revoking browser-role grants cannot affect the direct server connection.

### Phase 2 — clean representative replay

- Create an ephemeral/local representative PostgreSQL target, never the shared project.
- Apply `0000` through `0002` in journal order and run `npm run db:check` plus schema assertions for all enums, tables, constraints, foreign keys, indexes, and migration history.
- Apply the proposed security migration locally, then test denial for `anon` and `authenticated` across SELECT/INSERT/UPDATE/DELETE on every application table. Test that the designated server database role retains only the operations required by the application.
- Run the full application verification suite. Destroy only the explicitly identified ephemeral target after evidence capture.

### Phase 3 — reviewed migration artifact

- After preflight confirms exact role ownership/default ACLs, create a new migration using the installed migration generator; do not invent its timestamp/name.
- The migration must idempotently enable RLS on the nine tables; revoke existing and default table/sequence/function privileges from `anon` and `authenticated`; and contain no permissive policy, data DML, seed, scheduler, extension, or destructive object change.
- Treat advisor remediations as separate proposals. Do not drop the unique `product_tags` index or unused indexes based only on low-traffic statistics. Adding foreign-key indexes or a primary key requires its own reviewed migration and performance rationale.
- Record the final SQL, hash, expected locks, duration estimate, verification queries, and forward-repair plan for HUMAN review.

### Phase 4 — backup and recovery gate

- Read-only verify plan tier, daily-backup or PITR mode, retention window, latest successful recovery point, and restore eligibility.
- Minimum acceptable MVP evidence: a provider-supported recoverable point created before mutation, its timestamp/retention, named operator, expected downtime, and a written restore/duplicate-project procedure.
- Prefer a restore rehearsal into a separate disposable project. That creates external resources and therefore requires explicit authorization and budget approval.
- A restore of the shared Production-sensitive project is never a routine rollback: it causes downtime and may discard newer Production/Preview data. Prefer application rollback plus forward database repair after additive migrations.

### Phase 5 — future remote execution, only after G2B approval

- Re-run Phase 1, verify the backup/recovery point, then apply only the approved migration hash once.
- Run read-only postflight: migration history, schema diff, RLS/grants/default ACLs, Data API reachability denial, server application connectivity, security/performance advisors, and sanitized logs.
- Abort and stop on any mismatch. Do not seed data. Do not improvise SQL. Do not restore without a separate incident decision.

## Rollback model

- Before remote execution: no-op; stop and correct the plan.
- Application incompatibility with additive schema: roll back the application deployment to the recorded prior deployment when safe.
- Security-migration defect: use a pre-reviewed forward repair that restores only the minimum required grants; never broadly grant `ALL` to browser roles.
- Corrupt/incompatible database state: stop traffic-changing work, preserve evidence, and obtain a separate HUMAN recovery decision. Restoration is last resort because the project is shared and newer data may be lost.

## G2B decision required

The HUMAN must approve or reject the exact migration artifact, project target, operator/window, backup evidence, verification queries, and forward-repair plan. Until then, every external database action remains prohibited.
