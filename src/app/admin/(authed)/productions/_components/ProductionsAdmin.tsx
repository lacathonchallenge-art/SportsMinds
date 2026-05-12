"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Save,
  X,
} from "lucide-react";
import type { ProductionRow } from "@/lib/data/productions";
import {
  createProduction,
  deleteProduction,
  reorderProductions,
  toggleProductionStatus,
  updateProduction,
} from "../actions";
import type { ProductionInput } from "../types";
import { MediaInput } from "../../events/_components/MediaInput";

interface Draft extends ProductionInput {
  id?: string;
}

const EMPTY: Draft = {
  title: "",
  slug: "",
  fmt: "TV",
  year: "",
  client: "",
  type: "",
  host: "",
  cover_image: "",
  video_url: "",
  short_description: "",
  long_description: "",
  status: "draft",
  featured: false,
  display_order: 0,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductionsAdmin({ initial }: { initial: ProductionRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductionRow | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => setItems(initial), [initial]);

  // Auto-generate slug from title (when creating, until user touches the slug)
  useEffect(() => {
    if (!editing || editing.id || slugTouched) return;
    if (editing.title) {
      setEditing((e) => (e ? { ...e, slug: slugify(e.title) } : e));
    }
  }, [editing?.title, slugTouched, editing]);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  function startCreate() {
    setSlugTouched(false);
    setFieldErrors({});
    setEditing({ ...EMPTY, display_order: items.length });
  }
  function startEdit(p: ProductionRow) {
    setSlugTouched(true);
    setFieldErrors({});
    setEditing({
      id: p.id,
      title: p.title,
      slug: p.slug,
      fmt: (p.fmt === "RADIO" ? "RADIO" : "TV") as "TV" | "RADIO",
      year: p.year ?? "",
      client: p.client ?? "",
      type: p.type ?? "",
      host: p.host ?? "",
      cover_image: p.cover_image ?? "",
      video_url: p.video_url ?? "",
      short_description: p.short_description ?? "",
      long_description: p.long_description ?? "",
      status: p.status,
      featured: p.featured,
      display_order: p.display_order,
    });
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const res = editing.id
        ? await updateProduction(editing.id, editing)
        : await createProduction(editing);
      if (!res.ok) {
        flash("err", res.error || "Échec");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        return;
      }
      flash("ok", editing.id ? "Production mise à jour." : "Production ajoutée.");
      setEditing(null);
      router.refresh();
    });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    startTransition(async () => {
      const res = await reorderProductions(next.map((r) => r.id));
      if (!res.ok) flash("err", res.error || "Échec");
      else router.refresh();
    });
  }

  function toggleStatus(p: ProductionRow) {
    startTransition(async () => {
      const res = await toggleProductionStatus(p.id, p.status);
      if (res.ok) {
        flash("ok", p.status === "published" ? "Mise en brouillon." : "Publiée.");
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  function doDelete() {
    if (!confirmDelete) return;
    const t = confirmDelete;
    startTransition(async () => {
      const res = await deleteProduction(t.id);
      if (res.ok) {
        flash("ok", `« ${t.title} » supprimée.`);
        setConfirmDelete(null);
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-black/55">
          {items.length} production{items.length > 1 ? "s" : ""} ·{" "}
          {items.filter((p) => p.status === "published").length} publiée
          {items.filter((p) => p.status === "published").length > 1 ? "s" : ""}
        </div>
        <button
          onClick={startCreate}
          className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#000003]"
        >
          <Plus className="h-4 w-4" /> Ajouter une production
        </button>
      </div>

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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center text-[13px] text-black/55">
            Aucune production. Clique sur « Ajouter une production ».
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead className="border-b border-black/[0.06] bg-black/[0.02]">
              <tr className="text-left font-mono text-[10px] tracking-[0.22em] text-black/50 uppercase">
                <th className="w-12 px-4 py-3 text-left font-normal"></th>
                <th className="px-4 py-3 text-left font-normal">Titre · slug</th>
                <th className="w-[80px] px-4 py-3 text-left font-normal">Format</th>
                <th className="w-[150px] px-4 py-3 text-left font-normal">Année · client</th>
                <th className="w-[120px] px-4 py-3 text-left font-normal">Statut</th>
                <th className="w-[140px] px-4 py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {items.map((p, i) => (
                <tr key={p.id} className="text-[13px] hover:bg-black/[0.02]">
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center">
                      <Icon onClick={() => move(i, -1)} title="Monter"><ChevronUp className="h-3.5 w-3.5" /></Icon>
                      <Icon onClick={() => move(i, 1)} title="Descendre"><ChevronDown className="h-3.5 w-3.5" /></Icon>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => startEdit(p)}
                      className="block text-left font-medium text-black hover:text-[#003f7e]"
                    >
                      «&nbsp;{p.title}&nbsp;»
                    </button>
                    <div className="mt-0.5 font-mono text-[10px] tracking-wide text-black/40 truncate">
                      {[p.type, p.host && `avec ${p.host}`].filter(Boolean).join(" · ") || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase"
                      style={{
                        borderColor: "#f0943e",
                        color: "#f0943e",
                      }}
                    >
                      {p.fmt || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-black/65">
                    <div className="text-[#003f7e]">{p.year || "—"}</div>
                    <div className="text-black/45">{p.client || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Icon onClick={() => toggleStatus(p)} title={p.status === "published" ? "Dépublier" : "Publier"}>
                        {p.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Icon>
                      <Icon onClick={() => startEdit(p)} title="Modifier"><Edit3 className="h-3.5 w-3.5" /></Icon>
                      <Icon onClick={() => setConfirmDelete(p)} title="Supprimer" danger><Trash2 className="h-3.5 w-3.5" /></Icon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit / Create modal */}
      {editing && (
        <Modal
          title={editing.id ? "Modifier la production" : "Nouvelle production"}
          onClose={() => setEditing(null)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Titre"
              required
              error={fieldErrors["title"]}
              value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })}
              placeholder="Capsules pour Planète Foot"
            />
            <Field
              label="Slug"
              required
              error={fieldErrors["slug"]}
              value={editing.slug}
              onChange={(v) => {
                setSlugTouched(true);
                setEditing({ ...editing, slug: v });
              }}
              placeholder="capsules-planete-foot"
            />
            <FieldShell label="Format" required>
              <div className="flex gap-2">
                {(["TV", "RADIO"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setEditing({ ...editing, fmt: f })}
                    className={`flex-1 rounded-md px-3 py-2 text-[12.5px] font-semibold tracking-wide transition-colors ${
                      editing.fmt === f
                        ? "bg-[#f0943e] text-[#000003]"
                        : "border border-black/10 text-black/70 hover:bg-black/[0.04]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </FieldShell>
            <Field
              label="Année / période"
              value={editing.year ?? ""}
              onChange={(v) => setEditing({ ...editing, year: v })}
              placeholder="2005 – 2006"
            />
            <Field
              label="Client / sponsor"
              value={editing.client ?? ""}
              onChange={(v) => setEditing({ ...editing, client: v })}
              placeholder="MEDITEL"
            />
            <Field
              label="Type d'émission"
              value={editing.type ?? ""}
              onChange={(v) => setEditing({ ...editing, type: v })}
              placeholder="Magazine, capsule, documentaire…"
            />
            <Field
              label="Présentateur"
              value={editing.host ?? ""}
              onChange={(v) => setEditing({ ...editing, host: v })}
              placeholder="Noureddine Naybet"
            />
            <div className="sm:col-span-2">
              <FieldShell label="Image de couverture" hint="URL ou upload">
                <MediaInput
                  url={editing.cover_image ?? ""}
                  type="image"
                  accept="image"
                  onChange={(m) => setEditing({ ...editing, cover_image: m.url })}
                />
              </FieldShell>
            </div>
            <div className="sm:col-span-2">
              <FieldShell label="Vidéo (optionnelle)" hint="MP4 / WebM / lien YouTube ou Vimeo">
                <MediaInput
                  url={editing.video_url ?? ""}
                  type="video"
                  accept="video"
                  onChange={(m) => setEditing({ ...editing, video_url: m.url })}
                />
              </FieldShell>
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Description courte"
                value={editing.short_description ?? ""}
                onChange={(v) => setEditing({ ...editing, short_description: v })}
                textarea
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Description détaillée"
                value={editing.long_description ?? ""}
                onChange={(v) => setEditing({ ...editing, long_description: v })}
                textarea
                rows={5}
              />
            </div>
            <FieldShell label="Statut">
              <div className="flex gap-2">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditing({ ...editing, status: s })}
                    className={`flex-1 rounded-md px-3 py-2 text-[12.5px] font-semibold tracking-wide transition-colors ${
                      editing.status === s
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
            <label className="flex items-start gap-3 rounded-md border border-black/10 bg-black/[0.015] p-3">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="mt-1 h-4 w-4 accent-[#f0943e]"
              />
              <span className="text-[13px] text-black/80">Mettre en avant sur l&apos;accueil</span>
            </label>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => setEditing(null)}
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
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <Modal title="Supprimer cette production ?" onClose={() => setConfirmDelete(null)} size="sm">
          <p className="text-[13.5px] text-black/65">
            « <strong>{confirmDelete.title}</strong> » sera supprimée définitivement et
            disparaîtra immédiatement de la page d&apos;accueil.
          </p>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => setConfirmDelete(null)}
              disabled={pending}
              className="rounded-md border border-black/10 px-4 py-2 text-[12.5px] font-medium text-black/70 hover:bg-black/[0.04]"
            >
              Annuler
            </button>
            <button
              onClick={doDelete}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-[12.5px] font-semibold tracking-wide text-white hover:bg-red-700 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {pending ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── helpers ─── */

function StatusPill({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-emerald-700 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Publié
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Brouillon
    </span>
  );
}

function Icon({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-black/10 text-black/60 hover:bg-black/[0.05] hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({
  title,
  children,
  onClose,
  size = "md",
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`my-12 w-full rounded-xl border border-black/10 bg-white shadow-xl ${
          size === "sm" ? "max-w-md p-6" : "max-w-2xl p-6"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-black/45 hover:bg-black/[0.05] hover:text-black"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const cls = `w-full rounded-md border bg-white px-3 py-2 text-[13.5px] outline-none transition-colors ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-black/10 focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20"
  }`;
  return (
    <FieldShell label={label} required={required} error={error}>
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
    </FieldShell>
  );
}

function FieldShell({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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
      {children}
      {error && <span className="mt-1 block text-[11.5px] text-red-700">{error}</span>}
    </label>
  );
}
