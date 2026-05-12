import type { Production } from "@/components/sections/Productions";
import type { ProductionRow } from "@/lib/data/productions";

export function prodRowToItem(r: ProductionRow): Production {
  const fmt: "TV" | "RADIO" = r.fmt === "RADIO" ? "RADIO" : "TV";
  return {
    name: r.title,
    fmt,
    date: r.year ?? "",
    sponsor: r.client ?? undefined,
    type: r.type ?? undefined,
    host: r.host ?? undefined,
  };
}
