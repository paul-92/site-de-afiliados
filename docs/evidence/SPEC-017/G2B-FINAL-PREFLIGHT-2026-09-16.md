# SPEC-017 G2B final preflight

**Decision:** NO-GO — stop before remote mutation

**Created:** 2026-09-16T12:06:49Z

**Operator:** Codex, acting under the HUMAN's preparation-only authorization

**Repository commit inspected:** `5fa4d4d1f5e95254e0c8cbbcf227db563ee6a38c`

**Remote mutations performed:** none

## Secret-handling attestation

No database URL, password, hostname, credential, token, or secret value was printed, persisted, or committed. No remote SQL, migration, grant/revoke, RLS, Data API, Auth, environment, deployment, scheduler, data, or launch mutation was performed.

## A–D. Classifications and recovery status

- **A. Application role:** `UNKNOWN`. No `DATABASE_URL` was available in the process or ignored local environment files, and no authenticated deployment/browser/connector surface was available. Determination stopped without exposing a secret.
- **B. Connection mode:** `TRANSACTION POOLER (historical evidence only); CURRENT EFFECTIVE MODE UNKNOWN`. Repository evidence records that the Preview credential was corrected to a Transaction Pooler connection, but no current secret metadata was available to re-prove it.
- **C. Candidate `0003` compatibility:** `CONDITIONAL / NOT PROVEN`. The migration revokes privileges only from `anon` and `authenticated`; it does not revoke an independently named server login. However, enabling RLS can block a non-owner role without `BYPASSRLS`, while an owner/superuser/BYPASSRLS role remains able to operate. Compatibility therefore cannot pass until the effective application role and its ownership/RLS behavior are read-only proven.
- **D. Recovery package:** `NOT CREATED`. A safe logical package could not be created because no usable database connection and no Supabase CLI/`pg_dump`/`psql` toolchain were available. No placeholder was represented as a backup.

## E–H. Required recovery package

### Coverage

The minimum package must contain:

1. Supabase-filtered role dump;
2. application schema dump;
3. application data dump using COPY;
4. migration-history schema and data if not already covered;
5. manifest with UTC creation time, source project identifier in a non-secret form, operator, scope, exclusions, tool versions, retention, and restore ordering;
6. SHA-256 hashes for every plaintext dump before encryption and for the final encrypted archive.

### Exclusions requiring separate documentation

The normal Supabase CLI dump excludes provider-managed schemas such as `auth` and `storage`. It also does not recover Storage object bytes, Auth provider/OAuth configuration and secrets, SMTP configuration, API/JWT secrets, custom domains, Vercel environment configuration, or other provider control-plane settings. Database-resident Auth state must be classified explicitly and recovered only by a provider-supported method; do not improvise writes to provider-managed schemas. Storage metadata is not equivalent to Storage objects.

### Artifact location and hashes

- Recovery artifact: **none**.
- Recovery hashes: **none**.
- This evidence file is not a recovery artifact and contains no backup contents.

### Minimum viable operator procedure

Run from a trusted workstation with current Supabase CLI, Docker, an approved encryption tool, sufficient encrypted/off-repository storage, and a connection supplied only through the operator's secret store:

1. Create a new private staging directory outside the Git worktree with owner-only permissions.
2. Record the UTC timestamp, named operator, non-secret project identifier, CLI/container versions, scope, exclusions, and retention. Recommended minimum retention is through successful G2B postflight plus the agreed incident window; destruction requires a separate recorded decision.
3. Use `supabase db dump` to create `roles.sql` with `--role-only`, `schema.sql`, and `data.sql` with `--data-only --use-copy`, following the current Supabase backup/restore guide. Add explicit `supabase_migrations` schema/data dumps if the filtered main dumps do not include them.
4. Inspect command output before preserving logs; retain only sanitized status/error evidence. Never put the connection string on a shared command line, in shell history, or in the manifest.
5. Validate without Production restore: require every dump command to exit successfully; ensure files are non-empty; compute SHA-256; parse/list the dumps using the matching PostgreSQL/Supabase-supported tooling; and run a restore preflight that performs no connection to Production. A full rehearsal requires a separately authorized disposable target.
6. Encrypt the complete package with an approved authenticated-encryption mechanism and a key held separately in the organization's secret manager. Compute SHA-256 of the encrypted artifact. Delete plaintext only after the encrypted archive and hashes are verified, using the organization's secure-deletion policy.
7. Store the encrypted artifact off-repository in access-controlled storage and record its non-secret locator, retention/expiry, key custodian, and restore decision-maker.

### Restore procedure status

`DOCUMENTED, NOT EXECUTED OR REHEARSED`:

1. Obtain a separate HUMAN incident/recovery authorization and select a new/disposable target by default; restoring the shared Production-sensitive project requires explicit downtime and data-loss acceptance.
2. Retrieve and hash-verify the encrypted archive, decrypt into a private temporary directory, and verify every plaintext hash.
3. Provision a compatible Supabase target and required extensions/configuration. Preserve Supabase-managed boundaries.
4. Restore roles, schema, data, and migration history in the order documented by the current Supabase guide, with single-transaction/stop-on-error behavior where supported.
5. Apply separately captured provider control-plane/Auth/Storage configuration through supported interfaces; restore Storage object bytes from their separate backup.
6. Run schema, migration-history, row-count-only, RLS/grant/default-ACL, application-role, Auth, and application smoke checks before cutover.
7. Preserve the source and failed target until the HUMAN recovery owner accepts the result.

