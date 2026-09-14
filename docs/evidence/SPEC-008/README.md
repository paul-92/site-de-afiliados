# SPEC-008 execution evidence — 2026-09-14

## Gate

- Branch: `feature/spec-008-seo-content`
- Starting baseline: `eb85af818f7495bae6916787d975f8f9e93484df`
- SPEC-008: IMPLEMENTED / AWAITING HUMAN G3/G4
- PLAN-008: EXECUTED / QUALITY GATES PASS
- STOP CONDITION: none encountered

## Metadata and canonical

Native Next.js server metadata covers Home, products, categories, Achados, Até R$30, Até R$50, Novidades, and social sharing. Titles and descriptions use only existing catalog or controlled editorial facts. Canonicals are deterministic path-based URLs and ignore query, pagination, search, and tracking parameters.

`GARIMORA_SITE_URL` is validated as a credential-free HTTPS origin without path, query, or fragment. Production absolute SEO output fails closed if it is absent or invalid; no production domain is hardcoded.

## Robots and sitemap

`/robots.txt` explicitly excludes `/admin`, `/admin/*`, `/admin-access-denied`, `/buscar`, and `/go/*`. Search and administrator pages also declare `noindex`. Robots is treated only as crawler policy; the existing server-side administrator protection remains unchanged.

`/sitemap.xml` is server-rendered from the existing public repository. It includes Home, the four approved collections, active public categories, and products already filtered by the Publication Gate query: ACTIVE product, active category, active marketplace, and active affiliate link. It excludes admin, search, redirects, lifecycle-ineligible products, and all production DEMO products.

## Structured data and content

- Truthful `WebSite`, `BreadcrumbList`, `ItemList`, and `Product` JSON-LD use configured same-site URLs and public data.
- Product JSON-LD intentionally omits offers, rating, reviews, stock, availability, seller, shipping, discount, promotion, and old price because the catalog cannot substantiate those claims reliably.
- JSON-LD escapes `<` to prevent script termination/injection.
- Semantic breadcrumbs link Home to category and product without changing the approved identity.
- Versioned editorial copy is limited to Organização, Cozinha, Casa & Utilidades, Ferramentas & Manutenção, and the four approved collections.
- Existing affiliate and reference-price disclosures remain visible.

## DEMO isolation and security

The existing repository boundary still enables DEMO only when `NODE_ENV=development` and no database is configured. Production never falls back to DEMO. SEO adds defense-in-depth that rejects demo-marked products from production sitemap, product metadata, and Product JSON-LD. Tests prove production sitemap fails closed without the real catalog.

Slug validation is bounded and allowlisted before product lookup. Metadata relies on React/Next escaping, JSON-LD uses explicit safe serialization, editorial content is code-controlled text, social images accept only same-site paths or credential-free HTTPS URLs, and SEO modules never read or render raw AffiliateLink destinations.

## Verification

| Gate | Result |
|---|---|
| Lint | PASS — zero warnings |
| Type-check | PASS |
| Full regression | PASS — 59/59 tests, 12/12 files |
| SPEC-008 focused tests | PASS — 18/18 |
| Production build | PASS — `/robots.txt` and dynamic `/sitemap.xml` included |
| Migration validation | PASS — `drizzle-kit check` |
| Schema/migration/ADR diff | PASS — none |
| Runtime dependency audit | PASS — 0 vulnerabilities |
| Secret-pattern scan | PASS — matches limited to placeholders, validation code, tests, and prior evidence wording |
| Real-link scan | PASS — application/test values use reserved `.example`, schema.org, or localhost fixtures |
| Affiliate URL exposure scan | PASS |
| `git diff --check` | PASS |

Vitest retains the known forward-looking Vite native config-loader warning; it does not fail tests or affect runtime behavior.

## Scope confirmation

No schema, migration, ADR, tracking, Publication Gate, dependency, CMS, analytics, Search Console, production integration, or material visual change was made. No push, PR, merge, deployment, or `main` change occurred. Final implementation commit follows this record.
