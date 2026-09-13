import { describe, expect, it } from "vitest";
import { searchPublicCatalog, transitionProduct } from "@/catalog/use-cases";
import type { ProductStatus, PublicationCandidate } from "@/catalog/domain";
import type { CatalogListQuery, CatalogRepository, PublicProduct } from "@/catalog/repository";

class MemoryCatalogRepository implements CatalogRepository {
  status: ProductStatus = "DRAFT";
  lastQuery: CatalogListQuery | null = null;
  candidate: PublicationCandidate = {
    slug: "item-ficticio", title: "Item fictício", shortDescription: "Descrição fictícia", imageUrl: "https://images.example/item.jpg",
    imageAlt: "Item fictício", lastVerifiedAt: new Date(), categoryActive: true, marketplaceActive: true, marketplaceId: "m1",
    affiliateLinks: [{ active: true, url: "https://affiliate.example/item", marketplaceId: "m1" }],
  };
  async listPublic(query: CatalogListQuery): Promise<readonly PublicProduct[]> { this.lastQuery = query; return []; }
  async findPublicBySlug(): Promise<PublicProduct | null> { return null; }
  async getPublicationCandidate() { return { ...this.candidate, status: this.status }; }
  async updateStatus(_id: string, expected: ProductStatus, next: ProductStatus) { if (expected !== this.status) return false; this.status = next; return true; }
}

describe("Catalog use cases integrated with repository boundary", () => {
  it("normalizes and bounds public catalog filters", async () => {
    const repository = new MemoryCatalogRepository();
    await searchPublicCatalog(repository, { search: "  caixa  ", categorySlug: " Organização ", tagSlugs: ["compacto", "compacto", ""], limit: 999, offset: -2 });
    expect(repository.lastQuery).toEqual({ search: "caixa", categorySlug: "organização", tagSlugs: ["compacto"], featured: undefined, limit: 100, offset: 0 });
  });
  it("moves a publishable product through DRAFT to READY", async () => {
    const repository = new MemoryCatalogRepository();
    await expect(transitionProduct(repository, "p1", "READY")).resolves.toMatchObject({ status: "READY" });
    expect(repository.status).toBe("READY");
  });
  it("detects concurrent lifecycle updates", async () => {
    const repository = new MemoryCatalogRepository();
    repository.updateStatus = async () => false;
    await expect(transitionProduct(repository, "p1", "READY")).rejects.toThrow("concurrently");
  });
});
