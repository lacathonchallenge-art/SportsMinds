"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GalleryThumbnails,
  LayoutPanelTop,
  Plus,
  Quote,
  Type,
  X,
} from "lucide-react";
import { MediaInput, type MediaKind } from "./MediaInput";

export type BlockType = "text" | "gallery" | "quote" | "cta" | "stats";

export interface BlockDraft {
  type: BlockType;
  content: Record<string, unknown>;
}

const META: Record<BlockType, { label: string; icon: React.ComponentType<{ className?: string }>; hint: string; defaults: () => Record<string, unknown> }> = {
  text: {
    label: "Bloc texte",
    icon: FileText,
    hint: "Paragraphe titré (sous-section dans le case).",
    defaults: () => ({ title: "", body: "" }),
  },
  gallery: {
    label: "Galerie photos / vidéos",
    icon: GalleryThumbnails,
    hint: "Mosaïque d'images ou de vidéos avec titre optionnel.",
    defaults: () => ({ title: "", items: [] }),
  },
  quote: {
    label: "Citation / témoignage",
    icon: Quote,
    hint: "Citation client ou partenaire mise en valeur.",
    defaults: () => ({ text: "", author: "", role: "" }),
  },
  cta: {
    label: "CTA final",
    icon: LayoutPanelTop,
    hint: "Appel à action en fin de page (titre + bouton).",
    defaults: () => ({ title: "", ctaLabel: "", ctaHref: "" }),
  },
  stats: {
    label: "Chiffres clés",
    icon: Type,
    hint: "Grille de chiffres avec libellé court.",
    defaults: () => ({ title: "", items: [] }),
  },
};

interface PageBuilderProps {
  blocks: BlockDraft[];
  onChange: (next: BlockDraft[]) => void;
}

