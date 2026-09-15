# SPEC-016 — Google AdSense Monetization Integration

**Status:** PLANNED / DEFERRED · G1 HUMAN APPROVED · NO IMPLEMENTATION AUTHORIZED

**Planning baseline:** `27659a80bc5971fdc91dc2ea45578b153c460305`

## Objective

Prepare Garimora to pursue Google AdSense as a secondary monetization channel while keeping affiliate conversion as the primary commercial priority. The capability must be configuration-driven, disabled by default, isolated from Admin and non-production environments, privacy-aware, accessible, measurable, reversible, and unable to fabricate financial results.

G1 authorizes this specification, PLAN-016, its governance records, and documentation consistency work only. Advertising code, account operations, configuration, deployment, and Production activation are not authorized.

The HUMAN subsequently deferred execution until Garimora's primary affiliate operation is live and stable. The specification, plan, G1 decision, discovery, and history remain preserved; the deferment authorizes no Stage 0 work or AdSense implementation.

## Product and monetization contract

- Affiliate conversion remains the primary monetization objective.
- Initial advertising uses manual, conservative, explicitly allowlisted slots.
- Auto Ads are excluded from the initial rollout.
- Advertising must never resemble a product, marketplace offer, navigation item, or affiliate action.
- AdSense revenue remains semantically separate from affiliate revenue.
- Page Views, clicks, or modeled rates must never be converted into fabricated revenue, impressions, RPM, CPC, fill rate, or conversions.
- Public content remains complete and usable when ads are disabled, blocked, unfilled, or unavailable.

## Stage 0 readiness gate

No AdSense loader, ad slot, `ads.txt` record, CSP change, CMP, package, or environment variable may be implemented until a HUMAN accepts evidence for all of the following:

1. Truthful controller/business identity suitable for publication.
2. Operational general-contact and privacy-rights channels.
3. Final served countries/regions and intended-audience decision.
4. Legal review of LGPD and other applicable privacy duties.
5. Decision on personalized, non-personalized, and limited ads.
6. Approved CMP/consent strategy, including regional behavior and revocation.
7. Privacy-policy change requirements reviewed without fabricated legal claims.
8. Original-content/readiness review covering methodology, guides, category guidance, comparisons, recommendations, and thin-page risks.
9. Image and text ownership/licensing review.
10. Final-domain ownership, canonical-origin, crawlability, and Production-readiness evidence.
11. Baseline measurements for LCP, INP, CLS, JavaScript cost, third-party requests/bytes, mobile behavior, and affiliate CTA usability.
12. Explicit allowlist of routes eligible for monetization and denial list for all other routes/states.

Any unresolved item remains a blocking HUMAN/business or HUMAN/legal gate; it must not be replaced by sample information.

## Content-readiness contract

Garimora must not become an ad-first thin affiliate catalog. Monetized pages must provide useful, original publisher content, with truthful authorship and no unsupported claims. Readiness work may plan or later author content about:

- the Garimora curation methodology and selection criteria;
- buying and discovery guides;
- category-specific selection guidance;
- comparisons supported by verifiable sources;
- editorial recommendations and product-selection context.

Fake reviews, fake tests, invented expertise, fabricated product use, copied/scraped content, unverified superlatives, and unsupported commercial claims are prohibited. A HUMAN content review and the later Google site review remain authoritative; no repository check can guarantee AdSense approval.

## Privacy and consent contract

- The current storefront statement that no third-party advertising cookies are used must be revised before any AdSense resource is requested.
- Disclosures must truthfully cover the implemented advertising behavior, relevant vendors, purposes, user choices, and privacy contact.
- Audience, region, legal basis, controller identity, ads-personalization mode, and CMP strategy are HUMAN decisions supported by legal review.
- If Google requires a certified CMP for served regions, only an approved compatible option may be used.
- Where consent is required, no AdSense tag may be called before the applicable signal permits it.
- Users must receive an accessible way to revisit or revoke applicable choices.
- CMP code or a new dependency requires separate HUMAN authorization.

## Future technical architecture contract

After Stage 0 acceptance and a separate implementation authorization, the smallest valid architecture is:

- validated configuration for an AdSense client/publisher identifier;
- global advertising kill switch defaulting to disabled;
- explicit hostname and environment allowlist;
- centralized public-only loader with script deduplication;
- reusable manual `AdSlot` component accepting only approved placement identifiers;
- fail-safe behavior for missing/malformed configuration, denied consent, network failure, no-fill, and ad blockers;
- no AdSense resource, component, storage, or request in Admin;
- no real ad request from Preview/development unless separately and explicitly authorized;
- `ads.txt` containing only real account-issued seller information;
- narrowly scoped CSP changes based on current official Google/CMP requirements and tested with Report-Only first where practical.

The publisher/client identifier is public configuration, not a secret. OAuth tokens, API credentials, or other actual secrets remain server-side and are outside this SPEC.

## Route and placement contract

Initial eligible placement design:

- **Home:** at most one low-risk slot after useful content; never before or within the primary discovery action.
- **Category/collection:** between complete content/product groups, visually distinct from catalog cards.
- **Product:** only after principal product content, the affiliate CTA, and disclosures.
- **Mobile:** at most one slot on each eligible page in the initial rollout.

Initial ads are prohibited on:

- `/admin` and all descendants;
- access-denied or authentication flows;
- `/buscar`, including empty and populated results;
- empty, unavailable, error, not-found, and loading states;
- `/privacidade`, `/termos`, and `/afiliados`;
- `/go/*`, API routes, redirects, or non-content endpoints.

Advertising is also prohibited between price and affiliate CTA, immediately beside the main affiliate CTA, over content/navigation, in pop-ups or floating overlays, near dense interaction targets, disguised as a product, or in accidental-click patterns.

