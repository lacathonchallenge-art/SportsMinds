"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Save,
  X,
  Eye,
  Send,
} from "lucide-react";
import type { EventWithRelations } from "@/lib/data/events";
import { createEvent, updateEvent } from "../actions";
import type { EventInput } from "../types";
import { MediaInput, type MediaKind } from "./MediaInput";
import { PageBuilder, type BlockDraft, type BlockType } from "./PageBuilder";

type Mode = "create" | "edit";

interface KeyPointDraft {
  number: string;
  title: string;
  description: string;
}
interface MediaDraft {
  url: string;
  alt_text: string;
  type: MediaKind;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function emptyDraft() {
  return {
    title: "",
    slug: "",
    category: "Football",
    location: "",
    period: "",
    badge: "",
    type: "",
    editions: "",
    cover_image: "",
    cover_video: "",
    short_description: "",
    case_summary: "",
    status: "draft" as "draft" | "published",
    featured: false,
    seo_title: "",
    seo_description: "",
  };
}

export function EventForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: EventWithRelations;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Main field state
  const [data, setData] = useState(() => {
    if (initial) {
      return {
        title: initial.title,
        slug: initial.slug,
        category: initial.category,
        location: initial.location ?? "",
        period: initial.period ?? "",
        badge: initial.badge ?? "",
        type: initial.type ?? "",
        editions: initial.editions ?? "",
        cover_image: initial.cover_image ?? "",
        cover_video: initial.cover_video ?? "",
        short_description: initial.short_description ?? "",
        case_summary: initial.case_summary ?? "",
        status: initial.status,
        featured: initial.featured,
        seo_title: initial.seo_title ?? "",
        seo_description: initial.seo_description ?? "",
      };
    }
    return emptyDraft();
  });

  // Slug auto-fill from title when in create mode and slug is empty/untouched
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  useEffect(() => {
    if (!slugTouched && data.title) {
      setData((d) => ({ ...d, slug: slugify(d.title) }));
    }
  }, [data.title, slugTouched]);

  const [keyPoints, setKeyPoints] = useState<KeyPointDraft[]>(() =>
    initial
      ? initial.key_points.map((k) => ({
          number: k.number ?? "",
          title: k.title,
          description: k.description ?? "",
        }))
      : [],
  );
  const [media, setMedia] = useState<MediaDraft[]>(() =>
    initial
      ? initial.media.map((m) => ({
          url: m.url,
          alt_text: m.alt_text ?? "",
          type: (m.media_type === "video" ? "video" : "image") as MediaKind,
        }))
      : [],
  );
  const [blocks, setBlocks] = useState<BlockDraft[]>(() =>
    initial
      ? initial.components.map((c) => ({
          type: c.component_type as BlockType,
          content: c.content_json as Record<string, unknown>,
        }))
      : [],
  );

