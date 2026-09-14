/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { listPublicCategories, searchPublicCatalog } from "@/catalog/use-cases";
import { homeMetadata } from "@/seo/metadata";
import { JsonLdScript, itemListJsonLd, websiteJsonLd } from "@/seo/structured-data";

export const dynamic = "force-dynamic";
export const metadata = homeMetadata();
export default async function HomePage() {
  let data;
  try { data = await withPublicCatalogRepository(async (repository) => ({
    featured: await searchPublicCatalog(repository, { featured: true, limit: 4 }), under30: await searchPublicCatalog(repository, { maxPrice: 30, limit: 4 }),
    under50: await searchPublicCatalog(repository, { maxPrice: 50, limit: 4 }), newest: await searchPublicCatalog(repository, { order: "NEWEST", limit: 4 }), categories: await listPublicCategories(repository),
  })); } catch { return <><Hero/><CatalogUnavailable/></>; }
  return <><JsonLdScript data={websiteJsonLd()}/><JsonLdScript data={itemListJsonLd("Achados da Garimora", "/", data.featured)}/><Hero/>
    <CatalogSection eyebrow="Achados da semana" title="Uma seleção pequena. Boas descobertas." href="/achados"><ProductGrid products={data.featured} source="FEATURED"/></CatalogSection>
    <section className="section" id="categorias"><div className="section-heading"><div><p className="eyebrow">Explore por categoria</p><h2>Encontre seu próximo achado</h2></div></div><div className="category-grid">{data.categories.map((category, index) => <Link className={`category-card category-${index + 1}`} href={`/categoria/${category.slug}`} key={category.slug}><span className="category-number">0{index + 1}</span><strong>{category.name}</strong><span>{category.description ?? "Descubra nossa seleção."}</span><b aria-hidden="true">→</b></Link>)}</div></section>
    <CatalogSection eyebrow="Pequenos preços, boas ideias" title="Até R$ 30" href="/ate-30"><ProductGrid products={data.under30} source="PRICE_BUCKET"/></CatalogSection>
    <CatalogSection eyebrow="Escolhas acessíveis" title="Até R$ 50" href="/ate-50"><ProductGrid products={data.under50} source="PRICE_BUCKET"/></CatalogSection>
    <CatalogSection eyebrow="Acabaram de chegar" title="Novidades" href="/novidades"><ProductGrid products={data.newest} source="NEWEST"/></CatalogSection>
    <section className="editorial"><p className="eyebrow">Escolhas da Garimora</p><h2>Garimpar bem é escolher com intenção.</h2><p>Em vez de um catálogo infinito, reunimos uma seleção enxuta de itens úteis, com informação clara e preço tratado como referência.</p><Link className="button secondary" href="/achados">Conhecer a curadoria</Link></section><PriceDisclosure/>
  </>;
}
function Hero() { return <section className="hero"><div className="hero-copy"><p className="eyebrow">Curadoria para a vida real</p><h1>Achados que valem a pena.</h1><p>Produtos úteis, preços interessantes e escolhas garimpadas para facilitar sua vida.</p><form className="hero-search" action="/buscar" role="search"><label className="sr-only" htmlFor="hero-search">Buscar no catálogo</label><input id="hero-search" name="q" maxLength={120} placeholder="O que você está procurando?"/><button type="submit">Buscar</button></form><div className="hero-actions"><Link className="button" href="/achados">Explorar achados <span aria-hidden="true">→</span></Link><Link className="text-link" href="#categorias">Ver categorias</Link></div></div><div className="hero-visual"><img src="/demo/garimora-curadoria.png" alt="Seleção editorial de itens para organização, cozinha e manutenção" width="720" height="540"/><span className="hero-stamp">curadoria<br/><strong>Garimora</strong></span></div></section>; }
function CatalogSection({ eyebrow, title, href, children }: { eyebrow: string; title: string; href: string; children: React.ReactNode }) { return <section className="section"><div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><Link className="text-link" href={href}>Ver todos <span aria-hidden="true">→</span></Link></div>{children}</section>; }
