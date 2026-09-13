import Link from "next/link";
import type { PublicProduct } from "./repository";

export function ProductGrid({ products }: { products: readonly PublicProduct[] }) {
  if (!products.length) return <p>Nenhum produto publicado corresponde aos filtros.</p>;
  return <div className="grid">{products.map((product) => <article className="card" key={product.id}>
    <p className="eyebrow">{product.category.name} · {product.marketplace.name}</p>
    <h2><Link href={`/produto/${product.slug}`}>{product.title}</Link></h2>
    <p>{product.shortDescription}</p>
    {product.latestPrice ? <p className="price">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: product.latestPrice.currency }).format(Number(product.latestPrice.amount))}</p> : null}
    <p>{product.tags.map((tag) => `#${tag.name}`).join(" ")}</p>
  </article>)}</div>;
}
