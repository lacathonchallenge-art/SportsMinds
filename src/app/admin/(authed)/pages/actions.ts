"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CmsResult, ItemInput, SectionUpdateInput } from "./types";

/* ─── Schemas ─── */

const linkSchema = z.object({
  label: z.string().max(80).optional().default(""),
  href: z.string().max(240).optional().default(""),
});

const contentSchema = z
  .object({
    eyebrow: z.string().max(160).optional().default(""),
    subhead: z.string().max(400).optional().default(""),
    body: z.string().max(8000).optional().default(""),
    badge: z.string().max(80).optional().default(""),
    cta_primary: linkSchema.optional(),
    cta_secondary: linkSchema.optional(),
  })
  .catchall(z.unknown());

const mediaSchema = z
  .object({
    image: z.string().url().or(z.literal("")).optional().default(""),
    image_alt: z.string().max(240).optional().default(""),
    image_secondary: z.string().url().or(z.literal("")).optional().default(""),
    video: z.string().url().or(z.literal("")).optional().default(""),
  })
  .catchall(z.unknown());

const settingsSchema = z
  .object({
    theme: z.enum(["dark", "light", "default"]).optional().default("default"),
    overlay: z.boolean().optional(),
    animate: z.boolean().optional(),
  })
  .catchall(z.unknown());

const sectionUpdateSchema = z.object({
  title: z.string().max(240).optional().nullable(),
  subtitle: z.string().max(240).optional().nullable(),
  content_json: contentSchema,
  media_json: mediaSchema,
  settings_json: settingsSchema,
  is_visible: z.boolean().default(true),
  status: z.enum(["draft", "published"]).default("published"),
});

const itemSchema = z.object({
  title: z.string().max(240).optional().nullable(),
  subtitle: z.string().max(240).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
  media_url: z.string().url().or(z.literal("")).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  link_url: z.string().max(240).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_visible: z.boolean().default(true),
  content_json: z.record(z.string(), z.unknown()).default({}),
  item_type: z.string().max(40).default("generic"),
});

function flatten(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[i.path.join(".")] = i.message;
  return out;
}

/* ─── Page ─── */

export async function updatePageMeta(
  id: string,
  meta: { title?: string; seo_title?: string; seo_description?: string; status?: "draft" | "published" },
): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("pages")
    .update({
      title: meta.title ?? null,
      seo_title: meta.seo_title ?? null,
      seo_description: meta.seo_description ?? null,
      status: meta.status ?? "published",
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  // We don't know the slug here so revalidate the home and about as a safety net
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages");
  return { ok: true, id };
}

/* ─── Section ─── */

export async function updateSection(
  id: string,
  input: SectionUpdateInput,
  pageSlug: string,
): Promise<CmsResult> {
  await requireUser();
  const parsed = sectionUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flatten(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("page_sections")
    .update({
      title: parsed.data.title ?? null,
      subtitle: parsed.data.subtitle ?? null,
      content_json: parsed.data.content_json,
      media_json: parsed.data.media_json,
      settings_json: parsed.data.settings_json,
      is_visible: parsed.data.is_visible,
      status: parsed.data.status,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  if (pageSlug === "home") revalidatePath("/");
  else revalidatePath(`/${pageSlug === "about" ? "qui-sommes-nous" : pageSlug}`);
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true, id };
}

export async function toggleSectionVisible(
  id: string,
  current: boolean,
  pageSlug: string,
): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("page_sections")
    .update({ is_visible: !current })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}

export async function reorderSections(
  pageSlug: string,
  ids: string[],
): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("page_sections").update({ display_order: i }).eq("id", id),
    ),
  );
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}

/* ─── Items ─── */

