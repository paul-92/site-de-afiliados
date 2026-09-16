# SPEC-017 — G2B targeted read-only preflight

**Status:** COMPLETE · NO-GO FOR REMOTE G2B MUTATION

**Executed:** 2026-09-16

**Target:** sole accessible Supabase project `garimora`, `sa-east-1`, PostgreSQL 17.6, active/healthy

## Boundary attestation

All remote database calls were catalog-only `SELECT` queries or provider metadata reads. No application row content, Auth record, query text, client address, secret, key, token, password, connection string, DDL, DML, migration, grant, RLS, policy, Data API setting, backup, restore, scheduler, environment, deployment, promotion, or launch mutation occurred.

## A. Owner and grantor evidence

- `public` is owned by `pg_database_owner`.
- All nine Garimora application tables are owned by `postgres`.
- No application sequence exists; UUID defaults use `gen_random_uuid()`.
- Every current table grant on the nine tables was granted by `postgres`.
- Existing `public` schema ACLs were granted by `pg_database_owner`.

Classification: **REQUIRED BEFORE G2B MUTATION — RESOLVED.**

## B. Default-privilege evidence

`pg_default_acl` contains `public` defaults for both `postgres` and provider-managed `supabase_admin`:

- tables: broad privileges for `anon`, `authenticated`, `postgres`, and `service_role`, including PostgreSQL 17 `MAINTAIN`;
- sequences: `USAGE`, `SELECT`, and `UPDATE` for those roles;
- functions: `EXECUTE` for those roles.

`postgres` is not a member of `supabase_admin`; `supabase_admin` is a member of `postgres`. A migration running as `postgres` must not claim to alter `supabase_admin` defaults. The candidate therefore removes `postgres` defaults, which govern repository migrations and own all current application objects, and leaves provider-managed defaults untouched. G2C must use the provider Data API exposure control as the outer boundary if automatic provider grants remain.

Classification: **REQUIRED BEFORE G2B MUTATION — RESOLVED for repository-owned objects; provider default behavior remains a G2C item.**

## C. Effective current grant posture

- Each of the nine application tables grants all eight table privilege types (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `MAINTAIN`) to both `anon` and `authenticated`.
- The same privileges remain for `postgres` and `service_role`.
- `anon` and `authenticated` have `USAGE`, not `CREATE`, on `public`.
- RLS is enabled on all nine tables, not forced, with zero policies. Browser roles therefore currently fail closed at the row layer despite broad object grants.
- There are zero functions in `public`, including zero `SECURITY DEFINER` functions.

Classification: broad browser grants are **REQUIRED BEFORE G2B MUTATION** hardening for the server-only contract; zero policies is intentional.

## D. Application database role and mode

- No live Garimora application connection was visible during the read-only observation window.
- Active provider sessions were limited to PostgREST, pooler/provider administration, monitoring, and the management query session.
- Historical accepted evidence says Preview used the Transaction Pooler after its credential correction.
- The exact current Vercel `DATABASE_URL` role and mode could not be inspected because no authenticated Vercel/browser surface or Vercel connector was available.
- No connection string or credential was read.

Current classification: **UNKNOWN — REQUIRED BEFORE G2B MUTATION.** Historical mode evidence is not promoted to current proof.

## E. Proposed-revocation compatibility

The candidate revokes privileges only from `anon` and `authenticated`; it does not revoke from `postgres`, `service_role`, `authenticator`, `supabase_admin`, or any custom login role. `postgres` owns all application tables and retains owner rights. Thus the standard Supabase `postgres` direct/pooler application connection is compatible by construction.

Compatibility for the actual Vercel value remains **UNKNOWN** until its role/mode is classified. If it maps to `postgres`, result is PASS. If it is a custom role relying solely on membership-derived browser grants, a separate explicit least-privilege server-role grant would be required before revocation.

Classification: **REQUIRED BEFORE G2B MUTATION.**

## F. Data API current posture

