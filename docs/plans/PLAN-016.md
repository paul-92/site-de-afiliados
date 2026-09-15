# PLAN-016 — Google AdSense Monetization Integration

**Status:** PLANNED / DEFERRED · G1 HUMAN APPROVED · NO IMPLEMENTATION AUTHORIZED

**Planning baseline:** `27659a80bc5971fdc91dc2ea45578b153c460305`

**Implementation branch:** not authorized

## Execution model

Work is divided into independently reviewable stages. G1 authorizes this plan and governance documentation only. Stage 0 is the sole next actionable stage and produces evidence/decisions, not advertising code. Every later stage requires the preceding checkpoint and an explicit HUMAN authorization appropriate to that stage.

Execution is deferred until the primary affiliate operation is live and stable. Stage 0 is no longer an immediate action; resumption requires a new explicit HUMAN decision.

## Stage 0 — Public, business, content, privacy, and performance readiness

### 0.1 Business and domain readiness

- Obtain truthful controller/business identity, general contact, and privacy-rights contact from the HUMAN.
- Decide served countries/regions, intended audience, and treatment of minors.
- Confirm final canonical domain, ownership, HTTPS accessibility, redirects, and responsible account owner.
- Record which information is public, operational, legal-review-required, or unavailable.

Checkpoint evidence: approved business-information sheet, contact verification, audience/region decision, and domain-readiness report.

### 0.2 Privacy and CMP decision

- Inventory current first-party Analytics and Admin authentication behavior without changing it.
- Map prospective AdSense data flows, cookies/local storage, vendors, personalization modes, disclosures, choices, and revocation.
- Review current Google requirements for every served region.
- Obtain HUMAN/legal determination for LGPD and other applicable regimes.
- Compare Google CMP and certified third-party CMP options only if required; identify dependency, CSP, accessibility, performance, and governance impact.
- Do not install or configure a CMP.

Checkpoint evidence: dated source register, data-flow diagram, decision matrix, legal-review result, and explicit CMP/no-CMP decision.

### 0.3 Content and rights readiness

- Inventory every candidate monetized route and classify substantive, thin, empty, dynamic-failure, or non-content states.
- Define truthful curation methodology content.
- Plan useful buying/discovery guides, category guidance, evidence-based comparisons, editorial recommendations, and selection context.
- Review authorship, originality, image licensing, text rights, marketplace-source constraints, and unsupported claims.
- Define editorial ownership, review cadence, correction process, and minimum quality checklist without inventing a Google word/page threshold.

Checkpoint evidence: route/content inventory, prioritized content backlog, rights register, claims checklist, and HUMAN editorial approval.

### 0.4 Eligible-route and placement readiness

- Approve an allowlist limited to useful home, collection/category, and product states.
- Lock the denial list for Admin, access/auth, search, legal/disclosure, redirect/API, loading, error, unavailable, empty, and not-found states.
- Create placement wireframes for desktop/mobile using the SPEC contract.
- Confirm that affiliate CTA order, prominence, spacing, and labeling remain primary.

Checkpoint evidence: route matrix, placement map, responsive wireframes, and HUMAN UX approval.

### 0.5 Performance baseline

- Measure representative home, category/collection, and product routes on mobile and desktop before advertising.
- Capture LCP, INP, CLS, Lighthouse diagnostics, request count, transferred bytes, JavaScript cost, main-thread work, and affiliate CTA visibility/usability.
- Record lab methodology, device/network profile, repetitions, median/range, build/commit, and known environmental limitations.
- Define material-regression thresholds in addition to the good CWV boundaries in SPEC-016.

Checkpoint evidence: reproducible baseline report and HUMAN-approved regression budget.

### Stage 0 exit gate

Stage 0 passes only when every checklist item has evidence and the HUMAN explicitly accepts business, content, privacy/CMP, domain, route, placement, rights, and performance decisions. A partial result is not permission to add AdSense code.

## Stage 1 — Ownership-verification readiness

**Not currently authorized.** After Stage 0 and a separate gate:

- Obtain the real AdSense account-issued client/publisher identifier.
- Select one approved ownership method: meta tag, AdSense code, or real `ads.txt` record.
- Prefer the least invasive method consistent with the current official Google flow.
- Prove public crawlability on the final domain without enabling ads.
- Record Google account/site state truthfully; repository success does not equal Google approval.

Checkpoint: HUMAN verifies exact account data and authorizes any site-review action separately.

## Stage 2 — Disabled technical capability

**Not currently authorized.** After ownership/readiness approval:

- Add validated public identifier configuration, global kill switch, and environment/hostname allowlist.
- Keep all defaults disabled.
- Implement the public-only centralized loader and reusable manual slot boundary.
- Implement consent gating required by the approved Stage 0 decision.
- Add exact real `ads.txt` data only when provided and approved.
- Derive minimal CSP sources from dated official documentation and observed Report-Only evidence.
- Add unit/integration tests before any real request is enabled.

Checkpoint: config, isolation, consent, CSP, `ads.txt`, failure, security, and scope evidence pass with real ads still disabled.

## Stage 3 — Controlled Preview validation

**Requires explicit authorization for any real Google request.**

- Validate layouts using non-serving structural states first.
- If separately authorized, use only an approved controlled method and avoid clicks or artificial impressions.
- Verify script deduplication, navigation, consent states, CSP, accessibility, responsive behavior, no-fill, failure, and ad blocker behavior.
- Confirm Admin and denied routes issue zero AdSense requests.
- Compare performance and affiliate CTA behavior against Stage 0.

Checkpoint: automated G3 plus HUMAN Preview review. No Production activation is implied.

