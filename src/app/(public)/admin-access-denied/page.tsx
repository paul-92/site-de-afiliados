import type { Metadata } from "next";
import { getAdminBoundaryState } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { signInAction } from "./actions";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function AccessDeniedPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const state = await getAdminBoundaryState(); if (state.authenticated) redirect("/admin"); const query = await searchParams; return <section className="card narrow"><p className="eyebrow">Acesso protegido</p><h1>Autenticação necessária</h1><p>Entre com uma conta administrativa autorizada para acessar o cockpit.</p>{query.error && <p className="notice" role="alert">{query.error}</p>}<form action={signInAction} className="stack-form"><label>E-mail<input name="email" type="email" autoComplete="username" required/></label><label>Senha<input name="password" type="password" autoComplete="current-password" required/></label><button>Entrar</button></form><p className="muted">A sessão é validada pelo Supabase no servidor e o usuário precisa constar na allowlist administrativa.</p></section>; }
