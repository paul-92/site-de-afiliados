import type { ProductStatus, PublicationCandidate } from "./domain";

export interface CatalogListQuery {
  search?: string;
  categorySlug?: string;
  tagSlugs?: readonly string[];
  featured?: boolean;
  maxPrice?: number;
  order?: "DEFAULT" | "NEWEST";
  limit?: number;
  offset?: number;
}

export interface PublicProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  editorialNote: string | null;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  category: { slug: string; name: string };
  marketplace: { slug: string; name: string };
  tags: readonly { slug: string; name: string }[];
  latestPrice: { amount: string; currency: string; observedAt: Date } | null;
  lastVerifiedAt: Date | null;
  createdAt: Date;
}

export interface PublicCategory { slug: string; name: string; description: string | null }

export interface CatalogRepository {
  listPublic(query: CatalogListQuery): Promise<readonly PublicProduct[]>;
  findPublicBySlug(slug: string): Promise<PublicProduct | null>;
  listPublicCategories(): Promise<readonly PublicCategory[]>;
  findPublicCategory(slug: string): Promise<PublicCategory | null>;
  getPublicationCandidate(productId: string): Promise<(PublicationCandidate & { status: ProductStatus }) | null>;
  updateStatus(productId: string, expected: ProductStatus, next: ProductStatus): Promise<boolean>;
}
