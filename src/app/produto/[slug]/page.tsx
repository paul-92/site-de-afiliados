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
  try { product = await withPublicCatalogRepository((repository) => getPublicProduct(repository, slug)); }
  catch { return <CatalogUnavailable/>; }
  if (!product) notFound();
  const trail = [{ name: "Garimora", pathname: "/" }, { name: product.category.name, pathname: `/categoria/${product.category.slug}` }, { name: product.title, pathname: `/produto/${product.slug}` }];
  return <><JsonLdScript data={breadcrumbJsonLd(trail)}/><JsonLdScript data={productJsonLd(product)}/><Breadcrumbs items={[{ name: "Garimora", href: "/" }, { name: product.category.name, href: `/categoria/${product.category.slug}` }, { name: product.title }]}/><article className="product-detail">
    <div className="product-media"><img src={product.imageUrl} alt={product.imageAlt} width="800" height="600"/></div>
    <div className="product-info"><p className="eyebrow"><Link href={`/categoria/${product.category.slug}`}>{product.category.name}</Link> · {product.marketplace.name}</p><h1>{product.title}</h1><p className="lead">{product.shortDescription}</p>
      {product.latestPrice ? <p className="detail-price">{formatPrice(product.latestPrice.amount, product.latestPrice.currency)}<sup>*</sup></p> : <p className="muted">Consulte o preço na loja</p>}
      {product.editorialNote ? <section className="editorial-note" aria-labelledby="nota-editorial"><h2 id="nota-editorial">Por que garimamos</h2><p>{product.editorialNote}</p></section> : null}
      <ul className="tag-list" aria-label="Tags">{product.tags.map((tag) => <li key={tag.slug}>{tag.name}</li>)}</ul>
      {product.lastVerifiedAt ? <p className="muted">Informações verificadas em {new Intl.DateTimeFormat("pt-BR").format(product.lastVerifiedAt)}.</p> : null}
      <a className="button offer-button" href={offerHref(product.slug, "PRODUCT")}>Ver oferta no {product.marketplace.name}</a><p className="affiliate-note">Este é um link de afiliado. A Garimora pode receber uma comissão, sem custo adicional para você.</p><PriceDisclosure/>
    </div>
  </article></>;
}
