# HUMAN Decision — SPEC-017 custom-domain deferment

**Decision date:** 2026-09-15

**Decision:** APPROVED · CURRENT

**Custom domain:** DEFERRED POST-LAUNCH DUE TO CURRENT BUDGET

The HUMAN confirms that a paid/custom domain is not required for the initial MVP launch because there is currently no budget for domain acquisition. Initial Production may use the exact official Vercel Production `*.vercel.app` hostname at zero domain cost.

HUMAN read-only inspection identified the current Production hostname as `https://garimora.vercel.app`. This is the approved initial MVP canonical-host candidate, subject to later HTTPS, canonical metadata, robots/sitemap, `GARIMORA_SITE_URL`, CSP/security-header, and Preview-separation validation against the release candidate.

Production readiness must prove that it is the actual Production hostname, HTTPS is valid, canonical metadata and `GARIMORA_SITE_URL` use that origin, robots/sitemap use the correct origin where applicable, CSP/security headers are compatible, and Preview URLs are not treated as canonical. No fake or assumed hostname may be recorded.

This decision does not authorize a domain purchase, DNS change, Vercel configuration change, deployment, Production promotion, HSTS activation, or public launch. Future custom-domain migration remains separately governed.
