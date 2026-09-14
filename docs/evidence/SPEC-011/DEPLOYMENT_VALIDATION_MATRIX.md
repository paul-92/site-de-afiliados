# SPEC-012 deployment validation matrix

| Item not legitimately validated locally | Required SPEC-012 validation |
|---|---|
| Supabase Auth real | Login, authenticated Admin operation, session refresh, logout and fail-closed behavior against the configured project |
| Real allowlist | Authorized and unauthorized real users across `/admin/*` and mutations |
| Remote migrations | Apply accepted ordered migrations in the authorized Supabase window; verify final tables/indexes and rollback plan |
| Production environment | Configure and validate `DATABASE_URL`, Supabase public Auth variables, Admin IDs, site origin and server-only secrets |
| CSP with real origins | Reconcile `connect-src`, images and any actual Supabase/Vercel origins without broad wildcards |
| HTTPS and HSTS | Confirm HTTPS end-to-end before activating and validating HSTS |
| PageView retention | Activate and observe the 90-day scheduler boundary |
| Vercel runtime | Validate build/start behavior, headers, logs, routing and fail-closed errors on the real platform |
| Privacy/business identity | Configure truthful business identity and privacy contact before production publication |

None of these items is represented as locally PASS. Each is a SPEC-012 validation requirement.
