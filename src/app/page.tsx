import { ProductGrid } from "@/catalog/components";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { searchPublicCatalog } from "@/catalog/use-cases";

export const dynamic = "force-dynamic";
export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string; featured?: string }> }) {
  const filters = await searchParams;
  const products = process.env.DATABASE_URL ? await withCatalogRepository((repository) => searchPublicCatalog(repository, {
    search: filters.q, tagSlugs: filters.tag ? [filters.tag] : undefined, featured: filters.featured === "true" ? true : undefined,
  })) : [];
  return <><section className="hero"><p className="eyebrow">Curadoria útil, publicação responsável</p><h1>Garimora</h1><p>Produtos publicados somente após validação editorial e comercial.</p>
    <form><input aria-label="Buscar produtos" name="q" defaultValue={filters.q} placeholder="Buscar no catálogo"/><button type="submit">Buscar</button></form>
  </section><ProductGrid products={products}/>{!process.env.DATABASE_URL ? <p className="notice">Configure o banco local para consultar o catálogo.</p> : null}</>;
}
