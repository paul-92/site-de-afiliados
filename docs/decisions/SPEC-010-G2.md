# SPEC-010 G2 — Authorized execution decisions

HUMAN approved SPEC-010 G1 and authorized PLAN-010 G2 against baseline `a7f9af548ad106b317fd4ba20e0252234889564c`.

- CSP permits only resources required by the current Next.js application. Inline scripts/styles remain limited compatibility allowances; `unsafe-eval` is development-only. Objects, external base URIs and framing are denied.
- HSTS is deferred until SPEC-012 confirms end-to-end HTTPS.
- Current cookies are limited to essential Supabase administrator authentication. Storefront analytics uses no identifier cookie; no CMP need exists under the current architecture.
- Business identity/contact information is a deployment prerequisite rather than invented legal content.
- No schema, migration, dependency, material `/go`, tracking or Publication Gate change is needed.
