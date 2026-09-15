import { sql } from "drizzle-orm";
import type { createDatabase } from "@/db/client";
import { pageViews } from "@/db/schema";
import type { PageViewInput } from "./domain";
import type { AnalyticsRepository, AnalyticsSnapshot, RankedItem, TrendPoint } from "./repository";
import { withDatabaseDeadline } from "@/db/client";
import { withRuntimeTiming } from "@/lib/runtime-timing";
type Database = ReturnType<typeof createDatabase>["db"]; type Row = Record<string, unknown>; const number = (v: unknown) => Number(v ?? 0);
export const ANALYTICS_SNAPSHOT_TIMEOUT_MS = 30_000;
export class DrizzleAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly db: Database) {}
  async appendPageView(event: PageViewInput) { await this.db.insert(pageViews).values(event); }
  async purgeBefore(cutoff: Date) { const rows = await this.db.delete(pageViews).where(sql`${pageViews.occurredAt} < ${cutoff}`).returning({ id: pageViews.id }); return rows.length; }
  async snapshot(days: 7 | 30 | 90): Promise<AnalyticsSnapshot> {
    return withRuntimeTiming("QUERY", "analytics-snapshot", () => withDatabaseDeadline(this.snapshotSequentially(days), ANALYTICS_SNAPSHOT_TIMEOUT_MS));
  }
  private async snapshotSequentially(days: 7 | 30 | 90): Promise<AnalyticsSnapshot> {
    const interval = sql.raw(`interval '${days} days'`);
    const rows = (operation: string, query: ReturnType<typeof sql>) => withRuntimeTiming("QUERY", operation, async () => Array.from(await this.db.execute(query)) as Row[]);
    const rank = async (operation: string, query: ReturnType<typeof sql>): Promise<RankedItem[]> => (await rows(operation, query)).map((r) => ({ label: String(r.label ?? "UNKNOWN"), value: number(r.value) }));
    const [views] = await rows("analytics-page-views", sql`select count(*) value from page_views where occurred_at >= now() - ${interval}`);
    const [clicks] = await rows("analytics-affiliate-clicks", sql`select count(*) value from click_events where occurred_at >= now() - ${interval}`);
    const [active] = await rows("analytics-active-products", sql`select count(*) value from products where status = 'ACTIVE'`);
    const [clicked] = await rows("analytics-products-with-clicks", sql`select count(distinct product_id) value from click_events where occurred_at >= now() - ${interval}`);
    const productsRank = await rank("analytics-products-ranking", sql`select p.title label, count(*) value from click_events c join products p on p.id=c.product_id where c.occurred_at >= now() - ${interval} group by p.id,p.title order by value desc limit 10`);
    const categoriesRank = await rank("analytics-categories-ranking", sql`select coalesce(cat.name,'Sem categoria') label, count(*) value from click_events c left join categories cat on cat.id=c.category_id where c.occurred_at >= now() - ${interval} group by cat.id,cat.name order by value desc limit 10`);
    const trafficSources = await rank("analytics-traffic-sources", sql`select traffic_source label, count(*) value from page_views where occurred_at >= now() - ${interval} group by traffic_source order by value desc`);
    const sourcePages = await rank("analytics-source-pages", sql`select source_page label, count(*) value from click_events where occurred_at >= now() - ${interval} group by source_page order by value desc`);
    const pageTypes = await rank("analytics-page-types", sql`select page_type label, count(*) value from page_views where occurred_at >= now() - ${interval} group by page_type order by value desc`);
    const viewTrend = await rows("analytics-page-view-trend", sql`select to_char(date_trunc('day',occurred_at),'YYYY-MM-DD') date, count(*) value from page_views where occurred_at >= now() - ${interval} group by 1 order by 1`);
    const clickTrend = await rows("analytics-click-trend", sql`select to_char(date_trunc('day',occurred_at),'YYYY-MM-DD') date, count(*) value from click_events where occurred_at >= now() - ${interval} group by 1 order by 1`);
    const dates = new Map<string, TrendPoint>(); for (const r of viewTrend) dates.set(String(r.date), { date: String(r.date), views: number(r.value), clicks: 0 }); for (const r of clickTrend) { const date=String(r.date), point=dates.get(date) ?? { date, views:0, clicks:0 }; point.clicks=number(r.value); dates.set(date,point); }
    return { pageViews:number(views?.value), affiliateClicks:number(clicks?.value), activeProducts:number(active?.value), productsWithClicks:number(clicked?.value), products:productsRank, categories:categoriesRank, trafficSources, sourcePages, pageTypes, trend:[...dates.values()].sort((a,b)=>a.date.localeCompare(b.date)) };
  }
}
export async function withAnalyticsRepository<T>(work:(repository:AnalyticsRepository)=>Promise<T>) { const { createDatabase }=await import("@/db/client"); const {db,close}=createDatabase(); try{return await work(new DrizzleAnalyticsRepository(db));}finally{await close();} }
