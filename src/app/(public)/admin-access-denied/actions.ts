"use server";
import { redirect } from "next/navigation";
import { createMutableAuthClient } from "@/lib/admin-auth";
import { withRuntimeTiming } from "@/lib/runtime-timing";
export async function signInAction(data: FormData) { const email = String(data.get("email") ?? "").trim(); const password = String(data.get("password") ?? ""); if (!email || !password || email.length > 320 || password.length > 200) redirect("/admin-access-denied?error=Credenciais%20inválidas"); const supabase = await createMutableAuthClient(); const { error } = await withRuntimeTiming("AUTH", "supabase-sign-in-with-password", () => supabase.auth.signInWithPassword({ email, password })); if (error) redirect("/admin-access-denied?error=Credenciais%20inválidas"); redirect("/admin"); }
