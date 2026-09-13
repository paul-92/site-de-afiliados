import { createDatabase } from "./client";
import { affiliateLinks, categories, marketplaces, priceObservations, products, productTags, tags } from "./schema";

const { db, close } = createDatabase();
const [marketplace] = await db.insert(marketplaces).values({ slug: "mercado-exemplo", name: "Mercado Exemplo" }).returning();
const [category] = await db.insert(categories).values({ slug: "organizacao", name: "Organização", description: "Categoria fictícia para desenvolvimento." }).returning();
await db.insert(categories).values([
  { slug: "cozinha", name: "Cozinha", sortOrder: 1 },
  { slug: "casa-utilidades", name: "Casa & Utilidades", sortOrder: 2 },
  { slug: "ferramentas-manutencao", name: "Ferramentas & Manutenção", sortOrder: 3 },
]);
const [tag] = await db.insert(tags).values({ slug: "compacto", name: "Compacto" }).returning();
const [product] = await db.insert(products).values({
  slug: "organizador-modular-exemplo", title: "Organizador Modular (exemplo)",
  shortDescription: "Produto inteiramente fictício para desenvolvimento.", editorialNote: "Conteúdo editorial fictício.",
  imageUrl: "https://images.example/organizador.jpg", imageAlt: "Ilustração fictícia de um organizador modular",
  status: "ACTIVE", featured: true, marketplaceId: marketplace.id, categoryId: category.id, lastVerifiedAt: new Date(),
}).returning();
await db.insert(productTags).values({ productId: product.id, tagId: tag.id });
await db.insert(affiliateLinks).values({ productId: product.id, marketplaceId: marketplace.id, url: "https://affiliate.example/produto-ficticio" });
await db.insert(priceObservations).values({ productId: product.id, marketplaceId: marketplace.id, amount: "129.90", currency: "BRL" });
await close();
