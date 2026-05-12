"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser, requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { BLOCK_TYPES } from "./types";
import type { ActionResult, EventInput, UploadResult } from "./types";

/* ─── Upload ─── */

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_PREFIXES = ["image/", "video/"];

export async function uploadEventMedia(formData: FormData): Promise<UploadResult> {
  await requireUser();
  const raw = formData.get("file");
  if (!(raw instanceof File)) return { ok: false, error: "Aucun fichier reçu" };
  const file = raw;

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `Fichier trop volumineux (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB)` };
  }
  if (!ALLOWED_PREFIXES.some((p) => file.type.startsWith(p))) {
    return { ok: false, error: "Type non supporté (image ou vidéo seulement)" };
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().slice(0, 5);
  const random = Math.random().toString(36).slice(2, 10);
  const path = `events/${Date.now()}-${random}.${ext}`;

  const supabase = createSupabaseAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("event-media")
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data } = supabase.storage.from("event-media").getPublicUrl(path);
  const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

  return { ok: true, url: data.publicUrl, mediaType };
}

/* ─── Validation schemas ─── */

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const keyPointSchema = z.object({
  id: z.string().optional(),
  number: z.string().max(8).optional().nullable(),
  title: z.string().min(1, "Le titre est requis").max(160),
  description: z.string().max(500).optional().nullable(),
});

const mediaSchema = z.object({
  id: z.string().optional(),
  media_type: z.enum(["image", "video", "youtube", "vimeo"]).default("image"),
  url: z.string().url("URL invalide"),
  title: z.string().max(160).optional().nullable(),
  alt_text: z.string().max(240).optional().nullable(),
  is_main: z.boolean().optional().default(false),
});

/* ─── Page builder blocks ─── */

// BLOCK_TYPES and BlockType are re-imported from ./types (above)

const componentSchema = z.object({
  id: z.string().optional(),
  component_type: z.enum(BLOCK_TYPES),
  // We trust the form to send the right shape; persist as JSON.
  content_json: z.record(z.string(), z.unknown()).default({}),
});

const eventSchema = z.object({
  title: z.string().min(2, "Titre requis").max(160),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(slugRegex, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"),
  category: z.string().min(1, "Catégorie requise").max(60),
  location: z.string().max(120).optional().nullable(),
  period: z.string().max(120).optional().nullable(),
  badge: z.string().max(60).optional().nullable(),
  type: z.string().max(160).optional().nullable(),
  editions: z.string().max(120).optional().nullable(),
  cover_image: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  cover_video: z.string().url("URL invalide").or(z.literal("")).optional().nullable(),
  short_description: z.string().max(280).optional().nullable(),
  case_summary: z.string().max(4000).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  seo_title: z.string().max(120).optional().nullable(),
  seo_description: z.string().max(240).optional().nullable(),
  key_points: z.array(keyPointSchema).max(20).default([]),
  media: z.array(mediaSchema).max(40).default([]),
  components: z.array(componentSchema).max(40).default([]),
});

// EventInput and ActionResult are re-imported from ./types (above)

function flattenZodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    out[issue.path.join(".")] = issue.message;
  }
  return out;
}

/* ─── Create ─── */

