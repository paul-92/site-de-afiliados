import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { getPublicCategory, searchPublicCatalog } from "@/catalog/use-cases";
import { PageIntro } from "@/catalog/public-pages";
import { Breadcrumbs, EditorialSection } from "@/seo/components";
import { CATEGORY_EDITORIAL } from "@/seo/editorial";
import { categoryMetadata, unavailableMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd, categoryBreadcrumbs, itemListJsonLd } from "@/seo/structured-data";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await withPublicCatalogRepository((repository) => getPublicCategory(repository, slug));
    return category ? categoryMetadata(category) : unavailableMetadata("Categoria não encontrada | Garimora");
  } catch {
    return unavailableMetadata("Categoria indisponível | Garimora");
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pagina?: string }> }) {
  const [{ slug }, filters] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Math.min(1000, Number.parseInt(filters.pagina ?? "1", 10) || 1));
  let result;
  try { result = await withPublicCatalogRepository(async (repository) => ({ category: await getPublicCategory(repository, slug), products: await searchPublicCatalog(repository, { categorySlug: slug, limit: 24, offset: (page - 1) * 24 }) })); }
  catch { return <PageIntro eyebrow="Categoria" title="Catálogo indisponível" description="Tente novamente em instantes."/>; }
  if (!result.category) notFound();
  const trail = categoryBreadcrumbs(result.category);
  const editorial = CATEGORY_EDITORIAL[result.category.slug];
  return <><JsonLdScript data={breadcrumbJsonLd(trail)}/><JsonLdScript data={itemListJsonLd(result.category.name, `/categoria/${result.category.slug}`, result.products)}/><Breadcrumbs items={[{ name: "Garimora", href: "/" }, { name: result.category.name }]}/><PageIntro eyebrow="Categoria" title={result.category.name} description={result.category.description ?? "Produtos selecionados para facilitar sua rotina."}/>{editorial ? <EditorialSection content={editorial}/> : null}<ProductGrid products={result.products} source="CATEGORY" emptyMessage="Ainda não encontramos um achado nessa categoria."/><nav className="pagination" aria-label="Paginação">{page > 1 ? <a className="button secondary" href={`?pagina=${page - 1}`}>Página anterior</a> : <span/>}{result.products.length === 24 ? <a className="button secondary" href={`?pagina=${page + 1}`}>Próxima página</a> : null}</nav><PriceDisclosure/></>;
}
