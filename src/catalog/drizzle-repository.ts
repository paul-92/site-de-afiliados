import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import type { createDatabase } from "@/db/client";
import { affiliateLinks, categories, marketplaces, priceObservations, products, productTags, tags } from "@/db/schema";
import type { ProductStatus } from "./domain";
import type { CatalogListQuery, CatalogRepository, PublicProduct } from "./repository";

type Database = ReturnType<typeof createDatabase>["db"];

export class DrizzleCatalogRepository implements CatalogRepository {
  constructor(private readonly db: Database) {}

  async listPublic(query: CatalogListQuery) {
    const conditions: SQL[] = [
      eq(products.status, "ACTIVE"),
      eq(categories.active, true),
      eq(marketplaces.active, true),
      sql`exists (select 1 from ${affiliateLinks} al where al.product_id = ${products.id} and al.active = true)`,
    ];
    if (query.search) conditions.push(or(
      ilike(products.title, `%${query.search}%`),
      ilike(products.shortDescription, `%${query.search}%`),
      ilike(categories.name, `%${query.search}%`),
      sql`exists (select 1 from ${productTags} join ${tags} on ${tags.id} = ${productTags.tagId} where ${productTags.productId} = ${products.id} and ${tags.name} ilike ${`%${query.search}%`})`,
    )!);
    if (query.categorySlug) conditions.push(eq(categories.slug, query.categorySlug));
    if (query.featured !== undefined) conditions.push(eq(products.featured, query.featured));
    if (query.maxPrice !== undefined) conditions.push(sql`(select po.amount from ${priceObservations} po where po.product_id = ${products.id} order by po.observed_at desc limit 1) <= ${query.maxPrice}`);
    if (query.tagSlugs?.length) conditions.push(sql`exists (select 1 from ${productTags} join ${tags} on ${tags.id} = ${productTags.tagId} where ${productTags.productId} = ${products.id} and ${inArray(tags.slug, [...query.tagSlugs])})`);

    const rows = await this.db.select({
      id: products.id, slug: products.slug, title: products.title,
      shortDescription: products.shortDescription, editorialNote: products.editorialNote, imageUrl: products.imageUrl, imageAlt: products.imageAlt,
      featured: products.featured, categorySlug: categories.slug, categoryName: categories.name,
      marketplaceSlug: marketplaces.slug, marketplaceName: marketplaces.name,
      lastVerifiedAt: products.lastVerifiedAt, createdAt: products.createdAt,
    }).from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(marketplaces, eq(products.marketplaceId, marketplaces.id))
      .where(and(...conditions)).orderBy(...(query.order === "NEWEST" ? [desc(products.createdAt), asc(products.title)] : [desc(products.featured), asc(products.title)]))
      .limit(query.limit ?? 24).offset(query.offset ?? 0);

    return Promise.all(rows.map((row) => this.hydratePublicProduct(row)));
  }

  async findPublicBySlug(slug: string) {
    const [row] = await this.db.select({
      id: products.id, slug: products.slug, title: products.title,
      shortDescription: products.shortDescription, editorialNote: products.editorialNote, imageUrl: products.imageUrl, imageAlt: products.imageAlt,
      featured: products.featured, categorySlug: categories.slug, categoryName: categories.name,
      marketplaceSlug: marketplaces.slug, marketplaceName: marketplaces.name,
      lastVerifiedAt: products.lastVerifiedAt, createdAt: products.createdAt,
    }).from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(marketplaces, eq(products.marketplaceId, marketplaces.id))
      .where(and(eq(products.slug, slug), eq(products.status, "ACTIVE"), eq(categories.active, true), eq(marketplaces.active, true), sql`exists (select 1 from ${affiliateLinks} al where al.product_id = ${products.id} and al.active = true)`))
      .limit(1);
    return row ? this.hydratePublicProduct(row) : null;
  }

  async listPublicCategories() {
    return this.db.select({ slug: categories.slug, name: categories.name, description: categories.description })
      .from(categories).where(eq(categories.active, true)).orderBy(asc(categories.sortOrder), asc(categories.name));
  }

