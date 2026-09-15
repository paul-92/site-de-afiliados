# PLAN-017 — Production Readiness & Release

**Status:** G1 HUMAN APPROVED · G2A READINESS/INPUT CHECKPOINT NEXT

**Functional baseline:** `27659a80bc5971fdc91dc2ea45578b153c460305`

**Implementation/release branch:** not authorized

## Gate model

| Gate | Scope | Exit evidence | Authority unlocked |
|---|---|---|---|
| G1 | Accept SPEC-017/PLAN-017 scope and owners | Approved documents and baseline | Documentation/evidence collection only |
| G2A | Business and provider-readiness review | Inputs, targets, environment matrix, domain, legal and owner evidence | Local/read-only release preparation only |
| G2B | Database mutation authorization | Clean apply, schema diff, backup and recovery plan | Exact approved remote migrations only |
| G2C | Provider configuration authorization | Reviewed variable/header/domain/scheduler change sheet | Only enumerated Vercel/Supabase/DNS changes |
| G3 | Release-candidate acceptance | Frozen commit, automated checks, Preview and preflight evidence | Request for Production deployment decision |
| G4A | Production deployment authorization | Deployment runbook, abort thresholds, owners online | Deploy exact approved candidate only |
| G4B | Production smoke acceptance | Completed smoke matrix and finding register | Request for GO/NO-GO |
| G4C | HUMAN GO | Explicit GO decision | Public launch action only |
| G5 | Stabilization acceptance | Observation report, incidents, metrics and debt | Normal affiliate operations; release closure |

No gate implicitly grants a later gate. HSTS, retention-scheduler activation, DNS changes, migrations, deployment, and launch must each appear explicitly in the applicable HUMAN decision.

## Stage 1 — Documentation and governance

- Reconcile DAG reservations and record SPEC-017 as the next unreserved number.
- Lock SPEC-012 prerequisites and SPEC-015 functionality as inherited baselines.
- Record SPEC-016 as deferred and full taxonomy/marketplace CRUD as post-launch debt.
- Create the status register, responsibility matrix, evidence index, risk register, and decision templates.
- Confirm that all work remains documentation/read-only until G1.

**G1 result:** HUMAN APPROVED. Documentation and evidence preparation may proceed. No provider or Production action follows automatically.

## Stage 2 — HUMAN business inputs

- Record final domain, owner, business/controller identity, contacts and legal approver.
- Record Production, database, security/log, release and rollback owners.
- Approve Supabase/Vercel targets and Admin UUID owners without placing secrets in Git.
- Approve marketplaces, initial affiliate URL inventory and eligibility rules.
- Approve migration window, interruption tolerance, abort thresholds and stabilization window.
- Confirm affiliate-only privacy/legal posture and ClickEvent-retention disposition.

**Gate G2A:** HUMAN accepts complete truthful inputs and provider targets.

## Stage 3 — Provider configuration preparation

- Prepare a redacted Preview-versus-Production environment matrix.
- Prepare exact Vercel, Supabase Auth, database, DNS, domain, certificate, CSP, logging, backup and scheduler change sheets.
- Verify current provider state read-only when separately authorized.
- Confirm Data API exposure/grants/RLS posture and document any remediation as a stop condition.
- Prepare HSTS separately; do not activate it before accepted HTTPS evidence.

**Exit:** reviewable mutation plan with exact targets and rollback for every change.

## Stage 4 — Database and migration validation

- Apply migrations `0000`–`0002` in order to a clean representative database.
- Validate migration journal, schema objects, constraints, indexes and application compatibility.
- Rehearse backup/restore or provider-supported recovery.
- Reconcile target schema and data read-only.
- Produce exact remote migration and verification runbook.

**Gate G2B:** authorize only the enumerated Production database actions.

## Stage 5 — Release-candidate preparation

- Create an authorized release branch from the accepted baseline plus approved documentation/legal/release-only changes.
- Freeze exact commit, lockfile, migration hashes and environment contract.
- Run lint, type-check, unit/integration tests, Production build, dependency audit, secret scan, migration check and diff check.
- Run public/Admin/affiliate/Analytics regression in Preview with real authorized services.
- Revalidate authenticated direct-load/refresh after the SPEC-015 route-group redesign.
- Record all findings using the readiness classifications and P0–P3 severity.

**Gate G3:** accept or reject the immutable release candidate. P0/P1 and launch-relevant P2 must be zero.

## Stage 6 — Authorized Production configuration

After applicable G2B/G2C decisions only:

- Confirm backup and recovery readiness.
- Apply approved migrations.
- Configure approved environment variables and Supabase Auth origins.
- Configure approved domain/DNS/hosting bindings.
- Verify certificate and HTTPS.
- Validate CSP before any broadening; preserve current restrictions.
- Activate PageView retention scheduler only through its explicit authorization.
- Keep HSTS inactive until HTTPS evidence receives its own decision.

**Exit:** Production infrastructure ready but application not publicly launched unless separately authorized.

## Stage 7 — Production deployment

- Present the exact commit, provider state, migration result, monitoring view, owners, rollback target and abort thresholds.
- Obtain G4A.
- Deploy only the exact accepted candidate.
- Do not publish campaigns or make unrelated changes during the window.

## Stage 8 — Production smoke validation

