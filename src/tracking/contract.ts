export const TRACKING_ROUTE = "/go/[productSlug]" as const;

export function trackingContract(productSlug: string) {
  return { route: TRACKING_ROUTE, productSlug, resolvesDestinationServerSide: true, redirectImplemented: false } as const;
}
