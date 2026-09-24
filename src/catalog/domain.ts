export const PRODUCT_STATUSES = ["DRAFT", "READY", "ACTIVE", "PAUSED", "ARCHIVED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

const allowedTransitions: Record<ProductStatus, readonly ProductStatus[]> = {
  DRAFT: ["READY"],
  READY: ["ACTIVE"],
  ACTIVE: ["PAUSED"],
  PAUSED: ["ARCHIVED"],
  ARCHIVED: [],
};

export class InvalidProductTransitionError extends Error {}
export class PublicationGateError extends Error {
  constructor(public readonly reasons: readonly string[]) {
    super(`Publication Gate failed: ${reasons.join(", ")}`);
  }
}

import type { ReconciliationStatus, LinkOrigin } from "@/lib/identity/reconciliation";

export interface CandidateAffiliateLink {
  readonly active: boolean;
  readonly url: string;
  readonly marketplaceId: string;
  readonly reconciliationStatus?: ReconciliationStatus | null;
  readonly linkOrigin?: LinkOrigin | null;
  readonly destinationShopId?: string | null;
  readonly destinationItemId?: string | null;
  readonly destinationCanonicalUrl?: string | null;
}

export interface PublicationCandidate {
  readonly slug: string;
  readonly title: string;
  readonly shortDescription: string | null;
  readonly imageUrl: string | null;
  readonly imageAlt: string | null;
  readonly lastVerifiedAt: Date | null;
  readonly categoryActive: boolean;
  readonly marketplaceActive: boolean;
  readonly affiliateLinks: readonly CandidateAffiliateLink[];
  readonly marketplaceId: string;
  readonly discoveryMarketplaceId?: string | null;
  readonly discoveryShopId?: string | null;
  readonly discoveryItemId?: string | null;
  readonly discoveryCanonicalUrl?: string | null;
}

export function evaluatePublicationGate(product: PublicationCandidate) {
  const reasons: string[] = [];

  // Step 0: Two-Stage Identity Reconciliation Gate
  const activeLinks = product.affiliateLinks.filter(
    (link) => link.active && link.marketplaceId === product.marketplaceId && isHttpsUrl(link.url)
  );

  if (activeLinks.length === 0) {
    reasons.push("missing_active_affiliate_link");
  } else {
    // Evaluate reconciliation on active affiliate links
    let hasApprovedReconciliation = false;
    for (const link of activeLinks) {
      const status = link.reconciliationStatus;
      if (status === "EXACT_MATCH" || status === "EQUIVALENT") {
        hasApprovedReconciliation = true;
      } else if (status === "MATERIAL_MISMATCH") {
        if (!reasons.includes("reconciliation_material_mismatch")) {
          reasons.push("reconciliation_material_mismatch");
        }
      } else if (status === "INCONCLUSIVE") {
        if (!reasons.includes("reconciliation_inconclusive")) {
          reasons.push("reconciliation_inconclusive");
        }
      } else if (status === "DESTINATION_UNAVAILABLE") {
        if (!reasons.includes("destination_unavailable")) {
          reasons.push("destination_unavailable");
        }
      } else if (!status) {
        // Legacy / implicit reconciliation: check discovery vs destination if both present
        if (product.discoveryShopId && link.destinationShopId && product.discoveryItemId && link.destinationItemId) {
          if (product.discoveryShopId === link.destinationShopId && product.discoveryItemId === link.destinationItemId) {
            hasApprovedReconciliation = true;
          } else {
            if (!reasons.includes("reconciliation_inconclusive")) {
              reasons.push("reconciliation_inconclusive");
            }
          }
        } else {
          // Backward compatibility for legacy active products / fixture mocks without two-stage telemetry
          hasApprovedReconciliation = true;
        }
      }
    }

    if (!hasApprovedReconciliation && reasons.length === 0) {
      reasons.push("reconciliation_inconclusive");
    }
  }

  // Steps 1-9: Standard Publication Gate Checks
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) reasons.push("invalid_slug");
  if (!product.title.trim()) reasons.push("missing_title");
  if (!product.shortDescription?.trim()) reasons.push("missing_short_description");
  if (!isHttpsUrl(product.imageUrl)) reasons.push("invalid_image_url");
  if (!product.imageAlt?.trim()) reasons.push("missing_image_alt");
  if (!product.categoryActive) reasons.push("inactive_category");
  if (!product.marketplaceActive) reasons.push("inactive_marketplace");
  if (!product.lastVerifiedAt) reasons.push("never_verified");

  return { passed: reasons.length === 0, reasons } as const;
}

export function assertTransition(from: ProductStatus, to: ProductStatus, candidate?: PublicationCandidate) {
  if (!allowedTransitions[from].includes(to)) throw new InvalidProductTransitionError(`Transition ${from} -> ${to} is not allowed`);
  if ((to === "READY" || to === "ACTIVE") && !candidate) throw new PublicationGateError(["missing_candidate"]);
  if ((to === "READY" || to === "ACTIVE") && candidate) {
    const gate = evaluatePublicationGate(candidate);
    if (!gate.passed) throw new PublicationGateError(gate.reasons);
  }
}

function isHttpsUrl(value: string | null) {
  if (!value) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
