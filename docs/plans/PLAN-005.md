# PLAN-005 — Affiliate Tracking & Click Attribution

Status: G2 APPROVED; AUTHORIZED; EXECUTED; AWAITING HUMAN G3/G4.

1. Audit the real ClickEvent schema and stop for destructive or material schema/ADR changes.
2. Implement the repository boundary for eligible server-side destination resolution and append-only ClickEvent writes.
3. Implement controlled sourcePage and referrer classification without storing raw referrers or visitor identifiers.
4. Enforce the Eligibility Gate and HTTPS destination validation, with no visitor destination input.
5. Redirect temporarily with HTTP 307 and `Cache-Control: no-store`.
6. Fail open only for isolated analytics writes and fail closed for all destination uncertainty.
7. Add structured operational events without destination URLs or PII.
8. Run unit, boundary/integration, security and regression verification plus migration and repository safety checks.

## Schema audit and redirect decision

The original additive migration already contains all required ClickEvent columns and indexes. No migration is required; `session_hash` remains nullable and unused. HTTP 307 is used rather than 302 because it is explicitly temporary and preserves request semantics; this endpoint exposes GET only. Responses are marked `no-store`.
