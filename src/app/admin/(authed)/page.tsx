import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  FileEdit,
  Star,
  Building2,
  Tv,
  Images,
  Plus,
} from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = createSupabaseAdminClient();

  const [
    eventsTotal,
    eventsPublished,
    eventsDraft,
    eventsFeatured,
    refsTotal,
    prodsTotal,
    mediaTotal,
    recentEvents,
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("featured", true),
    supabase.from("brand_references").select("*", { count: "exact", head: true }),
    supabase.from("productions").select("*", { count: "exact", head: true }),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("id,title,category,status,featured,updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  return {
    eventsTotal: eventsTotal.count ?? 0,
    eventsPublished: eventsPublished.count ?? 0,
    eventsDraft: eventsDraft.count ?? 0,
    eventsFeatured: eventsFeatured.count ?? 0,
    refsTotal: refsTotal.count ?? 0,
    prodsTotal: prodsTotal.count ?? 0,
    mediaTotal: mediaTotal.count ?? 0,
    recentEvents: recentEvents.data ?? [],
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Événements", value: stats.eventsTotal, icon: CalendarDays, tone: "navy" as const },
    { label: "Publiés", value: stats.eventsPublished, icon: CheckCircle2, tone: "green" as const },
    { label: "Brouillons", value: stats.eventsDraft, icon: FileEdit, tone: "amber" as const },
    { label: "Mis en avant", value: stats.eventsFeatured, icon: Star, tone: "orange" as const },
    { label: "Références", value: stats.refsTotal, icon: Building2, tone: "navy" as const },
    { label: "Productions", value: stats.prodsTotal, icon: Tv, tone: "navy" as const },
    { label: "Médias", value: stats.mediaTotal, icon: Images, tone: "navy" as const },
  ];

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
            Aperçu
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Vue d&apos;ensemble du contenu
          </h2>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/events/new"
            className="bg-brand-orange hover:bg-brand-orange/90 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#000003] transition-colors"
          >
            <Plus className="h-4 w-4" /> Ajouter un événement
          </Link>
          <Link
            href="/admin/references"
            className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-black/80 transition-colors hover:border-black/20 hover:bg-black/[0.03]"
          >
            <Plus className="h-4 w-4" /> Ajouter une référence
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Recent activity */}
      <section className="mt-10 rounded-xl border border-black/[0.07] bg-white">
        <header className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <div>
            <h3 className="text-[15px] font-semibold">Derniers événements modifiés</h3>
            <p className="text-[12px] text-black/55">
              Activité récente sur l&apos;espace événements.
            </p>
          </div>
          <Link
            href="/admin/events"
            className="text-brand-navy hover:text-brand-orange text-[12px] font-semibold tracking-wide transition-colors"
          >
            Voir tout →
          </Link>
        </header>
        {stats.recentEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {stats.recentEvents.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/admin/events/${e.id}/edit`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="truncate text-[14px] font-medium">{e.title}</span>
                      {e.featured && (
                        <span className="bg-brand-orange/15 text-brand-orange shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] tracking-wide text-black/45 uppercase">
                      {e.category}
                      <span aria-hidden>·</span>
                      <span>{new Date(e.updated_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <StatusPill status={e.status as "draft" | "published"} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "navy" | "orange" | "green" | "amber";
}) {
  const toneClasses: Record<typeof tone, string> = {
    navy: "bg-[#003f7e]/8 text-[#003f7e]",
    orange: "bg-brand-orange/12 text-brand-orange",
    green: "bg-emerald-500/12 text-emerald-600",
    amber: "bg-amber-500/15 text-amber-600",
  };
  return (
    <div className="rounded-xl border border-black/[0.07] bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,3,0.18)]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.2em] text-black/50 uppercase">
          {label}
        </p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${toneClasses[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-display mt-4 text-4xl font-bold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-emerald-700 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Publié
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Brouillon
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-[13px] text-black/55">
        Aucun événement pour le moment.
      </p>
      <Link
        href="/admin/events/new"
        className="bg-brand-orange hover:bg-brand-orange/90 mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[12.5px] font-semibold tracking-wide text-[#000003]"
      >
        <Plus className="h-4 w-4" /> Créer le premier événement
      </Link>
    </div>
  );
}
