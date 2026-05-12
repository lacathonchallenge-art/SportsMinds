import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/auth";

export interface AppUserRow {
  id: string;
  email: string;
  role: AppRole;
  created_at: string;
}

export async function listUsers(): Promise<AppUserRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,email,role,created_at")
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as AppUserRow[];
}
