import { getAdminBoundaryState } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export default async function AdminPage() { const state = await getAdminBoundaryState(); return <section className="card"><h1>Admin</h1><p>{state.authenticated ? "Boundary administrativo autorizado." : "Boundary administrativo protegido; autenticação ainda não fornecida."}</p></section>; }
