import { createProductAction } from "@/admin/actions";
import { ProductForm } from "@/admin/product-form";
import { withAdminRepository } from "@/admin/repository";

export default async function NewProductPage() {
  const refs = await withAdminRepository((repo) => repo.references());
  return <div className="admin-page"><header className="admin-page-header"><div><p className="admin-kicker">Catálogo · Novo registro</p><h2>Novo produto</h2><p>Todo produto começa como rascunho. A publicação só será liberada pelo Publication Gate.</p></div></header><section className="admin-panel admin-form-panel" aria-labelledby="dados-novo-produto"><div className="admin-panel-heading"><div><p className="admin-kicker">Dados editoriais</p><h3 id="dados-novo-produto">Informações do produto</h3></div></div><ProductForm refs={refs} action={createProductAction}/></section></div>;
}
