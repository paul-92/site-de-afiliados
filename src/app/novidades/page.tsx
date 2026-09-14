import { CollectionPage } from "@/catalog/public-pages";
import { publicMetadata } from "@/seo/metadata";
import { COLLECTION_EDITORIAL } from "@/seo/editorial";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata({ title: "Novidades | Garimora", description: "Os produtos publicáveis mais recentemente criados no catálogo Garimora.", pathname: "/novidades" });
export default function Page() { return <CollectionPage eyebrow="Recém-chegados" title="Novidades" description="Os produtos publicáveis mais recentemente criados no catálogo." editorial={COLLECTION_EDITORIAL.novidades} pathname="/novidades" query={{ order: "NEWEST", limit: 24 }} source="NEWEST"/>; }
