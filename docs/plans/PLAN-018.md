# PLAN-018 — Public Storefront UX/UI Redesign

**SPEC:** [SPEC-018](file:///c:/Users/Samsung/Desktop/Garimora/site-de-afiliados/docs/specs/SPEC-018.md)  
**Status:** G3 HUMAN ACCEPTED / IMPLEMENTATION COMPLETED & VERIFIED · READY FOR RELEASE (G4)  
**Baseline Git:** `d30828edc8a15887107a1981c4853ee0bb40b034` (Branch: `feature/spec-015-admin-cockpit-ux-ui`)  
**Target Environment:** Local workspace `c:\Users\Samsung\Desktop\Garimora\site-de-afiliados`

---

## 1. Arquivos a Alterar
- `src/app/globals.css`: Consolidação de estilos públicos, remoção de crops estáticos legados, adição de tokens de grid de marketplace (4 a 6 colunas desktop, 2 colunas mobile), header comercial, banners e página de produto.
- `src/app/(public)/layout.tsx`: Reestruturação do cabeçalho público (`site-header`) com barra de busca dominante, submenu departamental de navegação e atalhos rápidos.
- `src/catalog/components.tsx`: Redesign do `ProductCard` (proporção 1:1, badge Shopee, preço destacado, CTA `/go`) e `ProductGrid` (classes de grid fluido e densidade aprimorada).
- `src/app/(public)/page.tsx`: Reorganização da Home (Hero Banner, Categorias em bolhas/cards compactos, seção "Achados da Shopee", "Achados da semana", faixas de preço "Até R$30" / "Até R$50", novidades e bloco editorial Garimora).
- `src/app/(public)/produto/[slug]/page.tsx`: Redesign da página do produto (galeria limpa à esquerda, painel de compra e decisão à direita, bloco "Por que garimpamos", disclosure e CTA dominante).
- `src/catalog/public-pages.tsx`: Adaptação de `CollectionPage` e `PageIntro` com suporte a banners de coleção e cabeçalhos visuais mais limpos.
- `src/app/(public)/categoria/[slug]/page.tsx`: Modernização do cabeçalho de categoria com banner contextual.
- `src/app/(public)/buscar/page.tsx`: Ajuste visual para sincronizar com o novo Header e a nova densidade de grid.

---

## 2. Componentes a Criar
- `src/catalog/banners.tsx`:
  - `HeroBanner`: Banner principal com título, subtítulo e CTA semântico.
  - `CampaignBanner`: Faixas intermediárias entre seções na Home.
  - `CategoryBanner`: Cabeçalho ilustrado para categorias e coleções.
- `src/catalog/search-bar.tsx` (ou integrado em layout): Componente de busca com campo de texto acessível, botão com ícone de lupa e rotulagem para leitor de tela.
- `src/catalog/category-nav.tsx`: Submenu horizontal deslizável com lista de categorias ativas e coleções para navegação rápida desktop e mobile.

---

## 3. Componentes a Modificar
- `ProductCard`:
  - Eliminar crops manuais (`scale(1.14)`);
  - Adicionar badge visual do marketplace (`Shopee`);
  - Proporção 1:1 para a imagem com `object-fit: cover`;
  - Hierarquia de preço de referência com asterisco (`*`);
  - Botão de ação direta `"Ver oferta →"` mantendo rota `/go`.
- `ProductGrid`:
  - Atualização para grid responsivo de 4 a 6 colunas (desktop), 3 colunas (tablet) e 2 colunas uniformes (mobile);
  - Mensagens amigáveis de curadoria contínua para coleções sem produtos suficientes.
- `PublicLayout`:
  - Incorporar barra de pesquisa central no Header;
  - Adicionar barra secundária de navegação (categorias e coleções).

---

## 4. Componentes e Módulos a Preservar Estritamente
- `src/app/admin/*` e seletores CSS `.admin-*`: **Intocados** (zero regressão no Cockpit da SPEC-015).
- `src/seo/*` (`metadata.ts`, `structured-data.tsx`, `components.tsx`): **Intocados** (canônicos, robots, JSON-LD preservados 100%).
- `src/app/go/[productSlug]/route.ts`: **Intocado** (redirecionamento HTTP 307 com `no-store`).
- `src/tracking/*` e `src/analytics/*`: **Intocados** (telemetria ClickEvent assíncrona).
- `src/db/*` e `drizzle/*`: **Intocados** (zero migrations, zero alterações de banco).

---

## 5. Alterações CSS & Design System
- Criação de tokens CSS padronizados sob `:root`:
  - Cores: `--garimora-green: #176b4d`, `--garimora-orange: #dc6c2e`, `--garimora-cream: #f8f6f0`, `--garimora-white: #ffffff`, `--garimora-line: #e2e4dc`.
  - Spacing & Radius: `--radius-card: 12px`, `--radius-btn: 8px`, `--radius-banner: 16px`.
- Densidade do Grid:
  ```css
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.65rem;
    }
  }
  ```
- Remoção de CSS morto e desduplicação de declarações em `globals.css`.

---

## 6. Header Comercial & Busca Dominante
- **Estrutura:**
  - Linha 1: Marca Garimora com claim editorial + Barra de busca central com input `q` e botão de busca + Links de apoio.
  - Linha 2: Submenu de navegação contendo links rápidos para `Cozinha`, `Casa & Utilidades`, `Organização`, `Ferramentas & Manutenção`, `Achados da Shopee`, `Achados`, `Até R$30`, `Até R$50`, `Novidades`.
- **Comportamento Mobile:**
  - Header fixo com busca acessível diretamente no topo.
  - Submenu em linha única deslizável horizontalmente com toque (`overflow-x: auto`, `scrollbar-width: none`).

---

## 7. Arquitetura da Home Reorganizada
1. Header + Barra de Busca Dominante
2. Submenu de Navegação de Categorias & Coleções
3. Hero Banner: Curadoria Garimora ("Achados que valem a pena")
4. Grade de Categorias em Destaque (Cards compactos / bubbles)
5. **Seção "Achados da Shopee"** (Destaques da curadoria Shopee em grid denso)
6. Seção "Achados da Semana" (Curadoria geral)
7. Campaign Banner: "Ideias práticas até R$ 30 e R$ 50"
8. Seções por Faixa de Preço ("Até R$ 30" / "Até R$ 50")
9. Seção "Novidades"
10. Bloco Editorial Institucional Garimora ("A gente garimpa. Você escolhe.")
11. Disclosure Legal de Preços Observados
12. Footer com Links Legais

---

## 8. Sistema de Banners
- **Hero Banner:** Container responsivo com background suave na paleta Garimora, proporção 3:1 (desktop) e 16:9 (mobile). Textos em HTML semântico com foco em acessibilidade e zero CLS.
- **Campaign Banners:** Blocos horizontais estreitos com contraste equilibrado e botão de ação para coleções.
- **Category Banners:** Cabeçalhos temáticos padronizados para `/categoria/[slug]`.
- **Prevenção de CLS:** Dimensões intrínsecas e propriedades de `aspect-ratio` fixadas via CSS.

---

## 9. Seção Editorial Shopee ("Achados da Shopee")
- **Conceito & Semântica (Ajuste G1):** Representa CURADORIA E OPORTUNIDADE EDITORIAL no marketplace parceiro. Não faz alegações de desconto, preço "de/por" ou urgência artificial.
- **Filtragem de Dados:** Exibe produtos com `marketplace.slug === "shopee"`, ordenados por destaque (`featured = true`) ou novidade.
- **Exibição de Preço:** `"A partir de R$ 31,99*"` (preço observado de referência com indicador de nota legal).

---

## 10. ProductCard & ProductGrid
- `ProductCard`:
  - Proporção 1:1, eliminando cortes forçados de CSS.
  - Badge visual `Shopee` no topo.
  - Título com limite de 2 linhas em clamp.
  - Preço formatado em destaque.
  - Botão `"Ver oferta →"` apontando para `/go/[slug]?source=[SOURCE]`.
- `ProductGrid`:
  - Grade fluida adaptativa que acomoda confortavelmente de 1 a N produtos.
  - Seções com 1 produto (como o Produto Piloto #001) exibem o card alinhado com elegância, sem quebrar o layout.

---

## 11. Páginas de Categorias & Coleções
- Inclusão de cabeçalho padronizado com breadcrumb navegável.
- Listagem em grid denso com paginação semântica funcional.
- Preservação dos textos editoriais de SEO (`CATEGORY_EDITORIAL` e `COLLECTION_EDITORIAL`).

---

## 12. Página de Produto (`/produto/[slug]`)
- **Desktop:** Layout em 2 colunas equilibradas (galeria à esquerda, painel de compra à direita).
- **Mobile:** Imagem fluida, título, preço e botão de oferta acessíveis com o polegar acima da dobra.
- **Conteúdo Editorial:** Bloco destacado `"Por que garimpamos"` para nota editorial, lista de tags, timestamp de verificação e notas de transparência de afiliação.

---

## 13. Estratégia Responsiva (Breakpoints)
- **Desktop Amplo (>1280px):** Grids de 5 a 6 colunas, banners em 3:1.
- **Desktop Padrão (992px–1279px):** Grids de 4 a 5 colunas.
- **Tablet (641px–991px):** Grids de 3 colunas, navegação ajustada.
- **Mobile (<=640px):** Grids de 2 colunas uniformes, busca no topo, touch targets >44px, zero overflow horizontal.

---

## 14. Estratégia de Acessibilidade
- Navegação completa por teclado (Tab e Shift+Tab) em todos os novos componentes e banners.
- Foco visível com anel de alto contraste (`outline: 3px solid #d77618`).
- Rótulos e `aria-label` adequados para campos de busca, links de cards e banners.
- Conformidade WCAG 2.1 AA em contraste de texto e botões.

---

## 15. Preservação de SEO & Contratos
- Metadados Next.js inalterados em `src/seo/metadata.ts`.
- Políticas de robots (`/buscar`, `/go/`, `/admin/` com `noindex`) preservadas.
- JSON-LD de `WebSite`, `Product`, `BreadcrumbList` e `ItemList` preservados 100%.

---

## 16. Preservação de Tracking & Redirecionamento
- Todo botão de oferta aponta exclusivamente para `/go/[productSlug]?source=[SOURCE]`.
- Retorno HTTP 307 e `Cache-Control: no-store` mantidos.
- Telemetria `click_events` gravando dados no Supabase.

---

## 17. Estratégia de Performance
- Arquitetura Server Components prioritária (mínimo JS client-side).
- Imagens otimizadas com dimensões intrínsecas para evitar CLS.
- Zero introdução de dependências pesadas no `package.json`.

---

## 18. Plano de Testes & Validação Oficial (Ajuste G1)
- **Comando de Verificação Oficial:** `npm run verify`
  1. `npm run lint` (ESLint 0 warnings);
  2. `npm run type-check` (TypeScript sem erros);
  3. `npm test` (Bateria Vitest passando integralmente);
  4. `npm run build` (Next.js production build);
  5. `npm run db:check` (Drizzle schema check).
- **Testes Manuais de Rotas Públicas:** `/`, `/produto/cortador-fatiador-ralador-multiuso`, `/categoria/cozinha`, `/achados`, `/ate-30`, `/ate-50`, `/novidades`, `/buscar`.
- **Teste de Redirecionamento `/go`:** Validação de HTTP 307 e registro de evento.

---

## 19. Plano de Evidências Visuais
- Capturas de tela comparativas (BEFORE vs. AFTER) nos seguintes cenários:
  - Home Desktop (1440px) e Home Mobile (375px)
  - Página de Produto Desktop e Mobile
  - Página de Categoria Desktop e Mobile
  - Busca Desktop e Mobile
  - Seções vazias / estados intermediários

---

## 20. Estratégia de Rollback
- O desenvolvimento ocorre na branch `feature/spec-015-admin-cockpit-ux-ui`.
- Caso qualquer regressão inaceitável ocorra durante a implementação:
  `git restore .` para reverter a working tree limpa para o commit `d30828edc8a15887107a1981c4853ee0bb40b034`.
- Como nenhuma migration ou mutação no banco é executada, o rollback é 100% seguro e instantâneo.

---

## 21. Sequência Exata de Implementação (Após G2)
1. **Etapa 1 — Design System & CSS Foundation:** Refatorar e consolidar `src/app/globals.css` com os novos tokens e regras de grid, eliminando crops legados por categoria.
2. **Etapa 2 — Componentes Base:** Atualizar `ProductCard` e `ProductGrid` em `src/catalog/components.tsx`.
3. **Etapa 3 — Sistema de Banners & Busca:** Criar componentes de banner em `src/catalog/banners.tsx` e integrar busca e submenu no Header em `src/app/(public)/layout.tsx`.
4. **Etapa 4 — Home Storefront:** Reorganizar `src/app/(public)/page.tsx` com a nova arquitetura (Hero, Categorias, Achados da Shopee, Coleções, Banners, Editorial).
5. **Etapa 5 — Product Page & Páginas Auxiliares:** Atualizar `src/app/(public)/produto/[slug]/page.tsx`, `categoria/[slug]/page.tsx`, coleções e `/buscar`.
6. **Etapa 6 — Verificação Oficial:** Executar `npm run verify` e testes manuais de rotas.
7. **Etapa 7 — Coleta de Evidências:** Gerar capturas visuais para o pacote G3.

---

## 22. Estimated Mutation Surface
- Arquivos modificados: 8 arquivos TypeScript/CSS existentes.
- Arquivos criados: 1 a 2 novos arquivos de componentes reutilizáveis (`banners.tsx`).
- Mutações no banco de dados: **0** (zero SQL, zero migrations).
- Mudanças em dependências (`package.json`): **0** (zero bibliotecas novas).

---

## 23. Riscos por Etapa & Mitigações
| Etapa | Risco Principal | Mitigação |
|---|---|---|
| **Etapa 1 (CSS)** | Regressão visual no Admin Cockpit | Preservar integralmente todas as classes com prefixo `.admin-*`. |
| **Etapa 2 (Cards)** | Imagens de proporções variadas distorcidas | Utilizar `aspect-ratio: 1/1` com `object-fit: cover` nativo. |
| **Etapa 3 (Header)** | Quebra de layout ou overflow horizontal em mobile | Layout flex/grid com `min-width: 0` e carrossel touch com `overflow-x: auto`. |
| **Etapa 4 (Home)** | Sensação de catálogo vazio com 1 produto | Layout gracioso que acomoda o Produto Piloto #001 com cards editoriais de apoio. |
| **Etapa 6 (Verify)** | Falha de lint ou type-check | Rigor absoluto no contrato TypeScript e zero violações no ESLint. |
