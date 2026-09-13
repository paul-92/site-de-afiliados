import { CollectionPage } from "@/catalog/public-pages";
export const dynamic = "force-dynamic";
export default function Page() { return <CollectionPage eyebrow="Boas escolhas" title="Até R$ 50" description="Achados cujo preço de referência mais recente é de até R$ 50." query={{ maxPrice: 50, limit: 24 }} source="PRICE_BUCKET"/>; }
