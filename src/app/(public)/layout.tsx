import Link from "next/link";
import { Suspense } from "react";
import { PageViewCollector } from "@/analytics/collector";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewCollector />
      </Suspense>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        {/* Nível principal: Logo + Busca ampla + Carrinho */}
        <div className="header-main">
          <div className="header-main-inner">
            <div className="brand-group">
              <Link className="brand" href="/" aria-label="Garimora, página inicial">
                {/* Ícone de sacola estilo Shopee */}
                <svg className="brand-bag-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Garimora</span>
              </Link>
            </div>

            <div className="header-search-column">
              <form className="header-search" action="/buscar" method="get" role="search">
                <label className="sr-only" htmlFor="header-search-input">
                  Buscar produtos, achados e promoções
                </label>
                <input
                  id="header-search-input"
                  name="q"
                  type="search"
                  maxLength={120}
                  placeholder="Buscar na Garimora..."
                  autoComplete="off"
                />
                <button type="submit" aria-label="Buscar produtos">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </form>

              {/* Tags de busca rápida abaixo do campo de pesquisa */}
              <div className="header-search-tags" aria-label="Termos de busca populares">
                <Link href="/buscar?q=potes">Kit Jogo De Potes</Link>
                <Link href="/buscar?q=cortador">Cortador De Legumes</Link>
                <Link href="/buscar?q=eletrico">Cortador Multifuncional</Link>
                <Link href="/buscar?q=ferramentas">Kit Ferramentas</Link>
                <Link href="/buscar?q=massa">Cilindro De Massa</Link>
              </div>
            </div>

            <div className="header-cart-wrap">
              <Link className="header-cart-button" href="/achados" aria-label="Ver produtos garimpados">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <nav className="site-subnav" aria-label="Navegação principal">
          <div className="subnav-inner">
            <Link className="subnav-link highlight" href="/#achados-shopee">
              Achados da Shopee
            </Link>
            <Link className="subnav-link" href="/categoria/cozinha">
              Cozinha
            </Link>
            <Link className="subnav-link" href="/categoria/casa-utilidades">
              Casa & Utilidades
            </Link>
            <Link className="subnav-link" href="/categoria/organizacao">
              Organização
            </Link>
            <Link className="subnav-link" href="/categoria/ferramentas-manutencao">
              Ferramentas & Manutenção
            </Link>
            <Link className="subnav-link" href="/achados">
              Achados da Semana
            </Link>
            <Link className="subnav-link" href="/ate-30">
              Até R$30
            </Link>
            <Link className="subnav-link" href="/ate-50">
              Até R$50
            </Link>
            <Link className="subnav-link" href="/novidades">
              Novidades
            </Link>
          </div>
        </nav>
      </header>

      <main id="conteudo">{children}</main>

      <footer>
        <div className="footer-content">
          <strong>Garimora.</strong>
          <p>Alguns links da Garimora são links de afiliado. Podemos receber uma comissão quando uma compra é realizada por meio deles, sem custo adicional para você.</p>
          <nav className="footer-links" aria-label="Informações institucionais">
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos de Uso</Link>
            <Link href="/afiliados">Aviso de Afiliados</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
