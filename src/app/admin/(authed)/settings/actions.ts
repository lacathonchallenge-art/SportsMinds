"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SettingsActionResult } from "./types";

const roleSchema = z.enum(["admin", "editor"]);

export async function setUserRole(
  userId: string,
  role: "admin" | "editor",
): Promise<SettingsActionResult> {
  const me = await requireAdmin();
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { ok: false, error: "Rôle invalide" };

  // Safety: don't let an admin demote themselves to editor — that would
  // lock them out of the settings page on the next page load.
  if (userId === me.id && role !== "admin") {
    return { ok: false, error: "Tu ne peux pas te rétrograder toi-même." };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings");
  return { ok: true };
}
