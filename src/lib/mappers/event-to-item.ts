import type { EventItem } from "@/components/sections/Events";
import type { EventWithRelations } from "@/lib/data/events";

/**
 * Maps a Supabase row (events + key_points + media) into the shape the
 * public <Events/> component expects.
 */
export function eventRowToItem(e: EventWithRelations): EventItem {
  const main = e.media.find((m) => m.is_main) ?? e.media[0] ?? null;
  return {
    name: e.title,
    cat: e.category,
    scope: e.type || "",
    edition: e.editions || "",
    loc: e.location || "",
    year: e.period || "",
    featured: e.featured,
    image: e.cover_image || main?.url || "",
    description: e.case_summary || e.short_description || "",
    highlights: e.key_points.map((k) => k.title),
    gallery: e.media.map((m) => ({
      url: m.url,
      type: m.media_type === "video" ? "video" : "image",
    })),
    blocks: e.components.map((c) => ({
      type: c.component_type,
      content: c.content_json,
    })),
  };
}
