import Link from "next/link";
import { withAdminRepository } from "@/admin/repository";

const metrics = [
  { key: "products", label: "Produtos", detail: "Itens cadastrados no catálogo", tone: "orange" },
  { key: "activeProducts", label: "Publicados", detail: "Produtos ativos na vitrine", tone: "green" },
  { key: "activeCategories", label: "Categorias ativas", detail: "Estruturas disponíveis", tone: "mint" },
  { key: "activeMarketplaces", label: "Marketplaces ativos", detail: "Canais de oferta disponíveis", tone: "cream" },
] as const;

export default async function AdminPage() {
  const health = await withAdminRepository((repo) => repo.dashboard());
  const empty = health.products === 0;
  return <div className="admin-page">
    <header className="admin-page-header">
      <div><p className="admin-kicker">Cockpit</p><h2>Saúde operacional</h2><p>Acompanhe a estrutura atual do catálogo e acesse as rotinas mais frequentes.</p></div>
      <Link className="button" href="/admin/products/new">Cadastrar produto</Link>
    </header>
    <section aria-labelledby="catalogo-agora">
      <div className="admin-section-heading"><div><p className="admin-kicker">Agora</p><h3 id="catalogo-agora">Catálogo em números</h3></div><Link href="/admin/products">Ver produtos <span aria-hidden="true">→</span></Link></div>
      <div className="admin-kpi-grid">{metrics.map((item) => <article className={`admin-kpi admin-kpi-${item.tone}`} key={item.key}><span className="admin-kpi-label">{item.label}</span><strong>{health[item.key].toLocaleString("pt-BR")}</strong><small>{item.detail}</small></article>)}</div>
    </section>
    {empty ? <section className="admin-zero-state" aria-labelledby="catalogo-vazio"><span className="admin-zero-mark" aria-hidden="true">+</span><div><p className="admin-kicker">Primeiro passo</p><h3 id="catalogo-vazio">O catálogo ainda está vazio</h3><p>Cadastre o primeiro produto como rascunho. A publicação continuará condicionada ao Publication Gate.</p></div><Link className="button" href="/admin/products/new">Criar primeiro produto</Link></section> : null}
    <section className="admin-operations" aria-labelledby="operacoes-rapidas">
      <div><p className="admin-kicker">Operação</p><h3 id="operacoes-rapidas">Acessos rápidos</h3><p>Continue pelas tarefas existentes, sem alterar o fluxo editorial.</p></div>
      <div className="admin-operation-links"><Link href="/admin/products?status=DRAFT"><span>Revisão editorial</span><strong>Revisar rascunhos</strong><i aria-hidden="true">→</i></Link><Link href="/admin/analytics"><span>Performance</span><strong>Abrir Analytics</strong><i aria-hidden="true">→</i></Link><Link href="/admin/taxonomy"><span>Organização</span><strong>Gerenciar categorias e tags</strong><i aria-hidden="true">→</i></Link></div>
    </section>
  </div>;
}
