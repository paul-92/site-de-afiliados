import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import type { createDatabase } from "@/db/client";
import { affiliateLinks, categories, marketplaces, priceObservations, products, productTags, tags } from "@/db/schema";

type Database = ReturnType<typeof createDatabase>["db"];
export type ProductInput = typeof products.$inferInsert;

export class AdminRepository {
  constructor(private readonly db: Database) {}

  async dashboard() {
    const [[productCount], [activeCount], [categoryCount], [marketplaceCount]] = await Promise.all([
      this.db.select({ value: count() }).from(products),
      this.db.select({ value: count() }).from(products).where(eq(products.status, "ACTIVE")),
      this.db.select({ value: count() }).from(categories).where(eq(categories.active, true)),
      this.db.select({ value: count() }).from(marketplaces).where(eq(marketplaces.active, true)),
    ]);
    return { products: productCount.value, activeProducts: activeCount.value, activeCategories: categoryCount.value, activeMarketplaces: marketplaceCount.value };
  }

  async listProducts(query: { search?: string; status?: string; page: number; pageSize: number }) {
    const conditions = [];
    if (query.search) conditions.push(or(ilike(products.title, `%${query.search}%`), ilike(products.slug, `%${query.search}%`))!);
    if (query.status && ["DRAFT", "READY", "ACTIVE", "PAUSED", "ARCHIVED"].includes(query.status)) conditions.push(eq(products.status, query.status as typeof products.$inferSelect.status));
    const where = conditions.length ? and(...conditions) : undefined;
    const [rows, [total]] = await Promise.all([
      this.db.select({ id: products.id, slug: products.slug, title: products.title, status: products.status, updatedAt: products.updatedAt, category: categories.name, marketplace: marketplaces.name })
        .from(products).innerJoin(categories, eq(products.categoryId, categories.id)).innerJoin(marketplaces, eq(products.marketplaceId, marketplaces.id))
        .where(where).orderBy(desc(products.updatedAt)).limit(query.pageSize).offset((query.page - 1) * query.pageSize),
      this.db.select({ value: count() }).from(products).where(where),
    ]);
    return { rows, total: total.value };
  }

  references() {
    return Promise.all([
      this.db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
      this.db.select().from(tags).orderBy(asc(tags.name)),
      this.db.select().from(marketplaces).orderBy(asc(marketplaces.name)),
    ]).then(([categoryRows, tagRows, marketplaceRows]) => ({ categories: categoryRows, tags: tagRows, marketplaces: marketplaceRows }));
  }

  async product(id: string) {
    const [product] = await this.db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) return null;
    const [links, prices, assignedTags] = await Promise.all([
      this.db.select({ id: affiliateLinks.id, url: affiliateLinks.url, active: affiliateLinks.active, marketplaceId: affiliateLinks.marketplaceId, marketplaceName: marketplaces.name })
        .from(affiliateLinks).innerJoin(marketplaces, eq(affiliateLinks.marketplaceId, marketplaces.id)).where(eq(affiliateLinks.productId, id)).orderBy(desc(affiliateLinks.createdAt)),
      this.db.select().from(priceObservations).where(eq(priceObservations.productId, id)).orderBy(desc(priceObservations.observedAt)),
      this.db.select({ id: tags.id, name: tags.name }).from(productTags).innerJoin(tags, eq(productTags.tagId, tags.id)).where(eq(productTags.productId, id)),
    ]);
    return { ...product, links, prices, assignedTags };
  }

  createProduct(input: ProductInput) { return this.db.insert(products).values(input).returning({ id: products.id }); }
  updateProduct(id: string, input: Partial<ProductInput>) { return this.db.update(products).set({ ...input, updatedAt: new Date() }).where(eq(products.id, id)); }
  createCategory(input: typeof categories.$inferInsert) { return this.db.insert(categories).values(input); }
  createTag(input: typeof tags.$inferInsert) { return this.db.insert(tags).values(input); }
  createMarketplace(input: typeof marketplaces.$inferInsert) { return this.db.insert(marketplaces).values(input); }
  addAffiliateLink(input: typeof affiliateLinks.$inferInsert) { return this.db.insert(affiliateLinks).values(input); }
  setAffiliateLinkActive(id: string, active: boolean) { return this.db.update(affiliateLinks).set({ active, updatedAt: new Date() }).where(eq(affiliateLinks.id, id)); }
  addPrice(input: typeof priceObservations.$inferInsert) { return this.db.insert(priceObservations).values(input); }
  async replaceTags(productId: string, tagIds: string[]) {
    await this.db.transaction(async (tx) => {
      await tx.delete(productTags).where(eq(productTags.productId, productId));
      if (tagIds.length) await tx.insert(productTags).values(tagIds.map((tagId) => ({ productId, tagId })));
    });
  }
}

export async function withAdminRepository<T>(work: (repository: AdminRepository) => Promise<T>) {
  const { createDatabase } = await import("@/db/client");
  const { db, close } = createDatabase();
  try { return await work(new AdminRepository(db)); } finally { await close(); }
}
