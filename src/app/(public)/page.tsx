import Link from "next/link";
import { CampaignBanner, HeroBanner } from "@/catalog/banners";
import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "@/catalog/components";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { listPublicCategories, searchPublicCatalog } from "@/catalog/use-cases";
import { homeMetadata } from "@/seo/metadata";
import { JsonLdScript, itemListJsonLd, websiteJsonLd } from "@/seo/structured-data";

export const dynamic = "force-dynamic";
export const metadata = homeMetadata();

export default async function HomePage() {
  let data;
  try {
    data = await withPublicCatalogRepository(async (repository) => {
      const [allProducts, featured, under30, under50, newest, categories] = await Promise.all([
        searchPublicCatalog(repository, { limit: 24 }),
        searchPublicCatalog(repository, { featured: true, limit: 8 }),
        searchPublicCatalog(repository, { maxPrice: 30, limit: 8 }),
        searchPublicCatalog(repository, { maxPrice: 50, limit: 8 }),
        searchPublicCatalog(repository, { order: "NEWEST", limit: 8 }),
        listPublicCategories(repository),
      ]);
      const shopeeProducts = allProducts.filter((p) => p.marketplace.slug === "shopee");
      return { allProducts, featured, under30, under50, newest, categories, shopeeProducts };
    });
  } catch {
    return (
      <>
        <HeroBanner
          badge="Curadoria para a vida real"
          title="Achados que valem a pena."
          lead="Produtos úteis, preços interessantes e escolhas garimpadas para facilitar sua vida."
          primaryCtaText="Explorar achados"
          primaryCtaHref="/achados"
          secondaryCtaText="Ver categorias"
          secondaryCtaHref="#categorias"
        />
        <CatalogUnavailable />
      </>
    );
  }

  return (
    <>
      <JsonLdScript data={websiteJsonLd()} />
      <JsonLdScript data={itemListJsonLd("Achados da Garimora", "/", data.featured)} />

      <HeroBanner
        badge="Curadoria para a vida real"
        title="Achados que valem a pena."
        lead="Produtos úteis, preços observados e escolhas garimpadas para facilitar sua rotina."
        primaryCtaText="Explorar achados"
        primaryCtaHref="/achados"
        secondaryCtaText="Ver categorias"
        secondaryCtaHref="#categorias"
      />

      <section className="section" id="categorias" aria-labelledby="heading-categorias">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore por departamento</p>
            <h2 id="heading-categorias">Categorias em destaque</h2>
          </div>
        </div>
        <div className="categories-strip">
          {data.categories.map((category, index) => (
            <Link
              className="category-bubble"
              href={`/categoria/${category.slug}`}
              key={category.slug}
              aria-label={`Ver produtos da categoria ${category.name}`}
            >
              <div className="category-bubble-icon" aria-hidden="true">
                0{index + 1}
              </div>
              <strong>{category.name}</strong>
              <span>{category.description ?? "Ver seleção"}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção Editorial Shopee: Curadoria de Oportunidades no marketplace Shopee */}
      <section className="section" id="achados-shopee" aria-labelledby="heading-shopee">
        <div className="shopee-section-header">
          <div className="shopee-section-title-wrap">
            <span className="shopee-badge-tag">Curadoria no Marketplace</span>
            <h2 id="heading-shopee">Achados da Shopee</h2>
            <p className="shopee-editorial-note">
              Seleção editorial de produtos práticos encontrados na Shopee. Apresentamos o preço de referência observado
              com total transparência de afiliação.
            </p>
          </div>
          <Link className="text-link" href="/achados">
            Ver curadoria completa <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ProductGrid
          products={data.shopeeProducts.length ? data.shopeeProducts : data.featured}
          source="FEATURED"
          emptyMessage="Estamos garimpando novos achados neste marketplace."
        />
      </section>

      <CatalogSection
        eyebrow="Curadoria editorial"
        title="Achados da semana"
        href="/achados"
        description="Uma seleção criteriosa dos melhores produtos garimpados recentemente."
      >
        <ProductGrid products={data.featured} source="FEATURED" />
      </CatalogSection>

      <CampaignBanner
        tag="Faixas Acessíveis"
        title="Ideias práticas até R$ 30 e R$ 50"
        description="Soluções inteligentes para casa, cozinha e organização que cabem no seu orçamento diário."
        ctaText="Ver produtos até R$ 30"
        ctaHref="/ate-30"
      />

      <CatalogSection
        eyebrow="Pequenos preços, boas ideias"
        title="Até R$ 30"
        href="/ate-30"
        description="Achados funcionais com preço de referência até R$ 30."
      >
        <ProductGrid products={data.under30} source="PRICE_BUCKET" />
      </CatalogSection>

      <CatalogSection
        eyebrow="Escolhas acessíveis"
        title="Até R$ 50"
        href="/ate-50"
        description="Seleção com excelente custo-benefício até R$ 50."
      >
        <ProductGrid products={data.under50} source="PRICE_BUCKET" />
      </CatalogSection>

      <CatalogSection
        eyebrow="Recém-adicionados"
        title="Novidades"
        href="/novidades"
        description="Os itens mais recentes adicionados ao nosso catálogo de curadoria."
      >
        <ProductGrid products={data.newest} source="NEWEST" />
      </CatalogSection>

      <section className="editorial" aria-labelledby="heading-editorial">
        <p className="eyebrow">Compromisso Garimora</p>
        <h2 id="heading-editorial">Garimpar bem é escolher com intenção.</h2>
        <p>
          Em vez de um feed caótico ou um catálogo infinito com milhares de itens duplicados, reunimos uma seleção
          enxuta e honesta de itens úteis, com fotos claras e preço tratado como referência observada.
        </p>
        <Link className="button secondary" href="/achados">
          Conhecer nossa curadoria
        </Link>
      </section>

      <PriceDisclosure />
    </>
  );
}

function CatalogSection({
  eyebrow,
  title,
  href,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="section-subtitle">{description}</p> : null}
        </div>
        <Link className="text-link" href={href}>
          Ver todos <span aria-hidden="true">→</span>
        </Link>
      </div>
      {children}
    </section>
  );
}
