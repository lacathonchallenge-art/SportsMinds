import { listAllProductions } from "@/lib/data/productions";
import { ProductionsAdmin } from "./_components/ProductionsAdmin";

export const dynamic = "force-dynamic";

export default async function ProductionsPage() {
  const productions = await listAllProductions();
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          CRM · Contenu
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Productions médias</h2>
        <p className="mt-2 max-w-xl text-[13px] text-black/55">
          Émissions TV, radio, capsules et productions affichées dans la section
          « Productions médias » de la page d&apos;accueil. Seules les productions
          <strong> publiées</strong> apparaissent côté public.
        </p>
      </header>
      <ProductionsAdmin initial={productions} />
    </div>
  );
}
