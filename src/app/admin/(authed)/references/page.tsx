import { listAllReferences } from "@/lib/data/references";
import { ReferencesAdmin } from "./_components/ReferencesAdmin";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const refs = await listAllReferences();
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          CRM · Contenu
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Références</h2>
        <p className="mt-2 max-w-xl text-[13px] text-black/55">
          Logos de marques affichés sur la page d&apos;accueil dans la section
          « Ils nous ont fait confiance ». Seules les références <strong>visibles</strong> apparaissent
          côté public, dans l&apos;ordre défini ici.
        </p>
      </header>
      <ReferencesAdmin initial={refs} />
    </div>
  );
}
