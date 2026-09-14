import { assertTransition, type ProductStatus } from "./domain";
import type { CatalogListQuery, CatalogRepository } from "./repository";

export async function transitionProduct(repository: CatalogRepository, productId: string, next: ProductStatus) {
  const candidate = await repository.getPublicationCandidate(productId);
  if (!candidate) throw new Error("Product not found");
  assertTransition(candidate.status, next, candidate);
  const updated = await repository.updateStatus(productId, candidate.status, next);
  if (!updated) throw new Error("Product changed concurrently; retry the operation");
  return { id: productId, previousStatus: candidate.status, status: next };
}

export async function searchPublicCatalog(repository: CatalogRepository, query: CatalogListQuery) {
  const normalized = {
    search: query.search?.trim().slice(0, 120) || undefined,
    categorySlug: query.categorySlug?.trim().toLowerCase() || undefined,
    tagSlugs: [...new Set(query.tagSlugs?.map((tag) => tag.trim().toLowerCase()).filter(Boolean) ?? [])].slice(0, 10),
    featured: query.featured,
    maxPrice: query.maxPrice && query.maxPrice > 0 ? Math.min(query.maxPrice, 100000) : undefined,
    order: query.order ?? "DEFAULT",
    limit: Math.min(Math.max(query.limit ?? 24, 1), 100),
    offset: Math.max(query.offset ?? 0, 0),
  };
  return repository.listPublic(normalized);
}

export function listPublicCategories(repository: CatalogRepository) { return repository.listPublicCategories(); }
export async function getPublicCategory(repository: CatalogRepository, slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) || normalized.length > 120) return null;
  return repository.findPublicCategory(normalized);
}

export async function getPublicProduct(repository: CatalogRepository, slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) || normalized.length > 120) return null;
  return repository.findPublicBySlug(normalized);
}
