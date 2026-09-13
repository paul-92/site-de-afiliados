import { createProductAction } from "@/admin/actions";
import { ProductForm } from "@/admin/product-form";
import { withAdminRepository } from "@/admin/repository";
export default async function NewProductPage() { const refs = await withAdminRepository((repo) => repo.references()); return <section><h2>Novo produto</h2><p className="muted">Todo produto começa como rascunho. A publicação só será liberada pelo Publication Gate.</p><ProductForm refs={refs} action={createProductAction}/></section>; }
