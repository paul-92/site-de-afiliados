# SPEC-017 — Production Readiness & Release

**Status:** G2A HUMAN APPROVED · G2B/G2C PREPARATION COMPLETE · NO PRODUCTION MUTATION AUTHORIZED

**Functional baseline:** `27659a80bc5971fdc91dc2ea45578b153c460305`

**Governance baseline:** SPEC-016 preservation commit `67ac33e`

## Objective

Take the accepted SPEC-015 launch candidate through controlled Production readiness, release, launch, and stabilization until Garimora's primary affiliate product-discovery and affiliate-redirection operation is live with truthful evidence.

SPEC-012 remains the authoritative source for unresolved Production prerequisites. SPEC-015 remains the accepted functional baseline. SPEC-017 owns their Production execution and evidence without reopening or rewriting either accepted history.

## Primary-operation contract

The launch-critical public journey is:

`visitor → Garimora → product discovery → product page → truthful offer and marketplace information → affiliate CTA → /go tracking and redirect → exact authorized marketplace affiliate URL`

The launch-critical Admin journey is:

`authorized Admin → login → Overview → Products → Categories/Tags → Marketplaces → create/edit product → affiliate link → Publication Gate → publish → public availability → truthful Analytics → logout → protected routes remain protected`

The release must prove both journeys against the exact Production candidate and real authorized infrastructure. Preview acceptance is supporting evidence, not Production evidence.

## MVP boundary

- Current create/read capability for Categories, Tags, and Marketplaces is accepted for the initial affiliate MVP.
- Full update/delete taxonomy and marketplace CRUD is recorded as post-launch product debt and must not enter this release unless a material launch blocker is evidenced and the HUMAN expands scope.
- Paid advertising, promotional campaign publication, growth automation, and AdSense are excluded.
- SPEC-016 remains PLANNED / DEFERRED until the primary affiliate operation is live and stable.

## Readiness classifications

Every finding and checkpoint must use one status:

- `PASS`: verified against the relevant exact environment and baseline.
- `READY`: implementation exists, but the next real-environment evidence is pending.
- `BLOCKED`: launch cannot proceed safely.
- `HUMAN INPUT REQUIRED`: a truthful business, legal, ownership, risk, or go/no-go decision is missing.
- `EXTERNAL ACTION REQUIRED`: an authorized provider/operator action is needed.
- `DEFERABLE POST-LAUNCH`: explicitly outside the MVP blocking path.

## Immutable release principles

1. Every Production mutation requires a preceding explicit HUMAN gate.
2. Credentials, tokens, URLs containing secrets, cookies, and private user data must never enter evidence or logs.
3. Preview success must not be represented as Production success.
4. No migration may run remotely without clean-database proof, reviewed order, backup confirmation, and rollback/forward-repair plan.
5. No deployment may occur before the release candidate is immutable and its exact commit is recorded.
6. A smoke failure affecting Auth, catalog truth, publication, redirect safety, tracking, privacy, security, or recoverability blocks launch.
7. Production data and metrics must never be fabricated or replaced by DEMO data.
8. AdSense and paid advertising must not enter this release.

## Required HUMAN inputs

- Exact canonical Production origin and responsible owner. The MVP may use the official Vercel Production `*.vercel.app` hostname; a paid/custom domain is deferred post-launch.
- Truthful controller/business identity, general contact, and privacy-rights contact.
- Production owner, database operator, security/log owner, and launch decision-maker.
- Authorized Supabase project and authorized Admin user UUIDs.
- Approved affiliate marketplaces, eligibility constraints, and initial real affiliate URLs.
- Approved maintenance/migration window, acceptable interruption, rollback thresholds, and observation window.
- Legal/privacy approval for the affiliate-only launch and published disclosures.
- Final GO/NO-GO and launch authorization.
- Post-stabilization decision to remove or permanently retain `runtime_timing`.

## Provider and environment requirements

