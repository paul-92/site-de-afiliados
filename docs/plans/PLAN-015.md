# PLAN-015 — Admin Cockpit UX/UI Redesign

**Status:** COMPLETED · G3 PASS · G4 HUMAN APPROVED

**Planning baseline:** `4e44ff4babccffe01af058fab8225401b7aa268d`

**Implementation branch:** `feature/spec-015-admin-cockpit-ux-ui`

## Implementation slices and checkpoints

### Slice 1 — Baseline and contract lock

- Confirm clean synchronized baseline and create the authorized implementation branch only after G2.
- Inventory public/Admin route output, Auth boundary, Server Actions, Analytics semantics, CRUD behavior, current screenshots, viewport behavior, schema/migrations, dependencies, and SPEC-012 governance.
- Record route and behavior invariants before restructuring.
- Checkpoint: no implementation until the invariant matrix is reviewable.

### Slice 2 — Route-group and shell separation

- Make the root document/provider layer minimal.
- Place existing public routes under a public route group with their current header, footer, main container, metadata behavior, and unchanged URLs.
- Give `/admin` its dedicated protected layout and full-width cockpit canvas.
- Preserve the existing server-side `getAdminBoundaryState()` check before protected content renders.
- Checkpoint: route manifest, direct-load/refresh, Auth denial, public visual regression, and collision tests pass before further redesign.

### Slice 3 — Admin visual foundations and navigation

- Introduce Admin-scoped tokens/components for shell, sidebar, page header, panels, KPI cards, statuses, notices, empty states, and skeletons.
- Build the persistent desktop sidebar and accessible tablet/mobile navigation.
- Add grouped navigation, active state, Garimora branding, and integrated logout without changing the logout action.
- Checkpoint: keyboard/focus, landmarks, active state, responsive navigation, contrast, and overflow review pass.

### Slice 4 — Overview cockpit

- Recompose the existing four database-backed counts into truthful KPI cards.
- Present only existing shortcuts and operational status that can be derived from already available values.
- Add intentional zero-data language; omit any panel that would require invented data or a new repository query outside approval.
- Checkpoint: exact count values and links match the existing implementation for populated and zero states.

### Slice 5 — Analytics presentation

- Recompose the existing KPI, trend, rankings, period control, unavailable-revenue statement, and managerial target.
- Preserve the bounded sequential Analytics repository and all metric definitions unchanged.
- Add accessible textual trend data and explicit empty states for every empty ranking/trend.
- Checkpoint: 7/30/90 query behavior, numeric output, truthful unavailable values, accessible chart semantics, loading, and timeout regression pass.

### Slice 6 — Catalog administration presentation

- Apply the shared cockpit hierarchy to Products, create/edit Product, Categories and tags, and Marketplaces.
- Improve filters, tables/lists, forms, Publication Gate, affiliate links, price history, success notices, and empty states without changing actions or domain behavior.
- Checkpoint: every CRUD/action path, validation, transition, filter, pagination, direct URL, and refresh behavior passes.

### Slice 7 — State, responsive, and accessibility hardening

- Add Admin-specific loading and safe error boundaries at the smallest useful segments.
- Complete desktop/tablet/mobile responsive behavior and reduced-motion treatment.
- Resolve accessibility or overflow findings without expanding business scope.
- Checkpoint: automated accessibility contracts plus HUMAN keyboard and responsive review pass with no P0/P1/P2 findings.

### Slice 8 — Final regression and evidence

- Run lint, type-check, full unit/integration regression, production build, route checks, migration validation, dependency/security audit, secret/scope scans, and `git diff --check`.
- Capture approved desktop, tablet, and mobile evidence for Overview, Analytics, Catalog, navigation, zero/empty, loading, and safe error states.
- Prove functional source changes are presentational only, with schema/migrations/dependencies and SPEC-012 Production governance unchanged.
- Stop at G3/G4; do not publish, merge, deploy, or perform any Production operation.

## Route-group migration strategy

Recommended target structure uses pathless App Router groups so URLs remain stable:

```text
src/app/layout.tsx                    minimal document/providers/skip behavior
src/app/(public)/layout.tsx           existing storefront header, main and footer
src/app/(public)/...                  existing public routes, unchanged URLs
src/app/admin/layout.tsx              server-protected cockpit shell
src/app/admin/...                     existing Admin routes, unchanged URLs
```

Implementation must move route files mechanically without duplicating URL-producing segments. Before and after manifests must be compared. Public metadata, robots/sitemap behavior, PageView collection, error/loading boundaries, styles, direct requests, refresh, and production build output must be verified. A route collision, URL change, public rendering change, or weakened Auth boundary stops the slice.

## Visual-system strategy

- Preserve the current Garimora wordmark and authoritative dark green, green, mint, cream, orange, ink, muted, line, and white palette.
- Create Admin-scoped semantic tokens for canvas, sidebar, panel, border, muted content, interactive, active, warning, success, danger, focus, and chart series; reuse current values wherever they meet contrast.
- Use CSS Grid/Flexbox and repository-native SVG where an icon materially improves scanning. Text labels remain authoritative.
- Use the reference for density, hierarchy, grouping, and cockpit composition only—not its branding, colors, exact geometry, content, or ornament.
- Consolidate duplicated Admin/Analytics CSS and avoid changing storefront selectors.
- No runtime UI, chart, icon, state, or CSS dependency is planned.

## Responsive strategy

