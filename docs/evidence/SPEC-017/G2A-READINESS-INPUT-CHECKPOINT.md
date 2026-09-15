# SPEC-017 — G2A readiness/input checkpoint

**Status:** G2A HUMAN APPROVED · CLOSED

**Prepared:** 2026-09-15

**Functional baseline:** `27659a80bc5971fdc91dc2ea45578b153c460305`

**G1 governance commit:** `2ca84d2`

## Purpose

Resolve only the smallest set of truthful HUMAN inputs needed to begin read-only Production readiness evidence. Do not ask the HUMAN to restate facts already proved by the repository. G2A does not authorize provider mutation, configuration, migration, deployment, Production data creation, or launch.

## Interrupted-execution reconciliation

- Workspace candidate inspected: the current Git repository at the recorded Garimora workspace path. No alternative repository candidate or linked provider metadata was found.
- Repository identity: PASS. Git history contains accepted functional baseline `27659a8`, SPEC-016 preservation `67ac33e`, and SPEC-017 G1 `2ca84d2` in order; the expected baseline is an ancestor of HEAD; the remote is `paul-92/site-de-afiliados`; and the DAG/SPEC state is consistent.
- Prior Supabase project evidence: none durably available in this thread, workspace, Git history, CLI configuration, MCP configuration, or browser state. It is not treated as PASS.
- Prior `execute_sql` operations: zero operations are present in the available execution transcript or durable evidence. There is therefore no evidenced SELECT/introspection statement and no evidenced mutation. If an unavailable external transcript later shows otherwise, this classification must be reopened before any mutation gate.
- Auth/user queries: none issued during this G2A resume. Historical SPEC-012 Preview evidence confirms functional Auth behavior but does not expose user records.
- Sensitive values returned or persisted: none observed. No password, token, JWT, key, connection string, secret value, or unnecessary personal data was recorded.
- Provider state changes: none observed or authorized.
- Vercel inspection: attempted only to open a read-only dashboard session; unavailable because no browser surface exists. No login or request against a project occurred.
- Supabase resumed inspection: not attempted after the common browser access path proved unavailable; no Supabase CLI/MCP project connection exists locally.
- Workspace changes from this resume: this checkpoint plus approved custom-domain governance documentation only.

## A. HUMAN can answer now

**Resolved by HUMAN on 2026-09-15.** The numbered questions below are retained as the original checkpoint; the authoritative answers are:

- Paid/custom domain is deferred post-launch and is not an MVP blocker. The exact official Vercel Production `*.vercel.app` hostname must be proven and used as the initial canonical Production origin.
- Garimora initially operates under the HUMAN as an individual/pessoa física; no company, CNPJ, registration, or business address may be invented.
- The approved general and privacy-rights contact is `paulotrajano599@gmail.com`; no additional personal information is authorized for publication.
- The existing Garimora Vercel and Supabase projects used for Preview are intended Production candidates.
- The Preview-validated real user is intended as the initial Production Admin; UUID correlation must use read-only evidence.
- Shopee is reported as an existing affiliate relationship; Amazon eligibility remains unverified. Both require provider evidence.
- The HUMAN accepts Product Owner, release coordinator, launch decision-maker, catalog operator, provider/secret administrator, backup/recovery supervisor, rollback decision-maker, and affiliate-only wording approver responsibilities for MVP.
- Concentration of duties increases operational/recovery risk; independent recovery verification is preferable; HUMAN approval is not independent legal advice.

These are the only immediate questions blocking the next read-only evidence phase:

1. **Production hostname owner:** Which Vercel project/team is intended to serve Garimora Production, and who controls it? The exact official Production `*.vercel.app` hostname will be proven read-only; do not invent one.
2. **Public identity and contacts:** What truthful controller/business identity, general contact, and privacy-rights contact may be published? If the operating legal form is not finalized, state what is legally approved for the MVP rather than using a placeholder.
3. **Provider targets:** Which Vercel project/team and Supabase project are the intended Production targets? Identifiers are sufficient; do not provide secrets. If question 1 already identifies Vercel, only the Supabase target remains here.
4. **Admin ownership:** Which Supabase Auth user UUIDs should be Production Admins? UUIDs are authorization identifiers, not passwords; do not provide tokens or credentials.
5. **Affiliate launch set:** Which marketplaces/programs are approved for launch, and who controls each affiliate account? Do not paste private account credentials.
6. **Release authority and operating owner:** May the current HUMAN/Product Owner temporarily act as Product Owner, release coordinator, launch decision-maker, and post-launch catalog operator for the MVP? Name any responsibility that must instead have a different owner.
7. **Security/recovery ownership:** Who is authorized to perform or supervise database backup/recovery and secret/provider administration? One person may fill both roles for the MVP only if the HUMAN explicitly accepts the concentration-of-access risk; an independent recovery verifier is recommended because a mistaken or compromised operator should not be the sole judge that recovery is viable.
8. **Legal approval:** Who will approve the affiliate-only privacy, terms, contact, and retention wording? If no qualified reviewer is appointed, explicitly decide whether launch must wait for one.

