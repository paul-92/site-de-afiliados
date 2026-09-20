/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogUnavailable, formatPrice, offerHref, PriceDisclosure } from "@/catalog/components";
import { withPublicCatalogRepository } from "@/catalog/drizzle-repository";
import { getPublicProduct } from "@/catalog/use-cases";
import { Breadcrumbs } from "@/seo/components";
import { productMetadata, unavailableMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd, productJsonLd } from "@/seo/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await withPublicCatalogRepository((repository) => getPublicProduct(repository, slug));
    return product ? productMetadata(product) : unavailableMetadata("Produto não encontrado | Garimora");
  } catch {
    return unavailableMetadata("Produto indisponível | Garimora");
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product;
  try {
    product = await withPublicCatalogRepository((repository) => getPublicProduct(repository, slug));
  } catch {
    return <CatalogUnavailable />;
  }
  if (!product) notFound();

  const isShopee = product.marketplace.slug === "shopee";
  const trail = [
    { name: "Garimora", pathname: "/" },
    { name: product.category.name, pathname: `/categoria/${product.category.slug}` },
    { name: product.title, pathname: `/produto/${product.slug}` },
  ];

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd(trail)} />
      <JsonLdScript data={productJsonLd(product)} />

      <Breadcrumbs
        items={[
          { name: "Garimora", href: "/" },
          { name: product.category.name, href: `/categoria/${product.category.slug}` },
          { name: product.title },
        ]}
      />

      <article className="product-detail-layout">
        <div className="product-media-panel">
          <div className="product-media-card">
            <img
              src={product.imageUrl}
              alt={product.imageAlt}
              width="800"
              height="800"
              loading="eager"
            />
          </div>
        </div>

        <div className="product-decision-panel">
          <div className="product-header-kicker">
            <Link className="pill" href={`/categoria/${product.category.slug}`}>
              {product.category.name}
            </Link>
            <span className={`card-badge badge-marketplace ${isShopee ? "badge-marketplace-shopee" : ""}`}>
              {product.marketplace.name}
            </span>
            {product.featured ? <span className="card-badge badge-curated">Achado Verificado</span> : null}
          </div>

          <h1>{product.title}</h1>
          <p className="lead">{product.shortDescription}</p>

          <div className="product-price-box">
            <span className="price-reference-label">Preço de referência observado:</span>
            {product.latestPrice ? (
              <p className="detail-price">
                {formatPrice(product.latestPrice.amount, product.latestPrice.currency)}
                <sup>*</sup>
              </p>
            ) : (
              <p className="muted">Consulte o valor na loja parceira</p>
            )}
          </div>

          {product.editorialNote ? (
            <section className="editorial-curation-box" aria-labelledby="nota-editorial">
              <h2 id="nota-editorial">Por que garimpamos</h2>
              <p>{product.editorialNote}</p>
            </section>
          ) : null}

          <ul className="tag-list" aria-label="Tags do produto">
            {product.tags.map((tag) => (
              <li key={tag.slug}>{tag.name}</li>
            ))}
          </ul>

          {product.lastVerifiedAt ? (
            <p className="muted">
              Informações verificadas pela curadoria em{" "}
              {new Intl.DateTimeFormat("pt-BR").format(product.lastVerifiedAt)}.
            </p>
          ) : null}

          <a className="product-cta-btn" href={offerHref(product.slug, "PRODUCT")}>
            Ver oferta no {product.marketplace.name} <span aria-hidden="true">→</span>
          </a>

          <p className="affiliate-note">
            Aviso de transparência: Este é um link de afiliado oficial. A Garimora pode receber uma comissão pela
            indicação quando uma compra for concretizada, sem nenhum acréscimo de valor para você.
          </p>

          <PriceDisclosure />
        </div>
      </article>
    </>
  );
}
