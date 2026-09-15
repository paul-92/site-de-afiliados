# SPEC-015 — Admin Cockpit UX/UI Redesign

**Status:** ACCEPTED/DONE · G3 PASS · G4 HUMAN APPROVED

**Planning baseline:** `4e44ff4babccffe01af058fab8225401b7aa268d`

## Objective

Redesign the protected Garimora Admin as a modern, professional SaaS-style cockpit while preserving Garimora's visual identity and every existing functional, security, privacy, data, and Production-readiness boundary.

The HUMAN-provided dashboard image is approved only as a reference for structure and visual hierarchy. It must not be copied literally. Dark green, mint/light green, cream/off-white, orange accent, and the Garimora wordmark remain authoritative; the result must be recognizably Garimora rather than a generic blue dashboard.

## Approved experience boundary

- Dedicated protected Admin cockpit separated visually from the public storefront shell.
- Persistent desktop sidebar with clear active state and grouped information architecture.
- Accessible responsive tablet/mobile navigation.
- Route-specific page headers, context, and truthful actions.
- KPI cards and operational panels backed only by existing data.
- Redesigned Analytics presentation preserving existing metrics and 7/30/90-day behavior.
- Redesigned Products, Categories and tags, Marketplaces, product-create, and product-detail presentation.
- Intentional loading, empty, error, success, and zero-data states.
- Accessible charts, tables, forms, navigation, landmarks, headings, focus behavior, and status announcements.
- Responsive regression and HUMAN visual-review evidence.

Existing Admin URLs remain unchanged:

- `/admin`
- `/admin/analytics`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/taxonomy`
- `/admin/marketplaces`

## Information architecture

```text
Garimora Admin
├── Overview
│   ├── Operational KPIs
│   ├── Publication/status context
│   └── Priority shortcuts
├── Performance
│   └── Analytics
│       ├── 7 / 30 / 90 days
│       ├── Existing traffic and click KPIs
│       ├── Daily trend
│       └── Existing rankings
├── Catalog
│   ├── Products
│   ├── Categories and tags
│   └── Marketplaces
└── Account
    └── Logout
```

The structure may later accommodate a Monetization area for affiliate and Google AdSense capabilities. SPEC-015 must not create that navigation, AdSense/publicity integration, advertising scripts, revenue or conversion ingestion, monetization metrics, or fake/disabled future features.

## Truthful-data contract

- No fabricated records, metrics, revenue, conversions, trends, recommendations, or placeholder business results.
- Zero remains zero and receives appropriate context rather than visual inflation.
- Unavailable values remain explicitly unavailable.
- Empty collections receive intentional empty-state UX.
- Revenue remains unavailable and the existing managerial target must not be represented as revenue or progress.

## Immutable functional boundaries

SPEC-015 must not change:

- Supabase Auth or `ADMIN_USER_IDS` authorization;
- server-side fail-closed protection or protected Server Actions;
- logout or post-logout denial;
- existing Admin and public URLs;
- CRUD, validation, product lifecycle, Publication Gate, affiliate-link, or append-only price behavior;
- database schema, migrations, lifecycle, deadlines, or `runtime_timing`;
- Analytics queries, definitions, aggregation, privacy model, or 7/30/90 periods;
- tracking, security, privacy, DEMO, or secret boundaries;
- SPEC-012 Production-readiness state or any Production gate.

## Route and rendering contract

The approved planning direction may separate public and Admin chrome with App Router route groups, but implementation requires G2 authorization. The migration must prove that public and Admin URLs do not change, public storefront presentation does not regress, Admin protection remains server-side and fail-closed, no route collision is introduced, and direct navigation and refresh work on every Admin route.

## Accessibility contract

- Preserve a working skip link targeting the Admin main content.
- Provide unambiguous landmarks, navigation labels, one page-level heading, and logical heading order.
- Mark the current navigation destination with `aria-current="page"` and a non-color-only visual state.
- Support complete keyboard operation and visible focus.
- Mobile navigation must expose expanded state and correctly handle focus entry, Escape dismissal, and focus return.
- Meet WCAG AA contrast for text, controls, statuses, focus indicators, and chart marks.
- Provide chart dates, series, and values in accessible text; do not rely on color, hover, or `title` attributes.
- Give tables accessible names/headers and preserve every field and action at responsive widths.
- Announce loading, safe errors, successful actions, and meaningful empty states without excessive screen-reader noise.
- Respect reduced-motion preferences and practical touch-target sizing.

## Acceptance criteria

1. The Admin uses a dedicated Garimora-branded cockpit with persistent desktop sidebar and accessible responsive navigation.
2. Navigation grouping is clear, current-route state is accurate, and all existing areas remain reachable.
3. Public and Admin URLs are unchanged; direct navigation and refresh succeed on every Admin route.
4. Public storefront presentation remains unchanged by route-group separation.
5. Server-side Auth, allowlist authorization, fail-closed behavior, protected mutations, logout, and post-logout denial pass regression.
6. Overview displays only existing truthful counts/actions and uses intentional zero/empty states.
7. Analytics preserves every existing query and metric, CTR semantics, rankings, trend, unavailable-revenue wording, and 7/30/90 behavior.
8. Products, Categories and tags, Marketplaces, product creation, product detail, Publication Gate, affiliate links, price history, filters, and pagination retain existing behavior.
9. Loading, empty, error, and success states are polished, safe, responsive, and accessible.
10. Charts expose equivalent textual values and never rely on color or pointer hover alone.
11. Desktop, tablet, and mobile layouts remain usable without unintended viewport overflow or hidden actions.
12. Keyboard, focus, landmarks, headings, labels, announcements, contrast, touch targets, and reduced motion satisfy the accessibility contract.
13. No invented data, Monetization feature, AdSense integration, revenue/conversion ingestion, or fake future navigation is added.
14. No runtime dependency is added unless separately justified and HUMAN approved.
15. No schema, migration, functional-domain, Auth, Analytics-semantic, privacy/security, `runtime_timing`, infrastructure, or Production-readiness change occurs.
16. Existing suites and the new Admin component, route, accessibility, and responsive regression matrix pass.
17. HUMAN visual review confirms the approved hierarchy, responsive behavior, Garimora identity, and non-literal use of the reference.
18. P0, P1, and P2 findings are zero at final acceptance.

## Exclusions and stop conditions

AdSense, advertising scripts, monetization/revenue/conversion ingestion, new business metrics, schema/migrations, Auth changes, Analytics semantic changes, Production operations, public-storefront redesign, and a general application-wide design-system rewrite are excluded.

A required new runtime dependency, route/URL change, loss of server-side protection, material repository/query change, fabricated data, security/privacy weakening, or scope expansion is a STOP CONDITION requiring a new HUMAN decision.
