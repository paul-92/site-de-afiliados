import { redirect } from "next/navigation";
import { AdminNav } from "@/admin/components";
import { getAdminBoundaryState } from "@/lib/admin-auth";
import { signOutAction } from "@/admin/actions";
export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) { const state = await getAdminBoundaryState(); if (!state.authenticated) redirect("/admin-access-denied"); return <div className="admin-shell"><div className="split admin-heading"><div><p className="eyebrow">Área protegida</p><h1>Administração</h1></div><form action={signOutAction}><button className="secondary">Sair</button></form></div><AdminNav />{children}</div>; }
