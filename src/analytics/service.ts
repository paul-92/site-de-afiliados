import type { AnalyticsRepository, AnalyticsSnapshot } from "./repository";
export const PAGE_VIEW_RETENTION_DAYS = 90;
export function ctr(clicks: number, eligibleViews: number) { return eligibleViews > 0 ? clicks / eligibleViews * 100 : 0; }
export function period(value: unknown): 7 | 30 | 90 { return value === "7" || value === "90" ? Number(value) as 7 | 90 : 30; }
export async function analyticsSnapshot(repo: AnalyticsRepository, days: 7 | 30 | 90) { return repo.snapshot(days); }
export async function enforcePageViewRetention(repo: AnalyticsRepository, now = new Date()) {
  return repo.purgeBefore(new Date(now.getTime() - PAGE_VIEW_RETENTION_DAYS * 86_400_000));
}
export function emptySnapshot(): AnalyticsSnapshot { return { pageViews: 0, affiliateClicks: 0, activeProducts: 0, productsWithClicks: 0, products: [], categories: [], trafficSources: [], sourcePages: [], pageTypes: [], trend: [] }; }
