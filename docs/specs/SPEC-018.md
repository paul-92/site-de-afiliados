# SPEC-018 — Public Storefront UX/UI Redesign

**Status:** G3 HUMAN ACCEPTED / CLOSED · IMPLEMENTATION ACCEPTED · READY FOR PRODUCTION RELEASE (G4)

**Starting baseline:** `d30828edc8a15887107a1981c4853ee0bb40b034` (Branch: `feature/spec-015-admin-cockpit-ux-ui`)

**Target Production:** `https://garimora.vercel.app`

---

## 1. Problem Statement

Garimora possui uma infraestrutura técnica estável, segura e auditada (SPEC-001 a SPEC-017 concluídas, release candidate em produção e ciclo operacional do Produto Piloto #001 validado com sucesso sob G-PILOT-001). No entanto, a interface pública atual do storefront reflete um layout de transição:
1. **Baixa densidade de catálogo:** O grid atual é limitado a 4 colunas rígidas com cards volumosos e espaçamentos excessivos, projetados para mockups iniciais, gerando sensação de catálogo vazio.
2. **Ausência de busca proeminente:** A barra de busca principal está oculta dentro do Hero editorial e o cabeçalho possui apenas um link secundário em forma de pílula para `/buscar`, contrariando a expectativa moderna de navegação de comércio eletrônico.
3. **Hero rígido com limitação mobile:** O Hero atual utiliza um grid com imagem estática de curadoria (`/demo/garimora-curadoria.png`) e um selo circular, sofrendo um corte agressivo em telas móveis (`max-width: 358px` forçado via CSS).
4. **Falta de hierarquia promocional e banners:** Inexistência de um sistema modular de banners e de uma seção dedicada a promoções/ofertas da Shopee, elementos centrais para a familiaridade e conversão em marketplaces contemporâneos.
5. **Crops artificiais por categoria:** A folha de estilos atual contém regras de escala (`transform: scale(1.14)`) e posicionamento manual criadas para imagens fictícias do DEMO, que distorcem ou cortam imagens reais oriundas de CDNs oficiais de parceiros como a Shopee.

---

## 2. Goals & Non-Goals

### Goals
- **UX inspirada na Shopee, identidade Garimora:** Reorganizar a arquitetura de informação, a densidade visual e a hierarquia de navegação com base na fluidez dos grandes marketplaces (especialmente Shopee), mantendo estritamente a identidade própria do Garimora (paleta verde/creme, tipografia limpa, proposta editorial curada e transparência de afiliação).
- **Busca dominante no Header:** Introduzir barra de pesquisa rápida e acessível diretamente no cabeçalho em todas as páginas públicas, com adaptação mobile nativa.
- **Navegação secundária estruturada:** Barra horizontal de categorias e coleções (`Achados`, `Até R$30`, `Até R$50`, `Novidades`, `Ofertas da Shopee`) com rolagem suave e suporte a toque.
- **Seção "Ofertas da Shopee" (Promotions):** Área dedicada a produtos da Shopee na Home com visual atrativo, sem recorrer a informações falsas de preço, desconto ou urgência.
- **Sistema modular de Banners:** Arquitetura para Hero Banners, Banners de Campanha, Banners de Categoria e Banners de Coleção, responsivos e acessíveis.
- **Card de Produto denso e moderno:** Redesenhar o `ProductCard` priorizando a imagem real, o preço observado de referência, o marketplace parceiro e o CTA de oferta, eliminando crops estáticos.
- **Grid escalável e adaptativo:** Aumentar a densidade do catálogo (4 a 6 colunas em desktop amplo, 2 a 3 em tablet e 2 em mobile), dimensionando com elegância desde 1 único produto até centenas.
- **Página de Produto orientada à conversão:** Layout limpo com galeria/imagem dominante, hierarquia de preço, contextualização editorial ("Por que garimpamos"), notas de transparência e CTA direto para a oferta via `/go`.
- **Preservação rigorosa de contratos:** Zero quebra de contratos de SEO (SPEC-008), Publication Gate, telemetria ClickEvent (SPEC-005), rota `/go`, e boundaries do Admin Cockpit.

### Non-Goals
- Não transformar o Garimora em marketplace transacional (sem carrinho próprio, checkout, frete, estoque ou pagamentos).
- Não copiar identidade visual, logotipos, ícones proprietários, CSS ou assets protegidos da Shopee.
- Não inventar dados comerciais inexistentes (proibidos descontos falsos, preços "de/por" inventados, estrelas de avaliação fictícias, contadores de vendas ou escassez artificial).
- Não alterar schema de banco de dados, migrations, Supabase Auth ou RLS nesta SPEC.
- Não cadastrar produtos em massa ou automatizar scraping (operação de catálogo permanece desacoplada).
- Não introduzir dependências pesadas de bibliotecas de componentes ou frameworks visuais externos.

---

## 3. Brand Identity & Design System

### Paleta de Cores Institucional
- **Primária:** `--garimora-green: #176b4d` (Verde Garimora, confiança e curadoria)
- **Primária Escura:** `--garimora-green-dark: #0d4c35` (Hover e contrastes)
- **Secundária / Acento:** `--garimora-orange: #dc6c2e` (CTA, destaques de ofertas e selos)
- **Fundo Claro:** `--garimora-cream: #f8f6f0` (Identidade editorial suave)
- **Fundo Branco:** `--garimora-white: #ffffff` (Superfície dos cards e componentes)
- **Texto Principal:** `--garimora-ink: #17251d` (Contraste ótimo para leitura)
- **Texto Secundário / Muted:** `--garimora-muted: #647168`
- **Bordas e Linhas:** `--garimora-line: #e2e4dc`
- **Superfícies Mint:** `--garimora-mint: #e4f0e7` (Fundos suaves de badges e categorias)

### Tipografia
- **Títulos Editoriais e Marca:** Georgia, Times New Roman, serif (elegância, curadoria "achados que valem a pena")
- **Interface, Preços e Navegação:** Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif (legibilidade alta em cards densos e inputs)

### Espaçamento & Escala
- Grid de 4px/8px base.
- Border-radius unificado: `8px` para inputs e botões secundários, `12px` para ProductCards e cards de categoria, `16px` para banners e seções de destaque.
- Sombras suaves: `0 4px 14px rgba(23, 37, 29, 0.06)` com elevação em hover.

---

## 4. Information Architecture & Home Layout

A Home da Garimora passa a seguir a hierarquia de descoberta de marketplace:

```
[ TOPBAR / HEADER ]
  ├── Marca Garimora
  ├── Barra de Busca Central Dominante (Input + Ícone + Ação de Busca)
  └── Atalhos Rápidos (Achados, Ofertas, Categorias, Admin se autenticado)

[ NAVEGAÇÃO DEPARTAMENTAL / SUBNUMENU ]
  ├── Todas as Categorias (Dropdown / Lista Rápida)
  ├── Cozinha | Casa & Utilidades | Organização | Ferramentas & Manutenção
  └── Coleções: Ofertas da Shopee | Achados | Até R$30 | Até R$50 | Novidades

[ HERO SECTION / CARROSSEL DE BANNERS ]
  ├── Banner Principal: "Achados que Valem a Pena — Curadoria Garimora"
  └── Banner Secundário / Campanha: "Ofertas em Destaque da Shopee"

[ CATEGORIAS EM DESTAQUE (BOLHAS / CARDS COMPACTOS) ]
  └── Grade com ícones/imagens representativas e nomes das categorias ativas

[ SEÇÃO PROMOÇÕES / OFERTAS DA SHOPEE ]
  ├── Título: "Ofertas da Shopee" · Subtítulo: "Produtos garimpados com preços de oportunidade"
  └── Grid Responsivo Denso (4–6 colunas desktop, 2 colunas mobile)

[ SEÇÃO ACHADOS DA SEMANA (CURADORIA GERAL) ]
  └── Destaques editoriais com badge de curadoria

[ BANNER DE CAMPANHA / INTERMEDIÁRIO ]
  └── "Preços até R$ 30 e R$ 50 — Ideias práticas sem gastar muito"

[ SEÇÃO POR FAIXA DE PREÇO ]
  ├── Destaques Até R$ 30
  └── Destaques Até R$ 50

[ NOVIDADES DO CATÁLOGO ]
  └── Últimos produtos catalogados e validados

[ EDITORIAL & TRANSPARÊNCIA DE AFILIADOS ]
  └── Bloco institucional: "A gente garimpa. Você escolhe." + Disclosure legal

[ FOOTER INSTITUCIONAL ]
  └── Links legais (Privacidade, Termos, Afiliados) e copyright
```

---

## 5. Promotions Section & Banner Architecture

### A. Promotions Section ("Achados da Shopee")
- **Nomenclatura Adotada:** "Achados da Shopee" (com subtítulo "Oportunidades garimpadas no marketplace parceiro").
- **Distinção Semântica Obrigatória (Ajuste G1):**
  - Enquanto o modelo de dados não possuir evidência verificável de preço anterior, desconto ou campanha oficial da plataforma, a classificação editorial de um produto como `featured` ou por tag/coleção editorial constitui estritamente **CURADORIA / OPORTUNIDADE EDITORIAL**, e **NÃO** evidência de desconto (`DISCOUNT EVIDENCE`).
  - É proibido afirmar desconto, percentual promocional, "de/por", urgência ou vantagem econômica específica sem dados auditáveis.
- **PROMOTION DATA GAP Formalmente Registrado:**
  - *Constatação:* As tabelas `products` e `price_observations` contêm apenas `amount`, `currency` e `observed_at`. Não existem campos para `original_price`, `discount_percent` ou `is_promotion`.
  - *Mitigação Honesta:* A seção agrupará produtos reais da Shopee com base em:
    1. Marketplace Shopee ativo (`marketplaceSlug = "shopee"`);
    2. Curadoria editorial (`featured = true`) ou tag temática;
    3. Apresentação fiel do preço observado de referência: `"A partir de R$ 31,99*"`.

### B. Sistema Modular de Banners
1. **Hero Banners (Desktop 1200x380px, Mobile 360x200px):**
   - Construídos em CSS/HTML semântico ou imagens otimizadas com proporção 3:1 ou 16:9.
   - Textos fundamentais fora da imagem bitmap (h1/h2, subtítulo, botão CTA).
   - Altamente contrastantes e acessíveis via teclado.
2. **Campaign Banners (Intermediários):**
   - Faixas horizontais compactas para quebra de ritmo visual entre seções (ex.: faixa "Até R$ 30 e R$ 50").
3. **Category & Collection Banners:**
   - Cards e headers contextuais nas páginas `/categoria/[slug]` e coleções `/achados`, `/ate-30`, etc.
4. **Prevenção de CLS:** Dimensões intrínsecas e `aspect-ratio` fixos definidos em CSS para evitar pulos de layout durante o carregamento de imagens.

---

## 6. Component Architecture & Detailed Redesigns

### Header (`src/app/(public)/layout.tsx` & componentes dedicados)
- **Desktop:** Layout em duas linhas ou barra única integrada com:
  - Logotipo institucional Garimora com claim "Achados que valem a pena";
  - Barra de busca de largura flexível com campo de texto (`name="q"`), placeholder contextual, botão com ícone e label acessível;
  - Navegação departamental com links diretos para Categorias e Coleções;
  - Área de contexto (atalho rápido de busca / coleções).
- **Mobile:**
  - Linha superior com logo Garimora e botão de menu/busca;
  - Barra de busca compacta sempre visível abaixo do logo;
  - Carrossel horizontal deslizável com tags de categorias para navegação com o polegar.

### ProductCard (`src/catalog/components.tsx`)
- **Proporção da Imagem:** `aspect-ratio: 1/1` (quadrada, padrão ouro de marketplaces).
- **Remoção de Crops Rígidos:** Eliminar regras legadas de escala de imagem por categoria (`.product-card-cozinha img { transform: scale(1.14) }`), adotando `object-fit: cover` nativo.
- **Hierarquia do Conteúdo:**
  - Imagem de alta visibilidade com link para a página do produto;
  - Tag do Marketplace parceiro (ex.: badge sutil `Shopee`);
  - Título em 2 linhas com clamp CSS;
  - Preço em destaque tipográfico (`font-size: 1.25rem`, peso 900) acompanhado de `*` indicando preço de referência;
  - Botão CTA direto: `"Ver oferta →"` apontando para `/go/[productSlug]?source=[SOURCE]`.
- **Acessibilidade:** Card clicável como unidade ou links semânticos bem rotulados sem links aninhados inválidos.

### Product Grid & Densidade Visual
- **Desktop Amplo (>1280px):** 5 a 6 colunas para telas largas, mantendo largura mínima por card de 190px.
- **Desktop Padrão (992px–1279px):** 4 a 5 colunas.
- **Tablet (640px–991px):** 3 colunas.
- **Mobile (<640px):** 2 colunas uniformes com gap de 8px a 12px (densidade mobile autêntica de marketplace, superando o layout vertical de 1 card por linha).

### Página do Produto (`/produto/[slug]`)
- **Desktop:**
  - Lado Esquerdo: Galeria/Imagem principal em proporção 1:1 ou 4:3, limpa e com fundo neutro suave.
  - Lado Direito: Informações essenciais:
    - Breadcrumb semântico navegável;
    - Badge de categoria e marketplace (`Shopee`);
    - Título editorial completo;
    - Bloco de preço de referência com tipografia dominante;
    - Botão de ação de destaque `"Ver oferta na Shopee"` ocupando a largura do bloco;
    - Nota de transparência de afiliados;
    - Bloco editorial curado `"Por que garimpamos"`;
    - Tags e data de verificação.
- **Mobile:**
  - Imagem fluida no topo;
  - Título, preço e botão de oferta com prioridade imediata acima da dobra;
  - Conteúdo editorial expandido abaixo do botão.

---

## 7. Escalabilidade de Catálogo (Suporte a Múltiplos Produtos)

- **Comportamento com 1 Produto (Estado Atual):** O redesign apresentará o Produto Piloto #001 com elegância e equilíbrio visual, evitando a sensação de "site quebrado". Seções sem produtos suficientes exibirão estados amigáveis de curadoria contínua ("Novos achados sendo garimpados").
- **Compatibilidade com Expansão Paralela:** À medida que a operação de catálogo adicionar produtos futuros (Produto #002, #003, etc.), os grids preencherão automaticamente as colunas sem necessidade de novas alterações de código.

---

## 8. Preservação de Contratos Funcionais e Técnicos

1. **SEO (SPEC-008):**
   - Manutenção de todas as tags canônicas determinísticas baseadas em `GARIMORA_SITE_URL`.
   - Manutenção das políticas de robots: `/admin/`, `/buscar`, `/go/` permanecem com `noindex`.
   - Manutenção integral dos dados estruturados JSON-LD (`WebSite`, `BreadcrumbList`, `ItemList`, `Product`).
2. **Redirecionamento e Telemetria (SPEC-005):**
   - Todos os botões de oferta ("Ver oferta") continuam utilizando obrigatoriamente a rota `/go/[productSlug]?source=[SOURCE]`.
   - Preservação da gravação assíncrona de `ClickEvent` e retorno HTTP 307 com `Cache-Control: no-store`.
3. **Publication Gate & Domínio:**
   - Zero bypass nas regras do Publication Gate; apenas produtos com status `ACTIVE` são exibidos publicamente.
4. **Segurança e Boundaries:**
   - Acesso ao `/admin` permanece 100% protegido por autenticação Supabase e middleware.

---

## 9. Acceptance Criteria (AC-01 a AC-19)

- **AC-01 — Identidade Garimora:** Marca, paleta verde/creme/laranja, tom editorial e slogan preservados.
- **AC-02 — Header com Busca Dominante:** Campo de busca funcional integrado no cabeçalho em todas as resoluções.
- **AC-03 — Navegação Secundária:** Categorias e coleções acessíveis via submenu horizontal.
- **AC-04 — Seção Achados da Shopee:** Seção dedicada na Home exibindo produtos reais da Shopee sob curadoria editorial, sem falsos claims de desconto.
- **AC-05 — Sistema de Banners:** Banners institucionais/promocionais renderizados de forma responsiva sem layout shifts.
- **AC-06 — ProductCard Moderno:** Imagem 1:1 sem crops distorcidos, preço destacado, badge do marketplace e CTA claro.
- **AC-07 — Densidade de Catálogo:** Grids de 4–6 colunas em desktop e 2 colunas em mobile.
- **AC-08 — Product Page Redesenhada:** Layout em 2 colunas no desktop, mobile com CTA imediato e bloco "Por que garimpamos".
- **AC-09 — Renderização do Produto Piloto #001:** Produto real (`cortador-fatiador-ralador-multiuso`) renderizado com perfeição visual em todos os breakpoints.
- **AC-10 — Contrato `/go` e Tracking:** Cliques nas ofertas continuam disparando `/go` e registrando `ClickEvent`.
- **AC-11 — SEO Íntegro:** Metadados, canônicos, sitemap e JSON-LD inalterados estruturalmente.
- **AC-12 — Acessibilidade Validada:** Navegação por teclado, foco visível, contraste WCAG 2.1 AA e touch targets adequados (>44px).
- **AC-13 — Ausência de Dados Fictícios:** Nenhum desconto, estoque ou prova social falsa inventada.
- **AC-14 — Responsividade Mobile-First:** Experiência mobile nativa e sem overflow horizontal.
- **AC-15 — Estados de Carregamento e Vazio:** Skeletons de loading e mensagens amigáveis de curadoria para seções vazias.
- **AC-16 — Performance Preservada:** Código server-first com mínimo JS client-side e imagens otimizadas.
- **AC-17 — Compatibilidade com Expansão:** Grids e seções preparados para receber novos produtos automaticamente.
- **AC-18 — Contrato de Validação Oficial:** `npm run verify` passa integralmente (`lint`, `type-check`, `test`, `build`, `db:check`) com 0 erros e 0 warnings.
- **AC-19 — Evidência Visual Completa:** Capturas de tela before/after comprovando o avanço estético e funcional.

---

## 10. Visual Evidence & Test Strategy

Para validação em G3, serão geradas evidências visuais comparativas (BEFORE vs. AFTER) nos seguintes cenários:
1. **Home Desktop (1440px):** Header, hero banner, categorias, ofertas Shopee, achados e grids densos.
2. **Home Mobile (375px):** Header compacto, busca, carrossel de categorias, grid de 2 colunas e footer.
3. **Página de Produto Desktop:** Layout galeria + compra com disclosure e nota editorial.
4. **Página de Produto Mobile:** Fluxo de leitura mobile com CTA de destaque.
5. **Busca e Categorias:** Listagem de produtos filtrados e paginação.
6. **Estados Vazios e Loading:** Exibição com skeletons e mensagens amigáveis.
