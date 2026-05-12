import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EventStatus } from "@/lib/data/events";

export interface PageRow {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface SectionRow {
  id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content_json: Record<string, unknown>;
  media_json: Record<string, unknown>;
  settings_json: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface SectionItemRow {
  id: string;
  section_id: string;
  item_type: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  media_url: string | null;
  icon: string | null;
  link_url: string | null;
  display_order: number;
  is_visible: boolean;
  content_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PageWithSections extends PageRow {
  sections: (SectionRow & { items: SectionItemRow[] })[];
}

/** Admin: all pages. */
export async function listPages(): Promise<PageRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("name", { ascending: true });
  return (data ?? []) as PageRow[];
}

/** Admin: page + all sections (any visibility/status). */
export async function getPageBySlugAdmin(slug: string): Promise<PageWithSections | null> {
  const supabase = createSupabaseAdminClient();
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!page) return null;
  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("display_order", { ascending: true });
  const sectionRows = (sections ?? []) as SectionRow[];
  const ids = sectionRows.map((s) => s.id);
  let items: SectionItemRow[] = [];
  if (ids.length > 0) {
    const { data: itemsData } = await supabase
      .from("section_items")
      .select("*")
      .in("section_id", ids)
      .order("display_order", { ascending: true });
    items = (itemsData ?? []) as SectionItemRow[];
  }
  return {
    ...(page as PageRow),
    sections: sectionRows.map((s) => ({
      ...s,
      items: items.filter((it) => it.section_id === s.id),
    })),
  };
}

/** Public: only visible + published sections, indexed by section_key. */
export async function getPublishedPage(slug: string): Promise<{
  page: PageRow;
  sections: Record<string, SectionRow & { items: SectionItemRow[] }>;
} | null> {
  const supabase = createSupabaseAdminClient();
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!page) return null;
  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  const sectionRows = (sections ?? []) as SectionRow[];
  const ids = sectionRows.map((s) => s.id);
  let items: SectionItemRow[] = [];
  if (ids.length > 0) {
    const { data: itemsData } = await supabase
      .from("section_items")
      .select("*")
      .in("section_id", ids)
      .eq("is_visible", true)
      .order("display_order", { ascending: true });
    items = (itemsData ?? []) as SectionItemRow[];
  }
  const map: Record<string, SectionRow & { items: SectionItemRow[] }> = {};
  for (const s of sectionRows) {
    map[s.section_key] = { ...s, items: items.filter((it) => it.section_id === s.id) };
  }
  return { page: page as PageRow, sections: map };
}

export async function getSectionById(id: string): Promise<(SectionRow & { items: SectionItemRow[] }) | null> {
  const supabase = createSupabaseAdminClient();
  const { data: section } = await supabase
    .from("page_sections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!section) return null;
  const { data: items } = await supabase
    .from("section_items")
    .select("*")
    .eq("section_id", id)
    .order("display_order", { ascending: true });
  return { ...(section as SectionRow), items: (items ?? []) as SectionItemRow[] };
}
