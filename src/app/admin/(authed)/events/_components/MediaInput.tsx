"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Film } from "lucide-react";
import { uploadEventMedia } from "../actions";

export type MediaKind = "image" | "video";
export type MediaAccept = "image" | "video" | "both";

const ACCEPT_MAP: Record<MediaAccept, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
  video: "video/mp4,video/webm,video/quicktime",
  both:
    "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime",
};

interface MediaInputProps {
  url: string;
  type?: MediaKind;
  onChange: (next: { url: string; type: MediaKind }) => void;
  /** Restrict file picker / detection. Default "both". */
  accept?: MediaAccept;
  placeholder?: string;
  /** Compact mode for gallery rows (no big preview). */
  compact?: boolean;
}

export function MediaInput({
  url,
  type = "image",
  onChange,
  accept = "both",
  placeholder = "https://… ou clique pour uploader",
  compact = false,
}: MediaInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [pending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;
    const file = files[0];
    const isImg = file.type.startsWith("image/");
    const isVid = file.type.startsWith("video/");
    if (!isImg && !isVid) {
      setError("Format non supporté");
      return;
    }
    if (accept === "image" && !isImg) {
      setError("Image attendue");
      return;
    }
    if (accept === "video" && !isVid) {
      setError("Vidéo attendue");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    setProgress(10);
    startTransition(async () => {
      // Fake progress while server-action runs (no native progress event for server actions)
      const interval = setInterval(() => setProgress((p) => Math.min(p + 8, 90)), 220);
      const res = await uploadEventMedia(fd);
      clearInterval(interval);
      if (!res.ok || !res.url || !res.mediaType) {
        setError(res.error || "Échec de l'upload");
        setProgress(0);
        return;
      }
      setProgress(100);
      onChange({ url: res.url, type: res.mediaType });
      setTimeout(() => setProgress(0), 600);
    });
  }

  const detectedType: MediaKind =
    type ||
    (url.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? "video" : "image");

  function preview() {
    if (!url) return null;
    if (detectedType === "video") {
      return (
        <video
          src={url}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      );
    }
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")}
      />
    );
  }

  return (
    <div className="space-y-2">
      {/* Mode tabs */}
      <div className="inline-flex rounded-md border border-black/10 bg-black/[0.02] p-0.5">
        <ModeBtn active={mode === "url"} onClick={() => setMode("url")} icon={<LinkIcon className="h-3 w-3" />}>
          URL
        </ModeBtn>
        <ModeBtn active={mode === "upload"} onClick={() => setMode("upload")} icon={<Upload className="h-3 w-3" />}>
          Upload
        </ModeBtn>
      </div>

      <div className={`grid gap-3 ${compact ? "grid-cols-[64px_1fr]" : "grid-cols-1"}`}>
        {/* Preview thumbnail */}
        {compact && (
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded border border-black/10 bg-black/[0.02]">
            {url ? preview() : detectedType === "video" ? (
              <Film className="h-5 w-5 text-black/30" />
            ) : (
              <ImageIcon className="h-5 w-5 text-black/30" />
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {mode === "url" ? (
            <div className="flex gap-2">
              <input
                value={url}
                onChange={(e) => {
                  const v = e.target.value;
                  const t: MediaKind = v.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? "video" : "image";
                  onChange({ url: v, type: t });
                }}
                placeholder={placeholder}
                className="flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#003f7e] focus:ring-2 focus:ring-[#003f7e]/20"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => onChange({ url: "", type: "image" })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 text-black/55 hover:bg-black/[0.04] hover:text-red-600"
                  aria-label="Effacer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-4 py-5 text-center transition-colors ${
                dragOver
                  ? "border-[#f0943e] bg-[#f0943e]/10"
                  : "border-black/15 bg-black/[0.015] hover:border-black/30 hover:bg-black/[0.03]"
              } ${pending ? "pointer-events-none opacity-70" : ""}`}
            >
              <Upload className="h-5 w-5 text-black/45" />
              <span className="text-[12.5px] font-medium text-black/75">
                {pending ? "Upload en cours…" : "Clique ou glisse un fichier ici"}
              </span>
              <span className="text-[11px] text-black/45">
                {accept === "image"
                  ? "JPG · PNG · WebP · GIF · SVG"
                  : accept === "video"
                    ? "MP4 · WebM · MOV (max 100 MB)"
                    : "Image ou vidéo (max 100 MB)"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT_MAP[accept]}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {progress > 0 && (
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full bg-[#f0943e] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-[11.5px] text-red-700">{error}</p>
          )}

          {/* Non-compact preview */}
          {!compact && url && (
            <div className="h-44 w-full overflow-hidden rounded-md border border-black/10">
              {preview()}
            </div>
          )}

          {url && (
            <p className="font-mono text-[10px] tracking-wide text-black/40 break-all">
              {detectedType === "video" ? "🎬" : "🖼"}&nbsp;{url}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
        active ? "bg-white text-[#003f7e] shadow-sm" : "text-black/55 hover:text-black"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
