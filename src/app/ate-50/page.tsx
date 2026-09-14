import { CollectionPage } from "@/catalog/public-pages";
import { publicMetadata } from "@/seo/metadata";
import { COLLECTION_EDITORIAL } from "@/seo/editorial";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata({ title: "Até R$50 | Garimora", description: "Achados cujo preço de referência mais recente é de até R$ 50.", pathname: "/ate-50" });
export default function Page() { return <CollectionPage eyebrow="Boas escolhas" title="Até R$ 50" description="Achados cujo preço de referência mais recente é de até R$ 50." editorial={COLLECTION_EDITORIAL["ate-50"]} pathname="/ate-50" query={{ maxPrice: 50, limit: 24 }} source="PRICE_BUCKET"/>; }
