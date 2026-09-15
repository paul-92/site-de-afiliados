# SPEC-015 — HUMAN Shell checkpoint evidence

**Implementation baseline:** `4e44ff4babccffe01af058fab8225401b7aa268d`

**Branch:** `feature/spec-015-admin-cockpit-ux-ui`

**State:** Slices 1–3 complete; awaiting HUMAN Shell approval before Slices 4–6.

## Implemented shell

- Public chrome moved intact to the pathless `(public)` route group.
- Root layout reduced to the shared document/metadata/style boundary.
- `/admin/layout.tsx` still performs `getAdminBoundaryState()` server-side and redirects fail-closed before rendering the cockpit.
- Dedicated Admin shell uses a persistent dark-green desktop sidebar, mint active state, cream canvas, orange Garimora accent, grouped navigation, route title, protected status, and unchanged logout Server Action.
- Tablet/mobile navigation becomes an off-canvas drawer with `aria-expanded`, `aria-controls`, Escape dismissal, first-link focus on open, focus return on Escape/scrim close, and hidden/focus-inert behavior while visually closed.
- Active state handles exact Overview and nested Product routes through `aria-current="page"`.
- No Monetization navigation or fabricated business data was added.

## Route and Auth regression

Production build route output preserved:

- Public: `/`, `/achados`, `/admin-access-denied`, `/afiliados`, `/ate-30`, `/ate-50`, `/buscar`, `/categoria/[slug]`, `/novidades`, `/privacidade`, `/produto/[slug]`, `/termos`, `/robots.txt`, and `/sitemap.xml`.
- Admin: `/admin`, `/admin/analytics`, `/admin/marketplaces`, `/admin/products`, `/admin/products/[id]`, `/admin/products/new`, and `/admin/taxonomy`.
- Infrastructure routes `/api/page-view` and `/go/[productSlug]` also remain present.

Local production requests returned HTTP 200 for every representative public route, retained the public navigation/footer, and did not render the Admin shell. Two successive direct requests to every Admin route produced the Next.js fail-closed redirect marker for `/admin-access-denied` and did not expose protected shell content. Existing authorization regression tests passed.

The local environment intentionally has no Supabase/database credentials. Authenticated direct-load/refresh was therefore not re-executed, because this checkpoint forbids Supabase/Vercel access or secret changes. The accepted SPEC-012 real Preview Auth/allowlist/direct-navigation result remains the functional baseline; authenticated route-group validation remains required at the next separately authorized real-environment checkpoint.

## Automated results

- Lint: PASS.
- Type-check: PASS after regenerating stale ignored Next.js route types.
- Unit/integration regression: PASS, 18 files and 93 tests.
- Production build and route collection: PASS.
- No route collision reported.
- No dependency, schema, migration, repository/query, Auth, Server Action, Analytics SQL/semantics, database lifecycle/deadline, or `runtime_timing` change.

## Visual evidence

- `shell-desktop.png`: 1440 × 900 desktop shell.
- `shell-mobile.png`: 390 × 844 mobile navigation open state.

Because real local Auth/database credentials are unavailable and remote access is prohibited, these two images are component-level renders of the implemented shell DOM and production CSS. They contain no metrics or business records. Route/Auth behavior was verified separately through the compiled application and regression suite.

## Findings and next gate

- P0: 0.
- P1: 0.
- P2: 0 identified in Slices 1–3.
- P3: authenticated route-group direct-load/refresh must be repeated in an authorized real environment; existing accepted tooling warnings remain unchanged.

No implementation beyond Slices 1–3 is authorized. HUMAN Shell approval is required before Overview, Analytics, or Catalog content redesign begins.
