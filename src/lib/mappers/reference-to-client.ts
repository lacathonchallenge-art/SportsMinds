import type { Client } from "@/components/sections/References";
import type { BrandReferenceRow } from "@/lib/data/references";

export function refRowToClient(r: BrandReferenceRow): Client {
  return {
    name: r.brand_name,
    url: r.logo_url ?? "",
  };
}
