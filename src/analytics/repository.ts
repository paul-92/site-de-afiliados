import type { PageViewInput } from "./domain";
export interface AnalyticsRepository {
  appendPageView(event: PageViewInput): Promise<void>;
  snapshot(days: 7 | 30 | 90): Promise<AnalyticsSnapshot>;
  purgeBefore(cutoff: Date): Promise<number>;
}
export interface RankedItem { label: string; value: number }
export interface TrendPoint { date: string; views: number; clicks: number }
export interface AnalyticsSnapshot {
  pageViews: number; affiliateClicks: number; activeProducts: number; productsWithClicks: number;
  products: RankedItem[]; categories: RankedItem[]; trafficSources: RankedItem[]; sourcePages: RankedItem[]; pageTypes: RankedItem[]; trend: TrendPoint[];
}
