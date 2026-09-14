export interface EditorialContent {
  intro: string;
  guidance: string;
}

export const CATEGORY_EDITORIAL: Readonly<Record<string, EditorialContent>> = {
  organizacao: {
    intro: "Ideias para reduzir a bagunça e tornar os espaços mais simples de usar.",
    guidance: "Comece pelos pontos que acumulam objetos no dia a dia e escolha soluções compatíveis com o espaço disponível.",
  },
  cozinha: {
    intro: "Utensílios e apoios escolhidos para deixar preparo, serviço e armazenamento mais práticos.",
    guidance: "Priorize itens que resolvam uma tarefa recorrente e que sejam fáceis de limpar e guardar.",
  },
  "casa-utilidades": {
    intro: "Utilidades para pequenos ajustes de conforto e praticidade nos ambientes da casa.",
    guidance: "Observe medidas, materiais e o uso pretendido antes de decidir se um item combina com a sua rotina.",
  },
  "ferramentas-manutencao": {
    intro: "Ferramentas essenciais para medições, montagens e cuidados domésticos de baixa complexidade.",
    guidance: "Escolha a ferramenta adequada para cada tarefa e siga sempre as orientações de segurança do fabricante.",
  },
};

export const COLLECTION_EDITORIAL = {
  achados: "Uma seleção enxuta de produtos que se destacam pela utilidade e clareza das informações disponíveis.",
  "ate-30": "Compare os preços de referência mais recentes e confirme o valor atual no marketplace antes de comprar.",
  "ate-50": "Opções reunidas pelo preço observado, com foco em usos cotidianos e escolhas conscientes.",
  novidades: "Itens publicados mais recentemente no catálogo, apresentados sem promessa de desconto ou disponibilidade.",
} as const;
