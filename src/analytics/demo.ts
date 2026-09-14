import type { AnalyticsSnapshot } from "./repository";
interface Env { NODE_ENV?: string; GARIMORA_ANALYTICS_DEMO?: string; DATABASE_URL?: string }
export function demoAnalyticsIsEnabled(env: Env = process.env) { return env.NODE_ENV === "development" && env.GARIMORA_ANALYTICS_DEMO !== "0" && !env.DATABASE_URL; }
export function demoAnalytics(days: 7 | 30 | 90): AnalyticsSnapshot {
  const scale = days / 30; const trend = Array.from({ length: Math.min(days, 30) }, (_, i) => ({ date: new Date(Date.UTC(2026, 8, 14 - i)).toISOString().slice(0, 10), views: 90 + (i % 5) * 13, clicks: 11 + (i % 4) * 3 })).reverse();
  return { pageViews: Math.round(3260 * scale), affiliateClicks: Math.round(418 * scale), activeProducts: 20, productsWithClicks: 14, products: [{ label: "Organizador giratório compacto", value: 82 }, { label: "Kit de ferramentas essencial", value: 69 }], categories: [{ label: "Organização", value: 144 }, { label: "Cozinha", value: 108 }], trafficSources: [{ label: "ORGANIC_SEARCH", value: 1210 }, { label: "INSTAGRAM", value: 806 }, { label: "DIRECT", value: 714 }], sourcePages: [{ label: "HOME", value: 171 }, { label: "CATEGORY", value: 104 }], pageTypes: [{ label: "PRODUCT", value: 1402 }, { label: "HOME", value: 907 }], trend };
}
