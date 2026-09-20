# SPEC-018 — UX/UI DISCOVERY REPORT
**Data:** 20/09/2026  
**Status:** DISCOVERY CONCLUÍDO · READ-ONLY · AGUARDANDO G1 HUMAN APPROVAL  
**Baseline Git:** `d30828edc8a15887107a1981c4853ee0bb40b034` (Branch: `feature/spec-015-admin-cockpit-ux-ui`)

---

### 1. CURRENT STATE
- O Garimora possui um catálogo operacional inicial composto exatamente por 1 produto real aprovado e ativo: **Produto Piloto #001** (`Cortador e Ralador Multiuso para Cozinha`, slug: `cortador-fatiador-ralador-multiuso`).
- A infraestrutura de produção encontra-se em `https://garimora.vercel.app`, conectada ao banco Supabase compartilhado (`eoevqgxmuhurzfxhhmuw`).
- As rotas públicas atuais respondem com status HTTP 200, SEO configurado conforme SPEC-008 e redirecionamento `/go` funcional com telemetria assíncrona.
- A camada visual atual do storefront público data da SPEC-007 (com retoques de SEO da SPEC-008). O design foi projetado em torno de mockups editoriais, apresentando baixa densidade de produtos e elementos estáticos incompatíveis com uma experiência contemporânea de marketplace.

---

### 2. CURRENT INFORMATION ARCHITECTURE
- **Layout Geral:**
  - `PublicLayout` (`src/app/(public)/layout.tsx`):
    - Skip link acessível (`#conteudo`);
    - `site-header` simples: Logotipo `Garimora.` + links textuais: `Categorias`, `Achados`, `Até R$30`, `Até R$50` e botão/pílula `Buscar`;
    - Conteúdo principal (`<main id="conteudo">`);
    - Rodapé institucional com aviso legal de afiliação e links para `Privacidade`, `Termos` e `Afiliados`.
- **Páginas do Storefront:**
  - `/` (Home): Hero com formulário de busca interno e imagem estática + Seção Achados + Grade de 4 Categorias + Seções Até R$30 / Até R$50 / Novidades + Bloco Editorial + Disclosure de Preço.
  - `/produto/[slug]`: Breadcrumbs + Grid de 2 colunas (mídia com sombra dura + card de informações com preço, nota editorial "Por que garimpamos", tags e botão `/go`).
  - `/categoria/[slug]`: Breadcrumbs + Introdução da categoria + Texto editorial de SEO + Grid de produtos + Paginação.
  - `/achados`, `/ate-30`, `/ate-50`, `/novidades`: Coleções baseadas em `CollectionPage` com grid de produtos.
  - `/buscar`: Formulário central com input e listagem de resultados (`noindex`).

---

### 3. CURRENT COMPONENT MAP
- `ProductCard` (`src/catalog/components.tsx`):
  - Card com imagem em moldura quadrada/4:3, metadados de categoria e selo "Achado", título, descrição curta (limitada a 2 linhas), preço formatado com indicador `*` de referência, link de detalhes e botão "Ver oferta →".
- `ProductGrid` (`src/catalog/components.tsx`):
  - Container em CSS grid de 4 colunas em desktop e 2 colunas em mobile. Renderiza mensagem de estado vazio (`empty`) se `products.length === 0`.
- `PriceDisclosure` (`src/catalog/components.tsx`):
  - Parágrafo padronizado de transparência sobre o preço de referência observado.
- `PageIntro` (`src/catalog/public-pages.tsx`):
  - Cabeçalho padronizado de categoria e coleções com eyebrow, h1 e descrição.
- `Breadcrumbs` (`src/seo/components.tsx`):
  - Lista semântica `<nav>` com `<ol>` de navegação estrutural.
- `JsonLdScript` (`src/seo/structured-data.tsx`):
  - Injeção de esquemas `WebSite`, `Product`, `BreadcrumbList` e `ItemList`.

---

### 4. CURRENT DESIGN SYSTEM / TOKENS
- **Variáveis Globais (`src/app/globals.css`):**
  - Cores: `--ink: #17251d`, `--muted: #647168`, `--green: #176b4d`, `--green-dark: #0d4c35`, `--mint: #e4f0e7`, `--cream: #f8f6f0`, `--line: #dedfd8`, `--orange: #dc6c2e`, `--white: #fff`.
  - Fontes: `Inter, ui-sans-serif, system-ui` para corpo; `Georgia, "Times New Roman", serif` para h1/h2 e marca.
  - Fundo do Body: `var(--cream)` com gradiente radial sutil (`radial-gradient(circle at 90% 6%, rgba(204, 225, 209, 0.6)...)`).
- **Problema de Herança:** O arquivo `globals.css` possui 72 linhas extensas combinando estilos públicos da SPEC-007, admin styles da SPEC-015 e patches de media queries sobrepostos. A folha de estilos acumulou redundâncias (ex.: declarações repetidas de `.periods`, `.trend-day`) que necessitam de consolidação modular.

