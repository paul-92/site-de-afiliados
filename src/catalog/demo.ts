import type { CatalogListQuery, CatalogRepository, PublicCategory, PublicProduct } from "./repository";
import type { ProductStatus, PublicationCandidate } from "./domain";

interface RuntimeEnvironment { NODE_ENV?: string; DATABASE_URL?: string; GARIMORA_DEMO?: string }

export function demoIsEnabled(env: RuntimeEnvironment = process.env) {
  return env.NODE_ENV === "development" && !env.DATABASE_URL && env.GARIMORA_DEMO !== "0";
}

const categories: readonly PublicCategory[] = [
  { slug: "organizacao", name: "Organização", description: "Soluções simples para deixar cada coisa em seu lugar." },
  { slug: "cozinha", name: "Cozinha", description: "Utensílios práticos para uma rotina mais gostosa." },
  { slug: "casa-utilidades", name: "Casa & Utilidades", description: "Pequenos achados que fazem diferença no dia a dia." },
  { slug: "ferramentas-manutencao", name: "Ferramentas & Manutenção", description: "Essenciais compactos para cuidar da casa com autonomia." },
] as const;

const demoSpecs = [
  ["organizador-giratorio", "Organizador giratório compacto", "organizacao", "39.90", true, "Mantém itens pequenos visíveis e ao alcance."],
  ["caixa-dobrável", "Caixa dobrável de tecido", "organizacao", "27.90", true, "Organiza armários sem ocupar espaço quando não está em uso."],
  ["colmeia-modular", "Colmeia modular para gavetas", "organizacao", "19.90", false, "Separa peças pequenas e simplifica a rotina."],
  ["suporte-multiuso", "Suporte vertical multiuso", "organizacao", "46.50", false, "Aproveita melhor o espaço de bancadas e prateleiras."],
  ["cesto-tramado", "Cesto tramado com alças", "organizacao", "49.90", true, "Uma solução leve para mantas, brinquedos ou revistas."],
  ["porta-utensilios", "Porta-utensílios em cerâmica", "cozinha", "34.90", true, "Deixa as ferramentas de cozinha reunidas e bonitas na bancada."],
  ["tabua-compacta", "Tábua compacta com canaleta", "cozinha", "29.90", false, "Tamanho prático para preparos rápidos do dia a dia."],
  ["potes-empilhaveis", "Conjunto de potes empilháveis", "cozinha", "48.90", true, "Formato modular para aproveitar melhor a despensa."],
  ["escorredor-flexivel", "Escorredor flexível de pia", "cozinha", "24.50", false, "Apoio versátil que pode ser guardado enrolado."],
  ["colher-medidora", "Kit de colheres medidoras", "cozinha", "18.90", false, "Medidas essenciais reunidas em um conjunto compacto."],
  ["bandeja-apoio", "Bandeja de apoio minimalista", "casa-utilidades", "42.90", true, "Agrupa objetos cotidianos com uma aparência leve."],
  ["luminaria-portatil", "Luminária portátil de leitura", "casa-utilidades", "49.50", true, "Luz direcionada para cantos de leitura e tarefas rápidas."],
  ["protetor-porta", "Protetor de porta ajustável", "casa-utilidades", "16.90", false, "Ajuda a reduzir frestas de forma simples e discreta."],
  ["ganchos-adesivos", "Kit de ganchos adesivos", "casa-utilidades", "21.90", false, "Cria pontos de apoio sem complicar a instalação."],
  ["capa-almofada", "Capa de almofada texturizada", "casa-utilidades", "32.90", false, "Renova um canto da casa com textura e cor natural."],
  ["kit-ferramentas", "Kit de ferramentas essencial", "ferramentas-manutencao", "49.90", true, "O básico bem escolhido para pequenos ajustes domésticos."],
  ["trena-compacta", "Trena compacta emborrachada", "ferramentas-manutencao", "22.90", false, "Fácil de guardar e útil em medições do cotidiano."],
  ["chaves-precisao", "Jogo de chaves de precisão", "ferramentas-manutencao", "28.90", true, "Pontas variadas para pequenos reparos e montagens."],
  ["nivel-bolso", "Nível de bolso magnético", "ferramentas-manutencao", "26.50", false, "Ajuda em instalações rápidas sem ocupar a caixa inteira."],
  ["maleta-parafusos", "Maleta organizadora de peças", "ferramentas-manutencao", "44.90", false, "Divisórias transparentes para encontrar cada peça depressa."],
] as const;

export const DEMO_PRODUCTS: readonly PublicProduct[] = demoSpecs.map(([slug, title, categorySlug, amount, featured, description], index) => {
  const category = categories.find((item) => item.slug === categorySlug)!;
  return {
    id: `demo-${index + 1}`, slug, title, shortDescription: description,
    editorialNote: `Garimpamos este item fictício porque ele representa uma solução prática, compacta e fácil de incorporar à rotina.`,
    imageUrl: "/demo/garimora-curadoria.png", imageAlt: `${title} em composição editorial demonstrativa`, featured,
    category, marketplace: { slug: "loja-demo", name: "Loja demonstrativa" },
    tags: [{ slug: "pratico", name: "Prático" }, { slug: "casa", name: "Casa" }],
    latestPrice: { amount, currency: "BRL", observedAt: new Date(`2026-09-${String(13 - (index % 6)).padStart(2, "0")}T12:00:00Z`) },
    lastVerifiedAt: new Date("2026-09-13T12:00:00Z"), createdAt: new Date(Date.UTC(2026, 8, 13 - index, 12)),
  };
});

export class DemoCatalogRepository implements CatalogRepository {
  async listPublic(query: CatalogListQuery) {
    let items = [...DEMO_PRODUCTS];
    if (query.search) { const term = query.search.toLocaleLowerCase("pt-BR"); items = items.filter((p) => [p.title, p.shortDescription, p.category.name, ...p.tags.map((t) => t.name)].some((v) => v.toLocaleLowerCase("pt-BR").includes(term))); }
    if (query.categorySlug) items = items.filter((p) => p.category.slug === query.categorySlug);
    if (query.featured !== undefined) items = items.filter((p) => p.featured === query.featured);
    if (query.maxPrice !== undefined) items = items.filter((p) => p.latestPrice && Number(p.latestPrice.amount) <= query.maxPrice!);
    if (query.order === "NEWEST") items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return items.slice(query.offset ?? 0, (query.offset ?? 0) + (query.limit ?? 24));
  }
  async findPublicBySlug(slug: string) { return DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null; }
  async listPublicCategories() { return categories; }
  async findPublicCategory(slug: string) { return categories.find((c) => c.slug === slug) ?? null; }
  async getPublicationCandidate(): Promise<(PublicationCandidate & { status: ProductStatus }) | null> { return null; }
  async updateStatus() { return false; }
}
