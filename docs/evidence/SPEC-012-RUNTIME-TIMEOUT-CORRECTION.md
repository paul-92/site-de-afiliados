# SPEC-012 — Runtime timeout correction and Preview evidence

## Baseline and scope

- Starting accepted baseline: `85e89c888380b314dc86c2fbf338ecbe9a1c5967`.
- Final HUMAN-validated functional HEAD: `88491f09204ef373514fddea904c1451d16530e9`.
- Correction branch: `feature/spec-012-runtime-timeout-correction`.
- Scope was limited to sanitized timing telemetry, PostgreSQL lifecycle hardening, bounded database work, Analytics runtime integration, tests, and evidence.
- The code corrections made no schema, migration, dependency, authorization, tracking, product behavior, secret, Supabase configuration, or Vercel configuration change.

## Recovered incident sequence

### A. Original 300-second runtime failure

Preview produced 300-second Vercel timeouts while database work was initiated during `/admin` rendering. A successful login redirected to `/admin`, and a direct authenticated request followed the same authorization and dashboard database path. The application had no application query deadline, and `client.end()` had no teardown timeout, so database work or teardown could remain pending until the platform terminated the invocation.

### B. Fail-fast runtime correction — `d82c8c4`

Commit `d82c8c48c6b10b73b0ebe2bb2ba19294b67bd8b3` hardened runtime behavior. It introduced conservative serverless PostgreSQL settings, bounded application work and teardown, and sanitized `runtime_timing` events for `AUTH`, `CONNECT`, `QUERY`, and `TEARDOWN`.

Postgres.js creates connections lazily: `database-client-create` measures synchronous client construction, while DNS, TCP, TLS, database authentication, pool wait, and SQL execution are included in the first `QUERY` duration. Logs intentionally contain no URL, credentials, keys, cookies, sessions, user identity, query text, or parameters.

| Setting | Value | Rationale |
| --- | ---: | --- |
| `prepare` | `false` | Required for the Supabase transaction pooler mode. |
| `max` | `1` | Conservative per-invocation pool size for serverless. |
| `connect_timeout` | 10 seconds | Allows normal establishment while failing far before the platform limit. |
| `statement_timeout` | 15 seconds | Cancels an executing statement server-side. |
| application query deadline | 20 seconds | Bounds client/network stalls not covered by the server timeout. |
| `idle_timeout` | 20 seconds | Prevents an unexpectedly retained idle connection. |
| `max_lifetime` | 300 seconds | Rotates retained connections. |
| teardown timeout | 5 seconds | Destroys work that cannot close cleanly. |
| SSL | `require` | Enforces TLS for the pooler connection. |

### C. Invalid database credential and PostgreSQL `28P01`

Preview then exposed PostgreSQL `28P01`, identifying an invalid `DATABASE_URL` credential for the Transaction Pooler connection. The code hardening in `d82c8c4` made failure bounded and diagnosable; it did **not** repair the credential and must not be represented as the cause of the authentication recovery.

### D. HUMAN operational credential correction

A HUMAN corrected the Preview `DATABASE_URL`/Transaction Pooler credential outside this repository. After that operational correction, `28P01` was not reproduced and the real PostgreSQL-backed Admin dashboard counts passed. No credential value is recorded here.

### E. Successful `/admin` validation

After the credential correction, HUMAN Preview validation confirmed real Supabase Auth login, `ADMIN_USER_IDS` authorization, authenticated `/admin` access, and PostgreSQL-backed dashboard counts. The former 300-second Vercel timeout was not reproduced.

### F. Analytics integration finding

Validation of `d82c8c4` found that navigation from `/admin` to `/admin/analytics` remained visually on `/admin`. The destination was blocked by an Analytics snapshot of eleven queries. With the serverless pool limited to one connection, the former `Promise.all` queued eleven operations without the dashboard's complete-snapshot deadline.

### G. Analytics runtime correction — `88491f0`

Commit `88491f09204ef373514fddea904c1451d16530e9` kept all SQL statements and metrics unchanged, executed the eleven operations explicitly in sequence, and applied one 30-second deadline to the complete snapshot. This avoids starting eleven deadlines while ten operations wait for the pool, prevents partial snapshots, and reaches the existing safe error boundary before the Vercel runtime limit. Individual sanitized timings identify the active metric without recording SQL or data.

A segment-level `/admin/analytics/loading.tsx` supplies accessible loading status during non-instant navigation.