---

### 5. RESPONSIVE BEHAVIOR
- **Breakpoints Existentes:**
  - `@media (max-width: 900px)`: Grid de produtos reduz de 4 para 2 colunas; Hero vira 1 coluna; Header vira linha com scroll horizontal.
  - `@media (max-width: 620px)`:
    - Hero forçado a `max-width: 358px` centralizado (gargalo crítico em smartphones médios/grandes);
    - Grid de produtos mantido em 2 colunas (`repeat(2, minmax(0, 1fr))`) com gap de 0.75rem;
    - Descrição do card (`.card-copy`) e link de detalhes (`.text-link`) são ocultados via `display: none`;
    - Header torna-se bloco estático com links em flex-wrap.

---

### 6. CURRENT PRODUCT CARD
- **Pontos Positivos:** Apresenta claramente a categoria, o título, o preço de referência observado com asterisco e o botão de oferta.
- **Dívidas e Falhas:**
  - Regras de crop por classe de categoria:
    - `.product-card-cozinha .image-frame img { object-position: 50% 35%; transform: scale(1.14); }`
    - Essa regra de escala artificial foi feita para o mockup antigo e distorce ou corta imagens reais de produtos da Shopee.
  - Falta de identificação clara do marketplace no card (o usuário não sabe se o produto é da Shopee antes de entrar na página ou clicar).
  - Densidade baixa: em telas desktop grandes, os cards ocupam 25% da largura da tela cada um, parecendo desproporcionalmente grandes.

---

### 7. CURRENT PRODUCT PAGE
- **Estrutura:**
  - Lado esquerdo: imagem com sombra dura verde menta (`box-shadow: 20px 20px 0 var(--mint)`).
  - Lado direito: card branco flutuante com borda arredondada (`border-radius: 28px`), contendo breadcrumb, título, preço em destaque (`2.65rem`), nota editorial "Por que garimpamos", tags, botão `/go`, nota de afiliação e disclosure.
- **Dívidas:**
  - A sombra decorativa da imagem e os cantos excessivamente arredondados pertencem a um estilo editorial "revista", afastando o usuário da experiência familiar e confiável de um marketplace de compras.
  - Em mobile, o botão de oferta fica empurrado para o final da página após todo o texto.

---

### 8. SEARCH EXPERIENCE
- **Fluxo Atual:** Apenas acessível por um botão na Home ou navegando até `/buscar`.
- **Problema:** Em um marketplace moderno (como a Shopee), a barra de busca central é o componente de maior peso visual e intenção de uso do visitante. Ocultá-la dentro do Hero reduz drasticamente a taxa de exploração.

---

### 9. CATEGORY EXPERIENCE
- **Página de Categoria (`/categoria/[slug]`):**
  - Lista de produtos filtrada por slug no banco.
  - Introdução com nome e descrição.
  - Bloco de texto editorial de SEO (`CATEGORY_EDITORIAL`).
  - Paginação funcional a cada 24 itens.
- **Oportunidade:** Adicionar um banner contextual de categoria no topo e filtros rápidos de ordenação/faixa de preço.

---

### 10. MOBILE EXPERIENCE
- **Diagnóstico:** A navegação mobile atual é truncada. O cabeçalho quebra em várias linhas sem barra de busca direta; o Hero é espremido em uma largura fixa de 358px; o carrossel de categorias não existe (grade vertical de blocos altos); e a página de produto exige rolagem excessiva para encontrar o botão de compra.

---

### 11. ACCESSIBILITY BASELINE
- **Conformidade Existente:**
  - Skip link presente (`.skip-link`);
  - Foco visível configurado (`outline: 3px solid #d77618`);
  - Suporte a `prefers-reduced-motion`;
  - Rótulos `aria-label` em links e inputs;
  - Breadcrumbs com `aria-current="page"`.
- **Atenção no Redesign:** Banners e carrosséis não devem ter texto embutido em imagens; botões de toque devem ter no mínimo 44x44px.

---

### 12. SEO CONSTRAINTS (SPEC-008 PRESERVED)
- Canônicos obrigatórios derivados de `GARIMORA_SITE_URL`.
- Rota `/buscar`, `/go/` e `/admin/` protegidas com `noindex`.
- Estrutura de dados JSON-LD (`WebSite`, `BreadcrumbList`, `ItemList`, `Product`) intocada.
- Breadcrumbs semânticos preservados.

---

### 13. FUNCTIONAL CONTRACTS TO PRESERVE
- Catálogo e ciclo de vida: Somente produtos `ACTIVE` com Publication Gate aprovado aparecem.
- Redirecionamento comercial: Cliques em ofertas devem obrigatoriamente transitar por `/go/[productSlug]?source=[SOURCE]` com retorno HTTP 307 e `Cache-Control: no-store`.
- Telemetria: Gravação assíncrona de `ClickEvent` no Supabase.
- Admin Cockpit: As rotas `/admin/*` não podem sofrer qualquer regressão visual ou quebra de autenticação.