## I–L. Blockers, candidate, postflight, and repair

### Remaining blockers

1. Current effective application database role is unknown.
2. Current connection mode is not re-proven; Transaction Pooler is supported only by historical repository evidence.
3. Candidate compatibility with the actual login's RLS/ownership attributes is unproven.
4. No encrypted, hash-verified logical recovery package exists.
5. Restore parsing/rehearsal evidence and a recovery decision-maker are absent.
6. Data API exposed-schema posture remains a separate G2C blocker.

### Candidate confirmation

`drizzle/0003_secure_server_only_data_boundary.sql` was not changed or executed. Its verified SHA-256 is:

`6C1BB76E9AC0397C1E02A2A7716612AC1153E944C6E8182805EF2186E59BE5E7`

### Eventual read-only postflight

After a separately approved mutation, require:

1. exactly one new migration-history row with the approved migration identity/hash;
2. RLS enabled and zero policies on all nine application tables;
3. no table privileges for `anon` or `authenticated` on those tables;
4. no future `postgres` default table/sequence/function privileges for browser roles, and no default function execution by `PUBLIC` in the approved scope;
5. positive SELECT/INSERT/UPDATE/DELETE checks for the proven application role as required by the application;
6. negative Data API checks for browser roles;
7. schema drift, security/performance advisor, application smoke, and sanitized-log checks;
8. immediate stop on any mismatch, without improvised SQL.

### Forward repair

If the application loses database access after an eventual commit:

1. stop rollout/traffic-changing work and identify the actual login role read-only;
2. preserve the error and catalog evidence;
3. apply only a separately pre-reviewed repair granting the minimum required schema `USAGE`, sequence privileges, and table operations to that named server role;
4. never grant browser-role `ALL`, add permissive RLS policies, broaden `service_role`, rewrite migration history, or improvise a down migration;
5. repeat the full postflight. Restoration remains a separate HUMAN incident decision.

## M–P. Impacts and decision

### Positive impacts

- The candidate makes the server-only boundary reproducible and removes browser-role object privileges.
- Future `postgres`-created public objects become opt-in for browser access.
- The candidate contains no data rewrite, destructive object operation, policy, seed, scheduler, or extension change.

### Negative impacts and risks

- A non-owner application role without an applicable RLS bypass/policy can be blocked even if table grants remain.
- `ALTER DEFAULT PRIVILEGES` affects only the named creator role and does not cover objects created by other provider roles.
- Free-plan recovery depends on operator-created logical exports; ordinary dumps have material Auth/Storage/control-plane exclusions.
- Any restore can cause downtime and discard newer shared Production/Preview state.
- The DDL can wait on locks even though the nine tables are small.

### Recommendation

**NO-GO for remote G2B mutation.** The candidate hash passes, but application-role compatibility and the mandatory recovery package do not.

### Exact next HUMAN mutation gate

After an operator completes the minimum viable recovery procedure and read-only role/mode inspection, the next HUMAN gate must explicitly approve all of the following in one bounded mutation authorization:

- exact target project and environment;
- named operator, execution window, communication channel, and abort authority;
- `drizzle/0003_secure_server_only_data_boundary.sql` at SHA-256 `6C1BB76E9AC0397C1E02A2A7716612AC1153E944C6E8182805EF2186E59BE5E7`;
- proven application role/mode and positive compatibility result;
- encrypted recovery artifact locator, plaintext/encrypted hashes, timestamp, retention, key custodian, verified integrity evidence, exclusions, and restore decision-maker;
- exact read-only preflight/postflight checks and the minimum-role forward-repair statement;
- authorization to execute only that one migration, once.

Until that gate is approved, stop before every remote mutation.

## Addendum — HUMAN Supabase connection-target evidence

**Evidence received:** 2026-09-16

**Evidence source:** direct HUMAN observation in the authenticated Supabase dashboard

**Scope:** Supabase-presented connection target/mode only; the Vercel write-only `DATABASE_URL` value was neither revealed nor compared

### Updated role and mode classification

The HUMAN-observed combination of Shared Pooler, the regional `pooler.supabase.com` endpoint, port `6543`, database `postgres`, and username format `postgres.<project-ref>` is classified as:

- **Connection target:** Supabase Shared Pooler (Supavisor).
- **Connection mode:** transaction mode, evidenced by port `6543` on the shared-pooler endpoint.
- **Presented database role:** base role `postgres`; the project-reference suffix is Supavisor tenant routing, not a different PostgreSQL application role.
- **Vercel linkage:** `NOT DIRECTLY VERIFIED`. The observation proves what Supabase presented for this project, not the current secret value stored in Vercel. Vercel's write-only secret was not read, compared, changed, or rotated.

