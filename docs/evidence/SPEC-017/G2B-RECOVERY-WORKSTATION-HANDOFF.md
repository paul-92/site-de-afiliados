# SPEC-017 — G2B recovery workstation handoff

**Status:** READY FOR VERSIONED TRANSFER · G2B REMOTE MUTATION REMAINS NO-GO

**Prepared:** 2026-09-16

**Project:** Garimora

**Repository:** `paul-92/site-de-afiliados`

**Branch:** `feature/spec-015-admin-cockpit-ux-ui`

**Baseline HEAD before handoff commit:** `5fa4d4d1f5e95254e0c8cbbcf227db563ee6a38c`

**Final transfer commit:** the commit containing this file; resolve after clone with `git rev-parse HEAD` and compare with the remote branch HEAD reported at transfer completion

## Target and candidate

- Supabase project ref: `eoevqgxmuhurzfxhhmuw`.
- PostgreSQL: 17.
- Supabase-presented application target: Shared Pooler / Supavisor, transaction mode, role-base `postgres`.
- The Supabase dashboard observation is connection target/mode evidence only. The write-only Vercel `DATABASE_URL` was not revealed or compared.
- Planned Production hostname: `https://garimora.vercel.app`.
- Custom domain: deferred post-launch.
- Candidate: `drizzle/0003_secure_server_only_data_boundary.sql`.
- Candidate state: **CANDIDATE / NOT REMOTELY APPLIED**.
- Candidate SHA-256: `6C1BB76E9AC0397C1E02A2A7716612AC1153E944C6E8182805EF2186E59BE5E7`.

## Gate state

- SPEC-016: planned/deferred.
- SPEC-017: Production Readiness.
- G1: approved.
- G2A: approved.
- G2B: **NO-GO for mutation** until the real recovery package is produced and verified.
- G2C: preparation only; no remote configuration authorization.
- No migration, remote mutable SQL, recovery, restore, RLS/grant/Data API change, environment change, deployment, promotion, scheduler, Auth change, DNS change, or launch was performed by this handoff.

## Candidate validation inherited by this checkpoint

Earlier local validation recorded:

- replay `0000`–`0003`: PASS;
- RLS: 9/9 application tables;
- browser-role table grants: zero;
- denial checks: 72/72 `anon`/`authenticated` operations denied;
- Drizzle migration consistency: PASS;
- lint: PASS;
- type-check: PASS;
- tests: 96/96 PASS;
- Production build: PASS.

The transfer validation must independently recheck the candidate hash and `npm run db:check`; it does not authorize applying the candidate.

## Current-workstation limitation

The current workstation has no administrative privileges. Docker and PostgreSQL client tools are unavailable and cannot be installed here; Google Colab is blocked. The Supabase CLI, dump/restore tools, approved encryption tooling, and a local database credential source are also unavailable. Consequently, a real recovery package cannot be produced safely here.

This is an operational limitation of the workstation, not a Garimora product failure. Recovery-package production has been deliberately transferred to another authorized workstation. No placeholder is a backup, and no backup/database content belongs in Git.

## Remaining blockers

1. Produce a real encrypted logical recovery package outside Git.
2. Cover roles, schema, data, and migration history as applicable.
3. Record UTC timestamp, sanitized target, operator, scope, exclusions, tool versions, file sizes, plaintext SHA-256 values, encrypted-package SHA-256, retention, off-site locator, key custodian, restore ordering, and restore decision-maker.
4. Verify dump command success, non-empty output, hashes, and SQL readability/parsability without restoring into Production.
5. Explicitly document Auth, Storage object, provider-managed schema/configuration, secrets, domains, and Vercel configuration exclusions.
6. Preserve the caveat that the Supabase-presented target was observed but the write-only Vercel secret was not compared.
7. Resolve the separate G2C Data API posture before launch.

## Tools to verify on the authorized workstation

Before handling any credential, verify availability and versions of:

- Git;
- Node.js 22 or newer and npm;
- current Supabase CLI;
- Docker compatible with that CLI;
- an approved authenticated-encryption tool and organizational key-storage method;
- sufficient private temporary and encrypted off-site storage.

Use `supabase db dump --help` on that workstation to confirm the current command surface. Do not infer flags from memory when the installed CLI is authoritative.

## First safe action on the authorized workstation

Clone the authorized repository, check out this exact branch, confirm that local HEAD equals the reported remote transfer commit, run `npm ci`, verify the candidate SHA-256, run `npm run db:check`, and review this handoff plus the three G2B evidence documents. **Do not obtain a database credential or start a dump during this first action.**

Only after those checks pass should the HUMAN issue a separate recovery-production authorization for handling the connection secret and creating the off-Git encrypted logical package.

## Prohibitions still in force

Do not:

- execute candidate `0003` or any remote migration;
- run mutable remote SQL;
- alter RLS, grants, policies, Data API, Auth, Storage, scheduler, DNS, Supabase, Vercel, or environment configuration;
- reveal, log, persist in Git, replace, or rotate `DATABASE_URL`, passwords, tokens, or keys;
- restore into Production;
- deploy, promote, merge, launch, or create Production data;
- put logical dumps, encrypted database artifacts, recovery keys, or secret-bearing logs in Git.

## Recovery package references

Read in order:

1. `docs/evidence/SPEC-017/G2B-DATABASE-PREPARATION.md`;
2. `docs/evidence/SPEC-017/G2B-PREPARATION-RESULT.md`;
3. `docs/evidence/SPEC-017/G2B-TARGETED-READ-ONLY-PREFLIGHT.md`;
4. `docs/evidence/SPEC-017/G2B-FINAL-PREFLIGHT-2026-09-16.md`;
5. this handoff.

The final preflight addendum contains the current role/mode classification and minimum HUMAN recovery procedure. Earlier `UNKNOWN` classifications are chronological evidence and are superseded only for the Supabase-presented target; they are not proof that the Vercel write-only value was inspected.