Migration timing, interruption tolerance, abort thresholds, stabilization duration, exact affiliate URLs, and GO/NO-GO are intentionally deferred until repository/provider evidence makes those decisions concrete.

## B. Already proven from repository

| Fact | Evidence/status |
|---|---|
| Accepted launch-candidate functionality | SPEC-015 accepted at `27659a8`; G3/G4 evidence records lint, type-check, 96 tests and Production build PASS |
| Preview runtime/Auth validation | SPEC-012 records real Preview Supabase Auth, allowlist, Admin, logout, PageView and Analytics PASS |
| Server-side Admin boundary | `src/lib/admin-auth.ts` uses `supabase.auth.getUser()` and server-side `ADMIN_USER_IDS`; missing configuration fails closed |
| Protected mutations | Admin Server Actions call the authorization boundary before mutation |
| Affiliate redirect safety | `/go/[productSlug]` requires active product/marketplace/link, validates HTTPS destination, records a ClickEvent attempt and returns non-cacheable 307 |
| Publication Gate | Existing domain rules block publication when required editorial, category, marketplace or affiliate-link conditions fail |
| Storefront and disclosures | Product discovery routes and affiliate/price/marketplace disclosures exist and passed accepted regressions |
| Analytics | PageView collection plus truthful 7/30/90 snapshots, trends, rankings and CTR are implemented |
| Retention boundary | PageView purge-before-90-days behavior exists; scheduling is not implemented/activated |
| SEO | Metadata, canonical generation, robots and sitemap exist; final origin and real-catalog behavior still need external evidence |
| Security headers | CSP, frame denial, content-type, referrer and permissions policies exist; final-origin behavior remains unproved |
| Environment contract | Repository documents database, Admin IDs, public Supabase values and canonical site URL; Production values are not in Git |
| Migration set | Ordered additive Drizzle migrations `0000`–`0002` and journal exist; remote/clean Production-equivalent application is unproved |
| DEMO isolation | Production code prevents development DEMO fallback |
| Service-role boundary | Application does not use the documented service-role placeholder; no service-role secret belongs in the client |
| MVP CRUD decision | Product create/edit/lifecycle is launch scope; taxonomy/marketplace create/read is sufficient; full update/delete is post-launch debt |
| AdSense | SPEC-016 is preserved as PLANNED / DEFERRED and is excluded from launch |

## C. Requires Vercel read-only evidence

After separate authorization to inspect the intended project:

- project/team identity and linked repository/branch;
- current Preview/Production environment separation and variable-name presence, without returning values;
- Production framework/build/runtime configuration;
- domain bindings and redirect state visible to Vercel;
- deployment history and recoverable prior deployment;
- logs, retention/access controls, monitoring and alert capabilities;
- final response headers and runtime behavior from an existing non-mutating environment, if one exists.

Read-only inspection must not create a deployment, change variables, attach domains, promote builds, or alter monitoring.

## D. Requires Supabase read-only evidence

After separate authorization to inspect the intended project:

- project identity, region and lifecycle state;
- Auth site URL/redirect configuration and existing intended Admin UUIDs;
- database version, connectivity method and pooler mode;
- migration history and existing schema objects;
- Data API exposed schemas, grants, RLS status and policies;
- backup/PITR availability and retention;
- scheduler/cron availability and current jobs;
- database/log monitoring and access controls;
- whether any existing data requires reconciliation.

Read-only inspection must not create users, alter Auth, execute SQL, reveal secrets, change grants/RLS, run migrations, create jobs, or modify data.

## E. Requires hostname/domain evidence

For the zero-cost MVP hostname:

