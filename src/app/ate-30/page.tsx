import { CollectionPage } from "@/catalog/public-pages";
export const dynamic = "force-dynamic";
export default function Page() { return <CollectionPage eyebrow="Cabe no bolso" title="Até R$ 30" description="Achados cujo preço de referência mais recente é de até R$ 30." query={{ maxPrice: 30, limit: 24 }} source="PRICE_BUCKET"/>; }