  async findPublicCategory(slug: string) {
    const [category] = await this.db.select({ slug: categories.slug, name: categories.name, description: categories.description })
      .from(categories).where(and(eq(categories.slug, slug), eq(categories.active, true))).limit(1);
    return category ?? null;
  }

  async getPublicationCandidate(productId: string) {
    const [row] = await this.db.select({
      status: products.status, slug: products.slug, title: products.title,
      shortDescription: products.shortDescription, imageUrl: products.imageUrl, imageAlt: products.imageAlt,
      lastVerifiedAt: products.lastVerifiedAt, marketplaceId: products.marketplaceId,
      categoryActive: categories.active, marketplaceActive: marketplaces.active,
      discoveryMarketplaceId: products.discoveryMarketplaceId,
      discoveryShopId: products.discoveryShopId,
      discoveryItemId: products.discoveryItemId,
      discoveryCanonicalUrl: products.discoveryCanonicalUrl,
    }).from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(marketplaces, eq(products.marketplaceId, marketplaces.id))
      .where(eq(products.id, productId)).limit(1);
    if (!row) return null;
    const links = await this.db.select({
      active: affiliateLinks.active,
      url: affiliateLinks.url,
      marketplaceId: affiliateLinks.marketplaceId,
      reconciliationStatus: affiliateLinks.reconciliationStatus,
      linkOrigin: affiliateLinks.linkOrigin,
      destinationShopId: affiliateLinks.destinationShopId,
      destinationItemId: affiliateLinks.destinationItemId,
      destinationCanonicalUrl: affiliateLinks.destinationCanonicalUrl,
    })
      .from(affiliateLinks).where(eq(affiliateLinks.productId, productId));
    return { ...row, status: row.status as ProductStatus, affiliateLinks: links };
  }

  async updateStatus(productId: string, expected: ProductStatus, next: ProductStatus) {
    const rows = await this.db.update(products).set({ status: next, updatedAt: new Date() })
      .where(and(eq(products.id, productId), eq(products.status, expected))).returning({ id: products.id });
    return rows.length === 1;
  }

  private async hydratePublicProduct(row: {
    id: string; slug: string; title: string; shortDescription: string | null; editorialNote: string | null; imageUrl: string | null;
    imageAlt: string | null; featured: boolean; categorySlug: string; categoryName: string;
    marketplaceSlug: string; marketplaceName: string;
    lastVerifiedAt: Date | null; createdAt: Date;
  }): Promise<PublicProduct> {
    const [tagRows, priceRows] = await Promise.all([
      this.db.select({ slug: tags.slug, name: tags.name }).from(productTags).innerJoin(tags, eq(productTags.tagId, tags.id)).where(eq(productTags.productId, row.id)).orderBy(asc(tags.name)),
      this.db.select({ amount: priceObservations.amount, currency: priceObservations.currency, observedAt: priceObservations.observedAt }).from(priceObservations).where(eq(priceObservations.productId, row.id)).orderBy(desc(priceObservations.observedAt)).limit(1),
    ]);
    return {
      id: row.id, slug: row.slug, title: row.title,
      shortDescription: row.shortDescription!, editorialNote: row.editorialNote, imageUrl: row.imageUrl!, imageAlt: row.imageAlt!, featured: row.featured,
      category: { slug: row.categorySlug, name: row.categoryName },
      marketplace: { slug: row.marketplaceSlug, name: row.marketplaceName }, tags: tagRows, latestPrice: priceRows[0] ?? null,
      lastVerifiedAt: row.lastVerifiedAt, createdAt: row.createdAt,
    };
  }
}

export async function withCatalogRepository<T>(work: (repository: CatalogRepository) => Promise<T>) {
  const { createDatabase } = await import("@/db/client");
  const { db, close } = createDatabase();
  try { return await work(new DrizzleCatalogRepository(db)); } finally { await close(); }
}

export async function withPublicCatalogRepository<T>(work: (repository: CatalogRepository) => Promise<T>) {
  const { demoIsEnabled, DemoCatalogRepository } = await import("./demo");
  if (demoIsEnabled()) return work(new DemoCatalogRepository());
  if (!process.env.DATABASE_URL) throw new Error("PUBLIC_CATALOG_NOT_CONFIGURED");
  return withCatalogRepository(work);
}
