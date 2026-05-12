import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type EventStatus = "draft" | "published";

export interface EventRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  period: string | null;
  badge: string | null;
  type: string | null;
  editions: string | null;
  cover_image: string | null;
  cover_video: string | null;
  short_description: string | null;
  case_summary: string | null;
  status: EventStatus;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventKeyPoint {
  id: string;
  event_id: string;
  number: string | null;
  title: string;
  description: string | null;
  display_order: number;
}

export interface EventMedia {
  id: string;
  event_id: string;
  media_type: "image" | "video" | "youtube" | "vimeo";
  url: string;
  title: string | null;
  alt_text: string | null;
  display_order: number;
  is_main: boolean;
}

export interface EventComponent {
  id: string;
  event_id: string;
  component_type: string;
  component_order: number;
  content_json: Record<string, unknown>;
}

export interface EventWithRelations extends EventRow {
  key_points: EventKeyPoint[];
  media: EventMedia[];
  components: EventComponent[];
}

/** Public site: only published events. */
export async function getPublishedEvents(): Promise<EventWithRelations[]> {
  const supabase = createSupabaseAdminClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error || !events) return [];

  const ids = events.map((e) => e.id);
  if (ids.length === 0) {
    return events.map((e) => ({ ...(e as EventRow), key_points: [], media: [], components: [] }));
  }

  const [{ data: kpRows }, { data: mediaRows }, { data: compRows }] = await Promise.all([
    supabase
      .from("event_key_points")
      .select("*")
      .in("event_id", ids)
      .order("display_order"),
    supabase
      .from("event_media")
      .select("*")
      .in("event_id", ids)
      .order("display_order"),
    supabase
      .from("event_components")
      .select("*")
      .in("event_id", ids)
      .order("component_order"),
  ]);

  const kp = (kpRows ?? []) as EventKeyPoint[];
  const md = (mediaRows ?? []) as EventMedia[];
  const cmp = (compRows ?? []) as EventComponent[];

  return (events as EventRow[]).map((e) => ({
    ...e,
    key_points: kp.filter((k) => k.event_id === e.id),
    media: md.filter((m) => m.event_id === e.id),
    components: cmp.filter((c) => c.event_id === e.id),
  }));
}

/** Admin: all events (any status). */
export async function listAllEvents(): Promise<EventRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as EventRow[];
}

/** Admin: single event + relations for the edit form. */
export async function getEventById(id: string): Promise<EventWithRelations | null> {
  const supabase = createSupabaseAdminClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!event) return null;
  const [{ data: kp }, { data: md }, { data: cmp }] = await Promise.all([
    supabase
      .from("event_key_points")
      .select("*")
      .eq("event_id", id)
      .order("display_order"),
    supabase
      .from("event_media")
      .select("*")
      .eq("event_id", id)
      .order("display_order"),
    supabase
      .from("event_components")
      .select("*")
      .eq("event_id", id)
      .order("component_order"),
  ]);
  return {
    ...(event as EventRow),
    key_points: (kp ?? []) as EventKeyPoint[],
    media: (md ?? []) as EventMedia[],
    components: (cmp ?? []) as EventComponent[],
  };
}