- PostgREST 14.5 is active.
- Database-local checks for `pgrst.db_schemas` returned no value.
- `public` grants and schema `USAGE` make the tables grant-eligible for the Data API, but RLS with zero policies currently denies rows.
- The exact provider exposed-schema setting remains **UNKNOWN**. No API key was retrieved merely to probe it.

Classification: **REQUIRED BEFORE LAUNCH/G2C**, but the candidate revocation safely removes table reachability even if `public` is exposed.

## G. Data API options and consequences

### A — disable Data API or unexpose `public`

Best fit for the accepted server-only data architecture. It removes the generated REST/GraphQL surface independent of RLS and grants, reduces accidental future exposure, and does not affect direct PostgreSQL/Drizzle access. Supabase Auth clients remain a separate API surface; provider validation is required before disabling the whole Data API integration. Removing only `public` or using a dedicated empty/minimal API schema is the lower-coupling alternative.

### B — retain `public` exposure

Keep RLS enabled and zero policies, revoke every current and future table/sequence/function privilege from `anon` and `authenticated`, and grant back only deliberately reviewed operations if browser data access is introduced. This preserves future Data API flexibility but retains more configuration surface and requires continuous policy/grant verification.

No option was selected or implemented. Classification: **G2C HUMAN DECISION REQUIRED**.

## H. Backup and recovery evidence

- Organization plan: **Free**.
- Supabase documentation provides automatic daily backups only for Pro, Team, and Enterprise plans; PITR is a paid add-on for those plans and requires eligible compute.
- Therefore no provider-supported daily recovery point, retention window, or PITR restore point is evidenced for this project.
- The connector exposes no read-only backup-list operation, and no dashboard session was available.
- Supabase recommends Free projects create off-site logical exports with `supabase db dump`.

Classification: **REQUIRED BEFORE G2B MUTATION — UNRESOLVED.**

## I. Recovery limitations and required alternative

Before mutation, an separately authorized operator must produce encrypted/off-site logical dumps of roles, schema, and data, record hashes/timestamp/operator/retention, and validate parsability plus a restore procedure. Supabase CLI dumps use provider filtering; the ordinary CLI dump excludes managed schemas such as `auth` and `storage`, so the operator must explicitly document whether Auth recovery is covered and what provider configuration is not recoverable from SQL. Storage objects, API/JWT secrets, Auth provider configuration, custom domains, and environment configuration require separate recovery records.

For this security-only migration, primary rollback is transaction abort before commit or the pre-reviewed forward repair after commit. A logical restore is last resort and may require a separate target, credentials, downtime, and reconfiguration.

## J. Launch blockers

- **LAUNCH BLOCKER:** no evidenced recoverable provider point or accepted/tested logical recovery package for the Production-sensitive shared database.
- **LAUNCH BLOCKER via G2C:** exact Data API exposed-schema posture and final option remain undecided.
- **REQUIRED BEFORE G2B MUTATION:** current Vercel database role/mode classification and positive compatibility result.

## K. Safe to defer

- **SAFE TO DEFER POST-LAUNCH:** eight supporting foreign-key indexes, subject to workload evidence.
- **SAFE TO DEFER POST-LAUNCH:** formal primary key conversion for `product_tags`; its unique pair index already enforces uniqueness.
- **SAFE TO DEFER POST-LAUNCH:** disposition of four low-traffic unused-index findings.
- **SAFE TO DEFER POST-LAUNCH:** PageView retention scheduler activation under its own gate.
- **OPTIONAL HARDENING:** paid PITR or restore rehearsal into a separate project, although a credible recovery method itself is not optional.

## L. Exact proposed versioned migration

Generated locally with the installed Drizzle generator as `drizzle/0003_secure_server_only_data_boundary.sql`.

**SHA-256:** `6C1BB76E9AC0397C1E02A2A7716612AC1153E944C6E8182805EF2186E59BE5E7`

It:

