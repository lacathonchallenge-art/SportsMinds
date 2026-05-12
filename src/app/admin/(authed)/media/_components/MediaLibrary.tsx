"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Trash2,
  Upload,
  Search,
  Image as ImageIcon,
  Film,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import type { MediaFile } from "@/lib/data/media";
import { deleteMediaFile } from "../actions";
import { uploadEventMedia } from "../../events/actions";

type Filter = "all" | "image" | "video";

export function MediaLibrary({ files }: { files: MediaFile[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmDelete, setConfirmDelete] = useState<MediaFile | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploadPending, startUpload] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (filter !== "all" && f.mediaType !== filter) return false;
      if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [files, filter, query]);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function copy(url: string, path: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 1600);
    } catch {
      flash("err", "Impossible de copier dans le presse-papiers");
    }
  }

  function doDelete() {
    if (!confirmDelete) return;
    const f = confirmDelete;
    startTransition(async () => {
      const res = await deleteMediaFile(f.name);
      if (res.ok) {
        flash("ok", "Fichier supprimé.");
        setConfirmDelete(null);
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  function handleUpload(list: FileList | null) {
    if (!list || list.length === 0) return;
    startUpload(async () => {
      let okCount = 0;
      let errCount = 0;
      for (const file of Array.from(list)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadEventMedia(fd);
        if (res.ok) okCount += 1;
        else errCount += 1;
      }
      flash(
        errCount === 0 ? "ok" : "err",
        `${okCount} fichier${okCount > 1 ? "s" : ""} uploadé${okCount > 1 ? "s" : ""}${
          errCount > 0 ? `, ${errCount} échec${errCount > 1 ? "s" : ""}` : ""
        }.`,
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/[0.07] bg-white p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom de fichier…"
            className="w-full rounded-md border border-black/10 bg-white py-2 pl-8 pr-3 text-[13px] outline-none focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20"
          />
        </div>
        <div className="inline-flex rounded-md border border-black/10 bg-black/[0.02] p-0.5">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-sm px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                filter === f
                  ? "bg-white text-[#003f7e] shadow-sm"
                  : "text-black/55 hover:text-black"
              }`}
            >
              {f === "all" ? "Tous" : f === "image" ? "Images" : "Vidéos"}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] text-black/45">
          {filtered.length} / {files.length}
        </span>
      </div>

      {/* Upload drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
          dragOver
            ? "border-[#f0943e] bg-[#f0943e]/10"
            : "border-black/15 bg-white hover:border-black/30 hover:bg-black/[0.03]"
        } ${uploadPending ? "pointer-events-none opacity-70" : ""}`}
      >
        <Upload className="h-5 w-5 text-black/45" />
        <span className="text-[13px] font-medium text-black/75">
          {uploadPending ? "Upload en cours…" : "Glisse un ou plusieurs fichiers ici (ou clique)"}
        </span>
        <span className="text-[11.5px] text-black/45">
          Images et vidéos · max 100 MB par fichier
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>

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
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 px-6 py-16 text-center text-[13px] text-black/55">
          {files.length === 0
            ? "Aucun fichier. Upload-en un pour commencer."
            : "Aucun résultat avec ces filtres."}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((f) => (
            <article
              key={f.name}
              className="group relative overflow-hidden rounded-xl border border-black/[0.07] bg-white transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,3,0.18)]"
            >
              <div className="relative aspect-square overflow-hidden bg-black/[0.02]">
                {f.mediaType === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={f.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : f.mediaType === "video" ? (
                  <video
                    src={f.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-black/25" />
                  </div>
                )}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-white uppercase backdrop-blur-sm">
                  {f.mediaType === "video" ? <Film className="h-2.5 w-2.5" /> : <ImageIcon className="h-2.5 w-2.5" />}
                  {f.mediaType}
                </span>
              </div>

              <div className="p-2.5">
                <div className="truncate font-mono text-[10.5px] tracking-wide text-black/60" title={f.name}>
                  {f.name.replace(/^events\//, "")}
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-black/40">
                  {prettySize(f.size)}
                  {f.createdAt && (
                    <>
                      {" · "}
                      {new Date(f.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => copy(f.url, f.name)}
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[9.5px] tracking-wider uppercase transition-colors ${
                      copiedPath === f.name
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-black/10 text-black/65 hover:bg-black/[0.04]"
                    }`}
                  >
                    {copiedPath === f.name ? (
                      <>
                        <Check className="h-3 w-3" /> Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> URL
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Ouvrir"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-black/60 hover:bg-black/[0.05]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(f)}
                      title="Supprimer"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDelete(null)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold">Supprimer ce fichier ?</h3>
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded p-1 text-black/45 hover:bg-black/[0.05]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[13.5px] text-black/65">
              <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
                {confirmDelete.name}
              </code>{" "}
              sera définitivement supprimé du bucket Supabase. Les événements qui référencent
              cette URL afficheront une image cassée.
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
          </div>
        </div>
      )}
    </div>
  );
}

function prettySize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
