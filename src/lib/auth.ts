import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AppRole = "admin" | "editor";

export interface AppUser {
  id: string;
  email: string;
  role: AppRole;
}

/**
 * Returns the currently authenticated user with their app role.
 * Returns null if there is no session or if the user has no profile row yet.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  // Read role with service role so we bypass any RLS edge cases.
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("id,email,role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Fallback: trigger should have inserted, but if it failed, do it now.
    const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
    const role: AppRole = isAdminEmail ? "admin" : "editor";
    await admin
      .from("users")
      .upsert({ id: user.id, email: user.email, role }, { onConflict: "id" });
    return { id: user.id, email: user.email, role };
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as AppRole,
  };
}

/** Server-side guard: redirect to /admin/login when not authed. */
export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Server-side guard: must be admin (e.g. for /admin/settings). */
export async function requireAdmin(): Promise<AppUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