### H. Final HUMAN Preview validation — PASS

The HUMAN validated the combined state at `88491f0` in Preview:

| Area | HUMAN-observed result |
| --- | --- |
| Home | PASS |
| `/api/page-view` | PASS; successful HTTP 204 responses observed |
| Corrected `DATABASE_URL` / Transaction Pooler connection | PASS |
| Previous PostgreSQL `28P01` | NOT REPRODUCED after HUMAN credential correction |
| Previous 300-second Vercel timeout | NOT REPRODUCED |
| Real Supabase Auth login | PASS |
| `ADMIN_USER_IDS` authorization | PASS |
| Authenticated `/admin` access | PASS |
| Logout | PASS |
| Protected `/admin` access after logout | PASS |
| PostgreSQL-backed dashboard counts | PASS |
| Overview navigation | PASS |
| `/admin` → `/admin/analytics` navigation | PASS |
| Analytics cockpit render | PASS |
| 7-, 30-, and 90-day periods | PASS |
| Previous Analytics navigation/rendering hang | NOT REPRODUCED after `88491f0` |
| Products | PASS |
| Categories and tags | PASS |
| Marketplaces | PASS |
| Return to Overview | PASS |

Production remained untouched and no Production promotion occurred. These fixes introduced no schema/migration change, service-role usage, Auth bypass, or observed security/privacy weakening.

## `runtime_timing` disposition

The instrumentation remains unchanged. The final HUMAN G4 decision requires it to remain temporarily through the separate Production-validation gate; its eventual removal or permanent retention requires a later HUMAN decision.

- **Benefits:** preserves phase-level evidence for Production validation, makes future latency/failure localization practical, and confirms fail-fast behavior without exposing query or identity data.
- **Risks:** adds operational log noise and a small maintenance surface; event names and durations can reveal coarse internal execution structure.
- **Runtime/log-volume impact:** console logging adds minor CPU/I/O overhead per timed Auth/database operation. Analytics produces the highest volume because it records individual operations plus the complete snapshot, but no material runtime impact has been observed.
- **Security/privacy:** current events are sanitized and intentionally omit credentials, URLs, cookies, JWTs, email, user identity, SQL, parameters, and returned data. Provider access controls, retention, and log-export policy still apply.
- **Recommendation:** **B — retain temporarily through Production validation**, then require a HUMAN decision to remove it or accept it permanently. This preserves the evidence needed at the remaining real-environment gate without prematurely creating permanent telemetry policy.

## Readiness and remaining findings

- P0: 0 identified.
- P1: 0 identified.
- P2: 0 identified after the two runtime corrections and successful HUMAN Preview validation.
- P3/debt: temporary `runtime_timing` disposition; the pre-existing Vite native config-loader warning and harmless color tooling notice; four accepted moderate development-only `drizzle-kit` advisories.

Still unresolved or not evidenced as complete for Production: Production-specific environment validation; approved migration/clean-database application evidence; CSP validation against the final real origins; end-to-end Production HTTPS confirmation; HSTS activation only after HTTPS confirmation; PageView 90-day retention scheduler activation and observation; truthful business identity/privacy contact validation; explicit session-refresh evidence if retained as an acceptance requirement; and Production monitoring/log-policy confirmation. Preview success does not authorize or prove Production promotion.

## Decision package

### Positive impacts

- Database failures are bounded and diagnosable well before the former platform timeout.
- The actual `28P01` cause and its HUMAN operational correction are accurately separated from code changes.
- Real Auth, allowlist authorization, PostgreSQL dashboard data, tracking, Admin navigation, Analytics, logout, and post-logout protection passed in Preview.
- No schema, migration, dependency, Auth-boundary, or privacy weakening was introduced by the corrections.

### Negative impacts / risks

- Conservative single-connection execution can add latency.
- Runtime deadlines may reject unusually slow but otherwise valid administrative queries.
- Temporary timing events add log volume and require an explicit post-Production disposition.
- Production prerequisites remain and cannot be inferred from Preview validation.

### Practical consequences

The corrected Preview baseline was accepted by the HUMAN for SPEC-012's correction and Preview-validation scope. Acceptance does not authorize deployment, merge, Production promotion, remote migration, secret change, HSTS activation, or scheduler activation. Each remaining Production operation stays behind its applicable HUMAN gate.

**Final state:** `SPEC-012 ACCEPTED · G4 HUMAN APPROVED · PREVIEW FUNCTIONAL VALIDATION ACCEPTED`
