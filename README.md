# Affiliate Hub / Garimora (candidate)

Modular affiliate-curation web app with an approved engineering foundation and a catalog implementation awaiting G3/G4 acceptance. The candidate name is not frozen and must not be used for production, domain purchases, or public campaigns yet.

## Local quality gate

1. Copy `.env.example` to `.env.local` only when a local PostgreSQL connection is needed.
2. Run `npm ci`.
3. Run `npm run verify`.

Database generation is deterministic and does not require a live database. `npm run db:migrate` and `npm run db:seed` require `DATABASE_URL`; no production migration is authorized by PLAN-003.

## Visual review without a database

Run `npm ci` (only when dependencies are not installed), then `npm run dev`, and open <http://localhost:3000>. In development, when `DATABASE_URL` is absent, Garimora automatically serves a local fictitious 20-product catalog. Set `GARIMORA_DEMO=0` to test the unavailable state.

The DEMO boundary is enforced in code: it requires `NODE_ENV=development`, has no production fallback, uses only a local generated image, and routes commercial clicks server-side to the reserved `.example` domain. In production, a configured `DATABASE_URL` remains mandatory and the catalog fails closed without it.

## Boundaries

- `/`, `/categoria/[slug]`, and `/produto/[slug]` consume the public catalog boundary. They expose only publishable `ACTIVE` products and support search/category/tag filters.
- `/admin` demonstrates a deny-by-default, server-side authorization boundary. Full Supabase Auth integration belongs to the administration/security work.
- `/go/[productSlug]` resolves eligible destinations server-side, records the controlled source context, and never exposes the stored destination in public UI.
- Catalog lifecycle and Publication Gate are implemented in SPEC-004. The full Admin experience remains out of scope.

See [SPEC-004](docs/specs/SPEC-004.md), [PLAN-004](docs/plans/PLAN-004.md), and the recorded evidence under `docs/evidence/`.
