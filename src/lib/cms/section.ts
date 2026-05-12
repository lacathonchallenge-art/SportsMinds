import type { SectionRow, SectionItemRow } from "@/lib/data/cms";

export type SectionCms = (SectionRow & { items: SectionItemRow[] }) | undefined;

export function pickStr(
  json: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const v = json?.[key];
  if (typeof v === "string" && v.trim()) return v;
  return fallback;
}

export function pickLink(
  json: Record<string, unknown> | undefined,
  key: string,
  fallback: { label: string; href: string },
): { label: string; href: string } {
  const v = json?.[key];
  if (v && typeof v === "object" && v !== null) {
    const o = v as { label?: unknown; href?: unknown };
    return {
      label: typeof o.label === "string" && o.label.trim() ? o.label : fallback.label,
      href: typeof o.href === "string" && o.href.trim() ? o.href : fallback.href,
    };
  }
  return fallback;
}

export function pickImage(
  media: Record<string, unknown> | undefined,
  key: string,
  fallback: string,
): string {
  const v = media?.[key];
  if (typeof v === "string" && v.trim()) return v;
  return fallback;
}

export function txt(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}