## Performance budget

The baseline and future post-integration evidence must cover representative home, collection/category, and product routes on mobile and desktop. Target field-quality boundaries at the 75th percentile are:

- LCP ≤ 2.5 seconds;
- INP ≤ 200 milliseconds;
- CLS ≤ 0.1.

Evidence must also report third-party requests and transferred bytes, JavaScript transfer/execution cost, main-thread impact, mobile layout behavior, ad-slot reservation, network/ad-blocker failure behavior, and affiliate CTA visibility/usability. Slots must reserve appropriate responsive space, avoid the LCP region, and never introduce uncontrolled layout shift. A material regression or Core Web Vitals category regression blocks rollout.

## Accessibility contract

- Ads and surrounding content remain distinguishable without relying on color alone.
- Slots do not interrupt heading, reading, focus, or landmark order.
- Empty/no-fill/blocked behavior does not announce noise or leave focusable remnants.
- Responsive slots do not obscure navigation, content, controls, or disclosures.
- Keyboard, zoom/reflow, reduced motion, touch targets, contrast, and screen-reader traversal remain usable.
- Any publisher-provided label must be truthful and unambiguous.

## Security and environment contract

- Existing Auth, `ADMIN_USER_IDS`, protected layouts/actions, and Admin response boundaries remain unchanged.
- Existing CSP directives must not be removed or broadly weakened.
- New sources must be explicit, minimal, justified by current official documentation and observed integration behavior.
- CSP should be evaluated in Report-Only before enforcement where practical.
- Advertising defaults to disabled in every environment.
- Production capability may exist only in a disabled state until a separate explicit Production activation gate.
- Preview/dev must not generate real ad traffic by default.

## `ads.txt` contract

- Do not publish placeholder, example, guessed, or stale seller records.
- Use only the exact Publisher ID and relationship issued/confirmed for the real AdSense account.
- Serve from the applicable root domain with plain-text content, successful crawler access, and deterministic tests.
- Before real data is approved, `/ads.txt` must remain absent rather than imply authorization.

## Analytics and Admin boundary

This SPEC does not add AdSense reporting, OAuth, revenue ingestion, financial persistence, scheduled imports, Admin Monetization navigation, or consolidated revenue. Existing Analytics SQL, Page Views, Affiliate Clicks, CTR semantics, rankings, privacy model, and 7/30/90 behavior remain unchanged.

A later SPEC must define the trusted Google reporting source, authentication, ingestion, reconciliation, currency/time-zone semantics, persistence, freshness, auditability, and truthful Admin presentation.

## Dependencies

No runtime dependency is approved. The initial architecture should use the existing Next.js/React/CSS stack. Any CMP, SDK, library, or package requires a written need, privacy/security/performance assessment, and separate HUMAN authorization before installation.

## Acceptance criteria

1. Stage 0 evidence is complete and explicitly HUMAN accepted before technical implementation.
2. Published identity and contact information are real and HUMAN approved.
3. Privacy/CMP behavior reflects documented business, regional, platform, and legal decisions.
4. Content readiness demonstrates useful original value without fabricated experience or claims.
5. Final-domain ownership and crawlability are demonstrated without implying Google approval.
6. Advertising is disabled by default and gated by explicit environment/hostname configuration.
7. Preview/dev make no real AdSense requests by default.
8. Admin and all denied routes/states never load or display advertising resources.
9. Missing, malformed, blocked, unfilled, or failed advertising cannot break the storefront.
10. The AdSense loader is centralized and deduplicated.
11. Only approved manual placements render; Auto Ads remain disabled.
12. Initial density and placement preserve affiliate CTA priority and avoid accidental-click patterns.
13. Mobile eligible pages render no more than one initial slot.
14. `ads.txt` contains only exact, real, authorized account data and passes root-domain validation.
15. CSP uses minimal explicit sources, preserves existing directives, and passes staged validation.
16. Accessibility and responsive behavior pass automated and HUMAN review.
17. Performance evidence meets approved budgets or records a HUMAN rejection; uncontrolled CLS is zero.
18. Existing public routes, Admin, Auth, CRUD, Publication Gate, Analytics, schema, migrations, and `runtime_timing` do not regress.
19. No revenue, impressions, RPM, CPC, fill rate, or conversions are fabricated or inferred.
20. Preview validation passes before any separately governed Production decision.

## Evidence requirements

- Completed Stage 0 checklist with owner, evidence, status, and HUMAN decision for each item.
- Route eligibility/denial matrix and network proof for public versus Admin routes.
- Current official Google policy/CMP/CSP source register with review date.
- Privacy/legal and content-readiness HUMAN approvals.
- Image/text rights inventory.
- Domain, robots, sitemap, canonical, and `ads.txt` validation results.
- Before/after mobile and desktop performance captures.
- Request/byte/JavaScript and layout-shift evidence.
- Consent-state, config-state, script-deduplication, failure, ad-blocker, accessibility, and responsive test results.
- Affiliate CTA regression evidence.
- Final scope audit proving no reporting, financial data, schema/migration, Auth, Analytics-semantic, dependency, infrastructure, or unauthorized Production change.

## Exclusions and stop conditions

Excluded: Auto Ads, AdSense reporting/API, OAuth, revenue ingestion, financial persistence, Admin Monetization reporting, combined revenue, schema/migrations, fabricated data, Vercel/Supabase operations, and Production activation.

Stop for a new HUMAN decision if any of the following occurs: incomplete Stage 0 evidence; missing business/legal decision; CMP or package need; new persistent data requirement; broad CSP weakening; changed Admin/Auth/Analytics semantics; real Preview ad traffic; Production enablement; route expansion; unverifiable content/rights; or policy ambiguity with material compliance impact.
