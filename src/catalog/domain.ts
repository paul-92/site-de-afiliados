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

export interface PublicationCandidate {
  slug: string;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  lastVerifiedAt: Date | null;
  categoryActive: boolean;
  marketplaceActive: boolean;
  affiliateLinks: readonly { active: boolean; url: string; marketplaceId: string }[];
  marketplaceId: string;
}

export function evaluatePublicationGate(product: PublicationCandidate) {
  const reasons: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) reasons.push("invalid_slug");
  if (!product.title.trim()) reasons.push("missing_title");
  if (!product.shortDescription?.trim()) reasons.push("missing_short_description");
  if (!isHttpsUrl(product.imageUrl)) reasons.push("invalid_image_url");
  if (!product.imageAlt?.trim()) reasons.push("missing_image_alt");
  if (!product.categoryActive) reasons.push("inactive_category");
  if (!product.marketplaceActive) reasons.push("inactive_marketplace");
  if (!product.lastVerifiedAt) reasons.push("never_verified");
  if (!product.affiliateLinks.some((link) => link.active && link.marketplaceId === product.marketplaceId && isHttpsUrl(link.url))) reasons.push("missing_active_affiliate_link");
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
