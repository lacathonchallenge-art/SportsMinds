"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { SectionRow, SectionItemRow } from "@/lib/data/cms";
import {
  createItem,
  deleteItem,
  reorderItems,
  reorderSections,
  seedExpertiseItems,
  toggleSectionVisible,
  updateItem,
  updateSection,
} from "../../actions";
import type { ItemInput, SectionUpdateInput } from "../../types";
import { MediaInput } from "../../../events/_components/MediaInput";

type SectionWithItems = SectionRow & { items: SectionItemRow[] };

interface SectionDraft {
  title: string;
  subtitle: string;
  body: string;
  eyebrow: string;
  badge: string;
  subhead: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  image: string;
  image_secondary: string;
  video: string;
  theme: "dark" | "light" | "default";
  is_visible: boolean;
  status: "draft" | "published";
}

function draftFromSection(s: SectionRow): SectionDraft {
  const c = s.content_json as Record<string, unknown>;
  const m = s.media_json as Record<string, unknown>;
  const st = s.settings_json as Record<string, unknown>;
  const ctaP = (c.cta_primary ?? {}) as Record<string, unknown>;
  const ctaS = (c.cta_secondary ?? {}) as Record<string, unknown>;
  return {
    title: s.title ?? "",
    subtitle: s.subtitle ?? "",
    body: typeof c.body === "string" ? c.body : "",
    eyebrow: typeof c.eyebrow === "string" ? c.eyebrow : "",
    badge: typeof c.badge === "string" ? c.badge : "",
    subhead: typeof c.subhead === "string" ? c.subhead : "",
    cta_primary_label: typeof ctaP.label === "string" ? ctaP.label : "",
    cta_primary_href: typeof ctaP.href === "string" ? ctaP.href : "",
    cta_secondary_label: typeof ctaS.label === "string" ? ctaS.label : "",
    cta_secondary_href: typeof ctaS.href === "string" ? ctaS.href : "",
    image: typeof m.image === "string" ? m.image : "",
    image_secondary: typeof m.image_secondary === "string" ? m.image_secondary : "",
    video: typeof m.video === "string" ? m.video : "",
    theme:
      st.theme === "dark" || st.theme === "light" || st.theme === "default"
        ? (st.theme as SectionDraft["theme"])
        : "default",
    is_visible: s.is_visible,
    status: s.status,
  };
}

function draftToInput(d: SectionDraft): SectionUpdateInput {
  return {
    title: d.title || null,
    subtitle: d.subtitle || null,
    content_json: {
      eyebrow: d.eyebrow,
      subhead: d.subhead,
      body: d.body,
      badge: d.badge,
      cta_primary: { label: d.cta_primary_label, href: d.cta_primary_href },
      cta_secondary: { label: d.cta_secondary_label, href: d.cta_secondary_href },
    },
    media_json: {
      image: d.image,
      image_alt: "",
      image_secondary: d.image_secondary,
      video: d.video,
    },
    settings_json: { theme: d.theme },
    is_visible: d.is_visible,
    status: d.status,
  };
}