- exact official Vercel Production `*.vercel.app` hostname;
- Vercel project/team ownership correlation;
- HTTP/HTTPS reachability, redirect chain and certificate coverage;
- proof that Preview deployment URLs are not emitted as canonical Production URLs;
- canonical metadata, sitemap and robots behavior using the exact Production origin;
- CSP/security headers on that origin.

No domain purchase, DNS change, hostname binding, or certificate configuration may occur during G2A. Registrar, DNSSEC, apex/`www`, custom-domain certificate, and custom-domain HSTS consequences are deferred until a separately governed future migration.

## F. Requires affiliate-provider information

- approved marketplace/program names and account owner;
- confirmation that the account/program permits the intended site and traffic methods;
- URL-generation method and required affiliate identifiers/parameters;
- restrictions on product content, images, price claims, link cloaking/redirection, attribution, geography or channels;
- a small controlled set of real affiliate URLs for later validation;
- contact/escalation path for account or tracking issues.

Repository evidence cannot prove provider eligibility or that a URL credits the correct affiliate account. Credentials, private keys and passwords must never be added to Git or the checkpoint.

## G. Safely deferable to later gates

- Migration window, exact remote commands and Production mutation order: G2B.
- Secret values and configuration changes: G2C.
- HSTS policy/activation: after accepted HTTPS evidence and a separate HUMAN decision.
- Retention scheduler activation: G2C and Production smoke.
- Exact deploy timing and abort thresholds: G3/G4A, informed by monitoring and recovery evidence.
- Final real-product records and controlled redirect test: G3/G4B.
- Final GO/NO-GO: G4C.
- Stabilization duration and `runtime_timing` disposition: finalize before G4C/G5.
- Full taxonomy/marketplace update/delete CRUD: post-launch debt.
- Paid/custom domain selection, acquisition, and migration are deferred post-launch. The official Vercel Production hostname still requires pre-launch verification and configuration.
- Paid advertising, promotional campaign publication and AdSense: separate future HUMAN decisions.

## Owner concentration decision

For a small MVP, one HUMAN/Product Owner may temporarily combine product ownership, release coordination, launch decision-making, catalog operation and incident coordination. This reduces handoff cost but creates availability and judgment concentration.

Provider-secret administration and database recovery can also be performed by that HUMAN only through explicit risk acceptance and documented recovery steps. Independent verification of backup restorability is materially preferable because recovery evidence should not depend solely on the operator who performs the mutation. Legal approval must be attributed truthfully; Product Owner approval must not be described as independent legal advice unless that is factually true.

The HUMAN explicitly accepts this concentration for the initial MVP. It remains a recorded operational/recovery risk and may be revisited after launch.

## Supabase read-only evidence

- Target correlation: PASS. Exactly one accessible project is named `garimora`; it is active/healthy in the São Paulo region and is the intended existing Preview candidate.
- Database: PostgreSQL 17, general-availability channel.
- Remote migration history: PASS by name and order for `worried_wallop`, `melodic_roughhouse`, and `third_sebastian_shaw`, corresponding to repository migrations `0000`–`0002`.
- Schema: all nine expected public application tables exist. Catalog, affiliate, marketplace, taxonomy, price, and click tables contain zero rows; `page_views` contains 13 rows. No row content was selected.
- RLS: enabled on all nine application tables.
- Policies: zero public-schema policies. Security advisor reports all nine tables as RLS-enabled without policies.
- Grants: `anon` and `authenticated` have broad table privileges, but RLS with no policies denies row access through those roles. This is fail-closed for the current server-only database architecture, though the broad grants and exposure configuration require explicit G2B/G2C review before launch.
- Data API exposed-schema setting: not visible through the inspected database setting; UNKNOWN.
- Auth: exactly one Auth user UUID exists. No email, phone, metadata, session, token, or credential was selected. Its UUID is held as sensitive operational evidence and is not reproduced here. Correlation to Production `ADMIN_USER_IDS` remains blocked until Vercel variable evidence is available.
- Auth advisor: leaked-password protection is disabled; disposition required before launch.
- Scheduler: `pg_cron` and `pg_net` are absent and no `cron.job` table exists. PageView retention scheduling is not active.
- Branches: no Supabase development branches were listed.
- Backup/PITR and log availability: UNKNOWN; current connector exposes no conclusive plan/backup/log status.
- Performance advisors: eight unindexed foreign keys, one table without a primary key (`product_tags`), and four currently unused indexes. These are assessment findings, not authorized changes; usage is minimal/empty and launch severity requires G2B review.

