"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RefActionResult, ReferenceInput } from "./types";

const refSchema = z.object({
  brand_name: z.string().min(1, "Nom requis").max(120),
  logo_url: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  category: z.string().max(60).optional().nullable(),
  link: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
});

// ReferenceInput and RefActionResult are imported from ./types (above)

function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) out[issue.path.join(".")] = issue.message;
  return out;
}

function cleanRef(p: ReferenceInput) {
  return {
    brand_name: p.brand_name,
    logo_url: p.logo_url || null,
    category: p.category || null,
    link: p.link || null,
    display_order: p.display_order,
    is_visible: p.is_visible,
  };
}

export async function createReference(input: ReferenceInput): Promise<RefActionResult> {
  await requireUser();
  const parsed = refSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brand_references")
    .insert(cleanRef(parsed.data))
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Échec" };
  revalidatePath("/");
  revalidatePath("/admin/references");
  return { ok: true, id: data.id };
}

export async function updateReference(id: string, input: ReferenceInput): Promise<RefActionResult> {
  await requireUser();
  const parsed = refSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("brand_references").update(cleanRef(parsed.data)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/references");
  return { ok: true, id };
}

export async function deleteReference(id: string): Promise<RefActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("brand_references").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/references");
  return { ok: true };
}

export async function toggleRefVisibility(id: string, current: boolean): Promise<RefActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("brand_references")
    .update({ is_visible: !current })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/references");
  return { ok: true };
}

export async function reorderReferences(ids: string[]): Promise<RefActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  // Naïve: update display_order one by one.
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("brand_references").update({ display_order: i }).eq("id", id),
    ),
  );
  revalidatePath("/");
  revalidatePath("/admin/references");
  return { ok: true };
}
