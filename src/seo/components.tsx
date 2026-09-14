import Link from "next/link";
import type { EditorialContent } from "./editorial";

export function Breadcrumbs({ items }: { items: readonly { name: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Navegação estrutural"><ol>{items.map((item, index) => <li key={`${item.name}-${index}`}>{item.href ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>;
}

export function EditorialSection({ content, categoryHref }: { content: EditorialContent; categoryHref?: string }) {
  return <section className="seo-editorial" aria-labelledby="guia-editorial"><p>{content.intro}</p><h2 id="guia-editorial">Antes de escolher</h2><p>{content.guidance}</p>{categoryHref ? <Link className="text-link" href={categoryHref}>Explorar a categoria</Link> : null}</section>;
}
