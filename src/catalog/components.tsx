import Link from "next/link";
import type { PublicProduct } from "./repository";
import type { SourcePage } from "@/tracking/contract";

export function formatPrice(amount: string, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(amount));
}

export function offerHref(slug: string, source: SourcePage) {
  return `/go/${encodeURIComponent(slug)}?source=${source}`;
}

export function ProductCard({ product, source }: { product: PublicProduct; source: SourcePage }) {
  return <article className={`product-card product-card-${product.category.slug}`}>
    <Link className="image-frame" href={`/produto/${product.slug}`} aria-label={`Abrir ${product.title}`}>
      {/* Stored catalog images are editorially approved at the publication gate. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.imageUrl} alt={product.imageAlt} width="480" height="360" loading="lazy" />
    </Link>
    <div className="product-card-body">
      <div className="card-meta"><Link href={`/categoria/${product.category.slug}`}>{product.category.name}</Link>{product.featured ? <span className="pill">Achado</span> : null}</div>
      <h3><Link href={`/produto/${product.slug}`}>{product.title}</Link></h3>
      <p className="card-copy">{product.shortDescription}</p>
      {product.latestPrice ? <p className="price">{formatPrice(product.latestPrice.amount, product.latestPrice.currency)}<sup>*</sup></p> : <p className="muted">Consulte o preço na loja</p>}
      <div className="card-actions"><Link className="text-link" href={`/produto/${product.slug}`}>Detalhes</Link><a className="button" href={offerHref(product.slug, source)}>Ver oferta <span aria-hidden="true">→</span></a></div>
    </div>
  </article>;
}

export function ProductGrid({ products, source, emptyMessage = "Ainda não encontramos um achado aqui." }: { products: readonly PublicProduct[]; source: SourcePage; emptyMessage?: string }) {
  if (!products.length) return <div className="empty" role="status"><h2>Nenhum produto por enquanto</h2><p>{emptyMessage}</p><Link className="button secondary" href="/">Voltar à página inicial</Link></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard product={product} source={source} key={product.id}/>)}</div>;
}

export function PriceDisclosure() {
  return <p className="disclosure"><sup>*</sup> Preço de referência observado recentemente. O valor e a disponibilidade no marketplace podem mudar.</p>;
}

export function CatalogUnavailable() {
  return <div className="empty" role="status"><h2>Catálogo temporariamente indisponível</h2><p>Não foi possível carregar os achados agora. Tente novamente em instantes.</p></div>;
}
