import { and, desc, eq } from "drizzle-orm";
import type { createDatabase } from "@/db/client";
import { affiliateLinks, clickEvents, marketplaces, products } from "@/db/schema";
import type { ClickEventInput, TrackingRepository } from "./repository";

type Database = ReturnType<typeof createDatabase>["db"];
export class DrizzleTrackingRepository implements TrackingRepository {
  constructor(private readonly db: Database) {}
  async resolveEligibleDestination(productSlug: string) {
    const [row] = await this.db.select({ productId: products.id, affiliateLinkId: affiliateLinks.id, marketplaceId: marketplaces.id, categoryId: products.categoryId, url: affiliateLinks.url })
      .from(products).innerJoin(marketplaces, eq(products.marketplaceId, marketplaces.id))
      .innerJoin(affiliateLinks, and(eq(affiliateLinks.productId, products.id), eq(affiliateLinks.marketplaceId, marketplaces.id)))
      .where(and(eq(products.slug, productSlug), eq(products.status, "ACTIVE"), eq(marketplaces.active, true), eq(affiliateLinks.active, true)))
      .orderBy(desc(affiliateLinks.updatedAt), desc(affiliateLinks.id)).limit(1);
    return row ?? null;
  }
  async appendClickEvent(event: ClickEventInput) {
    await this.db.insert(clickEvents).values({ productId: event.productId, affiliateLinkId: event.affiliateLinkId, marketplaceId: event.marketplaceId, categoryId: event.categoryId, sourcePage: event.sourcePage, referrerClass: event.referrerClass, occurredAt: event.occurredAt });
  }
}
export async function withTrackingRepository<T>(work: (repository: TrackingRepository) => Promise<T>) {
  const { createDatabase } = await import("@/db/client");
  const { db, close } = createDatabase();
  try { return await work(new DrizzleTrackingRepository(db)); } finally { await close(); }
}