  function set<K extends keyof typeof data>(k: K, v: (typeof data)[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }

  function submit(target: "save" | "publish") {
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const payload: EventInput = {
      ...data,
      status: target === "publish" ? "published" : data.status,
      key_points: keyPoints
        .filter((k) => k.title.trim())
        .map((k) => ({
          number: k.number || null,
          title: k.title,
          description: k.description || null,
        })),
      media: media
        .filter((m) => m.url.trim())
        .map((m, i) => ({
          media_type: m.type,
          url: m.url,
          alt_text: m.alt_text || null,
          title: null,
          is_main: i === 0,
        })),
      components: blocks.map((b) => ({
        component_type: b.type,
        content_json: b.content,
      })),
    };

    startTransition(async () => {
      const res =
        mode === "create"
          ? await createEvent(payload)
          : await updateEvent(initial!.id, payload);

      if (!res.ok) {
        setError(res.error || "Échec");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        return;
      }

      if (mode === "create" && res.id) {
        router.push(`/admin/events/${res.id}/edit?message=Événement+créé+avec+succès`);
      } else {
        setSuccess(
          target === "publish" ? "Événement publié avec succès." : "Modifications enregistrées.",
        );
        if (target === "publish") setData((d) => ({ ...d, status: "published" }));
        router.refresh();
        setTimeout(() => setSuccess(null), 3500);
      }
    });
  }

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/events"
            className="hover:text-brand-orange inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-black/55 uppercase transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Retour aux événements
          </Link>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            {mode === "create" ? "Nouvel événement" : data.title || "Édition"}
          </h2>
          {mode === "edit" && (
            <p className="mt-1 font-mono text-[11px] text-black/45">/{data.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <a
              href="/#events"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3.5 py-2 text-[12.5px] font-semibold tracking-wide text-black/70 hover:bg-black/[0.04]"
            >
              <Eye className="h-3.5 w-3.5" /> Prévisualiser
            </a>
          )}
          <button
            type="button"
            onClick={() => submit("save")}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3.5 py-2 text-[12.5px] font-semibold tracking-wide text-black/80 hover:bg-black/[0.03] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" /> {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => submit("publish")}
            disabled={pending}
            className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-[12.5px] font-semibold tracking-wide text-[#000003] disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" /> {data.status === "published" ? "Republier" : "Publier"}
          </button>
        </div>
      </header>

      {/* Flash messages */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Basics card */}
          <Card title="Informations principales">
            <Grid cols={2}>
              <Field
                label="Titre de l'événement"
                required
                error={fieldErrors["title"]}
                value={data.title}
                onChange={(v) => set("title", v)}
                placeholder="Danone Nations Cup"
              />
              <Field
                label="Slug"
                required
                hint="Utilisé dans l'URL · lettres minuscules, chiffres et tirets"
                error={fieldErrors["slug"]}
                value={data.slug}
                onChange={(v) => {
                  setSlugTouched(true);
                  set("slug", v);
                }}
                placeholder="danone-nations-cup"
              />
            </Grid>
            <Grid cols={3}>
              <Field
                label="Catégorie"
                required
                error={fieldErrors["category"]}
                value={data.category}
                onChange={(v) => set("category", v)}
                placeholder="Football"
              />
              <Field
                label="Lieu / ville"
                value={data.location}
                onChange={(v) => set("location", v)}
                placeholder="Casablanca"
              />
              <Field
                label="Date / période"
                value={data.period}
                onChange={(v) => set("period", v)}
                placeholder="Depuis 2010"
              />
            </Grid>
            <Grid cols={3}>
              <Field
                label="Badge spécial"
                value={data.badge}
                onChange={(v) => set("badge", v)}
                placeholder="Flagship"
              />
              <Field
                label="Type d'événement"
                value={data.type}
                onChange={(v) => set("type", v)}
                placeholder="Tournoi international jeunesse"
              />
              <Field
                label="Nombre d'éditions"
                value={data.editions}
                onChange={(v) => set("editions", v)}
                placeholder="15 éditions"
              />
            </Grid>
          </Card>

          {/* Cover */}
          <Card title="Visuel de couverture">
            <FieldShell
              label="Image de couverture"
              hint="Upload depuis ton ordinateur ou colle une URL externe."
              error={fieldErrors["cover_image"]}
            >
              <MediaInput
                url={data.cover_image}
                type="image"
                accept="image"
                onChange={(m) => set("cover_image", m.url)}
                placeholder="https://… (JPG, PNG, WebP)"
              />
            </FieldShell>

            <FieldShell
              label="Vidéo de couverture (optionnelle)"
              hint="Une vidéo qui peut remplacer l'image en hero."
              error={fieldErrors["cover_video"]}
            >
              <MediaInput
                url={data.cover_video}
                type="video"
                accept="video"
                onChange={(m) => set("cover_video", m.url)}
                placeholder="https://… (MP4, WebM, MOV)"
              />
            </FieldShell>
          </Card>

          {/* Content */}
          <Card title="Contenu">
            <Field
              label="Courte description"
              hint="280 caractères max · visible en card et meta."
              value={data.short_description}
              onChange={(v) => set("short_description", v)}
              textarea
              rows={2}
            />
            <Field
              label="Résumé du case"
              hint="Texte long affiché dans la modal détail."
              value={data.case_summary}
              onChange={(v) => set("case_summary", v)}
              textarea
              rows={6}
            />
          </Card>

          {/* Key points */}
          <Card
            title={`Points clés (${keyPoints.length})`}
            action={
              <button
                type="button"
                onClick={() =>
                  setKeyPoints((kp) => [
                    ...kp,
                    {
                      number: String(kp.length + 1).padStart(2, "0"),
                      title: "",
                      description: "",
                    },
                  ])
                }
                className="bg-brand-orange/15 text-brand-orange hover:bg-brand-orange/25 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-semibold tracking-wide"
              >
                <Plus className="h-3 w-3" /> Ajouter
              </button>
            }
          >
            {keyPoints.length === 0 ? (
              <p className="rounded border border-dashed border-black/15 px-4 py-6 text-center text-[12.5px] text-black/45">
                Aucun point clé. Clique sur « Ajouter ».
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {keyPoints.map((k, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-black/10 bg-black/[0.015] p-3"
                  >
                    <div className="flex items-start gap-2">
                      <input
                        value={k.number}
                        onChange={(e) =>
                          setKeyPoints((arr) =>
                            arr.map((x, j) => (j === i ? { ...x, number: e.target.value } : x)),
                          )
                        }
                        className="w-14 rounded border border-black/10 px-2 py-1.5 text-center font-mono text-[11px] outline-none focus:border-[#003f7e]"
                        placeholder="01"
                      />
                      <input
                        value={k.title}
                        onChange={(e) =>
                          setKeyPoints((arr) =>
                            arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                          )
                        }
                        className="flex-1 rounded border border-black/10 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#003f7e]"
                        placeholder="Production live multi-caméras"
                      />
                      <div className="flex items-center gap-0.5">
                        <ReorderBtn onClick={() => setKeyPoints((arr) => move(arr, i, -1))} dir="up" />
                        <ReorderBtn onClick={() => setKeyPoints((arr) => move(arr, i, 1))} dir="down" />
                        <button
                          type="button"
                          onClick={() =>
                            setKeyPoints((arr) => arr.filter((_, j) => j !== i))
                          }
                          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded text-red-600 hover:bg-red-50"
                          aria-label="Supprimer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={k.description}
                      onChange={(e) =>
                        setKeyPoints((arr) =>
                          arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)),
                        )
                      }
                      rows={1}
                      className="mt-2 ml-[60px] block w-[calc(100%-60px)] rounded border border-black/10 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#003f7e]"
                      placeholder="Description optionnelle…"
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Gallery */}
          <Card
            title={`Galerie (${media.length})`}
            action={
              <button
                type="button"
                onClick={() =>
                  setMedia((m) => [...m, { url: "", alt_text: "", type: "image" }])
                }
                className="bg-brand-orange/15 text-brand-orange hover:bg-brand-orange/25 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-semibold tracking-wide"
              >
                <Plus className="h-3 w-3" /> Ajouter un visuel
              </button>
            }
          >
            {media.length === 0 ? (
              <p className="rounded border border-dashed border-black/15 px-4 py-6 text-center text-[12.5px] text-black/45">
                Aucun visuel. La galerie n&apos;apparaîtra pas sur la page détail.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {media.map((m, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-black/10 bg-black/[0.015] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-black/40 uppercase">
                        {i === 0 ? "★ Principal" : `Visuel #${i + 1}`}
                        {" · "}
                        {m.type === "video" ? "🎬 Vidéo" : "🖼 Image"}
                      </span>
                      <div className="flex items-center">
                        <ReorderBtn onClick={() => setMedia((arr) => move(arr, i, -1))} dir="up" />
                        <ReorderBtn onClick={() => setMedia((arr) => move(arr, i, 1))} dir="down" />
                        <button
                          type="button"
                          onClick={() => setMedia((arr) => arr.filter((_, j) => j !== i))}
                          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded text-red-600 hover:bg-red-50"
                          aria-label="Supprimer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <MediaInput
                      url={m.url}
                      type={m.type}
                      accept="both"
                      compact
                      onChange={(next) =>
                        setMedia((arr) =>
                          arr.map((x, j) =>
                            j === i ? { ...x, url: next.url, type: next.type } : x,
                          ),
                        )
                      }
                    />

                    <input
                      value={m.alt_text}
                      onChange={(e) =>
                        setMedia((arr) =>
                          arr.map((x, j) =>
                            j === i ? { ...x, alt_text: e.target.value } : x,
                          ),
                        )
                      }
                      placeholder="Texte alternatif (accessibilité)"
                      className="mt-2 w-full rounded border border-black/10 px-2.5 py-1.5 text-[12px] outline-none focus:border-[#003f7e]"
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Page builder */}
          <Card
            title={`Page builder (${blocks.length})`}
          >
            <p className="-mt-1 mb-3 text-[12px] text-black/55">
              Compose la page détail de l&apos;événement avec des blocs (texte, citation, galerie,
              chiffres, CTA…). Affichés sous la galerie dans la modal de l&apos;événement.
            </p>
            <PageBuilder blocks={blocks} onChange={setBlocks} />
          </Card>

          {/* SEO */}
          <Card title="SEO (optionnel)">
            <Field
              label="Titre SEO"
              value={data.seo_title}
              onChange={(v) => set("seo_title", v)}
              placeholder="Sports Minds · Danone Nations Cup"
            />
            <Field
              label="Description SEO"
              value={data.seo_description}
              onChange={(v) => set("seo_description", v)}
              textarea
              rows={2}
            />
          </Card>
        </div>

        {/* Right column — publish controls */}
        <aside className="space-y-6">
          <Card title="Publication">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
                  Statut
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(["draft", "published"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className={`rounded-md px-3 py-2 text-[12.5px] font-semibold tracking-wide transition-colors ${
                        data.status === s
                          ? s === "published"
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-white"
                          : "border border-black/10 text-black/70 hover:bg-black/[0.04]"
                      }`}
                    >
                      {s === "published" ? "Publié" : "Brouillon"}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-md border border-black/10 bg-black/[0.015] p-3">
                <input
                  type="checkbox"
                  checked={data.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#f0943e]"
                />
                <span>
                  <span className="block text-[13px] font-medium text-black">
                    Mettre en avant sur l&apos;accueil
                  </span>
                  <span className="text-[12px] text-black/55">
                    L&apos;événement apparaîtra dans la carte « Flagship » de la page d&apos;accueil.
                  </span>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Rappel">
            <p className="text-[12.5px] leading-relaxed text-black/65">
              Seuls les événements <strong>publiés</strong> apparaissent sur la page publique.
              Tu peux ré-éditer ou retirer un événement à tout moment. La suppression est
              irréversible.
            </p>
          </Card>

          {mode === "edit" && initial && (
            <Card title="Métadonnées">
              <dl className="space-y-1.5 text-[12px] text-black/65">
                <Meta k="ID">{initial.id}</Meta>
                <Meta k="Créé">
                  {new Date(initial.created_at).toLocaleString("fr-FR")}
                </Meta>
                <Meta k="Modifié">
                  {new Date(initial.updated_at).toLocaleString("fr-FR")}
                </Meta>
                <Meta k="Points clés">{initial.key_points.length}</Meta>
                <Meta k="Médias">{initial.media.length}</Meta>
              </dl>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ───── Sub-components ───── */

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/[0.07] bg-white">
      <header className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5">
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
        {action}
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Grid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={`grid gap-4 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
    >
      {children}
    </div>
  );
}

function FieldShell({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2 font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
        <span>{label}</span>
        {hint && (
          <span className="font-sans text-[10px] normal-case tracking-normal text-black/40">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && <p className="mt-1 text-[11.5px] text-red-700">{error}</p>}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 3,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const base =
    "w-full rounded-md border bg-white px-3 py-2 text-[13.5px] outline-none transition-colors";
  const cls = error
    ? `${base} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200`
    : `${base} border-black/10 focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20`;
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
        <span>
          {label}
          {required && <span className="ml-1 text-[#f0943e]">*</span>}
        </span>
        {hint && (
          <span className="font-sans text-[10px] normal-case tracking-normal text-black/40">
            {hint}
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={cls}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          placeholder={placeholder}
        />
      )}
      {error && <span className="mt-1 block text-[11.5px] text-red-700">{error}</span>}
    </label>
  );
}

function ReorderBtn({
  onClick,
  dir,
}: {
  onClick: () => void;
  dir: "up" | "down";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "up" ? "Déplacer vers le haut" : "Déplacer vers le bas"}
      className="inline-flex h-6 w-6 items-center justify-center rounded text-black/55 hover:bg-black/[0.06] hover:text-black"
    >
      {dir === "up" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
    </button>
  );
}

function Meta({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-mono text-[9px] tracking-[0.2em] text-black/45 uppercase">{k}</dt>
      <dd className="truncate font-mono text-[11px] text-black/70">{children}</dd>
    </div>
  );
}
