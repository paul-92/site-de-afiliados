import type { Metadata } from "next";
import { PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { searchPublicCatalog } from "@/catalog/use-cases";
import { PageIntro } from "@/catalog/public-pages";
import type { PublicProduct } from "@/catalog/repository";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Buscar | Garimora", description: "Busque no catálogo publicado da Garimora.", robots: { index: false, follow: true }, alternates: { canonical: "/buscar" } };
function safeQuery(value?: string) { return value?.trim().slice(0, 120) ?? ""; }
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = safeQuery((await searchParams).q);
  let products: PublicProduct[] = [];
  if (q) { try { products = [...await withPublicCatalogRepository((repository) => searchPublicCatalog(repository, { search: q, limit: 24 }))]; } catch { products = []; } }
  return <><PageIntro eyebrow="Encontre seu próximo achado" title="Buscar" description="Pesquise por nome ou descrição no catálogo publicado."/><form className="search-form" action="/buscar" role="search"><label htmlFor="catalog-search">O que você procura?</label><div><input id="catalog-search" name="q" maxLength={120} defaultValue={q} placeholder="Ex.: organizador, ferramenta..."/><button type="submit">Buscar</button></div></form>{q ? <section aria-labelledby="resultados"><h2 id="resultados">Resultados para “{q}”</h2><ProductGrid products={products} source="SEARCH" emptyMessage="Tente outro termo ou explore nossos achados."/><PriceDisclosure/></section> : <div className="empty" role="status"><p>Digite um termo para começar.</p></div>}</>;
}
