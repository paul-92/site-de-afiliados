import { CatalogUnavailable, PriceDisclosure, ProductGrid } from "./components";
import { withCatalogRepository } from "./drizzle-repository";
import { searchPublicCatalog } from "./use-cases";
import type { CatalogListQuery } from "./repository";
import type { SourcePage } from "@/tracking/contract";

export async function CollectionPage({ eyebrow, title, description, query, source }: { eyebrow: string; title: string; description: string; query: CatalogListQuery; source: SourcePage }) {
  if (!process.env.DATABASE_URL) return <><PageIntro eyebrow={eyebrow} title={title} description={description}/><CatalogUnavailable/></>;
  const products = await withCatalogRepository((repository) => searchPublicCatalog(repository, query));
  return <><PageIntro eyebrow={eyebrow} title={title} description={description}/><ProductGrid products={products} source={source}/><PriceDisclosure/></>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}
