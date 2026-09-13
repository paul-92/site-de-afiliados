import { createDatabase } from "./client";
import { categories, marketplaces, products } from "./schema";

const { db, close } = createDatabase();
const [marketplace] = await db.insert(marketplaces).values({ slug: "marketplace-ficticio", name: "Marketplace fictício" }).returning();
const [category] = await db.insert(categories).values({ slug: "organizacao", name: "Organização" }).returning();
await db.insert(categories).values([{ slug: "cozinha", name: "Cozinha" }, { slug: "utilidades", name: "Utilidades" }]);
await db.insert(products).values([{ slug: "organizador-modular-exemplo", title: "Organizador Modular (exemplo)", shortDescription: "Produto inteiramente fictício para desenvolvimento.", marketplaceId: marketplace.id, categoryId: category.id }]);
await close();
