import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export type AdminBoundaryState = { authenticated: boolean; userId: string | null };

export function authorizeAdmin(userId: string | null, allowedIds = process.env.ADMIN_USER_IDS ?? ""): AdminBoundaryState {
  const allowed = new Set(allowedIds.split(",").map((id) => id.trim()).filter(Boolean));
  return { authenticated: Boolean(userId && allowed.has(userId)), userId };
}

export async function getAdminBoundaryState(): Promise<AdminBoundaryState> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return authorizeAdmin(null);
  const store = await cookies();
  const supabase = createServerClient(url, key, { cookies: { getAll: () => store.getAll(), setAll: () => undefined } });
  const { data, error } = await supabase.auth.getUser();
  return authorizeAdmin(error ? null : (data.user?.id ?? null));
}

export async function createMutableAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("AUTH_NOT_CONFIGURED");
  const store = await cookies();
  return createServerClient(url, key, { cookies: { getAll: () => store.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => store.set(name, value, options)) } });
}
