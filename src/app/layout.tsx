import Link from "next/link";
import { Suspense } from "react";
import { PageViewCollector } from "@/analytics/collector";
import { rootMetadata } from "@/seo/metadata";
import "./globals.css";
export const metadata = rootMetadata();
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><Suspense fallback={null}><PageViewCollector /></Suspense><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="site-header"><Link className="brand" href="/" aria-label="Garimora, página inicial">Garimora<span>.</span></Link><nav aria-label="Navegação principal"><Link href="/#categorias">Categorias</Link><Link href="/achados">Achados</Link><Link href="/ate-30">Até R$30</Link><Link href="/ate-50">Até R$50</Link><Link className="search-link" href="/buscar">Buscar</Link></nav></header><main id="conteudo">{children}</main><footer><strong>Garimora.</strong><p>Curadoria independente de produtos úteis. Podemos receber comissão por compras feitas por nossos links, sem custo adicional para você.</p></footer></body></html>; }
