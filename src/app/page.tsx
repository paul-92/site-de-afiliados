import Link from "next/link";
import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { listPublicCategories, searchPublicCatalog } from "@/catalog/use-cases";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!process.env.DATABASE_URL) return <><Hero/><CatalogUnavailable/></>;
  const data = await withCatalogRepository(async (repository) => ({
    featured: await searchPublicCatalog(repository, { featured: true, limit: 4 }),
    under30: await searchPublicCatalog(repository, { maxPrice: 30, limit: 4 }),
    under50: await searchPublicCatalog(repository, { maxPrice: 50, limit: 4 }),
    newest: await searchPublicCatalog(repository, { order: "NEWEST", limit: 4 }),
    categories: await listPublicCategories(repository),
  }));
  return <><Hero/>
    <CatalogSection title="Achados em destaque" href="/achados"><ProductGrid products={data.featured} source="FEATURED"/></CatalogSection>
    <section className="section" id="categorias"><div className="section-heading"><div><p className="eyebrow">Explore por ambiente</p><h2>Categorias</h2></div></div><div className="category-grid">{data.categories.map((category) => <Link className="category-card" href={`/categoria/${category.slug}`} key={category.slug}><strong>{category.name}</strong><span>{category.description ?? "Descubra nossa seleção."}</span></Link>)}</div></section>
    <CatalogSection title="Até R$ 30" href="/ate-30"><ProductGrid products={data.under30} source="PRICE_BUCKET"/></CatalogSection>
    <CatalogSection title="Até R$ 50" href="/ate-50"><ProductGrid products={data.under50} source="PRICE_BUCKET"/></CatalogSection>
    <CatalogSection title="Novidades" href="/novidades"><ProductGrid products={data.newest} source="NEWEST"/></CatalogSection>
    <section className="editorial"><p className="eyebrow">Seleção editorial</p><h2>Menos rolagem. Mais utilidade.</h2><p>A Garimora reúne produtos que passam por critérios de publicação, com informação clara e preço tratado como referência.</p><Link className="button secondary" href="/achados">Conhecer a curadoria</Link></section><PriceDisclosure/>
  </>;
}

function Hero() { return <section className="hero"><div><p className="eyebrow">Curadoria para a vida real</p><h1>Achados úteis que valem a pena conhecer.</h1><p>Descubra soluções práticas para casa, cozinha, organização e manutenção — sem catálogo infinito.</p><div className="hero-actions"><Link className="button" href="/achados">Ver achados</Link><Link className="text-link" href="/buscar">Buscar produto</Link></div></div><div className="hero-mark" aria-hidden="true"><span>garimados</span><strong>com critério</strong></div></section>; }
function CatalogSection({ title, href, children }: { title: string; href: string; children: React.ReactNode }) { return <section className="section"><div className="section-heading"><h2>{title}</h2><Link className="text-link" href={href}>Ver todos</Link></div>{children}</section>; }
