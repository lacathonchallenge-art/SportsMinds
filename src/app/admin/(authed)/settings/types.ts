/**
 * Shared types for the Settings admin.
 * Kept out of "use server" files (Next 16 restriction: only async exports).
 */

export interface SettingsActionResult {
  ok: boolean;
  error?: string;
}
