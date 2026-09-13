import { notFound } from "next/navigation";
import { PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { getPublicCategory, searchPublicCatalog } from "@/catalog/use-cases";
import { PageIntro } from "@/catalog/public-pages";

export const dynamic = "force-dynamic";
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pagina?: string }> }) {
  const [{ slug }, filters] = await Promise.all([params, searchParams]);
  if (!process.env.DATABASE_URL) return <PageIntro eyebrow="Categoria" title="Catálogo indisponível" description="Tente novamente em instantes."/>;
  const page = Math.max(1, Math.min(1000, Number.parseInt(filters.pagina ?? "1", 10) || 1));
  const result = await withCatalogRepository(async (repository) => ({ category: await getPublicCategory(repository, slug), products: await searchPublicCatalog(repository, { categorySlug: slug, limit: 24, offset: (page - 1) * 24 }) }));
  if (!result.category) notFound();
  return <><PageIntro eyebrow="Categoria" title={result.category.name} description={result.category.description ?? "Produtos selecionados para facilitar sua rotina."}/><ProductGrid products={result.products} source="CATEGORY" emptyMessage="Ainda não encontramos um achado nessa categoria."/><nav className="pagination" aria-label="Paginação">{page > 1 ? <a className="button secondary" href={`?pagina=${page - 1}`}>Página anterior</a> : <span/>}{result.products.length === 24 ? <a className="button secondary" href={`?pagina=${page + 1}`}>Próxima página</a> : null}</nav><PriceDisclosure/></>;
}
