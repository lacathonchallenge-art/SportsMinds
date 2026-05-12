"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  Copy,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  StarOff,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import {
  deleteEvent,
  duplicateEvent,
  toggleFeatured,
  toggleStatus,
} from "../actions";
import type { EventRow } from "@/lib/data/events";

export function EventsTable({ events }: { events: EventRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<EventRow | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category))).sort(),
    [events],
  );

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (featuredOnly && !e.featured) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!e.title.toLowerCase().includes(q) && !e.slug.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [events, statusFilter, categoryFilter, featuredOnly, query]);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3200);
  }

  function handleToggleStatus(e: EventRow) {
    startTransition(async () => {
      const res = await toggleStatus(e.id, e.status);
      if (res.ok) {
        flash("ok", `« ${e.title} » est maintenant ${e.status === "published" ? "en brouillon" : "publié"}.`);
        router.refresh();
      } else {
        flash("err", res.error || "Échec");
      }
    });
  }

  function handleToggleFeatured(e: EventRow) {
    startTransition(async () => {
      const res = await toggleFeatured(e.id, e.featured);
      if (res.ok) {
        flash("ok", e.featured ? "Mise en avant retirée." : "Mis en avant.");
        router.refresh();
      } else {
        flash("err", res.error || "Échec");
      }
    });
  }

  function handleDuplicate(e: EventRow) {
    startTransition(async () => {
      const res = await duplicateEvent(e.id);
      if (res.ok && res.id) {
        flash("ok", "Événement dupliqué.");
        router.push(`/admin/events/${res.id}/edit`);
      } else {
        flash("err", res.error || "Échec");
      }
    });
  }

  function handleDelete() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    startTransition(async () => {
      const res = await deleteEvent(target.id);
      if (res.ok) {
        flash("ok", `« ${target.title} » supprimé.`);
        setConfirmDelete(null);
        router.refresh();
      } else {
        flash("err", res.error || "Échec");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/[0.07] bg-white p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par titre ou slug…"
            className="w-full rounded-md border border-black/10 bg-white pl-8 pr-3 py-2 text-[13px] outline-none focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20"
          />
        </div>
        <Select value={statusFilter} onChange={(v) => setStatusFilter(v as typeof statusFilter)} icon={<Filter className="h-3.5 w-3.5" />}>
          <option value="all">Tous statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </Select>
        <Select value={categoryFilter} onChange={setCategoryFilter}>
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <label className="inline-flex items-center gap-2 px-2 text-[12.5px] text-black/70">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setFeaturedOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#f0943e]"
          />
          Mis en avant uniquement
        </label>
      </div>

      {feedback && (
        <div className={`rounded-md border px-4 py-2.5 text-[13px] ${
          feedback.kind === "ok"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[14px] text-black/55">
              {events.length === 0
                ? "Aucun événement. Crée le premier."
                : "Aucun résultat avec ces filtres."}
            </p>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead className="border-b border-black/[0.06] bg-black/[0.02]">
              <tr className="text-left font-mono text-[10px] tracking-[0.22em] text-black/50 uppercase">
                <Th width="68px">Image</Th>
                <Th>Titre · slug</Th>
                <Th width="140px">Catégorie</Th>
                <Th width="160px">Lieu · période</Th>
                <Th width="120px">Statut</Th>
                <Th width="80px" className="text-center">Featured</Th>
                <Th width="120px">Modifié</Th>
                <Th width="170px" className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {filtered.map((e) => (
                <tr key={e.id} className="text-[13px] hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    {e.cover_image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={e.cover_image}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="bg-brand-orange/15 flex h-10 w-14 items-center justify-center rounded text-[10px] font-mono text-[#003f7e]">
                        IMG
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/events/${e.id}/edit`}
                      className="block font-medium text-black hover:text-[#003f7e]"
                    >
                      {e.title}
                    </Link>
                    <div className="mt-0.5 font-mono text-[10px] tracking-wide text-black/40 truncate">
                      /{e.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-black/70">{e.category}</td>
                  <td className="px-4 py-3 text-black/70">
                    <div>{e.location || <span className="text-black/30">—</span>}</div>
                    <div className="font-mono text-[10px] text-black/40">
                      {e.period || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {e.featured ? (
                      <Star className="bg-brand-orange/15 text-brand-orange mx-auto h-6 w-6 rounded-full p-1" />
                    ) : (
                      <span className="text-black/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-black/55">
                    {new Date(e.updated_at).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <RowBtn
                        title={e.status === "published" ? "Dépublier" : "Publier"}
                        onClick={() => handleToggleStatus(e)}
                        disabled={pending}
                      >
                        {e.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </RowBtn>
                      <RowBtn
                        title={e.featured ? "Retirer mise en avant" : "Mettre en avant"}
                        onClick={() => handleToggleFeatured(e)}
                        disabled={pending}
                      >
                        {e.featured ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                      </RowBtn>
                      <RowBtn title="Dupliquer" onClick={() => handleDuplicate(e)} disabled={pending}>
                        <Copy className="h-3.5 w-3.5" />
                      </RowBtn>
                      <RowLink href={`/admin/events/${e.id}/edit`} title="Modifier">
                        <Edit3 className="h-3.5 w-3.5" />
                      </RowLink>
                      <RowLink href={`/#events`} title="Voir sur le site" target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </RowLink>
                      <RowBtn
                        title="Supprimer"
                        onClick={() => setConfirmDelete(e)}
                        disabled={pending}
                        danger
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </RowBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl"
          >
            <h3 className="text-[18px] font-semibold text-black">Supprimer cet événement&nbsp;?</h3>
            <p className="mt-2 text-[13.5px] text-black/65">
              « <strong>{confirmDelete.title}</strong> » sera définitivement supprimé de la base
              ainsi que ses points clés et sa galerie. Il disparaîtra immédiatement du site
              public.
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
                onClick={handleDelete}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-[12.5px] font-semibold tracking-wide text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {pending ? "Suppression…" : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  width,
  className = "",
}: {
  children: React.ReactNode;
  width?: string;
  className?: string;
}) {
  return (
    <th
      style={{ width }}
      className={`px-4 py-3 text-left font-normal ${className}`}
    >
      {children}
    </th>
  );
}

function Select({
  value,
  onChange,
  children,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/45">{icon}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-md border border-black/10 bg-white py-2 pr-7 text-[12.5px] outline-none focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20 ${icon ? "pl-8" : "pl-3"}`}
      >
        {children}
      </select>
    </div>
  );
}

function StatusPill({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-emerald-700 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Publié
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Brouillon
    </span>
  );
}

function RowBtn({
  children,
  onClick,
  title,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors disabled:opacity-50 ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-black/10 text-black/65 hover:bg-black/[0.05] hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function RowLink({
  children,
  href,
  title,
  target,
}: {
  children: React.ReactNode;
  href: string;
  title: string;
  target?: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      target={target}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-black/65 transition-colors hover:bg-black/[0.05] hover:text-black"
    >
      {children}
    </Link>
  );
}
