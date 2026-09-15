"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const adminNavigation = [
  { href: "/admin", label: "Visão geral", group: "Cockpit", icon: "grid" },
  { href: "/admin/analytics", label: "Analytics", group: "Performance", icon: "chart" },
  { href: "/admin/products", label: "Produtos", group: "Catálogo", icon: "box" },
  { href: "/admin/taxonomy", label: "Categorias e tags", group: "Catálogo", icon: "tag" },
  { href: "/admin/marketplaces", label: "Marketplaces", group: "Catálogo", icon: "store" },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chart: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
    tag: <><path d="M20 13 13 20a2 2 0 0 1-3 0l-6-6a2 2 0 0 1 0-3l7-7h7a2 2 0 0 1 2 2v7Z"/><circle cx="15" cy="8" r="1"/></>,
    store: <><path d="M4 10v10h16V10"/><path d="M3 4h18l-2 6H5L3 4Z"/><path d="M9 20v-6h6v6"/></>,
  };
  return <svg aria-hidden="true" className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function isAdminRouteActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <nav className="admin-sidebar-nav" aria-label="Administração">{adminNavigation.map((item, index) => { const heading = index === 0 || item.group !== adminNavigation[index - 1].group; return <div className="admin-nav-entry" key={item.href}>{heading && <p className="admin-nav-group">{item.group}</p>}<Link href={item.href} aria-current={isAdminRouteActive(pathname, item.href) ? "page" : undefined} onClick={onNavigate}><Icon name={item.icon}/><span>{item.label}</span></Link></div>; })}</nav>;
}

function pageTitle(pathname: string) {
  return adminNavigation.find((item) => isAdminRouteActive(pathname, item.href))?.label ?? "Administração";
}

export function AdminShell({ children, signOutAction }: { children: React.ReactNode; signOutAction: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    sidebar.current?.querySelector<HTMLAnchorElement>(".admin-sidebar-nav a")?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <div className={`admin-frame${open ? " nav-open" : ""}`}><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><aside ref={sidebar} className="admin-sidebar" id="admin-navigation"><div className="admin-brand"><Link href="/admin" aria-label="Garimora Admin, visão geral">Garimora<span>.</span></Link><small>Cockpit administrativo</small></div><AdminNavigation pathname={pathname} onNavigate={() => setOpen(false)}/><div className="admin-sidebar-footer"><span className="admin-protected"><i aria-hidden="true"/>Área protegida</span><form action={signOutAction}><button className="admin-logout" type="submit">Sair</button></form></div></aside>{open && <button className="admin-nav-scrim" aria-label="Fechar navegação" onClick={() => { setOpen(false); trigger.current?.focus(); }}/>}<div className="admin-workspace"><header className="admin-topbar"><button ref={trigger} className="admin-menu-button" type="button" aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen((value) => !value)}><span aria-hidden="true">☰</span><span className="sr-only">Menu administrativo</span></button><div><p>Área protegida</p><h1>{pageTitle(pathname)}</h1></div><span className="admin-context">Garimora Admin</span></header><main className="admin-main" id="conteudo">{children}</main></div></div>;
}
