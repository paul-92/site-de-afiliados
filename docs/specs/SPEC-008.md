# SPEC-008 — SEO & Content Foundation

**Status:** ACCEPTED/DONE · G3 PASS · G4 HUMAN APPROVED

**Starting baseline:** `eb85af818f7495bae6916787d975f8f9e93484df`

**Accepted functional baseline:** `c76cd1d984f1f0ca6897a4c11a91f457265a1378`

## Objective

Provide a truthful, server-rendered SEO and minimum editorial foundation for Garimora's eligible public catalog while preserving the domain, Publication Gate, SPEC-005 tracking, administrator boundary, approved storefront, affiliate transparency, and development-only DEMO.

## Contract

- Native Next.js metadata for Home, product, category, and collection pages.
- Deterministic canonicals derived from a validated `GARIMORA_SITE_URL`, never from request query or tracking parameters.
- Explicit robots policy: `/admin/`, `/buscar`, and `/go/` are not indexable.
- Dynamic sitemap limited to eligible public categories and products plus approved public collections.
- Truthful `WebSite`, `BreadcrumbList`, `ItemList`, and `Product` JSON-LD only when available data supports them.
- Semantic breadcrumbs, controlled editorial copy for the four current categories and collections, and natural internal links.
- Search remains functional but `noindex`; tracking and administrator surfaces remain outside SEO.
- Production SEO fails closed when configuration or catalog data is unavailable. DEMO data is development-only.

## Boundaries

No ranking promise, CMS, mass content generation, analytics, Search Console integration, social-account integration, schema or migration change, ADR change, dependency-heavy SEO layer, Publication Gate change, tracking change, redesign, deployment, or production integration is authorized. New ideas go to BACKLOG.

## Acceptance

The approved public surfaces expose accurate titles, descriptions, canonicals, social metadata, internal navigation, and safe structured data. Robots and sitemap exclude search, admin, redirects, ineligible products, and production DEMO data. Affiliate destinations and invented commercial claims never appear in SEO output.
