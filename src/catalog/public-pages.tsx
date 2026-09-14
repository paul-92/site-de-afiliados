import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "./components";
import { withPublicCatalogRepository } from "./drizzle-repository";
import { searchPublicCatalog } from "./use-cases";
import type { CatalogListQuery } from "./repository";
import type { SourcePage } from "@/tracking/contract";

export async function CollectionPage({ eyebrow, title, description, query, source }: { eyebrow: string; title: string; description: string; query: CatalogListQuery; source: SourcePage }) {
  let products;
  try { products = await withPublicCatalogRepository((repository) => searchPublicCatalog(repository, query)); }
  catch { return <><PageIntro eyebrow={eyebrow} title={title} description={description}/><CatalogUnavailable/></>; }
  return <><PageIntro eyebrow={eyebrow} title={title} description={description}/><ProductGrid products={products} source={source}/><PriceDisclosure/></>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
