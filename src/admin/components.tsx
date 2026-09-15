import type { ProductStatus } from "@/catalog/domain";

export function Notice({ text }: { text?: string }) { return text ? <div className="admin-notice" role="status"><span aria-hidden="true">✓</span><p>{text}</p></div> : null; }
const statusLabels: Record<ProductStatus, string> = { DRAFT: "Rascunho", READY: "Pronto", ACTIVE: "Publicado", PAUSED: "Pausado", ARCHIVED: "Arquivado" };
export function StatusBadge({ status }: { status: ProductStatus }) { return <span className={`badge badge-${status.toLowerCase()}`}>{statusLabels[status]}</span>; }
export function Empty({ title = "Nenhum registro", children }: { title?: string; children: React.ReactNode }) { return <div className="admin-empty" role="status"><span aria-hidden="true">◇</span><div><strong>{title}</strong><p>{children}</p></div></div>; }
export const gateLabels: Record<string, string> = { invalid_slug: "Slug inválido", missing_title: "Título ausente", missing_short_description: "Descrição curta ausente", invalid_image_url: "Imagem HTTPS ausente ou inválida", missing_image_alt: "Texto alternativo ausente", inactive_category: "Categoria inativa", inactive_marketplace: "Marketplace inativo", never_verified: "Produto ainda não verificado", missing_active_affiliate_link: "Link afiliado ativo e compatível ausente" };