export function PageBuilder({ blocks, onChange }: PageBuilderProps) {
  const [picker, setPicker] = useState(false);

  function addBlock(type: BlockType) {
    const next: BlockDraft = { type, content: META[type].defaults() };
    onChange([...blocks, next]);
    setPicker(false);
  }
  function update(i: number, content: Record<string, unknown>) {
    onChange(blocks.map((b, j) => (j === i ? { ...b, content } : b)));
  }
  function remove(i: number) {
    onChange(blocks.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <p className="rounded border border-dashed border-black/15 px-4 py-6 text-center text-[12.5px] text-black/45">
          Aucun bloc. Compose la page détail de l&apos;événement en ajoutant des sections.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {blocks.map((b, i) => {
          const meta = META[b.type];
          const Icon = meta.icon;
          return (
            <li key={i} className="rounded-md border border-black/10 bg-black/[0.015] p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#003f7e] uppercase">
                  <Icon className="h-3.5 w-3.5" />
                  {meta.label}
                  <span className="text-black/35"> · bloc #{i + 1}</span>
                </span>
                <div className="flex items-center">
                  <IconBtn onClick={() => move(i, -1)} title="Monter">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn onClick={() => move(i, 1)} title="Descendre">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </IconBtn>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    title="Supprimer le bloc"
                    aria-label="Supprimer le bloc"
                    className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <BlockEditor block={b} onChange={(c) => update(i, c)} />
            </li>
          );
        })}
      </ul>

      {/* Picker / add */}
      {picker ? (
        <div className="rounded-md border border-black/10 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-black/55 uppercase">
              Choisis un type de bloc
            </span>
            <button
              type="button"
              onClick={() => setPicker(false)}
              className="rounded p-1 text-black/45 hover:bg-black/[0.05]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(META) as Array<[BlockType, (typeof META)[BlockType]]>).map(([type, m]) => {
              const Icon = m.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex items-start gap-3 rounded-md border border-black/10 bg-white p-3 text-left transition-colors hover:border-[#003f7e] hover:bg-[#003f7e]/[0.04]"
                >
                  <span className="bg-brand-orange/15 text-brand-orange flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-black">{m.label}</span>
                    <span className="block text-[11.5px] text-black/55">{m.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="bg-brand-orange/15 text-brand-orange hover:bg-brand-orange/25 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11.5px] font-semibold tracking-wide"
        >
          <Plus className="h-3 w-3" /> Ajouter un bloc
        </button>
      )}
    </div>
  );
}

/* ─── Block-specific editors ─── */

function BlockEditor({
  block,
  onChange,
}: {
  block: BlockDraft;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const c = block.content;

  if (block.type === "text") {
    return (
      <div className="space-y-2">
        <Input
          label="Titre (optionnel)"
          value={(c.title as string) ?? ""}
          onChange={(v) => onChange({ ...c, title: v })}
          placeholder="Sous-titre du bloc"
        />
        <Textarea
          label="Texte"
          value={(c.body as string) ?? ""}
          onChange={(v) => onChange({ ...c, body: v })}
          rows={4}
          placeholder="Paragraphe affiché sur la page détail…"
        />
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div className="space-y-2">
        <Textarea
          label="Citation"
          value={(c.text as string) ?? ""}
          onChange={(v) => onChange({ ...c, text: v })}
          rows={3}
          placeholder="« Le partenariat avec Sports Minds nous a permis… »"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            label="Auteur"
            value={(c.author as string) ?? ""}
            onChange={(v) => onChange({ ...c, author: v })}
            placeholder="Prénom Nom"
          />
          <Input
            label="Rôle / société"
            value={(c.role as string) ?? ""}
            onChange={(v) => onChange({ ...c, role: v })}
            placeholder="Directrice marketing · Marque X"
          />
        </div>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="grid gap-2 sm:grid-cols-3">
        <Input
          label="Titre"
          value={(c.title as string) ?? ""}
          onChange={(v) => onChange({ ...c, title: v })}
          placeholder="Vous voulez la même chose ?"
        />
        <Input
          label="Texte du bouton"
          value={(c.ctaLabel as string) ?? ""}
          onChange={(v) => onChange({ ...c, ctaLabel: v })}
          placeholder="Lancer un projet"
        />
        <Input
          label="Lien"
          value={(c.ctaHref as string) ?? ""}
          onChange={(v) => onChange({ ...c, ctaHref: v })}
          placeholder="#contact"
        />
      </div>
    );
  }

  if (block.type === "gallery") {
    const items = (c.items as Array<{ url: string; type: MediaKind; alt?: string }>) ?? [];
    return (
      <div className="space-y-3">
        <Input
          label="Titre (optionnel)"
          value={(c.title as string) ?? ""}
          onChange={(v) => onChange({ ...c, title: v })}
          placeholder="Coulisses, finale, équipe…"
        />
        <div className="space-y-2">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded border border-black/10 bg-white p-2.5"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-wider text-black/45 uppercase">
                  Visuel #{i + 1} · {it.type === "video" ? "🎬 Vidéo" : "🖼 Image"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = items.filter((_, j) => j !== i);
                    onChange({ ...c, items: next });
                  }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-red-600 hover:bg-red-50"
                  aria-label="Retirer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <MediaInput
                url={it.url}
                type={it.type}
                accept="both"
                compact
                onChange={(m) => {
                  const next = items.map((x, j) =>
                    j === i ? { ...x, url: m.url, type: m.type } : x,
                  );
                  onChange({ ...c, items: next });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...c, items: [...items, { url: "", type: "image" }] })
            }
            className="inline-flex items-center gap-1.5 rounded border border-dashed border-black/20 px-3 py-1.5 text-[11.5px] font-medium text-black/65 hover:border-black/35 hover:bg-black/[0.03]"
          >
            <Plus className="h-3 w-3" /> Ajouter à la galerie
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "stats") {
    const items = (c.items as Array<{ value: string; label: string; suffix?: string }>) ?? [];
    return (
      <div className="space-y-3">
        <Input
          label="Titre (optionnel)"
          value={(c.title as string) ?? ""}
          onChange={(v) => onChange({ ...c, title: v })}
          placeholder="Résultats · saison 2024"
        />
        <div className="space-y-1.5">
          {items.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_2fr_120px_28px] items-end gap-2 rounded border border-black/10 bg-white p-2"
            >
              <Input
                label="Valeur"
                value={s.value ?? ""}
                onChange={(v) => {
                  const next = items.map((x, j) => (j === i ? { ...x, value: v } : x));
                  onChange({ ...c, items: next });
                }}
                placeholder="2.5M"
              />
              <Input
                label="Libellé"
                value={s.label ?? ""}
                onChange={(v) => {
                  const next = items.map((x, j) => (j === i ? { ...x, label: v } : x));
                  onChange({ ...c, items: next });
                }}
                placeholder="Enfants impliqués"
              />
              <Input
                label="Suffixe"
                value={s.suffix ?? ""}
                onChange={(v) => {
                  const next = items.map((x, j) => (j === i ? { ...x, suffix: v } : x));
                  onChange({ ...c, items: next });
                }}
                placeholder="+ / % / h"
              />
              <button
                type="button"
                onClick={() => {
                  const next = items.filter((_, j) => j !== i);
                  onChange({ ...c, items: next });
                }}
                aria-label="Retirer"
                className="inline-flex h-9 w-7 items-center justify-center rounded text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...c, items: [...items, { value: "", label: "", suffix: "" }] })
            }
            className="inline-flex items-center gap-1.5 rounded border border-dashed border-black/20 px-3 py-1.5 text-[11.5px] font-medium text-black/65 hover:border-black/35 hover:bg-black/[0.03]"
          >
            <Plus className="h-3 w-3" /> Ajouter un chiffre
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── tiny field helpers ─── */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[9.5px] tracking-[0.18em] text-black/50 uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-black/10 bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#003f7e]"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[9.5px] tracking-[0.18em] text-black/50 uppercase">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded border border-black/10 bg-white px-2.5 py-1.5 text-[12.5px] outline-none focus:border-[#003f7e]"
      />
    </label>
  );
}

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
      className="inline-flex h-6 w-6 items-center justify-center rounded text-black/55 hover:bg-black/[0.06] hover:text-black"
    >
      {children}
    </button>
  );
}
