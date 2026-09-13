import { headers } from "next/headers";

export type AdminBoundaryState = { authenticated: boolean; userId: string | null };

export function authorizeAdmin(userId: string | null, allowedIds = process.env.ADMIN_USER_IDS ?? ""): AdminBoundaryState {
  const allowed = new Set(allowedIds.split(",").map((id) => id.trim()).filter(Boolean));
  return { authenticated: Boolean(userId && allowed.has(userId)), userId };
}

export async function getAdminBoundaryState(): Promise<AdminBoundaryState> {
  const requestHeaders = await headers();
  return authorizeAdmin(requestHeaders.get("x-supabase-user-id"));
}
