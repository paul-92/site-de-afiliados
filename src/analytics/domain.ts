export const PAGE_TYPES = ["HOME", "CATEGORY", "PRODUCT", "SEARCH", "FEATURED", "PRICE_BUCKET", "NEWEST", "OTHER"] as const;
export const TRAFFIC_SOURCES = ["ORGANIC_SEARCH", "INSTAGRAM", "TIKTOK", "PINTEREST", "PAID", "DIRECT", "REFERRAL", "OTHER"] as const;
export type PageType = (typeof PAGE_TYPES)[number];
export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];
export interface PageViewInput { pageType: PageType; pageKey: string | null; trafficSource: TrafficSource; trafficMedium: string | null; campaign: string | null; occurredAt: Date }

const PII = /(?:@|\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b|\b(?:email|cpf|phone|telefone|nome|name)=)/i;
export function sanitizeDimension(value: unknown, max = 80) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._ -]/g, "").replace(/\s+/g, "-").slice(0, max);
  return normalized && !PII.test(value) ? normalized : null;
}
export function pageFromPath(path: unknown): { pageType: PageType; pageKey: string | null } {
  if (typeof path !== "string" || path.includes("?") || path.includes("#")) return { pageType: "OTHER", pageKey: null };
  if (path === "/") return { pageType: "HOME", pageKey: null };
  const keyed = path.match(/^\/(categoria|produto)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
  if (keyed) return { pageType: keyed[1] === "categoria" ? "CATEGORY" : "PRODUCT", pageKey: sanitizeDimension(keyed[2], 160) };
  if (path === "/buscar") return { pageType: "SEARCH", pageKey: null };
  if (path === "/achados") return { pageType: "FEATURED", pageKey: null };
  if (path === "/novidades") return { pageType: "NEWEST", pageKey: null };
  if (path === "/ate-30" || path === "/ate-50") return { pageType: "PRICE_BUCKET", pageKey: path.slice(1) };
  return { pageType: "OTHER", pageKey: null };
}
export function normalizeTraffic(referrer: unknown, origin: unknown, utmSource: unknown, utmMedium: unknown): TrafficSource {
  const source = sanitizeDimension(utmSource);
  const medium = sanitizeDimension(utmMedium);
  if (medium && /^(cpc|ppc|paid|paid-social|display)$/.test(medium)) return "PAID";
  if (source?.includes("instagram")) return "INSTAGRAM";
  if (source?.includes("tiktok")) return "TIKTOK";
  if (source?.includes("pinterest")) return "PINTEREST";
  if (source && /^(google|bing|duckduckgo|yahoo)$/.test(source)) return "ORGANIC_SEARCH";
  if (!referrer || typeof referrer !== "string") return "DIRECT";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (typeof origin === "string" && new URL(origin).hostname === host) return "DIRECT";
    if (/google|bing|duckduckgo|yahoo/.test(host)) return "ORGANIC_SEARCH";
    if (host.includes("instagram")) return "INSTAGRAM";
    if (host.includes("tiktok")) return "TIKTOK";
    if (host.includes("pinterest")) return "PINTEREST";
    return "REFERRAL";
  } catch { return "OTHER"; }
}
export function validatePageView(raw: Record<string, unknown>, now = new Date()): PageViewInput | null {
  const page = pageFromPath(raw.path);
  if (page.pageType === "OTHER") return null;
  return { ...page, trafficSource: normalizeTraffic(raw.referrer, raw.origin, raw.utmSource, raw.utmMedium), trafficMedium: sanitizeDimension(raw.utmMedium, 40), campaign: sanitizeDimension(raw.campaign, 80), occurredAt: now };
}
