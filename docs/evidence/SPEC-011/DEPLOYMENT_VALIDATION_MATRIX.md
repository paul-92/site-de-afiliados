# SPEC-012 deployment validation matrix

| Item not legitimately validated locally | Required SPEC-012 validation |
|---|---|
| Real Supabase project/configuration | Select and validate the authorized real project and its configuration |
| Supabase Auth real | Login, authenticated Admin operation, session refresh, logout and fail-closed behavior against the configured project |
| Real Admin user and allowlist | Provision the authorized Admin identity and validate authorized and unauthorized real users across `/admin/*` and mutations |
| Real PostgreSQL clean migration | Apply the complete accepted migration history to a clean real PostgreSQL database and verify final tables/indexes |
| Approved remote migrations | Apply only approved ordered migrations in the authorized Supabase window and verify the rollback plan |
| Production environment | Configure and validate `DATABASE_URL`, Supabase public Auth variables, Admin IDs, site origin and server-only secrets |
| CSP with real Supabase origins | Reconcile `connect-src`, images and actual Supabase/Vercel origins without broad wildcards |
| HTTPS and HSTS | Confirm HTTPS end-to-end before activating and validating HSTS |
| PageView retention | Activate and observe the 90-day scheduler boundary |
| Vercel runtime | Validate build/start behavior, headers, logs, routing and fail-closed errors on the real platform |
| Preview/Staging | Validate the release in an authorized Preview/Staging environment before production publication |
| Privacy/business identity/contact | Configure and validate truthful business identity and a real privacy contact channel before production publication |

None of these items is represented as locally PASS. Each is a SPEC-012 validation requirement.
