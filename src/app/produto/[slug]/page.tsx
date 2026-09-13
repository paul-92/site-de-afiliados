import { notFound } from "next/navigation";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { getPublicProduct } from "@/catalog/use-cases";

export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!process.env.DATABASE_URL) return <section className="card"><h1>Catálogo indisponível</h1><p>Configure o banco local para consultar produtos.</p></section>;
  const product = await withCatalogRepository((repository) => getPublicProduct(repository, slug));
  if (!product) notFound();
  return <article className="card"><p className="eyebrow">{product.category.name} · {product.marketplace.name}</p><h1>{product.title}</h1><p>{product.shortDescription}</p><p>{product.tags.map((tag) => `#${tag.name}`).join(" ")}</p><p><a href={`/go/${product.slug}`}>Ver oferta</a></p></article>;
}
