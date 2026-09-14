import { CollectionPage } from "@/catalog/public-pages";
import { publicMetadata } from "@/seo/metadata";
import { COLLECTION_EDITORIAL } from "@/seo/editorial";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata({ title: "Até R$30 | Garimora", description: "Achados cujo preço de referência mais recente é de até R$ 30.", pathname: "/ate-30" });
export default function Page() { return <CollectionPage eyebrow="Cabe no bolso" title="Até R$ 30" description="Achados cujo preço de referência mais recente é de até R$ 30." editorial={COLLECTION_EDITORIAL["ate-30"]} pathname="/ate-30" query={{ maxPrice: 30, limit: 24 }} source="PRICE_BUCKET"/>; }
