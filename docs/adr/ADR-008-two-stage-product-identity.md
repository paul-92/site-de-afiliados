# ADR-008 — Two-Stage Product Identity & Affiliate Reconciliation Architecture

**Status:** PROPOSED (G1 Scope Authorization Only · Amended for Affiliate-Panel-Assisted Discovery · Awaiting G2 Authorization)

**Date:** 2026-09-21

**Deciders:** Human Architecture Lead, Antigravity AI Agent

---

## 1. Context and Problem Statement

Garimora originally enforced a strict single-stage product identity rule: the `Shop ID` + `Item ID` extracted from product discovery had to match the `Shop ID` + `Item ID` of the affiliate link destination 1:1.

During Catalog Expansion v1, 6 out of 9 prepared candidate products failed preflight validation due to identity mismatches. Diagnostic investigation of representative cases (`CAND-B2-FERR` and `CAND-C1-CASA`) proved that HUMAN-generated affiliate links point deterministically (100% stability) to valid Shopee PDPs representing the exact same physical product concept, but registered under a different seller or listing ID.

Rejecting all affiliate links that target alternate listings of the same product creates unacceptable operational friction. Conversely, blindly accepting affiliate destinations without validation risks silent product substitution and catalog corruption.

Furthermore, future Product Discovery will support **Affiliate-Panel-Assisted Discovery** through a HUMAN-authenticated Shopee Affiliate session. The identity architecture must decouple discovery origin provenance from monetization destination while remaining agnostic to the link acquisition method.

---

## 2. Decision Drivers

- **Catalog Integrity:** Ensure Garimora never publishes a materially different product than advertised.
- **Monetization Viability:** Allow valid, high-converting affiliate links pointing to equivalent product listings to be published safely.
- **Auditability & Provenance:** Retain complete historical evidence of where a candidate was originally discovered and how its affiliate link was acquired (`HUMAN_PROVIDED` vs `AFFILIATE_PANEL_ASSISTED`).
- **Fail-Closed Governance:** Automatically block candidates whenever identity alignment is ambiguous or inconclusive.
- **Credential Security:** Guarantee zero agent access to user passwords, 2FA tokens, or session secrets.
- **Marketplace Neutrality:** Maintain an architectural design compatible with future marketplace additions.

---

## 3. Considered Options

1. **Option 1: Strict Single-Stage Identity (Status Quo)**
   - Reject any affiliate link whose destination `Shop ID` + `Item ID` does not match discovery 1:1.
2. **Option 2: Unchecked Destination Adoption**
   - Automatically overwrite candidate identity with whatever product listing the affiliate link points to.
3. **Option 3: Two-Stage Identity & Fail-Closed Reconciliation Engine (PROPOSED)**
   - Decouple `Discovered Identity` from `Monetizable Identity`. Require explicit, multi-tier identity reconciliation before publication regardless of link acquisition origin (`HUMAN_PROVIDED` or `AFFILIATE_PANEL_ASSISTED`).

---

## 4. Decision Outcome

**Proposed Option 3: Two-Stage Identity & Fail-Closed Reconciliation Engine.**

### Architectural Mechanism
1. **Discovered Identity:** Preserves discovery origin (`marketplace_id`, `discovery_shop_id`, `discovery_item_id`, `discovery_canonical_url`).
2. **Monetizable Identity:** Captures affiliate preflight destination (`marketplace_id`, `destination_shop_id`, `destination_item_id`, `destination_canonical_url`, `link_origin`).
3. **Reconciliation Engine:** Evaluates alignment into 4 distinct outcomes:
   - `EXACT_MATCH`: 1:1 match of Shop ID + Item ID.
   - `EQUIVALENT`: Same category, identical title concept, equivalent technical specs, matching images, different seller.
   - `MATERIAL_MISMATCH`: Deviation in variant, size, model, capacity, or utility.
   - `INCONCLUSIVE`: Insufficient or conflicting metadata.

### Commercial Data Rule
Customer-facing commercial attributes (observed price, stock status, active affiliate destination) MUST be freshly observed from the `Monetizable Identity`. Discovered price is retained only as historical discovery context.

---

## 5. Consequences

### Positive Consequences
- Unblocks candidate products whose valid affiliate links target equivalent seller listings.
- Provides complete audit trail from discovery origin to monetizable endpoint.
- Supports both manual chat handoffs (`HUMAN_PROVIDED`) and future authenticated affiliate sessions (`AFFILIATE_PANEL_ASSISTED`).
- Protects storefront users from price and product specification discrepancies.
- Keeps 4 existing ACTIVE products backward-compatible (`discovery == destination`).

### Negative Consequences / Trade-offs
- Slightly increases database schema surface and query complexity.
- Requires maintaining a multi-tier reconciliation decision matrix.

---

## 6. Compatibility & Migration Strategy

- **Existing Active Baseline:** Pilot #001 and Batch 01 products (4 active products total) automatically evaluate to `EXACT_MATCH` and `HUMAN_PROVIDED`. No historical data modification is required.
- **Blocked Candidates:** The 6 blocked candidates will be processed through the Two-Stage Reconciliation Pipeline only after explicit G2 authorization.

---

## 7. Status and Next Steps

This ADR is **PROPOSED**. Implementation will begin only upon receiving explicit HUMAN G2 authorization.
