import { safeAffiliateDestination } from "@/tracking/domain";
import {
  evaluateIdentityReconciliation,
  type DiscoveredProductIdentity,
  type LinkOrigin,
  type MonetizableDestinationIdentity,
  type ReconciliationResult,
} from "./reconciliation";

export interface DestinationPreflightRequest {
  readonly affiliateUrl: string;
  readonly linkOrigin?: LinkOrigin;
  readonly discoveredIdentity: DiscoveredProductIdentity;
  readonly allowSimulatedResponse?: boolean;
}

export interface DestinationPreflightResponse {
  readonly preflightPassed: boolean;
  readonly isSafeDestination: boolean;
  readonly linkOrigin: LinkOrigin;
  readonly resolvedUrl: string | null;
  readonly destinationShopId: string | null;
  readonly destinationItemId: string | null;
  readonly destinationCanonicalUrl: string | null;
  readonly httpStatus: number | null;
  readonly reconciliation: ReconciliationResult;
}

export function parseShopeeUrlIdentifiers(urlStr: string): {
  shopId: string | null;
  itemId: string | null;
  canonicalUrl: string | null;
} {
  try {
    const url = new URL(urlStr);
    // Patterns supported:
    // /product/:shopId/:itemId
    // /opaanlp/:shopId/:itemId
    // i.:shopId.:itemId
    // /item/:shopId/:itemId
    const pathname = url.pathname;

    const productMatch = pathname.match(/\/(?:product|opaanlp|item)\/(\d+)\/(\d+)/i);
    if (productMatch) {
      const shopId = productMatch[1];
      const itemId = productMatch[2];
      return {
        shopId,
        itemId,
        canonicalUrl: `https://shopee.com.br/product/${shopId}/${itemId}`,
      };
    }

    const dotMatch = pathname.match(/-i\.(\d+)\.(\d+)/i);
    if (dotMatch) {
      const shopId = dotMatch[1];
      const itemId = dotMatch[2];
      return {
        shopId,
        itemId,
        canonicalUrl: `https://shopee.com.br/product/${shopId}/${itemId}`,
      };
    }

    return { shopId: null, itemId: null, canonicalUrl: null };
  } catch {
    return { shopId: null, itemId: null, canonicalUrl: null };
  }
}

export function isAllowedMarketplaceUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();
  return (
    hostname === "shopee.com.br" ||
    hostname === "s.shopee.com.br" ||
    hostname.endsWith(".shopee.com.br")
  );
}

export async function executeDestinationPreflight(
  request: DestinationPreflightRequest,
  fetchFn: typeof fetch = fetch
): Promise<DestinationPreflightResponse> {
  const linkOrigin: LinkOrigin = request.linkOrigin ?? "HUMAN_PROVIDED";
  const safeUrl = safeAffiliateDestination(request.affiliateUrl);

  // 1. Safety check
  if (!safeUrl || !isAllowedMarketplaceUrl(safeUrl)) {
    const syntheticDestination: MonetizableDestinationIdentity = {
      marketplaceId: request.discoveredIdentity.marketplaceId,
      destinationShopId: "",
      destinationItemId: "",
      destinationHttpCode: 400,
    };
    return {
      preflightPassed: false,
      isSafeDestination: false,
      linkOrigin,
      resolvedUrl: null,
      destinationShopId: null,
      destinationItemId: null,
      destinationCanonicalUrl: null,
      httpStatus: 400,
      reconciliation: evaluateIdentityReconciliation(
        request.discoveredIdentity,
        syntheticDestination
      ),
    };
  }

  // 2. HTTP Resolution
  try {
    const res = await fetchFn(request.affiliateUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "GarimoraPreflight/1.0 (+https://garimora.com.br)",
      },
    });

    const finalUrlStr = res.url || request.affiliateUrl;
    const { shopId, itemId, canonicalUrl } = parseShopeeUrlIdentifiers(finalUrlStr);

    const isAntiBot =
      finalUrlStr.includes("/verify/traffic") ||
      finalUrlStr.includes("/anti_bot") ||
      res.status === 403;

    const destinationIdentity: MonetizableDestinationIdentity = {
      marketplaceId: request.discoveredIdentity.marketplaceId,
      destinationShopId: shopId ?? "",
      destinationItemId: itemId ?? "",
      destinationCanonicalUrl: canonicalUrl,
      destinationHttpCode: res.status,
      isAntiBotOrBlocked: isAntiBot,
    };

    const reconciliation = evaluateIdentityReconciliation(
      request.discoveredIdentity,
      destinationIdentity
    );

    const preflightPassed =
      res.status === 200 &&
      !isAntiBot &&
      (reconciliation.status === "EXACT_MATCH" || reconciliation.status === "EQUIVALENT");

    return {
      preflightPassed,
      isSafeDestination: true,
      linkOrigin,
      resolvedUrl: finalUrlStr,
      destinationShopId: shopId,
      destinationItemId: itemId,
      destinationCanonicalUrl: canonicalUrl,
      httpStatus: res.status,
      reconciliation,
    };
  } catch {
    const syntheticDestination: MonetizableDestinationIdentity = {
      marketplaceId: request.discoveredIdentity.marketplaceId,
      destinationShopId: "",
      destinationItemId: "",
      destinationHttpCode: 0,
    };
    return {
      preflightPassed: false,
      isSafeDestination: true,
      linkOrigin,
      resolvedUrl: null,
      destinationShopId: null,
      destinationItemId: null,
      destinationCanonicalUrl: null,
      httpStatus: 0,
      reconciliation: evaluateIdentityReconciliation(
        request.discoveredIdentity,
        syntheticDestination
      ),
    };
  }
}