export async function createItem(
  sectionId: string,
  pageSlug: string,
  input: ItemInput,
): Promise<CmsResult> {
  await requireUser();
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flatten(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("section_items")
    .insert({
      section_id: sectionId,
      item_type: parsed.data.item_type,
      title: parsed.data.title ?? null,
      subtitle: parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      media_url: parsed.data.media_url || null,
      icon: parsed.data.icon || null,
      link_url: parsed.data.link_url || null,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
      content_json: parsed.data.content_json,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Échec" };
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true, id: data.id };
}

export async function updateItem(
  id: string,
  pageSlug: string,
  input: ItemInput,
): Promise<CmsResult> {
  await requireUser();
  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flatten(parsed.error) };
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("section_items")
    .update({
      item_type: parsed.data.item_type,
      title: parsed.data.title ?? null,
      subtitle: parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      media_url: parsed.data.media_url || null,
      icon: parsed.data.icon || null,
      link_url: parsed.data.link_url || null,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
      content_json: parsed.data.content_json,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true, id };
}

export async function deleteItem(id: string, pageSlug: string): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("section_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}

export async function reorderItems(
  pageSlug: string,
  ids: string[],
): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  await Promise.all(
    ids.map((id, i) =>
      supabase.from("section_items").update({ display_order: i }).eq("id", id),
    ),
  );
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}

/* ─── Seed defaults for known sections ─── */

const EXPERTISE_DEFAULTS = [
  {
    title: "Communication événementielle",
    subtitle: "STRATEGY",
    description:
      "Plans 360°, déploiement multi-canal et orchestration de campagnes sportives à forte visibilité.",
    media_url:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    capabilities: [
      "Plan stratégique",
      "Direction artistique",
      "Relations presse",
      "RP & influence",
    ],
  },
  {
    title: "Conception et production d'événements sportifs",
    subtitle: "EVENTS",
    description:
      "De la première esquisse à la cérémonie finale — concept, scénographie, logistique et opérations sur site.",
    media_url:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80",
    capabilities: ["Scénographie", "Logistique", "Sécurité", "Régie générale"],
  },
  {
    title: "Production télévisée et radio",
    subtitle: "BROADCAST",
    description:
      "Magazines, capsules, plateaux et captations multi-caméras pour les diffuseurs nationaux et internationaux.",
    media_url:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    capabilities: [
      "Captation multicam",
      "Plateaux TV",
      "Post-production",
      "Habillage antenne",
    ],
  },
  {
    title: "Droit d'image de sportifs professionnels",
    subtitle: "TALENT",
    description:
      "Représentation, contrats d'image et placements de talents pour fédérations, marques et clubs.",
    media_url:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    capabilities: ["Négociation", "Placement", "Contrats", "Suivi"],
  },
  {
    title: "Activation de marque & sponsoring",
    subtitle: "BRAND",
    description:
      "Brand experience, fan zones, naming, content & social — l'activation qui transforme la visibilité en préférence.",
    media_url:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    capabilities: [
      "Fan experience",
      "Naming",
      "Hospitality",
      "Content social",
    ],
  },
  {
    title: "Conseil en stratégie de communication",
    subtitle: "ADVISORY",
    description:
      "Diagnostic, positionnement et roadmap — un partenariat long-terme pour ancrer les marques dans le sport.",
    media_url:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    capabilities: ["Diagnostic", "Positionnement", "Roadmap", "KPI & mesure"],
  },
];

export async function seedExpertiseItems(
  sectionId: string,
  pageSlug: string,
): Promise<CmsResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  // Skip if any item already exists
  const { count } = await supabase
    .from("section_items")
    .select("id", { count: "exact", head: true })
    .eq("section_id", sectionId);
  if ((count ?? 0) > 0) {
    return { ok: false, error: "Cette section contient déjà des items." };
  }
  const rows = EXPERTISE_DEFAULTS.map((e, i) => ({
    section_id: sectionId,
    item_type: "expertise",
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    media_url: e.media_url,
    display_order: i,
    is_visible: true,
    content_json: { capabilities: e.capabilities },
  }));
  const { error } = await supabase.from("section_items").insert(rows);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}
