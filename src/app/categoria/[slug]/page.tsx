import { ProductGrid } from "@/catalog/components";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { searchPublicCatalog } from "@/catalog/use-cases";

export const dynamic = "force-dynamic";
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ q?: string; tag?: string }> }) {
  const [{ slug }, filters] = await Promise.all([params, searchParams]);
  const products = process.env.DATABASE_URL ? await withCatalogRepository((repository) => searchPublicCatalog(repository, { categorySlug: slug, search: filters.q, tagSlugs: filters.tag ? [filters.tag] : undefined })) : [];
  return <section><p className="eyebrow">Categoria</p><h1>{slug}</h1><ProductGrid products={products}/></section>;
}
