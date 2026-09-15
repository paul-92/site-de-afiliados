import Link from "next/link";
import { Suspense } from "react";
import { PageViewCollector } from "@/analytics/collector";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><Suspense fallback={null}><PageViewCollector /></Suspense><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="site-header"><Link className="brand" href="/" aria-label="Garimora, página inicial">Garimora<span>.</span></Link><nav aria-label="Navegação principal"><Link href="/#categorias">Categorias</Link><Link href="/achados">Achados</Link><Link href="/ate-30">Até R$30</Link><Link href="/ate-50">Até R$50</Link><Link className="search-link" href="/buscar">Buscar</Link></nav></header><main id="conteudo">{children}</main><footer><strong>Garimora.</strong><p>Alguns links da Garimora são links de afiliado. Podemos receber uma comissão quando uma compra é realizada por meio deles, sem custo adicional para você.</p><nav className="footer-links" aria-label="Informações institucionais"><Link href="/privacidade">Privacidade</Link><Link href="/termos">Termos</Link><Link href="/afiliados">Afiliados</Link></nav></footer></>;
}
