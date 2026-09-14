# SPEC-011 G2 — Authorized execution decisions

HUMAN approved SPEC-011 G1 and authorized PLAN-011 G2 against baseline `3f6000fa0703ac8f4413968fb4d5fc9f3c576540`.

- No E2E framework existed; only `@playwright/test` was added as an authorized devDependency. Chrome already installed locally was reused because the Playwright browser download was blocked by the local self-signed certificate chain.
- Development E2E used the existing verified DEMO server without terminating or mutating the user's process. Production smoke used a separate `next start` process and real production build.
- PostgreSQL/Docker were unavailable locally. Migration readiness therefore uses ordered journal/SQL inspection, non-destructive scan, Drizzle validation, schema snapshot and deterministic regeneration. Remote application remains SPEC-012 validation.
- RC-1 may be declared only with all local gates passing and P0/P1 at zero.
