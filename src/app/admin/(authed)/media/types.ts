/**
 * Shared types for the Media admin.
 * Kept out of "use server" files (Next 16 restriction: only async exports).
 */

export interface MediaActionResult {
  ok: boolean;
  error?: string;
}
