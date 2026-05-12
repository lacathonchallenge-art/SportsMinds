/**
 * Shared types for the References admin.
 * Kept out of "use server" files (Next 16 restriction: only async exports).
 */

export interface RefActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

export interface ReferenceInput {
  brand_name: string;
  logo_url?: string | null;
  category?: string | null;
  link?: string | null;
  display_order: number;
  is_visible: boolean;
}
