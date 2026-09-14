import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "./components";
import { withPublicCatalogRepository } from "./drizzle-repository";
import { searchPublicCatalog } from "./use-cases";
import type { CatalogListQuery } from "./repository";
import type { SourcePage } from "@/tracking/contract";
import { Breadcrumbs } from "@/seo/components";
import { JsonLdScript, breadcrumbJsonLd, itemListJsonLd } from "@/seo/structured-data";

export async function CollectionPage({ eyebrow, title, description, editorial, pathname, query, source }: { eyebrow: string; title: string; description: string; editorial: string; pathname: string; query: CatalogListQuery; source: SourcePage }) {
  let products;
  try { products = await withPublicCatalogRepository((repository) => searchPublicCatalog(repository, query)); }
  catch { return <><PageIntro eyebrow={eyebrow} title={title} description={description}/><CatalogUnavailable/></>; }
  const trail = [{ name: "Garimora", pathname: "/" }, { name: title, pathname }];
  return <><JsonLdScript data={breadcrumbJsonLd(trail)}/><JsonLdScript data={itemListJsonLd(title, pathname, products)}/><Breadcrumbs items={[{ name: "Garimora", href: "/" }, { name: title }]}/><PageIntro eyebrow={eyebrow} title={title} description={description}/><section className="seo-editorial" aria-label={`Guia editorial: ${title}`}><p>{editorial}</p></section><ProductGrid products={products} source={source}/><PriceDisclosure/></>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
