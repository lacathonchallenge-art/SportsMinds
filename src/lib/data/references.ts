import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface BrandReferenceRow {
  id: string;
  brand_name: string;
  logo_url: string | null;
  category: string | null;
  link: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

/** Public site: only visible refs, ordered. */
export async function getVisibleReferences(): Promise<BrandReferenceRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("brand_references")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as BrandReferenceRow[];
}

/** Admin: all. */
export async function listAllReferences(): Promise<BrandReferenceRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("brand_references")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []) as BrandReferenceRow[];
}

export async function getReferenceById(id: string): Promise<BrandReferenceRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("brand_references")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as BrandReferenceRow | null) ?? null;
}
