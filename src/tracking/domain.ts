import type { ReferrerClass, SourcePage } from "./contract";

export function normalizeProductSlug(value: string) {
  const slug = value.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 160 ? slug : null;
}

export function safeAffiliateDestination(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return null;
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) return null;
    if (/^(?:127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1\]?$)/i.test(url.hostname)) return null;
    const private172 = url.hostname.match(/^172\.(\d{1,3})\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return null;
    return url;
  } catch { return null; }
}

export function classifyTraffic(requestUrl: string, referrer: string | null): { sourcePage: SourcePage; referrerClass: ReferrerClass } {
  if (!referrer) return { sourcePage: "DIRECT", referrerClass: "DIRECT" };
  try {
    const request = new URL(requestUrl);
    const source = new URL(referrer);
    if (request.origin !== source.origin) return { sourcePage: "EXTERNAL", referrerClass: "EXTERNAL" };
    const path = source.pathname;
    const sourcePage: SourcePage = path === "/" ? "HOME" : path.startsWith("/produto/") ? "PRODUCT" : path.startsWith("/categoria/") ? "CATEGORY" : source.searchParams.has("q") ? "SEARCH" : "OTHER_INTERNAL";
    return { sourcePage, referrerClass: "INTERNAL" };
  } catch { return { sourcePage: "DIRECT", referrerClass: "DIRECT" }; }
}
