/**
 * Shared types for the Productions admin.
 * Kept out of "use server" files (Next 16 restriction: only async exports).
 */

export interface ProdActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

export interface ProductionInput {
  title: string;
  slug: string;
  fmt: "TV" | "RADIO";
  year?: string | null;
  client?: string | null;
  type?: string | null;
  host?: string | null;
  cover_image?: string | null;
  video_url?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  status: "draft" | "published";
  featured: boolean;
  display_order: number;
}
