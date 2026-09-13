import Link from "next/link";
import type { ProductStatus } from "@/catalog/domain";
export function Notice({ text }: { text?: string }) { return text ? <p className="notice" role="status">{text}</p> : null; }
export function StatusBadge({ status }: { status: ProductStatus }) { return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>; }
export function Empty({ children }: { children: React.ReactNode }) { return <p className="empty">{children}</p>; }
export function AdminNav() { return <nav className="admin-nav" aria-label="Administração"><Link href="/admin">Visão geral</Link><Link href="/admin/products">Produtos</Link><Link href="/admin/taxonomy">Categorias e tags</Link><Link href="/admin/marketplaces">Marketplaces</Link></nav>; }
export const gateLabels: Record<string, string> = { invalid_slug: "Slug inválido", missing_title: "Título ausente", missing_short_description: "Descrição curta ausente", invalid_image_url: "Imagem HTTPS ausente ou inválida", missing_image_alt: "Texto alternativo ausente", inactive_category: "Categoria inativa", inactive_marketplace: "Marketplace inativo", never_verified: "Produto ainda não verificado", missing_active_affiliate_link: "Link afiliado ativo e compatível ausente" };
