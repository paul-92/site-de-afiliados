# SPEC-012 — Runtime timeout correction evidence

## Baseline and scope

- Accepted baseline: `85e89c888380b314dc86c2fbf338ecbe9a1c5967`.
- Correction branch: `feature/spec-012-runtime-timeout-correction`.
- Scope is limited to safe timing telemetry, PostgreSQL lifecycle hardening, bounded database work, tests, and this evidence.
- No schema, migration, Supabase, Vercel, secret, authorization, tracking, or product behavior change is included.

## Diagnosis and timing model

The strongest common cause of both observed 300-second timeouts is database work initiated while rendering `/admin`. A successful login redirects to `/admin`, and a direct authenticated GET follows the same authorization and dashboard database path. The application previously had no query deadline, and `client.end()` had no timeout, so either work or teardown could remain pending until Vercel terminated the invocation.

Safe `runtime_timing` events now distinguish `AUTH`, `CONNECT`, `QUERY`, and `TEARDOWN`. Postgres.js creates connections lazily: `database-client-create` measures synchronous client construction, while DNS, TCP, TLS, database authentication, pool wait, and SQL execution are included in the first `QUERY` duration. Logs intentionally contain no URL, credentials, keys, cookies, sessions, user identity, query text, or parameters.

## Runtime correction

| Setting | Value | Rationale |
| --- | ---: | --- |
| `prepare` | `false` | Required for the Supabase transaction pooler mode. |
| `max` | `1` | Conservative per-invocation pool size for serverless; avoids four simultaneous connections for dashboard counts. |
| `connect_timeout` | 10 seconds | Allows normal network establishment while failing far before the 300-second platform limit. |
| `statement_timeout` | 15 seconds | Server-side cancellation of an executing statement. |
| application query deadline | 20 seconds | Bounds client/network stalls not covered by a server statement timeout. |
| `idle_timeout` | 20 seconds | Prevents an unexpectedly retained client from holding an idle connection indefinitely. |
| `max_lifetime` | 300 seconds | Rotates retained connections and matches a conservative serverless lifecycle. |
| teardown timeout | 5 seconds | `client.end({ timeout: 5 })` destroys work that cannot close cleanly. |
| SSL | `require` | Enforces TLS for the Supabase pooler connection. |

Dashboard semantics remain four independent counts. With a one-connection pool, the existing `Promise.all` requests are queued and executed without opening four database connections. Each operation has its own bounded deadline.

## Risks and rollback

- A 15-second statement timeout can cancel genuinely slow administrative queries; current count queries are expected to finish far below it.
- A pool of one serializes the four counts and may add small latency, while materially reducing connection pressure.
- An application deadline rejects before underlying I/O necessarily stops; the bounded teardown immediately follows and destroys it within five additional seconds.
- Rollback is a revert of the isolated correction commit. No data or external configuration rollback is needed.

## Preview validation checklist

1. Deploy the correction branch to Preview without changing its existing variables.
2. Open `/admin-access-denied` anonymously and confirm a fast GET.
3. Sign in with the authorized real user and record the POST duration.
4. Confirm navigation to `/admin` and record its GET duration.
5. Inspect `runtime_timing` events in order; do not export secrets or request headers.
6. Confirm `supabase-sign-in-with-password` and `supabase-get-user` succeed normally.
7. Identify whether the first dashboard query succeeds or fails, and its duration.
8. Confirm `database-client-close` succeeds within five seconds, or reports failure before the Vercel limit.
9. Refresh `/admin`, then validate session refresh and logout.
10. Exercise the remaining admin pages and the public storefront.
11. If a query fails, correlate its timestamp with Supabase Postgres/Supavisor logs.
12. Confirm no invocation reaches 300 seconds and no runtime log includes credentials, cookies, JWTs, email, URL, query text, or parameters.

Local tests cannot establish Vercel-to-Supabase connectivity. Final root-cause confirmation remains dependent on the Preview timing sequence and correlated provider logs.