export function PageEditor({
  pageSlug,
  sections,
}: {
  pageSlug: string;
  sections: SectionWithItems[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [list, setList] = useState(sections);
  const [editing, setEditing] = useState<SectionWithItems | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => setList(sections), [sections]);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    startTransition(async () => {
      const res = await reorderSections(pageSlug, next.map((s) => s.id));
      if (!res.ok) flash("err", res.error || "Échec");
      else router.refresh();
    });
  }

  function toggleVis(s: SectionWithItems) {
    startTransition(async () => {
      const res = await toggleSectionVisible(s.id, s.is_visible, pageSlug);
      if (res.ok) {
        flash("ok", s.is_visible ? "Section masquée." : "Section visible.");
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`rounded-md border px-4 py-2.5 text-[13px] ${
            feedback.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <ul className="space-y-2">
        {list.map((s, i) => (
          <li
            key={s.id}
            className="rounded-xl border border-black/[0.07] bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,3,0.18)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="rounded p-0.5 text-black/40 hover:bg-black/[0.05] hover:text-black"
                  aria-label="Monter"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="rounded p-0.5 text-black/40 hover:bg-black/[0.05] hover:text-black"
                  aria-label="Descendre"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[#003f7e] uppercase">
                    #{i + 1} · {s.section_key}
                  </span>
                  {!s.is_visible && (
                    <span className="rounded-sm bg-amber-500/15 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-amber-700 uppercase">
                      Masquée
                    </span>
                  )}
                  {s.status === "draft" && (
                    <span className="rounded-sm bg-black/10 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-black/65 uppercase">
                      Brouillon
                    </span>
                  )}
                  {s.items.length > 0 && (
                    <span className="bg-brand-orange/15 text-brand-orange rounded-sm px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase">
                      {s.items.length} item{s.items.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h4 className="mt-1 truncate text-[15px] font-semibold text-black">
                  {s.title || (
                    <span className="text-black/40 italic">(sans titre)</span>
                  )}
                </h4>
                {s.subtitle && (
                  <p className="mt-0.5 truncate text-[12.5px] text-black/55">
                    {s.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <IconBtn
                  onClick={() => toggleVis(s)}
                  title={s.is_visible ? "Masquer" : "Afficher"}
                >
                  {s.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </IconBtn>
                <button
                  type="button"
                  onClick={() => setEditing(s)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#003f7e] px-3 py-1.5 text-[12px] font-semibold tracking-wide text-white hover:bg-[#002d5c]"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Modifier
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <SectionEditModal
          section={editing}
          pageSlug={pageSlug}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            flash("ok", msg);
            setEditing(null);
            router.refresh();
          }}
          onError={(msg) => flash("err", msg)}
          pending={pending}
          startTransition={startTransition}
        />
      )}
    </div>
  );
}

/* ─── Modal ─── */

function SectionEditModal({
  section,
  pageSlug,
  onClose,
  onSaved,
  onError,
  pending,
  startTransition,
}: {
  section: SectionWithItems;
  pageSlug: string;
  onClose: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
  pending: boolean;
  startTransition: (cb: () => void) => void;
}) {
  const [data, setData] = useState<SectionDraft>(() => draftFromSection(section));
  const [items, setItems] = useState(section.items);

  function set<K extends keyof SectionDraft>(k: K, v: SectionDraft[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function save() {
    startTransition(async () => {
      const res = await updateSection(section.id, draftToInput(data), pageSlug);
      if (res.ok) onSaved("Section enregistrée avec succès.");
      else onError(res.error || "Échec");
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-3xl rounded-xl border border-black/10 bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-black/[0.07] p-5">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-[#003f7e] uppercase">
              {section.section_key} · {section.section_type}
            </div>
            <h3 className="mt-1 text-[18px] font-semibold tracking-tight">
              Modifier la section
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-black/45 hover:bg-black/[0.05]"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Titre principal"
              value={data.title}
              onChange={(v) => set("title", v)}
            />
            <Field
              label="Sous-titre / eyebrow (mono)"
              value={data.subtitle}
              onChange={(v) => set("subtitle", v)}
              placeholder="DOMAINES D'EXPERTISE"
            />
          </div>

          <Field
            label="Eyebrow (texte court)"
            value={data.eyebrow}
            onChange={(v) => set("eyebrow", v)}
            placeholder="AGENCE CONSEIL · COMMUNICATION SPORTIVE"
          />

          <Field
            label="Sous-titre étendu (subhead)"
            value={data.subhead}
            onChange={(v) => set("subhead", v)}
            textarea
            rows={2}
            placeholder="De KANA PRODUCTION à SPORTS MINDS — une histoire…"
          />

          <Field
            label="Texte principal"
            value={data.body}
            onChange={(v) => set("body", v)}
            textarea
            rows={5}
          />

          <Field
            label="Badge"
            value={data.badge}
            onChange={(v) => set("badge", v)}
            placeholder="★ Nouvelle identité"
          />

          {/* Media */}
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldShell label="Image principale">
              <MediaInput
                url={data.image}
                type="image"
                accept="image"
                onChange={(m) => set("image", m.url)}
              />
            </FieldShell>
            <FieldShell label="Image secondaire (optionnelle)">
              <MediaInput
                url={data.image_secondary}
                type="image"
                accept="image"
                onChange={(m) => set("image_secondary", m.url)}
              />
            </FieldShell>
          </div>

          <FieldShell label="Vidéo (optionnelle)">
            <MediaInput
              url={data.video}
              type="video"
              accept="video"
              onChange={(m) => set("video", m.url)}
            />
          </FieldShell>

          {/* CTAs */}
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldShell label="Bouton principal (label / lien)">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={data.cta_primary_label}
                  onChange={(e) => set("cta_primary_label", e.target.value)}
                  className="rounded border border-black/10 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#003f7e]"
                  placeholder="Label"
                />
                <input
                  value={data.cta_primary_href}
                  onChange={(e) => set("cta_primary_href", e.target.value)}
                  className="rounded border border-black/10 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#003f7e]"
                  placeholder="/path ou #anchor"
                />
              </div>
            </FieldShell>
            <FieldShell label="Bouton secondaire (label / lien)">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={data.cta_secondary_label}
                  onChange={(e) => set("cta_secondary_label", e.target.value)}
                  className="rounded border border-black/10 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#003f7e]"
                  placeholder="Label"
                />
                <input
                  value={data.cta_secondary_href}
                  onChange={(e) => set("cta_secondary_href", e.target.value)}
                  className="rounded border border-black/10 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#003f7e]"
                  placeholder="/path ou #anchor"
                />
              </div>
            </FieldShell>
          </div>

          {/* Settings */}
          <div className="grid gap-3 sm:grid-cols-3">
            <FieldShell label="Thème">
              <select
                value={data.theme}
                onChange={(e) => set("theme", e.target.value as SectionDraft["theme"])}
                className="w-full rounded border border-black/10 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-[#003f7e]"
              >
                <option value="default">Défaut</option>
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </FieldShell>
            <label className="mt-6 inline-flex items-start gap-3 rounded-md border border-black/10 bg-black/[0.015] p-3">
              <input
                type="checkbox"
                checked={data.is_visible}
                onChange={(e) => set("is_visible", e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#f0943e]"
              />
              <span className="text-[12.5px] text-black/80">Section visible</span>
            </label>
            <FieldShell label="Statut">
              <div className="flex gap-2">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
                    className={`flex-1 rounded-md px-3 py-2 text-[12px] font-semibold tracking-wide ${
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
            </FieldShell>
          </div>

          {/* Items repeatable */}
          <ItemsEditor
            sectionId={section.id}
            sectionKey={section.section_key}
            pageSlug={pageSlug}
            items={items}
            onChange={setItems}
            onFlashError={(m) => onError(m)}
            onFlashOk={() => {}}
          />
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-black/[0.07] p-5">
          <button
            onClick={onClose}
            disabled={pending}
            className="rounded-md border border-black/10 px-4 py-2 text-[12.5px] font-medium text-black/70 hover:bg-black/[0.04]"
          >
            Annuler
          </button>
          <button
            onClick={save}
            disabled={pending}
            className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-[12.5px] font-semibold tracking-wide text-[#000003] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" /> {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ─── Items editor (repeatable rows for objectives / stats / etc.) ─── */

function ItemsEditor({
  sectionId,
  sectionKey,
  pageSlug,
  items,
  onChange,
  onFlashError,
}: {
  sectionId: string;
  sectionKey: string;
  pageSlug: string;
  items: SectionItemRow[];
  onChange: (next: SectionItemRow[]) => void;
  onFlashError: (m: string) => void;
  onFlashOk: (m: string) => void;
}) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<SectionItemRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    startTransition(async () => {
      const res = await reorderItems(pageSlug, next.map((it) => it.id));
      if (!res.ok) onFlashError(res.error || "Échec");
      else router.refresh();
    });
  }

  function doDelete(it: SectionItemRow) {
    startTransition(async () => {
      const res = await deleteItem(it.id, pageSlug);
      if (res.ok) {
        onChange(items.filter((x) => x.id !== it.id));
        router.refresh();
      } else onFlashError(res.error || "Échec");
    });
  }

  return (
    <section className="rounded-md border border-black/10 bg-black/[0.015] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
          Items répétables ({items.length})
        </h4>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-brand-orange/15 text-brand-orange hover:bg-brand-orange/25 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-wide"
        >
          <Plus className="h-3 w-3" /> Ajouter un item
        </button>
      </div>

      {items.length === 0 && !creating ? (
        <div className="rounded border border-dashed border-black/15 px-4 py-5 text-center">
          <p className="text-[12px] text-black/45">
            Aucun item pour cette section.
          </p>
          {sectionKey === "expertises" && (
            <button
              type="button"
              onClick={() => {
                startTransition(async () => {
                  const res = await seedExpertiseItems(sectionId, pageSlug);
                  if (res.ok) router.refresh();
                  else onFlashError(res.error || "Échec de l'import");
                });
              }}
              disabled={pending}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#003f7e] px-4 py-2 text-[12px] font-semibold tracking-wide text-white hover:bg-[#002d5c] disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" />
              {pending
                ? "Import en cours…"
                : "Importer les 6 expertises par défaut"}
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li
              key={it.id}
              className="flex items-center gap-2 rounded border border-black/10 bg-white p-2"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveItem(i, -1)}
                  className="rounded p-0.5 text-black/40 hover:bg-black/[0.05]"
                  aria-label="Monter"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(i, 1)}
                  className="rounded p-0.5 text-black/40 hover:bg-black/[0.05]"
                  aria-label="Descendre"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">
                  {it.title || <span className="text-black/40 italic">(sans titre)</span>}
                </div>
                {it.description && (
                  <div className="mt-0.5 truncate text-[11.5px] text-black/55">
                    {it.description}
                  </div>
                )}
              </div>
              {it.icon && (
                <span className="font-mono text-[10px] tracking-wide text-black/45 uppercase">
                  {it.icon}
                </span>
              )}
              <button
                type="button"
                onClick={() => setEditingItem(it)}
                aria-label="Modifier"
                className="inline-flex h-7 w-7 items-center justify-center rounded text-black/60 hover:bg-black/[0.05] hover:text-black"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => doDelete(it)}
                disabled={pending}
                aria-label="Supprimer"
                className="inline-flex h-7 w-7 items-center justify-center rounded text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(editingItem || creating) && (
        <ItemEditModal
          item={editingItem}
          sectionId={sectionId}
          pageSlug={pageSlug}
          orderHint={items.length}
          onClose={() => {
            setEditingItem(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditingItem(null);
            setCreating(false);
            router.refresh();
          }}
          onError={onFlashError}
        />
      )}
    </section>
  );
}

function ItemEditModal({
  item,
  sectionId,
  pageSlug,
  orderHint,
  onClose,
  onSaved,
  onError,
}: {
  item: SectionItemRow | null;
  sectionId: string;
  pageSlug: string;
  orderHint: number;
  onClose: () => void;
  onSaved: () => void;
  onError: (m: string) => void;
}) {
  const [data, setData] = useState<ItemInput>(() => ({
    title: item?.title ?? "",
    subtitle: item?.subtitle ?? "",
    description: item?.description ?? "",
    media_url: item?.media_url ?? "",
    icon: item?.icon ?? "",
    link_url: item?.link_url ?? "",
    display_order: item?.display_order ?? orderHint,
    is_visible: item?.is_visible ?? true,
    content_json: item?.content_json ?? {},
    item_type: item?.item_type ?? "generic",
  }));
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = item
        ? await updateItem(item.id, pageSlug, data)
        : await createItem(sectionId, pageSlug, data);
      if (res.ok) onSaved();
      else onError(res.error || "Échec");
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[210] flex items-start justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg rounded-xl border border-black/10 bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-black/[0.07] p-4">
          <h3 className="text-[15px] font-semibold tracking-tight">
            {item ? "Modifier l'item" : "Nouvel item"}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-black/45 hover:bg-black/[0.05]"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3 p-4">
          <Field
            label="Titre"
            value={data.title ?? ""}
            onChange={(v) => setData({ ...data, title: v })}
          />
          <Field
            label="Sous-titre"
            value={data.subtitle ?? ""}
            onChange={(v) => setData({ ...data, subtitle: v })}
          />
          <Field
            label="Description"
            value={data.description ?? ""}
            onChange={(v) => setData({ ...data, description: v })}
            textarea
            rows={3}
          />
          <Field
            label="Capacités (une par ligne — pour la section Expertises)"
            value={
              Array.isArray(data.content_json?.capabilities)
                ? (data.content_json.capabilities as string[]).join("\n")
                : typeof data.content_json?.capabilities === "string"
                  ? (data.content_json.capabilities as string)
                  : ""
            }
            onChange={(v) => {
              const arr = v
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean);
              setData({
                ...data,
                content_json: { ...(data.content_json ?? {}), capabilities: arr },
              });
            }}
            textarea
            rows={4}
            placeholder={"Plan stratégique\nDirection artistique\nRelations presse"}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Icône (clé interne)"
              value={data.icon ?? ""}
              onChange={(v) => setData({ ...data, icon: v })}
              placeholder="beach / compass / leaf / heart / pin / ball / shield"
            />
            <Field
              label="Lien (optionnel)"
              value={data.link_url ?? ""}
              onChange={(v) => setData({ ...data, link_url: v })}
              placeholder="/page ou https://…"
            />
          </div>
          <FieldShell label="Image / média (optionnel)">
            <MediaInput
              url={data.media_url ?? ""}
              type="image"
              accept="both"
              onChange={(m) => setData({ ...data, media_url: m.url })}
            />
          </FieldShell>
          <label className="inline-flex items-start gap-3 rounded-md border border-black/10 bg-black/[0.015] p-2.5">
            <input
              type="checkbox"
              checked={!!data.is_visible}
              onChange={(e) => setData({ ...data, is_visible: e.target.checked })}
              className="mt-1 h-3.5 w-3.5 accent-[#f0943e]"
            />
            <span className="text-[12px] text-black/80">Item visible</span>
          </label>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-black/[0.07] p-4">
          <button
            onClick={onClose}
            disabled={pending}
            className="rounded-md border border-black/10 px-3 py-1.5 text-[12px] font-medium text-black/70 hover:bg-black/[0.04]"
          >
            Annuler
          </button>
          <button
            onClick={save}
            disabled={pending}
            className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-wide text-[#000003]"
          >
            <Save className="h-3 w-3" /> {pending ? "…" : "Enregistrer"}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ─── helpers ─── */

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-black/65 hover:bg-black/[0.05] hover:text-black"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full rounded-md border border-black/10 bg-white px-3 py-2 text-[13.5px] outline-none transition-colors focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20";
  return (
    <FieldShell label={label}>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </FieldShell>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