- Desktop: persistent 240–272px sidebar and flexible content canvas.
- Tablet: compact rail or modal/off-canvas navigation selected during implementation based on keyboard and content fit evidence.
- Mobile: single-column page, labeled menu trigger, visible current context, focus-managed drawer, stacked actions/forms, and compact truthful KPIs.
- Preserve table semantics through named horizontal-scroll regions or an accessible record-card alternative that exposes every field/action.
- Validate no unintended horizontal viewport overflow at representative narrow, tablet, laptop, and wide-desktop widths.

## Accessibility strategy

- Server-render landmarks and headings; isolate only pathname/mobile-menu behavior in the smallest Client Component.
- Preserve skip navigation and visible focus.
- Use `aria-current`, `aria-expanded`, controlled focus entry/return, Escape dismissal, and non-color-only active/status indicators.
- Supply accessible names/captions and header associations for data tables.
- Expose chart series, dates, and values as semantic text/table content.
- Distinguish zero, empty, unavailable, loading, and error states in both copy and semantics.
- Validate WCAG AA contrast, target size, zoom/reflow, reduced motion, keyboard order, and announcements.

## Regression and test matrix

| Contract | Automated evidence | HUMAN evidence |
| --- | --- | --- |
| Public URLs/presentation unchanged | route/build comparison; existing storefront/SEO/E2E suites; focused screenshot comparison | desktop/mobile storefront spot-check |
| Admin URLs/direct load/refresh | route manifest and Playwright traversal of every Admin URL | navigation and refresh walkthrough |
| Auth/allowlist/fail-closed | existing security tests plus protected-layout and unauthenticated route regression | real authorized login/logout and post-logout denial at later authorized environment gate |
| Protected Server Actions | existing mutation authorization assertions and action regression | CRUD walkthrough without boundary changes |
| Sidebar/mobile navigation | component semantics and Playwright keyboard/viewport tests | desktop, tablet, mobile navigation review |
| Active route | component tests for exact and nested paths | visual clarity review |
| Overview truthfulness | render tests with populated and zero repository fixtures | KPI/empty-state review |
| Analytics semantics | existing domain/service/runtime tests plus exact 7/30/90 and empty-snapshot rendering | periods, charts, rankings, unavailable revenue review |
| Catalog behavior | filters, pagination, form, validation, Publication Gate, link and price action regression | operational workflow review |
| Loading/error/success/empty | component/route render assertions and safe-message checks | perceived hierarchy and clarity review |
| Accessibility | semantic assertions, keyboard Playwright, contrast review, reduced-motion and reflow checks | keyboard, focus, screen-width and readable-chart review |
| Boundaries | schema/migration/dependency diffs, secret scan, security/privacy tests, `git diff --check` | confirm no scope or Production-governance expansion |

## Required evidence package

- Before/after route manifest and proof of unchanged public/Admin URLs.
- Before/after Admin screenshots at desktop, tablet, and mobile widths.
- Public storefront comparison showing unchanged presentation.
- Overview and Analytics populated and zero/empty evidence using legitimate fixtures only.
- Loading, safe error, success, mobile navigation, table/form, and active-route evidence.
- Keyboard/focus walkthrough and accessible chart representation.
- Test/build/migration/dependency/security/privacy/scope results.
- Final changed-file audit proving no schema, migration, Auth, Analytics-semantic, `runtime_timing`, infrastructure, or SPEC-012 governance change.

## HUMAN visual-review checkpoints

1. **G2 before implementation:** approve the PLAN, route-group migration, responsive navigation choice boundary, evidence matrix, and implementation branch creation.
2. **Shell checkpoint after Slices 1–3:** review cockpit composition, Garimora identity, non-literal reference use, desktop sidebar, mobile navigation, and unchanged storefront.
3. **Content checkpoint after Slices 4–6:** review Overview, Analytics, Catalog, truthful zero/empty/unavailable states, and information hierarchy.
4. **G4 final acceptance after G3:** review desktop/tablet/mobile evidence, keyboard/accessibility behavior, functional regression results, and final scope audit.

Intermediate visual checkpoints authorize corrections only within the approved SPEC; they do not authorize publication, merge, deployment, or Production operations.

## Risks and rollback

- Route-group movement can cause route collisions, metadata/layout changes, or public rendering regressions. Keep moves isolated in the first implementation checkpoint and revert that checkpoint if any invariant fails.
- A navigation Client Component can introduce hydration/focus defects. Keep it small, progressively enhanced, and independently testable.
- Responsive tables can hide data/actions. Preserve semantic source order and all operational controls.
- Visual KPI emphasis can imply meaning not present in the data. Keep labels explicit and zero/unavailable states truthful.
- Chart changes can distort comparison or reduce accessibility. Preserve values/scales and ship equivalent semantic data.
- Global CSS can affect the storefront. Prefer Admin-scoped tokens/selectors and verify public screenshots.

Rollback is checkpoint-based and code-only. Route-group separation, shell foundations, Overview, Analytics, Catalog, and state/accessibility slices must remain independently revertible. No rollback may alter data, migrations, Auth, secrets, infrastructure, or Production.

## Gates

- Current gate: Slices 1–3 complete; HUMAN Shell review required.
- Next gate: HUMAN Shell approval before Slices 4–6.
- G3: automated quality, regression, safety, and evidence gate after implementation.
- G4: HUMAN visual/functional acceptance.
- Publication, PR, merge, Preview deployment, and every Production operation remain separately authorized gates.
