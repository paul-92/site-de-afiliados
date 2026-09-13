import { CollectionPage } from "@/catalog/public-pages";
export const dynamic = "force-dynamic";
export default function Page() { return <CollectionPage eyebrow="Seleção Garimora" title="Achados" description="Produtos úteis escolhidos para ganhar destaque na nossa curadoria." query={{ featured: true, limit: 24 }} source="FEATURED"/>; }