This addendum supersedes the earlier `UNKNOWN` target/mode classification for the Supabase-presented target. It does not convert the unavailable Vercel secret into inspected evidence.

### Updated candidate compatibility

**Target-level result: PASS, subject to the Vercel-linkage caveat.**

For the presented `postgres` target, candidate `0003`:

1. revokes privileges only from `anon` and `authenticated`, not from `postgres`;
2. enables RLS, but the table owner normally bypasses RLS unless `FORCE ROW LEVEL SECURITY` is enabled; this candidate does not force RLS;
3. applies future default-privilege revocations explicitly for role `postgres`, matching the presented base role;
4. does not revoke schema usage or provider-role privileges; and
5. remains compatible with the application's existing `prepare: false` setting required for transaction-pooler operation.

The remaining identity risk is operational rather than a contradiction in the SQL: because the Vercel value is write-only and was not compared, this evidence alone cannot prove that the deployed application currently uses the presented target. The eventual mutation gate must accept that limitation together with existing successful PostgreSQL-backed application evidence, or require a non-secret runtime connection classification through an approved mechanism.

The candidate file was not modified or executed. SHA-256 remains:

`6C1BB76E9AC0397C1E02A2A7716612AC1153E944C6E8182805EF2186E59BE5E7`

### Updated Free-plan recovery strategy

An encrypted off-site logical backup is accepted as the MVP recovery strategy. Paid PITR is not an MVP prerequisite. The logical package must contain Supabase-filtered roles, schema, data, and migration history as applicable, plus a manifest recording UTC creation time, sanitized target, operator, scope, exclusions, sizes, plaintext SHA-256 values, encrypted-package SHA-256, off-Git locator, retention, restore ordering, and decision-maker.

### Automatic production result

No real dump could be produced automatically. The environment has none of the required dump/restore tools (`supabase`, `pg_dump`, `pg_restore`, `psql`, Docker, or Podman), no approved encryption utility (`age`, GPG, 7-Zip, or OpenSSL), no Vercel CLI, and no locally available database credential source. No empty or synthetic file was represented as recovery evidence.

### Minimum HUMAN action

On a trusted operator workstation, outside this Git worktree:

1. Install or use an existing current Supabase CLI and Docker installation. Confirm versions with `supabase --version`, `supabase db dump --help`, and `docker --version`; do not install anything in this repository.
2. Create a private off-Git staging directory with owner-only access and sufficient space.
3. Obtain the connection string directly from the authenticated Supabase Connect dialog and supply it only through a temporary process environment variable or approved secret manager. Do not paste it into repository files, scripts, command history, logs, chat, or evidence. Prefer a connection method supported by the current Supabase backup guide; do not alter the Vercel secret.
4. Following the current CLI help, produce:
   - `roles.sql` using `supabase db dump --role-only`;
   - `schema.sql` using the normal Supabase-filtered schema dump;
   - `data.sql` using `--data-only --use-copy`;
   - explicit `supabase_migrations` schema/data dumps if the ordinary filtered dumps do not include migration history.
5. Require successful exit codes and non-empty files. Record byte sizes and SHA-256 hashes. Check that the SQL dumps are readable/parseable with the matching supported tooling without connecting to or restoring into Production. A full restore rehearsal needs a separately authorized disposable target.
6. Write a secret-free manifest with timestamp, sanitized project/region/mode classification, operator, scope, exclusions, tool versions, sizes, hashes, retention, restore procedure, and off-Git destination.
7. Encrypt the dumps and manifest together with approved authenticated encryption. Store the key separately in the organization's secret manager. Hash the encrypted artifact, verify it, then remove plaintext under the organization's secure-handling procedure.
8. Place the encrypted artifact in access-controlled off-site storage. Return only the sanitized locator, hashes, timestamp, sizes, retention, exclusions, tool versions, and validation result to the G2B evidence package.

If the workstation cannot safely install/run these tools or securely retain the encryption key, stop. The minimum alternative is another trusted operator workstation that already has the toolchain; an unencrypted dump or repository-stored dump is not acceptable.

### Recovery exclusions and limitations

- Normal Supabase CLI dumps exclude provider-managed schemas such as `auth` and `storage`; any database-resident Auth recovery coverage must be explicitly confirmed against the actual dump and current provider-supported restore procedure.
- Storage database metadata does not include Storage object bytes; object contents need a separate export/backup.
- Auth provider/OAuth secrets, SMTP settings, API/JWT secrets, project configuration, Data API settings, custom domains, Vercel environment values, and other provider control-plane state require separate sanitized configuration records and supported restoration steps.
- No restore into Production is authorized. Restore remains a separate HUMAN incident decision.

### Updated recommendation

**NO-GO for the future remote G2B mutation gate until the encrypted logical package exists and its sizes, hashes, integrity validation, retention, off-Git location, exclusions, and restore procedure are recorded.**

Once that recovery evidence is complete, the candidate is technically compatible with the Supabase-presented `postgres` transaction-pooler target. The final HUMAN gate must explicitly acknowledge that the Vercel write-only secret was not directly compared, approve the exact target/operator/window and candidate hash, and authorize only one execution followed by the documented read-only postflight.
