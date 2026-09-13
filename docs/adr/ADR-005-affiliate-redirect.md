# ADR-005 — Affiliate Redirect Tracking

Status: FROZEN. Public affiliate CTAs will use `/go/{productSlug}`. The server resolves an active stored destination, attempts to record a click, then uses a temporary redirect. PLAN-003 implements only the non-redirecting contract skeleton.
