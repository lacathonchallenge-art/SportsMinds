import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllEvents } from "@/lib/data/events";
import { EventsTable } from "./_components/EventsTable";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const sp = await searchParams;
  const events = await listAllEvents();

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
            CRM · Contenu
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Événements</h2>
          <p className="mt-2 max-w-xl text-[13px] text-black/55">
            Liste de tous les événements. Les événements <strong>publiés</strong> apparaissent
            automatiquement sur la page d&apos;accueil. Les <strong>brouillons</strong> restent privés.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#000003] transition-colors"
        >
          <Plus className="h-4 w-4" /> Ajouter un événement
        </Link>
      </header>

      {sp.message && (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-800">
          {sp.message}
        </div>
      )}

      <EventsTable events={events} />
    </div>
  );
}
