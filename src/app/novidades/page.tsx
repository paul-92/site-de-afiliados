import { CollectionPage } from "@/catalog/public-pages";
export const dynamic = "force-dynamic";
export default function Page() { return <CollectionPage eyebrow="Recém-chegados" title="Novidades" description="Os produtos publicáveis mais recentemente criados no catálogo." query={{ order: "NEWEST", limit: 24 }} source="NEWEST"/>; }
