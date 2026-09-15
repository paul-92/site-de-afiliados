import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/admin/admin-shell";
import { signOutAction } from "@/admin/actions";
import { getAdminBoundaryState } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = await getAdminBoundaryState();
  if (!state.authenticated) redirect("/admin-access-denied");
  return <AdminShell signOutAction={signOutAction}>{children}</AdminShell>;
}
