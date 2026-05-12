/**
 * Shared types for the Pages CMS admin. Kept out of `actions.ts` because
 * Next.js requires "use server" files to export ONLY async functions.
 */

export interface CmsResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

export interface LinkContent {
  label?: string;
  href?: string;
}

export interface SectionContentJson {
  eyebrow?: string;
  subhead?: string;
  body?: string;
  badge?: string;
  cta_primary?: LinkContent;
  cta_secondary?: LinkContent;
  [key: string]: unknown;
}

export interface SectionMediaJson {
  image?: string;
  image_alt?: string;
  image_secondary?: string;
  video?: string;
  [key: string]: unknown;
}

export interface SectionSettingsJson {
  theme?: "dark" | "light" | "default";
  overlay?: boolean;
  animate?: boolean;
  [key: string]: unknown;
}

export interface SectionUpdateInput {
  title?: string | null;
  subtitle?: string | null;
  content_json: SectionContentJson;
  media_json: SectionMediaJson;
  settings_json: SectionSettingsJson;
  is_visible: boolean;
  status: "draft" | "published";
}

export interface ItemInput {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  media_url?: string | null;
  icon?: string | null;
  link_url?: string | null;
  display_order: number;
  is_visible: boolean;
  content_json: Record<string, unknown>;
  item_type: string;
}
