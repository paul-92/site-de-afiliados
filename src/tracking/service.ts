import { AFFILIATE_REDIRECT_STATUS } from "./contract";
import { classifyTraffic, normalizeProductSlug, safeAffiliateDestination } from "./domain";
import type { TrackingRepository } from "./repository";

export interface TrackingLogger { info(event: string, context: Record<string, unknown>): void; warn(event: string, context: Record<string, unknown>): void; error(event: string, context: Record<string, unknown>): void; }
const consoleLogger: TrackingLogger = { info: (event, context) => console.info(event, context), warn: (event, context) => console.warn(event, context), error: (event, context) => console.error(event, context) };

export async function resolveAffiliateRedirect(repository: TrackingRepository, request: Request, productSlug: string, logger: TrackingLogger = consoleLogger) {
  const slug = normalizeProductSlug(productSlug);
  if (!slug) { logger.warn("AFFILIATE_REDIRECT_DENIED", { reason: "INVALID_SLUG" }); return null; }
  let eligible;
  try { eligible = await repository.resolveEligibleDestination(slug); }
  catch { logger.error("AFFILIATE_REDIRECT_DENIED", { reason: "DESTINATION_LOOKUP_FAILED", productSlug: slug }); return null; }
  if (!eligible) { logger.warn("AFFILIATE_REDIRECT_DENIED", { reason: "INELIGIBLE", productSlug: slug }); return null; }
  const destination = safeAffiliateDestination(eligible.url);
  if (!destination) { logger.error("AFFILIATE_REDIRECT_DENIED", { reason: "UNSAFE_STORED_DESTINATION", productId: eligible.productId }); return null; }
  const traffic = classifyTraffic(request.url, request.headers.get("referer"));
  try {
    await repository.appendClickEvent({ productId: eligible.productId, affiliateLinkId: eligible.affiliateLinkId, marketplaceId: eligible.marketplaceId, categoryId: eligible.categoryId, ...traffic, occurredAt: new Date() });
    logger.info("AFFILIATE_CLICK_RECORDED", { productId: eligible.productId, sourcePage: traffic.sourcePage });
  } catch { logger.error("AFFILIATE_CLICK_WRITE_FAILED", { productId: eligible.productId }); }
  return { destination, status: AFFILIATE_REDIRECT_STATUS } as const;
}
