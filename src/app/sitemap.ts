import type { MetadataRoute } from "next";
import type { PublicCategory, PublicProduct } from "@/catalog/repository";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { listPublicCategories, searchPublicCatalog } from "@/catalog/use-cases";
import { absolutePublicUrl } from "@/seo/config";
import { productIsAllowedInSeo } from "@/seo/safety";

export const dynamic = "force-dynamic";

const STATIC_PATHS = ["/", "/achados", "/ate-30", "/ate-50", "/novidades"] as const;

export function buildSitemapEntries(categories: readonly PublicCategory[], products: readonly PublicProduct[]): MetadataRoute.Sitemap {
  const entries = [
    ...STATIC_PATHS.map((pathname) => ({ pathname, changeFrequency: pathname === "/" ? "daily" as const : "weekly" as const, priority: pathname === "/" ? 1 : 0.7 })),
    ...categories.map((category) => ({ pathname: `/categoria/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.filter((product) => productIsAllowedInSeo(product)).map((product) => ({ pathname: `/produto/${product.slug}`, lastModified: product.lastVerifiedAt ?? product.createdAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
  return entries.flatMap(({ pathname, ...entry }) => {
    const url = absolutePublicUrl(pathname);
    return url ? [{ url, ...entry }] : [];
  });
}

async function allPublicProducts() {
  return withPublicCatalogRepository(async (repository) => {
    const products: PublicProduct[] = [];
    for (let offset = 0; offset < 5000; offset += 100) {
      const page = [...await searchPublicCatalog(repository, { limit: 100, offset })];
      products.push(...page);
      if (page.length < 100) break;
    }
    return products;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!absolutePublicUrl("/")) return [];
  try {
    const [categories, products] = await Promise.all([
      withPublicCatalogRepository((repository) => listPublicCategories(repository)),
      allPublicProducts(),
    ]);
    return buildSitemapEntries(categories, products);
  } catch {
    return [];
  }
}