## Stage 4 — Limited Production pilot

**Separately governed and not authorized.**

- Enable at most one approved manual placement per eligible page, with mobile capped at one.
- Monitor policy notifications, invalid traffic, Core Web Vitals, errors, layout stability, and affiliate CTA impact.
- Keep Auto Ads disabled.
- Exercise and record the kill-switch procedure.

Checkpoint: HUMAN decision to stop, continue, adjust, or roll back.

## Stage 5 — Evidence-based expansion

**Separately governed and not authorized.**

- Expand only placements supported by performance, UX, policy, and affiliate-impact evidence.
- Treat Auto Ads or hybrid mode as a new explicit HUMAN decision.
- Do not add revenue reporting under this plan.

## Stage 0 readiness checklist

| Area | Required decision/evidence | Owner | Current state |
| --- | --- | --- | --- |
| Controller identity | Real publishable name/entity and jurisdiction | HUMAN/legal | Missing |
| General contact | Tested operational channel | HUMAN | Missing |
| Privacy contact | Tested rights-request channel | HUMAN/legal | Missing |
| Regions | Served countries and regional behavior | HUMAN/business | Missing |
| Audience | Intended audience and minors position | HUMAN/legal | Missing |
| Ad mode | Personalized/non-personalized/limited policy | HUMAN/legal/business | Missing |
| CMP | Google CMP, approved certified third party, or justified alternative | HUMAN/legal | Missing |
| Privacy policy | Required truthful disclosure changes | HUMAN/legal | Pending decision |
| Original content | Methodology, guides, category value and thin-page review | Editorial/HUMAN | Incomplete |
| Rights | Images, copy, sources and claims register | Editorial/legal | Missing |
| Domain | Final hostname, ownership, HTTPS, redirects and crawl | HUMAN/operations | Not established in repository |
| Route allowlist | Eligible content routes/states | Product/HUMAN | Proposed only |
| Route denial list | Non-monetized routes/states | Product/HUMAN | Proposed only |
| Placements | Desktop/mobile wireframes and CTA separation | UX/HUMAN | Proposed only |
| Performance | Reproducible baseline and regression limits | Engineering/HUMAN | Missing |
| Google policy | Dated official-policy review | Engineering/legal | Discovery baseline only |

## Test and evidence matrix for future implementation

| Contract | Automated evidence | HUMAN/external evidence |
| --- | --- | --- |
| Disabled/default/malformed config | unit and render tests; zero Google requests | configuration review |
| Environment/hostname isolation | host/environment matrix | Preview and final-domain review |
| Admin and denied routes | route traversal and request interception | authenticated walkthrough when authorized |
| Consent | pending/accept/reject/revoke tests | legal/CMP flow approval |
| Loader | navigation/remount deduplication | network inspection |
| Manual slots | allowlist and responsive rendering | placement/CTA visual review |
| `ads.txt` | exact body, status, MIME and no-placeholder scan | root-domain crawl and AdSense status |
| CSP | source assertions and Report-Only violation capture | security approval |
| Failure/ad blocker/no-fill | simulated resource denial | usability review |
| Performance | before/after CWV and resource budgets | mobile perceived-speed review |
| Accessibility | semantics, focus, reflow, contrast | keyboard/screen-reader review |
| Existing product | full public/Admin/Auth/Analytics regression | critical-flow walkthrough |
| Scope | dependency/schema/migration/secret diff audit | HUMAN gate sign-off |

## Rollback and kill-switch plan

- One global server-evaluated enablement switch defaults to false.
- A separate hostname/environment predicate must also pass.
- Disabling prevents loader and slot initialization rather than merely hiding rendered ads.
- Slots fall back without focusable elements, error UI, or broken layout.
- Network inspection proves zero subsequent AdSense requests after rollback/deploy.
- Rollback evidence records commit/config state, affected routes, timestamps, CSP state, CWV, and storefront health.
- No rollback operation may alter data, Auth, Analytics semantics, secrets outside the approved config action, Supabase, or unrelated infrastructure.

## HUMAN/business decisions required before Stage 1

1. Controller/business identity and jurisdiction.
2. General and privacy-rights contacts.
3. Final domain and AdSense account owner.
4. Served regions and intended audience, including minors.
5. Personalized/non-personalized/limited ads policy.
6. CMP strategy and legal review outcome.
7. Approved privacy-policy content.
8. Editorial methodology, content backlog, and quality owner.
9. Image/text rights disposition.
10. Eligible routes, denied routes, placement wireframes, and density.
11. Performance methodology and material-regression limits.
12. Responsible owners for Google policy monitoring and invalid-traffic response.

## Protected boundaries

No stage may silently alter SPEC-012, SPEC-015, Admin Auth, `ADMIN_USER_IDS`, schema, migrations, repositories, existing Analytics SQL/semantics, 7/30/90 periods, CRUD, Publication Gate, `runtime_timing`, secrets, Vercel, Supabase, or Production. Reporting/API, OAuth, revenue ingestion, persistence, and Admin Monetization belong to a separate future SPEC.

## Gates

- **G1:** HUMAN approved SPEC-016 creation and planning on 2026-09-15.
- **Current gate:** HUMAN-provided Stage 0 business inputs and authorization to execute the readiness evidence work.
- **Stage 0 exit:** HUMAN accepts the complete readiness package.
- **Stage 1+:** each requires explicit authorization; no gate implies the next.
- **G3:** future automated quality, policy-contract, regression, security, privacy, and performance evidence.
- **G4:** future HUMAN Preview/UX acceptance.
- Account mutation, site-review submission, Preview real-ad traffic, deployment, merge, and Production activation remain separately governed.
