import { listMediaFiles } from "@/lib/data/media";
import { MediaLibrary } from "./_components/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const files = await listMediaFiles();
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          CRM · Médias
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Bibliothèque média</h2>
        <p className="mt-2 max-w-xl text-[13px] text-black/55">
          Tous les fichiers uploadés depuis l&apos;admin (couvertures, galeries, logos…).
          Stockés dans Supabase Storage, bucket <code className="rounded bg-black/[0.06] px-1 py-0.5 font-mono text-[11px]">event-media</code>.
        </p>
      </header>
      <MediaLibrary files={files} />
    </div>
  );
}
