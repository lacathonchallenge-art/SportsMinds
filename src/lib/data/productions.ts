import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EventStatus } from "@/lib/data/events";

export interface ProductionRow {
  id: string;
  title: string;
  slug: string;
  fmt: string | null;
  year: string | null;
  client: string | null;
  type: string | null;
  host: string | null;
  cover_image: string | null;
  video_url: string | null;
  short_description: string | null;
  long_description: string | null;
  status: EventStatus;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Public site — only published, ordered. */
export async function getPublishedProductions(): Promise<ProductionRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("productions")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  return (data ?? []) as ProductionRow[];
}

/** Admin — everything. */
export async function listAllProductions(): Promise<ProductionRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("productions")
    .select("*")
    .order("display_order", { ascending: true });
  return (data ?? []) as ProductionRow[];
}

export async function getProductionById(id: string): Promise<ProductionRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("productions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as ProductionRow | null) ?? null;
}