| Area | Required Production evidence | Blocking failure |
|---|---|---|
| Domain/HTTPS | Canonical host, certificate, redirects, no mixed content | wrong origin, invalid TLS, loop or insecure asset |
| Headers | CSP and security headers on representative routes | material weakening or required flow blocked |
| SEO | canonical metadata, robots.txt, sitemap with real eligible URLs | placeholder origin, private route indexed, invalid sitemap |
| Storefront | home, search, collections, category, product, legal; desktop/mobile | DEMO data, false content, broken discovery |
| Affiliate disclosure | visible product/global disclosure and marketplace truth | missing or misleading disclosure |
| `/go` success | one controlled real link, exact 307 destination/parameters, ClickEvent | unsafe/wrong URL, missing affiliate parameters |
| `/go` denial | invalid, missing, paused/inactive cases | redirect succeeds when ineligible |
| Auth | authorized login, session refresh/expiry, logout | authorized user blocked or unsafe session behavior |
| Authorization | anonymous and non-allowlisted user; routes and mutations | protected content/action accessible |
| Admin/catalog | Overview, Products, create/edit, taxonomy create/read, marketplaces create/read | launch-critical operation broken |
| Publication Gate | incomplete block, eligible publish, public appearance | invalid publish or eligible product unavailable |
| PageView | 204 behavior and persisted non-sensitive test row | public breakage or systematic loss |
| Analytics | truthful 7/30/90 counts, trend, rankings and zero states | false data or unavailable cockpit |
| Retention | authorized scheduler invocation and boundary observation | absent or unsafe purge |
| Logs/monitoring | sanitized logs, alerts, owners and dashboards | secret/PII leak or no actionable observability |
| Backup/rollback | recovery status and previous deploy target | no credible recovery route |

Capture timestamps, exact commit/deploy identifiers, expected versus observed results, sanitized evidence, owner, severity and disposition.

**Gate G4B:** HUMAN accepts smoke evidence. Failures return to the appropriate earlier stage.

## Stage 9 — HUMAN GO/NO-GO and launch

- Review smoke results, open risks, monitoring, rollback, legal approval and operating ownership.
- Obtain explicit G4C GO or record NO-GO.
- On GO, authorize only the public launch action.
- Do not authorize paid advertising or SPEC-016 by implication.

## Stage 10 — Stabilization observation

- Observe agreed availability, errors, latency, Auth, database deadlines, redirects, click-write failures, PageViews, Affiliate Clicks and Analytics truthfulness.
- Validate backup health and rollback availability.
- Correct only launch-critical defects through controlled decisions.
- Record residual P3/product debt, including full taxonomy/marketplace CRUD.
- Obtain G5 and decide `runtime_timing` removal or permanent retention.

## Launch-blocker mapping

| Blocker | Owner stage/gate |
|---|---|
| Missing Production owner SPEC | Stage 1 / G1 |
| Domain, identity, contacts, owners, marketplaces | Stage 2 / G2A |
| Environment separation and provider targets | Stages 2–3 / G2A–G2C |
| Data API/RLS/grant posture | Stages 3–4 / G2B or new HUMAN decision |
| Clean migration and schema proof | Stage 4 / G2B |
| Backup and recovery proof | Stages 4 and 6 / G2B–G4A |
| Auth/Admin on post-SPEC-015 candidate | Stage 5 / G3 |
| Exact real affiliate URLs | Stages 2, 5 and 8 / G2A–G4B |
| Legal/privacy/contact publication | Stages 2 and 5 / G2A–G3 |
| Canonical domain, HTTPS and CSP | Stages 3, 6 and 8 / G2C–G4B |
| Retention scheduler | Stages 3, 6 and 8 / explicit G2C–G4B |
| Monitoring and rollback | Stages 3–8 / G4A–G4B |
| Final Production smoke | Stage 8 / G4B |
| Public launch | Stage 9 / G4C |

## Immediate post-launch affiliate operating handoff

1. Source real products and offers from approved marketplaces.
2. Validate program and product eligibility.
3. Obtain valid affiliate URLs through authorized accounts.
4. Compare and verify affiliate identifiers and parameters.
5. Create categories and tags as operationally needed.
6. Register truthful titles, descriptions, images, alt text, marketplace and observed-price context.
7. Add the verified affiliate link and complete the Publication Gate.
8. Publish and validate the public product/category presentation.
9. Perform a controlled `/go` redirect check without artificial click activity.
10. Prepare truthful promotional content with visible affiliate context.
11. Distribute only through approved organic channels.
12. Observe PageViews, Affiliate Clicks, redirect errors and Analytics.
13. Identify products and categories meriting additional organic promotion.
14. Keep paid advertising and AdSense behind separate HUMAN decisions.

## Evidence package

- Approved gate decisions.
- Responsibility and environment matrices.
- Redacted provider configuration and Auth evidence.
- Clean and Production migration reports.
- Backup/restore and rollback runbooks.
- Release-candidate test and dependency reports.
- Domain/HTTPS/CSP/header/SEO evidence.
- Auth/Admin/catalog/publication evidence.
- Affiliate URL, redirect and tracking evidence.
- PageView/Analytics/retention evidence.
- Legal/privacy approval.
- Production smoke and defect register.
- GO/NO-GO record.
- Stabilization and operational-handoff report.

## Current stop

SPEC-017 and PLAN-017 are G1-approved. The next checkpoint is G2A readiness/input review. No branch creation, merge, deployment, Vercel/Supabase/DNS mutation, remote migration, secret change, HSTS activation, scheduler activation, Production data creation, AdSense work, paid spend, campaign publication, or public launch is authorized.
