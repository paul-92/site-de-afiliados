import type { ProductStatus, PublicationCandidate } from "./domain";

export interface CatalogListQuery {
  search?: string;
  categorySlug?: string;
  tagSlugs?: readonly string[];
  featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface PublicProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  category: { slug: string; name: string };
  marketplace: { slug: string; name: string };
  tags: readonly { slug: string; name: string }[];
  latestPrice: { amount: string; currency: string; observedAt: Date } | null;
}

export interface CatalogRepository {
  listPublic(query: CatalogListQuery): Promise<readonly PublicProduct[]>;
  findPublicBySlug(slug: string): Promise<PublicProduct | null>;
  getPublicationCandidate(productId: string): Promise<(PublicationCandidate & { status: ProductStatus }) | null>;
  updateStatus(productId: string, expected: ProductStatus, next: ProductStatus): Promise<boolean>;
}