---

### 14. TECHNICAL CONSTRAINTS
- Next.js 15 App Router com React Server Components.
- Vanilla CSS / CSS Modules / `globals.css` sem introdução de Tailwind ou frameworks JS de terceiros.
- Zero migrações de banco de dados ou alterações de schema no Supabase nesta SPEC.
- Operação de catálogo desacoplada: SPEC-018 não cadastra novos produtos.

---

### 15. UX PAIN POINTS (RESUMO)
1. Ausência de barra de busca no Header.
2. Layout com densidade muito baixa (cards grandes demais, poucos itens por linha).
3. Crops de imagem artificiais (`scale(1.14)`) que danificam fotos reais da Shopee.
4. Hero mobile engessado em `max-width: 358px`.
5. Ausência de seção de ofertas/promoções destacadas.
6. Falta de um sistema de banners responsivos.
7. Sensação de "catálogo vazio" quando há poucos produtos cadastrados.

---

### 16. REDESIGN OPPORTUNITIES
1. **Header Estilo Marketplace:** Logo Garimora + Barra de pesquisa central com botão de lupa + Submenu de categorias e coleções.
2. **Cards Densos e Padronizados:** Aspect ratio 1:1, badge do marketplace (Shopee), preço forte, tipografia moderna e botão de clique claro.
3. **Grid Dinâmico de 4 a 6 Colunas:** Permitir que o usuário visualize múltiplos itens de uma vez no desktop e 2 colunas fluidas no smartphone.
4. **Página de Produto Profissional:** Galeria limpa à esquerda, painel de compra à direita com breadcrumbs, nota "Por que garimpamos", disclosure e CTA verde/laranja dominante.

---

### 17. PROMOTIONS SECTION & PROMOTION DATA GAP ASSESSMENT
- **Objetivo:** Criar a seção `"Ofertas da Shopee"` na Home.
- **PROMOTION DATA GAP Identificado:**
  - *Diagnóstico do Banco de Dados:* A tabela `products` e a tabela `price_observations` contêm apenas `amount`, `currency` e `observed_at`. Não existem colunas como `original_price`, `discount_percent` ou `is_promotion`.
  - *Mitigação Honesta:* É expressamente proibido simular descontos ou criar preços "de/por" falsos. A seção de promoções será preenchida deterministicamente por produtos que cumpram:
    1. Marketplace Shopee ativo (`marketplaceSlug = "shopee"`);
    2. Filtragem por produtos em destaque (`featured = true`) ou com tag associada a ofertas (`ofertas-shopee`), quando cadastrada;
    3. Exibição fiel do preço de entrada observado com a indicação editorial: `"A partir de R$ [VALOR]*"`.

---

### 18. BANNER SYSTEM ARCHITECTURE
- **Tipologia de Banners:**
  1. **Hero Banner:** Área superior da Home com proporção 3:1 (desktop) e 16:9 (mobile), contendo título institucional ("Achados que valem a pena"), subtítulo e CTA para `/achados`.
  2. **Campaign Banners:** Banners entre seções (ex.: faixa "Até R$ 30 e R$ 50 — Ideias práticas para seu dia a dia").
  3. **Category Banners:** Cabeçalhos visuais ilustrados nas páginas de categorias com badges temáticos.
  4. **Collection Banners:** Banners nas coleções `/achados`, `/ate-30`, `/ate-50`, `/novidades`.
- **Estratégia de Performance e Acessibilidade:**
  - Banners renderizados via CSS e HTML semântico com textos em texto real (não rasterizado dentro de imagens JPEG/PNG).
  - Suporte completo a navegação por teclado e leitor de tela.

---

### 19. RISKS
1. **Risco de Falso Vazio:** Ao aumentar a densidade para 5–6 colunas com apenas 1 produto no banco, o grid pode parecer inacabado se não houver um design que acomode graciosamente catálogos em fase inicial. *(Mitigação: cards de curadoria editorial de preenchimento inteligente "Garimpando novidades" sem links quebrados).*
2. **Risco de Quebra de CSS Compartilhado:** O arquivo `globals.css` estiliza tanto o storefront quanto elementos do cockpit administrativo. *(Mitigação: escopar os estilos do storefront sob classes específicas de storefront, preservando 100% dos seletores `.admin-*`).*
3. **Risco de Hotlink de Imagens:** O produto piloto utiliza URL da CDN da Shopee. O redesign deve garantir `object-fit: cover` sem cortes estáticos de CSS.

---

### 20. OUT-OF-SCOPE ITEMS
- Cadastro do Produto Piloto #002 (operação de catálogo independente).
- Alteração no schema do PostgreSQL ou novas migrations.
- Implementação de carrinho, checkout ou compra própria.
- Automações de scraping ou integração com Shopee Open Platform API.
- Alterações em Supabase Auth, RLS ou variáveis de ambiente de produção.
