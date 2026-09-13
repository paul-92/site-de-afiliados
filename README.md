# Affiliate Hub / Garimora (candidate)

Engineering foundation for a modular affiliate-curation web app. The candidate name is not frozen and must not be used for production, domain purchases, or public campaigns yet.

## Local quality gate

1. Copy `.env.example` to `.env.local` only when a local PostgreSQL connection is needed.
2. Run `npm ci`.
3. Run `npm run verify`.

Database generation is deterministic and does not require a live database. `npm run db:migrate` and `npm run db:seed` require `DATABASE_URL`; no production migration is authorized by PLAN-003.

## Boundaries

- `/`, `/categoria/[slug]`, and `/produto/[slug]` are public architecture skeletons.
- `/admin` demonstrates a deny-by-default, server-side authorization boundary. Full Supabase Auth integration belongs to the administration/security work.
- `/go/[productSlug]` returns `501` and never redirects. Commercial redirect behavior belongs to SPEC-005.
- The schema is foundational only. Product catalog behavior belongs to SPEC-004.

See [project context](.context/PROJECT_CONTEXT.md), [execution state](.context/EXECUTION_STATE.md), and [PLAN-003](docs/plans/PLAN-003.md).
