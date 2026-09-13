# SPEC-006 — Administration Cockpit

Status: G1/G2 APPROVED; IMPLEMENTATION AUTHORIZED; IN PROGRESS.

Decision record: HUMAN approved G2 and authorized PLAN-006. Baseline: SPEC-003/004/005 ACCEPTED/DONE; SPEC-005 published at `f2cb97feffac52feb152767d7fc8ed35322965c3`.

## Contract

Provide a server-rendered, administrator-only cockpit for operational health and catalog management: searchable/paginated products, product creation/edit/detail, categories, tags, marketplaces, affiliate links, append-only price observations, the existing domain Publication Gate, and valid lifecycle transitions.

ADR-004 remains frozen. Authentication is supplied behind the replaceable server boundary and every mutation independently authorizes. The cockpit must deny by default, validate untrusted form data, preserve price history, and never create a parallel publication rule.

Analytics/revenue/CTR, automated research or curation, marketing agents, scraping, Shopee import, AI, complex RBAC, deployment, PR and main merge are excluded.
