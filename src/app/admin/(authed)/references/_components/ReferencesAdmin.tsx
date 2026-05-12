"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Edit3,
} from "lucide-react";
import type { BrandReferenceRow } from "@/lib/data/references";
import {
  createReference,
  deleteReference,
  reorderReferences,
  toggleRefVisibility,
  updateReference,
} from "../actions";
import type { ReferenceInput } from "../types";
import { MediaInput } from "../../events/_components/MediaInput";

interface Draft extends ReferenceInput {
  id?: string;
}

const EMPTY_DRAFT: Draft = {
  brand_name: "",
  logo_url: "",
  category: "",
  link: "",
  display_order: 0,
  is_visible: true,
};

export function ReferencesAdmin({ initial }: { initial: BrandReferenceRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BrandReferenceRow | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => setItems(initial), [initial]);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  function startCreate() {
    setEditing({
      ...EMPTY_DRAFT,
      display_order: items.length,
    });
    setFieldErrors({});
  }
  function startEdit(r: BrandReferenceRow) {
    setEditing({
      id: r.id,
      brand_name: r.brand_name,
      logo_url: r.logo_url ?? "",
      category: r.category ?? "",
      link: r.link ?? "",
      display_order: r.display_order,
      is_visible: r.is_visible,
    });
    setFieldErrors({});
  }

  function save() {
    if (!editing) return;
    startTransition(async () => {
      const res = editing.id
        ? await updateReference(editing.id, editing)
        : await createReference(editing);
      if (!res.ok) {
        flash("err", res.error || "Échec");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        return;
      }
      flash("ok", editing.id ? "Référence mise à jour." : "Référence ajoutée.");
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
      const res = await reorderReferences(next.map((r) => r.id));
      if (!res.ok) flash("err", res.error || "Réordonnancement échoué");
      else router.refresh();
    });
  }

  function toggleVis(r: BrandReferenceRow) {
    startTransition(async () => {
      const res = await toggleRefVisibility(r.id, r.is_visible);
      if (res.ok) {
        flash("ok", r.is_visible ? "Référence masquée." : "Référence visible.");
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  function doDelete() {
    if (!confirmDelete) return;
    const t = confirmDelete;
    startTransition(async () => {
      const res = await deleteReference(t.id);
      if (res.ok) {
        flash("ok", `« ${t.brand_name} » supprimée.`);
        setConfirmDelete(null);
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-black/55">
          {items.length} référence{items.length > 1 ? "s" : ""} ·{" "}
          {items.filter((r) => r.is_visible).length} visible
          {items.filter((r) => r.is_visible).length > 1 ? "s" : ""}
        </div>
        <button
          onClick={startCreate}
          className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#000003] transition-colors"
        >
          <Plus className="h-4 w-4" /> Ajouter une référence
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

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((r, i) => (
          <article
            key={r.id}
            className={`group relative overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,3,0.18)] ${
              r.is_visible ? "border-black/[0.08]" : "border-amber-300/50 opacity-75"
            }`}
          >
            <div className="flex h-32 items-center justify-center border-b border-black/[0.06] bg-black/[0.02] px-6">
              {r.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={r.logo_url}
                  alt={r.brand_name}
                  loading="lazy"
                  className="max-h-16 max-w-[80%] object-contain"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
                />
              ) : (
                <span className="font-mono text-[10px] tracking-[0.18em] text-black/30 uppercase">
                  Pas de logo
                </span>
              )}
            </div>
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">{r.brand_name}</div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-wide text-black/45">
                    {r.category || "—"} · #{r.display_order + 1}
                  </div>
                </div>
                {!r.is_visible && (
                  <span className="shrink-0 rounded-sm bg-amber-500/15 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-amber-700 uppercase">
                    Masqué
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Icon onClick={() => move(i, -1)} title="Monter"><ChevronUp className="h-3.5 w-3.5" /></Icon>
                  <Icon onClick={() => move(i, 1)} title="Descendre"><ChevronDown className="h-3.5 w-3.5" /></Icon>
                </div>
                <div className="flex items-center gap-1">
                  <Icon
                    onClick={() => toggleVis(r)}
                    title={r.is_visible ? "Masquer" : "Afficher"}
                  >
                    {r.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </Icon>
                  <Icon onClick={() => startEdit(r)} title="Modifier">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Icon>
                  <Icon
                    onClick={() => setConfirmDelete(r)}
                    title="Supprimer"
                    danger
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Icon>
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-black/15 px-6 py-12 text-center text-[13px] text-black/55">
            Aucune référence. Clique sur « Ajouter une référence ».
          </div>
        )}
      </div>

      {/* Edit / Create modal */}
      {editing && (
        <Modal
          title={editing.id ? "Modifier la référence" : "Nouvelle référence"}
          onClose={() => setEditing(null)}
        >
          <div className="space-y-4">
            <Field
              label="Nom de la marque"
              required
              error={fieldErrors["brand_name"]}
              value={editing.brand_name}
              onChange={(v) => setEditing({ ...editing, brand_name: v })}
              placeholder="Coca-Cola"
            />
            <FieldShell label="Logo" hint="Upload ou colle une URL" error={fieldErrors["logo_url"] ?? undefined}>
              <MediaInput
                url={editing.logo_url ?? ""}
                type="image"
                accept="image"
                onChange={(m) => setEditing({ ...editing, logo_url: m.url })}
                placeholder="https://… (PNG, SVG, WebP)"
              />
            </FieldShell>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Catégorie"
                value={editing.category ?? ""}
                onChange={(v) => setEditing({ ...editing, category: v })}
                placeholder="Boissons, Auto, Banque…"
              />
              <Field
                label="Lien externe (optionnel)"
                error={fieldErrors["link"] ?? undefined}
                value={editing.link ?? ""}
                onChange={(v) => setEditing({ ...editing, link: v })}
                placeholder="https://…"
              />
            </div>
            <label className="flex items-start gap-3 rounded-md border border-black/10 bg-black/[0.015] p-3">
              <input
                type="checkbox"
                checked={editing.is_visible}
                onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })}
                className="mt-1 h-4 w-4 accent-[#f0943e]"
              />
              <span className="text-[13px] text-black/80">
                Visible sur la page d&apos;accueil
              </span>
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
        <Modal
          title="Supprimer cette référence ?"
          onClose={() => setConfirmDelete(null)}
          size="sm"
        >
          <p className="text-[13.5px] text-black/65">
            « <strong>{confirmDelete.brand_name}</strong> » sera supprimée définitivement et
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

/* ─── Subcomponents ─── */

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
        className={`mt-12 w-full rounded-xl border border-black/10 bg-white shadow-xl ${
          size === "sm" ? "max-w-md p-6" : "max-w-lg p-6"
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <FieldShell label={label} required={required} error={error}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-white px-3 py-2 text-[13.5px] outline-none transition-colors ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-black/10 focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20"
        }`}
      />
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
