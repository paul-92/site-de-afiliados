import { describe, expect, it } from "vitest";
import { demoIsEnabled, DEMO_PRODUCTS, DemoCatalogRepository } from "@/catalog/demo";
import { searchPublicCatalog } from "@/catalog/use-cases";

describe("local development catalog", () => {
  it("is technically disabled in production regardless of configuration", () => {
    expect(demoIsEnabled({ NODE_ENV: "production", GARIMORA_DEMO: "1" })).toBe(false);
    expect(demoIsEnabled({ NODE_ENV: "production" })).toBe(false);
  });

  it("starts automatically only in development without a database", () => {
    expect(demoIsEnabled({ NODE_ENV: "development" })).toBe(true);
    expect(demoIsEnabled({ NODE_ENV: "development", DATABASE_URL: "postgresql://configured" })).toBe(false);
    expect(demoIsEnabled({ NODE_ENV: "development", GARIMORA_DEMO: "0" })).toBe(false);
    expect(demoIsEnabled({ NODE_ENV: "test" })).toBe(false);
  });

  it("provides 20 fictitious eligible products across all four categories", () => {
    expect(DEMO_PRODUCTS).toHaveLength(20);
    expect(new Set(DEMO_PRODUCTS.map((product) => product.category.slug))).toEqual(new Set(["organizacao", "cozinha", "casa-utilidades", "ferramentas-manutencao"]));
    expect(DEMO_PRODUCTS.every((product) => product.latestPrice && product.imageUrl.startsWith("/demo/"))).toBe(true);
  });

  it("supports featured, price buckets, newest, category and search contracts", async () => {
    const repository = new DemoCatalogRepository();
    expect(await searchPublicCatalog(repository, { featured: true })).not.toHaveLength(0);
    expect((await searchPublicCatalog(repository, { maxPrice: 30 })).every((p) => Number(p.latestPrice?.amount) <= 30)).toBe(true);
    expect(await searchPublicCatalog(repository, { categorySlug: "ferramentas-manutencao" })).toHaveLength(5);
    expect((await searchPublicCatalog(repository, { search: "ferramentas" })).length).toBeGreaterThan(0);
    const newest = await searchPublicCatalog(repository, { order: "NEWEST" });
    expect(newest[0].createdAt.getTime()).toBeGreaterThan(newest[1].createdAt.getTime());
  });
});
