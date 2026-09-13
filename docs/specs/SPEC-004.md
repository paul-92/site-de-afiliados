# SPEC-004 — Product Catalog

Status: G1/G2 APPROVED; IMPLEMENTED; AWAITING G3/G4.

## Contract

Implement the catalog domain over the approved SPEC-003 foundation: Product, Category, Tag, ProductTag, Marketplace, AffiliateLink and PriceObservation; an explicit product lifecycle; a Publication Gate; repository boundaries and use cases; public catalog lookup, search and filters; a versioned, additive migration; fictitious seed data; and automated verification.

## Acceptance criteria

- Public queries return only `ACTIVE` products whose category and marketplace are active and which have an active affiliate link.
- Search, category, tag, featured, pagination and product-detail queries cross the repository boundary.
- Lifecycle follows `DRAFT → READY → ACTIVE → PAUSED → ARCHIVED`; archived is terminal.
- Entering `READY` or `ACTIVE` requires a valid slug, title, short description, HTTPS image with alt text, active category and marketplace, verification timestamp, and a matching active HTTPS affiliate link.
- Price observations preserve amount, currency, marketplace and observation time.
- Migration is additive and retains the SPEC-003 tracking schema untouched.
- Seed data and URLs are exclusively fictitious.

## Explicit exclusions

No complete Admin UI, functional tracking/redirect, scraping, personal affiliate links, production deploy or merge to `main`.
