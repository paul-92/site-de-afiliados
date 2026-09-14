# SPEC-010 execution evidence

## Acceptance gate

- Accepted functional baseline: `aa927b2c05559df63dc1904580abfe3e9f356495`.
- G3: PASS.
- G4: HUMAN APPROVED.
- SPEC-010: ACCEPTED/DONE.
- PLAN-010: COMPLETED.
- 80/80 tests PASS; production build PASS; security/privacy checks PASS; runtime vulnerabilities = 0.
- Schema and migrations remain unchanged.
- Four moderate development-only advisories in the known `drizzle-kit` toolchain remain an accepted risk.

## Authorization and Supabase boundary

The `/admin/*` layout verifies Supabase Auth server-side and applies the administrator allowlist. Every exported administrative mutation calls the same fail-closed boundary before repository work, including products, taxonomy, marketplaces, affiliate links, prices, lifecycle and logout. Analytics inherits the protected layout. Only the public anon key is used with Supabase Auth; server-only secrets are absent from client/application sources. Missing Auth configuration denies access.

## Headers and errors

CSP denies objects and framing, restricts base/form/connect/resource origins, and avoids broad wildcards. `nosniff`, strict-origin referrer policy, restricted permissions and `DENY` frame protection apply globally. Production HSTS awaits verified HTTPS in SPEC-012. Public error responses use controlled codes/messages and do not expose stack, SQL or internals.

## Cookies, privacy and retention

Cookie inventory: essential/authentication — Supabase Admin session; analytics — none; third-party — none. PageView remains aggregate and cookie-free: no persistent IP, fingerprint, analytics session ID, raw referrer, complete query string or cross-site behavioral tracking. Retention is 90 days through the existing boundary. SPEC-012 obligation: **ACTIVATE PAGEVIEW 90-DAY RETENTION SCHEDULER**.

## Redirects, input and output

`/go` preserves validated slug → eligible HTTPS destination → ClickEvent → 307, no-store and closed failures; isolated click-write failure remains non-blocking. Admin URLs reject non-HTTPS, credentials, private/local targets and oversized values. React output escaping and safe JSON-LD serialization mitigate script injection. Affiliate destinations remain absent from public catalog/SEO output.

## Legal and commercial transparency

Versioned `/privacidade`, `/termos` and `/afiliados` pages have controlled metadata/canonicals and footer access. Disclosures explain affiliate commission, observed/non-real-time price, marketplace-controlled availability/final price and that Garimora does not process purchases. Future content must not invent reviews, ratings, best-seller claims, urgency, stock, discounts, struck-through prices or other unverified commercial claims.

## DEMO, dependencies and Git

Catalog and Analytics DEMO remain development-only. Schema and migrations are unchanged; `drizzle/0002_third_sebastian_shaw.sql` remains intact and unapplied remotely. Dependency, test/build, scan and Git results are recorded at final gate. No remote Supabase, Vercel, scheduler, push, PR, merge or deploy is authorized.

## Final quality gate

| Gate | Result |
|---|---|
| Lint | PASS — zero warnings |
| Type-check | PASS |
| Full regression | PASS — 80/80 tests, 16/16 files |
| SPEC-010 security tests | PASS — 8/8 |
| Production build | PASS — institutional routes generated |
| Drizzle validation | PASS |
| Migration determinism | PASS — no schema changes |
| Runtime dependency audit | PASS — 0 vulnerabilities |
| Development tooling audit | ACCEPTED — 4 moderate advisories in the known `drizzle-kit`/legacy esbuild chain; remediation requires incompatible forced downgrade |
| Secret scan | PASS — only fictitious local/example database placeholders matched |
| Real-link scan | PASS — only reserved `.example`, localhost and schema.org values matched |
| Logging/error review | PASS — controlled tracking fields only; no token, cookie, Authorization, PII, secret, SQL or stack output introduced |
| `git diff --check` | PASS |

## Handoff findings and prerequisites

SPEC-012 must:

- configure business identity and a privacy contact channel;
- configure and validate real environment variables;
- revalidate CSP with real origins;
- confirm HTTPS end-to-end;
- activate HSTS only after HTTPS confirmation;
- **ACTIVATE PAGEVIEW 90-DAY RETENTION SCHEDULER**;
- apply approved migrations to remote Supabase only during the SPEC-012 authorized window.

Non-blocking SPEC-011 QA/E2E Final finding: Next.js warning `missing-data-scroll-behavior`. Observed symptom: `scroll-behavior: smooth` on the `html` element without `data-scroll-behavior="smooth"`. Treat and validate during SPEC-011; no functional code was changed for it in this finalization.

No PR, merge, deploy, `main` change, remote Supabase/Vercel access, remote migration application, scheduler activation, SPEC-011 implementation, warning correction, or BACKLOG execution occurred during finalization.
