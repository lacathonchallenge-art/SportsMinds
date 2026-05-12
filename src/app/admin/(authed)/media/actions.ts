"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MediaActionResult } from "./types";

const BUCKET = "event-media";

export async function deleteMediaFile(path: string): Promise<MediaActionResult> {
  await requireUser();
  if (!path.startsWith("events/")) {
    return { ok: false, error: "Chemin non autorisé" };
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}