export async function createEvent(input: EventInput): Promise<ActionResult> {
  await requireUser();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const { key_points, media, components, ...payload } = parsed.data;
  const supabase = createSupabaseAdminClient();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("events")
    .select("id")
    .eq("slug", payload.slug)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "Ce slug est déjà utilisé.", fieldErrors: { slug: "Déjà utilisé" } };
  }

  const cleaned = {
    ...payload,
    cover_image: payload.cover_image || null,
    cover_video: payload.cover_video || null,
    short_description: payload.short_description || null,
    case_summary: payload.case_summary || null,
    seo_title: payload.seo_title || null,
    seo_description: payload.seo_description || null,
    location: payload.location || null,
    period: payload.period || null,
    badge: payload.badge || null,
    type: payload.type || null,
    editions: payload.editions || null,
  };

  const { data: inserted, error } = await supabase
    .from("events")
    .insert(cleaned)
    .select("id")
    .single();
  if (error || !inserted) {
    return { ok: false, error: error?.message || "Échec de la création" };
  }

  const eventId = inserted.id as string;
  if (key_points.length > 0) {
    await supabase.from("event_key_points").insert(
      key_points.map((k, i) => ({
        event_id: eventId,
        number: k.number || null,
        title: k.title,
        description: k.description || null,
        display_order: i,
      })),
    );
  }
  if (media.length > 0) {
    await supabase.from("event_media").insert(
      media.map((m, i) => ({
        event_id: eventId,
        media_type: m.media_type,
        url: m.url,
        title: m.title || null,
        alt_text: m.alt_text || null,
        display_order: i,
        is_main: !!m.is_main,
      })),
    );
  }
  if (components.length > 0) {
    await supabase.from("event_components").insert(
      components.map((c, i) => ({
        event_id: eventId,
        component_type: c.component_type,
        component_order: i,
        content_json: c.content_json,
      })),
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  return { ok: true, id: eventId };
}

/* ─── Update ─── */

export async function updateEvent(id: string, input: EventInput): Promise<ActionResult> {
  await requireUser();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Validation échouée", fieldErrors: flattenZodErrors(parsed.error) };
  }
  const { key_points, media, components, ...payload } = parsed.data;
  const supabase = createSupabaseAdminClient();

  // Check slug uniqueness (excluding self)
  const { data: clash } = await supabase
    .from("events")
    .select("id")
    .eq("slug", payload.slug)
    .neq("id", id)
    .maybeSingle();
  if (clash) {
    return { ok: false, error: "Ce slug est déjà utilisé.", fieldErrors: { slug: "Déjà utilisé" } };
  }

  const cleaned = {
    ...payload,
    cover_image: payload.cover_image || null,
    cover_video: payload.cover_video || null,
    short_description: payload.short_description || null,
    case_summary: payload.case_summary || null,
    seo_title: payload.seo_title || null,
    seo_description: payload.seo_description || null,
    location: payload.location || null,
    period: payload.period || null,
    badge: payload.badge || null,
    type: payload.type || null,
    editions: payload.editions || null,
  };

  const { error } = await supabase.from("events").update(cleaned).eq("id", id);
  if (error) return { ok: false, error: error.message };

  // Replace key_points & media (simpler than diffing)
  await supabase.from("event_key_points").delete().eq("event_id", id);
  if (key_points.length > 0) {
    await supabase.from("event_key_points").insert(
      key_points.map((k, i) => ({
        event_id: id,
        number: k.number || null,
        title: k.title,
        description: k.description || null,
        display_order: i,
      })),
    );
  }

  await supabase.from("event_media").delete().eq("event_id", id);
  if (media.length > 0) {
    await supabase.from("event_media").insert(
      media.map((m, i) => ({
        event_id: id,
        media_type: m.media_type,
        url: m.url,
        title: m.title || null,
        alt_text: m.alt_text || null,
        display_order: i,
        is_main: !!m.is_main,
      })),
    );
  }

  await supabase.from("event_components").delete().eq("event_id", id);
  if (components.length > 0) {
    await supabase.from("event_components").insert(
      components.map((c, i) => ({
        event_id: id,
        component_type: c.component_type,
        component_order: i,
        content_json: c.content_json,
      })),
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}/edit`);
  return { ok: true, id };
}

/* ─── Delete ─── */

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  return { ok: true };
}

/* ─── Toggle status / featured ─── */

export async function toggleStatus(id: string, current: "draft" | "published"): Promise<ActionResult> {
  await requireUser();
  const next = current === "published" ? "draft" : "published";
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").update({ status: next }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/events");
  return { ok: true };
}

export async function toggleFeatured(id: string, current: boolean): Promise<ActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("events").update({ featured: !current }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/events");
  return { ok: true };
}

/* ─── Duplicate ─── */

export async function duplicateEvent(id: string): Promise<ActionResult> {
  await requireUser();
  const supabase = createSupabaseAdminClient();
  const { data: src } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (!src) return { ok: false, error: "Événement introuvable" };

  const suffix = Math.random().toString(36).slice(2, 7);
  const newSlug = `${src.slug}-copy-${suffix}`;
  const { id: _ignored, created_at: _c, updated_at: _u, ...rest } = src;

  const { data: inserted, error } = await supabase
    .from("events")
    .insert({
      ...rest,
      slug: newSlug,
      title: `${src.title} (copie)`,
      status: "draft",
      featured: false,
    })
    .select("id")
    .single();
  if (error || !inserted) return { ok: false, error: error?.message || "Échec de la duplication" };

  const newId = inserted.id as string;

  // Copy key_points
  const { data: kp } = await supabase.from("event_key_points").select("*").eq("event_id", id);
  if (kp && kp.length > 0) {
    await supabase.from("event_key_points").insert(
      kp.map((k) => ({
        event_id: newId,
        number: k.number,
        title: k.title,
        description: k.description,
        display_order: k.display_order,
      })),
    );
  }
  // Copy media
  const { data: md } = await supabase.from("event_media").select("*").eq("event_id", id);
  if (md && md.length > 0) {
    await supabase.from("event_media").insert(
      md.map((m) => ({
        event_id: newId,
        media_type: m.media_type,
        url: m.url,
        title: m.title,
        alt_text: m.alt_text,
        display_order: m.display_order,
        is_main: m.is_main,
      })),
    );
  }

  revalidatePath("/admin/events");
  return { ok: true, id: newId };
}

/* ─── Helper: redirect after create (called from form on success) ─── */

export async function goToEditPage(id: string) {
  await requireAdmin().catch(() => requireUser());
  redirect(`/admin/events/${id}/edit?message=Événement+enregistré+avec+succès`);
}