## SQL operation ledger

All six `execute_sql` calls were READ_ONLY SELECT/introspection. No INSERT, UPDATE, DELETE, TRUNCATE, DDL, function invocation with side effects, Auth mutation, or migration was issued.

1. Selected Auth UUID only from `auth.users`; one UUID returned.
2. Selected `anon`/`authenticated` public table grants and public policies.
3. Selected Data API setting, scheduler extensions, and cron-table presence; only the final cron-presence result was returned by the connector.
4. Selected the Data API exposed-schema setting separately; returned unavailable/null.
5. Selected installed scheduler-related extensions; none returned.
6. Counted public-schema RLS policies; returned zero.

No password, email, phone, token, JWT, key, connection string, session, or application row content was returned or persisted.

## Vercel read-only evidence

The computer-use interface could not access the open browser, so the following is explicitly classified as **HUMAN-observed manual read-only evidence**, not agent/tool-verified evidence:

- Project identity: Garimora.
- Git repository linkage: `paul-92/site-de-afiliados`, matching the authoritative repository.
- Current Production: active and `Ready` at commit `8bd702f`, branch `feature/spec-003-engineering-foundation`.
- Accepted SPEC-015 Preview: `Ready` at commit `27659a8`, branch `feature/spec-015-admin-cockpit-ux-ui`.
- Production hostname: `garimora.vercel.app`.
- Preview variable names present: `DATABASE_URL`, `ADMIN_USER_IDS`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Production environment-variable filter result: `No Environment Variables Added`.
- No variable value or secret was exposed.

Conclusions:

- Project and repository correlation: PASS by HUMAN evidence.
- Deployment-environment separation: PASS in the limited sense that distinct Production and Preview deployments/scopes are visible.
- Release readiness: BLOCKED. Production is on the obsolete engineering-foundation commit rather than the accepted launch candidate.
- Production environment readiness: BLOCKED. None of the required application variables is present in Production.
- Production Admin correlation: Preview functional evidence and Preview `ADMIN_USER_IDS` presence support the intended user flow, but Production has no allowlist variable. Direct value-to-UUID comparison was not performed and no value was exposed.
- Production hostname: PROVEN BY HUMAN as `garimora.vercel.app`; runtime HTTPS/canonical/header behavior still requires later release-candidate validation.
- Monitoring/log availability and rollback capability: not included in the supplied observation and remain UNKNOWN.
- No Vercel mutation occurred.

## Current blockers and stop

- HUMAN questions A1–A8 are resolved as recorded above.
- Supabase read-only inspection is complete for currently available connector capabilities.
- Vercel target, repository, deployment, hostname, and environment-scope evidence is recorded from HUMAN manual read-only inspection.
- Production is on obsolete commit `8bd702f`; no deployment/promotion is authorized.
- Production has no environment variables; configuration is not authorized at G2A.
- Custom-domain absence is not an MVP blocker. `garimora.vercel.app` is the verified initial Production hostname candidate.
- HTTPS, canonical metadata, robots/sitemap, `GARIMORA_SITE_URL`, CSP/security headers, monitoring/logs, and rollback behavior remain to be proven against the later release candidate.
- Production Admin is not configured because Production lacks `ADMIN_USER_IDS`; UUID value comparison was intentionally not performed.
- Supabase backup/PITR and Data API exposed-schema setting remain UNKNOWN.
- RLS state exists remotely but is not represented by repository migrations; G2B must reconcile this drift before any mutation proposal.
- No Production mutation is authorized.
- Stop at the G2A HUMAN checkpoint.

## Exact next HUMAN gate

On 2026-09-15 the HUMAN approved this evidence package, explicitly accepted temporary Preview/Production sharing of the validated Garimora Supabase project, authorized this documentation-only commit, and opened preparation-only G2B and G2C tracks.

The shared Supabase project is Production-sensitive from this point. Preview may not execute destructive tests, indiscriminate data generation, or operations that can compromise real Production data. No remote SQL, migration, environment/secret change, Auth change, RLS/grant/Data API change, backup/restore action, scheduler activation, deployment, promotion, HSTS, Production data creation, or launch is authorized. The next HUMAN gates are the separate G2B database-mutation decision and G2C provider-configuration decision.
