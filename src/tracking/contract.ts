export const TRACKING_ROUTE = "/go/[productSlug]" as const;
export const AFFILIATE_REDIRECT_STATUS = 307 as const;
export const SOURCE_PAGES = ["HOME", "PRODUCT", "CATEGORY", "SEARCH", "FEATURED", "PRICE_BUCKET", "NEWEST", "OTHER_INTERNAL", "EXTERNAL", "DIRECT"] as const;
export const REFERRER_CLASSES = ["DIRECT", "INTERNAL", "EXTERNAL"] as const;

export type SourcePage = (typeof SOURCE_PAGES)[number];
export type ReferrerClass = (typeof REFERRER_CLASSES)[number];

export function trackingContract(productSlug: string) {
  return { route: TRACKING_ROUTE, productSlug, resolvesDestinationServerSide: true, redirectImplemented: true, redirectStatus: AFFILIATE_REDIRECT_STATUS } as const;
}
