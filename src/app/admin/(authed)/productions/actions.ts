"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProdActionResult, ProductionInput } from "./types";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const prodSchema = z.object({
  title: z.string().min(2, "Titre requis").max(160),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(slugRegex, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"),
  fmt: z.enum(["TV", "RADIO"]).default("TV"),
  year: z.string().max(60).optional().nullable(),
  client: z.string().max(120).optional().nullable(),
  type: z.string().max(160).optional().nullable(),
  host: z.string().max(120).optional().nullable(),
  cover_image: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  video_url: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  short_description: z.string().max(280).optional().nullable(),
  long_description: z.string().max(4000).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
});

// ProductionInput and ProdActionResult are imported from ./types (above)

function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) out[issue.path.join(".")] = issue.message;
  return out;
}

function clean(p: ProductionInput) {
  return {
    title: p.title,
    slug: p.slug,
    fmt: p.fmt,
    year: p.year || null,
    client: p.client || null,
    type: p.type || null,
    host: p.host || null,
    cover_image: p.cover_image || null,
    video_url: p.video_url || null,
    short_description: p.short_description || null,
    long_description: p.long_description || null,
    status: p.status,
    featured: p.featured,
    display_order: p.display_order,
  };
}

export async function createProduction(input: ProductionInput): Promise<ProdActionResult> {
  await requireUser();
  const parsed = prodSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  // slug uniqueness
  const { data: clash } = await supabase
    .from("productions")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (clash) {
    return { ok: false, error: "Slug déjà utilisé", fieldErrors: { slug: "Déjà utilisé" } };
  }
  const { data, error } = await supabase
    .from("productions")
    .insert(clean(parsed.data))
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Échec" };
  revalidatePath("/");
  revalidatePath("/admin/productions");
  return { ok: true, id: data.id };
}

export async function updateProduction(
  id: string,
  input: ProductionInput,
): Promise<ProdActionResult> {
  await requireUser();
  const parsed = prodSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { data: clash } = await supabase
    .from("productions")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", id)
    .maybeSingle();
  if (clash) {
    return { ok: false, error: "Slug déjà utilisé", fieldErrors: { slug: "Déjà utilisé" } };
  }
  const { error } = await supabase.from("productions").update(clean(parsed.data)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/productions");
  return { ok: true, id };
}

export async function deleteProduction(id: string): Promise<ProdActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("productions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/productions");
  return { ok: true };
}

export async function toggleProductionStatus(
  id: string,
  current: "draft" | "published",
): Promise<ProdActionResult> {
  await requireUser();
  const next = current === "published" ? "draft" : "published";
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("productions").update({ status: next }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/productions");
  return { ok: true };
}

export async function reorderProductions(ids: string[]): Promise<ProdActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("productions").update({ display_order: i }).eq("id", id),
    ),
  );
  revalidatePath("/");
  revalidatePath("/admin/productions");
  return { ok: true };
}
