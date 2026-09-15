# SPEC-017 — G2C Production configuration preparation

**Status:** PREPARATION COMPLETE · AWAITING HUMAN PROVIDER-CONFIGURATION GATE

**Prepared:** 2026-09-15

**Production origin:** `https://garimora.vercel.app`

## Boundaries

This is a redacted configuration plan only. It does not authorize changing Vercel variables, Supabase Auth/Data API, secrets, domains, monitoring, backup settings, scheduler, deployments, HSTS, or data. Preview and Production share the Supabase project only under the accepted G2A risk; their Vercel environment scopes remain separate.

## Production environment matrix

| Variable | Vercel Production | Vercel Preview | Sensitivity and rule |
|---|---|---|---|
| `DATABASE_URL` | Required; shared Supabase target | Existing; same target temporarily accepted | Secret. Use the approved serverless/pooler connection form. Never expose or print. |
| `ADMIN_USER_IDS` | Required; exact allowlisted Auth UUID(s) | Existing; same intended initial Admin | Sensitive authorization config. Comma-separated UUIDs; no emails. Fail closed when absent/invalid. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required; shared project URL | Existing; same project | Public identifier, but verify exact project correlation. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required; shared project publishable/legacy anon key | Existing; same project | Browser-visible by design; never substitute `service_role`/secret key. |
| `GARIMORA_SITE_URL` | Required: `https://garimora.vercel.app` | Do not set to a Preview hostname as canonical | Credential-free HTTPS origin; no path, query, fragment, or trailing data. |
| `GARIMORA_DEMO` | Absent or `0` | Absent or `0` for shared-project validation | Production code already prevents DEMO, but explicit disable avoids ambiguity. |
| `GARIMORA_ANALYTICS_DEMO` | Absent or `0` | Absent or `0` | Never permit synthetic Analytics against shared state. |
| `SUPABASE_SERVICE_ROLE_KEY` | Must remain absent | Must remain absent | Unused and unsafe in this application; never expose to client bundles. |

Only variable names, scopes, target correlation, and cryptographic fingerprints may be recorded. Values must not enter Git, screenshots, logs, chat, or evidence.

## Admin allowlist and Auth plan

1. Read-only correlate the single intended Auth user UUID with the redacted Preview allowlist and proposed Production `ADMIN_USER_IDS`; do not retrieve email, phone, metadata, sessions, or tokens.
2. Production allowlist contains only explicitly approved UUIDs. Empty/malformed/mismatched values are NO-GO and must preserve denial.
3. Set Supabase Auth Site URL to `https://garimora.vercel.app` only after G2C approval.
4. Allow exact Production redirect origins/paths required by the implemented login flow. Prefer exact Production URLs; do not use a broad Production wildcard.
5. If Preview Auth must continue, allow only the narrow Vercel Preview pattern tied to the Garimora project/team plus required path(s). Record that shared Auth means Preview can create sessions against the Production-sensitive user pool.
6. Retain localhost redirects only if explicitly required for controlled development; otherwise remove them. Any change to providers, email templates, MFA, password policy, leaked-password protection, JWT lifetime, or sessions requires explicit authorization.
7. Resolve the advisor finding for leaked-password protection as its own reviewed Auth change; it is not implicitly approved here.

## Data API and database connection configuration

- Confirm the Vercel Production connection uses the approved Supabase pooler/direct mode supported by the serverless runtime, TLS required, without leaking the URI.
- Because application data access is server-side direct PostgreSQL, preferred posture is Data API disabled. If it must stay enabled, remove `public` from exposed schemas or expose only a dedicated minimal schema, paired with the G2B least-privilege grants/RLS posture.
- Auth endpoints remain necessary; do not confuse disabling/restricting the Data API with disabling Supabase Auth.
- Any Data API setting mutation waits for both the exact G2B SQL review and G2C HUMAN approval.

## Vercel Production change sheet

After G2C approval only:

1. Confirm project/team `Garimora`, linked repository `paul-92/site-de-afiliados`, Production branch policy, and hostname `garimora.vercel.app`.
2. Add the required variables to Production scope only, using provider secret controls. Avoid copying unrelated Preview values.
3. Review build/runtime settings without deploying. Variable changes that require redeployment do not authorize that redeployment.
4. Keep the existing Production deployment at commit `8bd702f` until G4A; do not promote or redeploy during G2C.
5. Do not add a custom domain, DNS records, redirects, or HSTS.

## Monitoring and alert plan

- Before G4A, name the launch owner and verify access to Vercel deployment/function logs plus Supabase database/Auth/API logs without recording secret or personal content.
- Monitor availability, 5xx rate, database connection/timeouts, Auth failures, admin denials, `/go` denials, click-write failures, PageView failures, Analytics failures, and latency.
- Use sanitized structured evidence: timestamp, route/operation, status, duration, deploy ID, and correlation ID where available. Do not log tokens, cookies, URLs containing credentials, raw referrers, emails, UUID allowlists, or database strings.
- Define alert thresholds and observation window at G4A. Immediate abort conditions remain secret exposure, Auth bypass, unsafe redirect, corrupt migration, broad outage, false public information, or unrecoverable data risk.

## Application rollback plan

- Before deployment, record the current stable Production deployment ID/commit and verify Vercel rollback/promote capability read-only.
- Rollback target is an immutable prior deployment with compatible environment and database state.
- Environment changes must have a redacted before/after manifest and a reversal sequence; secret values remain only in the provider.
- Additive migrations are not automatically rolled back. On database incompatibility, stop, preserve evidence, and use the G2B forward-repair/recovery decision path.
- Shared Supabase state means a Preview action can invalidate Production rollback assumptions; freeze destructive Preview activity throughout the release window.

## Retention plan

- Current code defines a 90-day `page_views` purge boundary; no scheduler exists remotely.
- Scheduler implementation/activation remains separately gated because it deletes Production-sensitive data. G2C may later authorize only an enumerated mechanism, schedule, authenticated invocation path, timeout, retry/idempotency behavior, logging, owner, and disable procedure.
- Before activation, test the cutoff against synthetic data only in an isolated representative database. In the shared project, first use a read-only count for rows strictly older than the computed UTC cutoff; do not select row contents.
- Initial execution requires a dry-run count, explicit HUMAN approval, recorded cutoff/timezone, deletion-count evidence, and post-run boundary verification. Never purge `click_events` by implication; its retention remains a separate legal/product decision.

## Backup and configuration retention

- Database retention follows the separately approved G2B backup/PITR plan; do not assume availability from plan tier.
- Preserve Git-tracked configuration documents indefinitely with no secrets. Keep redacted provider change records, deployment IDs, migration hashes, and incident evidence for the HUMAN-approved operational period.
- Provider log retention and access controls must be read-only verified before G4A and reconciled with the published privacy wording.

## Verification after a future G2C mutation

- Confirm variable names/scopes and fingerprints without values; verify no secret appears in client bundles.
- Verify Auth Site URL and narrowly scoped redirects, authorized/unauthorized/anonymous behavior, refresh, logout, and post-logout denial.
- Verify Data API denial or exact minimal exposure, server database connectivity, and fail-closed behavior when configuration is missing.
- A configuration change does not authorize deployment. Runtime HTTPS, canonical, robots/sitemap, CSP, headers, monitoring, and rollback checks occur against the separately approved release candidate.

## G2C decision required

The HUMAN must approve or reject each enumerated provider change, exact scopes, Auth origins, Data API posture, monitoring access, rollback manifest, retention mechanism, and operator/window. Until then, all provider mutations remain prohibited.
