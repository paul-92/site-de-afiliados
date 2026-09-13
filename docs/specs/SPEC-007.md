# SPEC-007 — Public Frontend & Discovery

**Status:** G1 APPROVED · IMPLEMENTED · AWAITING G3/G4  
**Priority:** P0  
**Dependencies:** SPEC-003/004/005/006 ACCEPTED/DONE

## Objective

Provide a public, account-free Garimora experience in which visitors discover, browse, search, understand, and open curated products through the safe SPEC-005 redirect.

## Approved surface

- Home with hero, featured finds, catalog categories, price collections, newest products, and editorial positioning.
- Header/navigation, reusable ProductCard, category, product, search, Achados, Até R$30, Até R$50, and Novidades.
- Public empty, loading, not-found, query-failure, mobile, tablet, and desktop states.
- Semantic HTML, keyboard focus, labels, meaningful image alternatives, reduced motion, and adequate contrast.
- Only ACTIVE products with active category, marketplace, and affiliate destination; prices always come from the latest PriceObservation and are disclosed as references.
- Every commercial CTA targets `/go/[productSlug]` with an allowlisted source context. AffiliateLink destinations remain server-side.

## Boundaries

Server Components are the default and client JavaScript is limited to the required error retry boundary. No advanced SEO, CMS/blog, analytics, marketing agent, campaigns, automated research, public login, favorites, reviews, or scraping. New ideas go to BACKLOG.

No schema or migration change is authorized. A destructive migration, material domain/ADR change, need to expose AffiliateLink, heavy unplanned dependency, or scope expansion is a STOP CONDITION.

## Acceptance

A visitor can enter, discover, browse by category and collection, search, inspect a product, understand reference-price and affiliate disclosures, and continue through tracked `/go` routing. Invalid or unpublished resources do not leak technical or commercial data.