- Preview and Production may temporarily share the validated Garimora Supabase project for the MVP under the explicit G2A risk acceptance. From Production preparation onward, that shared project is Production-sensitive: Preview must not perform destructive tests, indiscriminate data generation, or any operation that can compromise real Production data. Future isolation requires a separate review.
- Vercel Preview and Production environment scopes remain distinct even while their Supabase target is shared.
- Production values for `DATABASE_URL`, `ADMIN_USER_IDS`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GARIMORA_SITE_URL` validated without exposing values.
- `GARIMORA_DEMO` unable to enable DEMO behavior in Production.
- `SUPABASE_SERVICE_ROLE_KEY` remains unused and should not be configured without a separately approved need.
- Supabase Auth origins/redirects, authorized users, database connectivity, backups, Data API exposure, grants, and RLS posture verified.
- Exact official Vercel Production hostname, canonical behavior, certificate, HTTPS, and hosting bindings verified. Preview URLs must never become canonical.
- CSP verified against actual Production origins without broad weakening.
- HSTS remains off until end-to-end HTTPS evidence is accepted, then requires separate authorization.
- PageView retention scheduling requires separate authorization, execution evidence, and observation.

## Database and migration contract

1. Validate migrations `0000`, `0001`, and `0002` in journal order on a clean representative PostgreSQL database.
2. Verify final enums, tables, foreign keys, unique constraints, indexes, and migration history.
3. Reconcile the shared Supabase project's pre-existing schema and data before mutation; treat all existing state as potentially Production data.
4. Record backup/PITR capability and a tested restore or provider-supported recovery procedure.
5. Prefer application rollback plus reviewed forward repair; do not assume destructive down migrations.
6. Apply only the reviewed migration set in the authorized window.
7. Verify post-application schema and application connectivity.
8. Confirm that public-schema tables are not unintentionally exposed through Supabase Data API grants. If exposed, require an approved RLS/grant design before launch.

## Auth and security contract

- Server-side `supabase.auth.getUser()` and `ADMIN_USER_IDS` remain authoritative.
- Missing or invalid Auth configuration must fail closed.
- Every Admin layout and mutation remains protected.
- Test authorized login, unauthorized authenticated denial, anonymous denial, session refresh/expiry, logout, post-logout route denial, and post-logout mutation denial.
- No service-role or database secret may reach client bundles.
- Validate CSP, clickjacking, content-type, referrer, permissions, cache and redirect headers on the final origin.
- Activate HSTS only through its own post-HTTPS HUMAN gate.

## Affiliate and publication contract

- Only truthful, verified product and marketplace information may be published.
- Publication Gate must reject incomplete or ineligible products.
- Product, selected marketplace, and selected affiliate link must be active for `/go` eligibility.
- Affiliate destinations must remain HTTPS and pass the existing safe-destination rules.
- Production evidence must compare the stored URL with the actual 307 destination, including affiliate parameters.
- A click-write failure may not strand the visitor, but it must be observable because it can undercount Analytics.
- Inactive, paused, missing, malformed, and unsafe cases must fail closed.

## Analytics and retention contract

- Verify PageView HTTP behavior and persisted rows using non-sensitive test activity.
- Verify ClickEvents from controlled affiliate redirects.
- Verify truthful 7/30/90 counts, trend, rankings, sources, page types, CTR, zero states, and unavailable-revenue wording.
- Activate the 90-day PageView retention job only after explicit HUMAN authorization.
- Prove the scheduler calls the existing retention boundary, handles failures observably, and deletes only rows older than the boundary.
- Record a legal/product disposition for ClickEvent retention; it may remain post-launch debt only with explicit acceptance.
- Retain sanitized `runtime_timing` through Production validation; decide removal or permanent retention after stabilization.

## Legal, SEO, domain, and transport contract

- Publish real business/controller and privacy-contact information; no placeholder claims.
- Preserve affiliate, price, marketplace and no-purchase-processing disclosures.
- Confirm the privacy text matches actual PageView, ClickEvent, Auth, cookie, and retention behavior.
- Configure `GARIMORA_SITE_URL` with the exact verified HTTPS Vercel Production origin.
- Verify canonical metadata, noindex boundaries, robots.txt, and sitemap on the final domain with real eligible catalog data.
- Verify the Production hostname, certificate, redirect policy, mixed-content absence, CSP, and security headers. Custom-domain purchase/configuration is not required for MVP launch.
- HSTS activation is a separately authorized post-HTTPS action.

## Monitoring, backup, rollback, and abort contract

- Name an on-call/launch owner and escalation channel.
- Monitor availability, server errors, database deadlines, Auth failures, affiliate redirect denials, click-write failures, PageView failures, Analytics failures, and unexpected latency.
- Define provider log access, sanitization, retention, and review responsibility.
- Verify database backup/PITR and record recovery steps.
- Record the prior deploy identifier and application rollback procedure.
- Define abort thresholds before deployment.
- Roll back the application when safe; pause launch and use reviewed forward repair for incompatible database state.
- Any secret leak, Auth bypass, unsafe redirect, corrupt migration, false public information, broad outage, or unrecoverable data risk is an immediate NO-GO.

## Acceptance criteria

1. All HUMAN inputs and owners required for launch are recorded and truthful.
2. Exact release commit, dependency lock, migration set, environment matrix, and provider targets are frozen.
3. Clean-database migration validation and recovery evidence pass.
4. Authorized Production migrations and environment configuration complete only after their explicit gates.
5. Final domain, HTTPS, canonical behavior, robots, sitemap, CSP and security headers pass.
6. Real Supabase Auth, allowlist, Admin protection, session behavior and logout pass.
7. Storefront discovery and product presentation pass with no DEMO fallback.
8. Real affiliate URLs and parameters pass controlled `/go` redirect and ClickEvent validation.
9. Product administration and Publication Gate pass end to end.
10. PageView and Analytics 7/30/90 behavior pass truthfully.
11. Retention scheduling is activated and observed, or launch is blocked.
12. Legal/privacy/contact and affiliate disclosures receive HUMAN approval.
13. Monitoring, backup, rollback and abort readiness pass.
14. Final Production smoke matrix has no open P0, P1, or launch-relevant P2.
15. HUMAN issues GO, then separately authorizes public launch.
16. Stabilization observation completes and residual debt is recorded.

## Exclusions and stop conditions

Excluded: AdSense, advertising scripts, `ads.txt`, advertising variables/CMP/CSP, ad slots, monetization reporting, paid campaigns, SPEC-013 growth execution, SPEC-014 automation execution, and full taxonomy/marketplace CRUD.

Stop for a new HUMAN decision on any scope expansion, new runtime dependency, schema change beyond the accepted migrations, Auth model change, RLS/grant remediation, legal ambiguity, secret rotation, Production mutation, HSTS activation, scheduler activation, deployment, launch, or paid distribution.
