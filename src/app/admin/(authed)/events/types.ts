/**
 * Shared types + runtime constants for the Events admin.
 * Kept out of "use server" files (Next 16 restriction: only async exports).
 */

export const BLOCK_TYPES = ["text", "gallery", "quote", "cta", "image-text", "stats"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface ActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  mediaType?: "image" | "video";
  error?: string;
}

export interface EventKeyPointInput {
  id?: string;
  number?: string | null;
  title: string;
  description?: string | null;
}

export interface EventMediaInput {
  id?: string;
  media_type: "image" | "video" | "youtube" | "vimeo";
  url: string;
  title?: string | null;
  alt_text?: string | null;
  is_main?: boolean;
}

export interface EventComponentInput {
  id?: string;
  component_type: BlockType;
  content_json: Record<string, unknown>;
}

export interface EventInput {
  title: string;
  slug: string;
  category: string;
  location?: string | null;
  period?: string | null;
  badge?: string | null;
  type?: string | null;
  editions?: string | null;
  cover_image?: string | null;
  cover_video?: string | null;
  short_description?: string | null;
  case_summary?: string | null;
  status: "draft" | "published";
  featured: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  key_points: EventKeyPointInput[];
  media: EventMediaInput[];
  components: EventComponentInput[];
}
