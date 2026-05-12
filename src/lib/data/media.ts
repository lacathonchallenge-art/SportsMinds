import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface MediaFile {
  name: string;       // path within bucket
  url: string;        // public URL
  size: number;       // bytes
  contentType: string;
  mediaType: "image" | "video" | "other";
  createdAt: string;
  updatedAt: string;
}

const BUCKET = "event-media";

/** List all files under the events/ prefix. */
export async function listMediaFiles(): Promise<MediaFile[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("events", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
  if (error || !data) return [];

  return data
    .filter((f) => f.name && !f.name.endsWith("/") && f.id !== null)
    .map((f) => {
      const path = `events/${f.name}`;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const ct = f.metadata?.mimetype ?? "";
      const mediaType: MediaFile["mediaType"] = ct.startsWith("image/")
        ? "image"
        : ct.startsWith("video/")
          ? "video"
          : "other";
      return {
        name: path,
        url: pub.publicUrl,
        size: (f.metadata?.size as number) ?? 0,
        contentType: ct,
        mediaType,
        createdAt: f.created_at ?? "",
        updatedAt: f.updated_at ?? "",
      };
    });
}