1. enables RLS on each of the nine named tables;
2. revokes `ALL PRIVILEGES` on exactly those tables from `anon` and `authenticated`, including PostgreSQL 17 `MAINTAIN`;
3. revokes future `postgres`-owned table and sequence privileges from those roles;
4. revokes future `postgres`-owned function execution from those roles and `PUBLIC`;
5. creates no policy, DML, seed, function, extension, scheduler, index, constraint, or destructive object change;
6. preserves `postgres`, `service_role`, provider roles, schema `USAGE`, and all non-browser roles.

The SQL file is the authoritative exact content; no remote application is authorized.

## M. Verification procedure

Pre-mutation:

1. Freeze commit and migration SHA-256; verify migrations `0000`–`0002` and remote history still match.
2. Prove current Vercel database role/mode without exposing its value; require `postgres` mapping or explicitly prove an alternative server role has necessary privileges.
3. Capture and verify the authorized logical recovery package.
4. Re-run catalog assertions for owners, default ACLs, grants, RLS/policies, row counts only, Data API setting, and advisors.
5. Replay `0000`–`0003` on a clean PostgreSQL 17 target; require four migration history rows, nine RLS-enabled tables, zero browser-role table grants, 72/72 denied browser operations, and full application verification.

Post-mutation, if separately approved:

1. Confirm exactly one new migration history row with the approved hash.
2. Confirm RLS enabled and zero policies on all nine tables.
3. Confirm zero table privileges for `anon`/`authenticated` and no future `postgres` default table/sequence/function privileges.
4. Confirm the server role can perform the required application operations and browser roles receive permission denial through the Data API.
5. Run security/performance advisors and application smoke checks; stop on first mismatch.

Local candidate replay result: four migrations, nine RLS tables, zero browser table grants, 72/72 denials, `drizzle-kit check` PASS. Full verification also passed: lint, type-check, 96/96 tests, Production build, and migration consistency.

## N. Forward repair and abort

Abort before mutation on target/history/hash/owner/default-ACL/role/recovery mismatch, unexpected nonempty catalog table, active incident, or new policy/grant.

If the approved migration fails before commit, preserve the error and do not retry improvised SQL. If application access fails after commit, first establish the actual login role. Grant only `USAGE` on `public` and the minimum required table operations to that named server role; never restore browser-role `ALL`, add permissive policies, or alter `service_role` as a shortcut. Re-run the exact postflight. Restore is a separate HUMAN incident decision.

## O. Positive impacts

- Repository and remote security posture become reproducible.
- Browser roles lose object reachability as well as row visibility.
- Future repository-created objects become opt-in rather than automatically exposed.
- The direct server path and provider-managed roles remain untouched.
- No data rewrite, table rebuild, index build, or destructive DDL is involved.

## P. Negative impacts and risks

- A misclassified application login that depends on inherited browser grants could lose access.
- `supabase_admin` provider defaults remain outside the migration's authority; G2C exposure controls and recurring audits remain necessary.
- Free plan has no evidenced provider recovery point.
- Disabling the entire Data API without confirming Auth/product coupling could cause functional impact; prefer a scoped exposed-schema decision.
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and table `REVOKE` take catalog/table locks; expected duration is short for nine tiny tables, but a busy session can cause lock wait.

## Q. Recommendation

**NO-GO FOR REMOTE G2B MUTATION.** The exact candidate migration now exists and passes local replay, but the current application role/mode and minimum recovery prerequisite remain unresolved. Data API posture also remains a G2C launch blocker.

## R. Exact next HUMAN gate

Authorize two preparation actions only:

1. read-only Vercel inspection of the Production/Preview `DATABASE_URL` metadata sufficient to classify database role and direct/session/transaction-pooler mode without returning the URL, host, password, or other secret; and
2. creation and verification of an encrypted logical recovery package for the Free-plan Supabase project, with explicit scope for `public`, roles, data, Auth limitations, hashes, retention, operator, and restore procedure.

After those pass, the next HUMAN database-mutation gate must approve the exact `0003` file/hash, target, operator/window, recovery package, postflight queries, and forward-repair before any remote SQL.
