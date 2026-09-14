# SPEC-009 G2 — Authorized execution decisions

HUMAN approved SPEC-009 G1 and authorized PLAN-009 G2 against baseline `3089b8606757d63fd51cec8733182c2ef0608883`.

Persistence audit found no equivalent PageView entity. The minimum additive table is therefore required. It has no foreign keys or identifiers and uses only indexes supporting time, page-type/time, and source/time queries. Rollback is operationally `DROP TABLE page_views`, intentionally not embedded in forward migration. The migration is local, deterministic, additive, and must not be applied remotely.

Client collection was selected because server renders, metadata, crawlers and prefetch can create false views. It emits once after a public route mount; the server rejects uncontrolled paths and never persists referrer or the full query string.
