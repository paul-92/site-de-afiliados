# SPEC-005 — Affiliate Tracking

Status: ACCEPTED/DONE.

Decision record: HUMAN approved G2 and authorized PLAN-005. Baseline: SPEC-003 ACCEPTED/DONE; SPEC-004 ACCEPTED/DONE; PLAN-004 COMPLETED.

## Contract

`/go/{productSlug}` resolves Product, Marketplace and AffiliateLink on the server. Redirect is allowed only for an ACTIVE product, active marketplace, active matching affiliate link and safe stored HTTPS URL. The system attempts one append-only ClickEvent with controlled source/referrer classifications, then issues a temporary redirect.

Analytics write failure alone is fail-open. Invalid slug, ineligibility, lookup failure or dubious destination is fail-closed as `AFFILIATE_REDIRECT_DENIED`. Visitor-provided destinations are never used.

No sessionHash, PII, fingerprinting, analytics dashboard, complete Admin, scraping, commission tracking, deploy or main merge is included.
