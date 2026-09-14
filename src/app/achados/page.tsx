import { CollectionPage } from "@/catalog/public-pages";
import { publicMetadata } from "@/seo/metadata";
import { COLLECTION_EDITORIAL } from "@/seo/editorial";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata({ title: "Achados | Garimora", description: "Produtos úteis escolhidos para ganhar destaque na curadoria Garimora.", pathname: "/achados" });
export default function Page() { return <CollectionPage eyebrow="Seleção Garimora" title="Achados" description="Produtos úteis escolhidos para ganhar destaque na nossa curadoria." editorial={COLLECTION_EDITORIAL.achados} pathname="/achados" query={{ featured: true, limit: 24 }} source="FEATURED"/>; }
