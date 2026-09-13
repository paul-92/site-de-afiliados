import type { ReferrerClass, SourcePage } from "./contract";

export interface EligibleAffiliateDestination { productId: string; affiliateLinkId: string; marketplaceId: string; categoryId: string | null; url: string; }
export interface ClickEventInput extends Omit<EligibleAffiliateDestination, "url"> { sourcePage: SourcePage; referrerClass: ReferrerClass; occurredAt: Date; }
export interface TrackingRepository {
  resolveEligibleDestination(productSlug: string): Promise<EligibleAffiliateDestination | null>;
  appendClickEvent(event: ClickEventInput): Promise<void>;
}
