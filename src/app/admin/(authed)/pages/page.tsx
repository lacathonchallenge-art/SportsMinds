import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { listPages } from "@/lib/data/cms";

export const dynamic = "force-dynamic";

const PUBLIC_URLS: Record<string, string> = {
  home: "/",
  about: "/qui-sommes-nous",
  expertises: "/#expertises",
  "events-productions": "/#events",
  contact: "/#contact",
};

export default async function AdminPagesPage() {
  const pages = await listPages();
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          CRM · Pages du site
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Pages du site</h2>
        <p className="mt-2 max-w-2xl text-[13px] text-black/55">
          Modifie titres, sous-titres, textes, images et boutons des pages publiques.
          Les modifications publiées s&apos;appliquent automatiquement sur le site.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {pages.map((p) => (
          <article
            key={p.id}
            className="group rounded-xl border border-black/[0.07] bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-22px_rgba(0,0,3,0.18)]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="bg-brand-orange/15 text-brand-orange flex h-9 w-9 items-center justify-center rounded-md">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">{p.name}</h3>
                    <a
                      href={PUBLIC_URLS[p.slug] ?? "/"}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] tracking-wide text-black/45 hover:text-[#003f7e]"
                    >
                      {PUBLIC_URLS[p.slug] ?? `/${p.slug}`}
                    </a>
                  </div>
                </div>
              </div>
              <StatusPill status={p.status} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
              <div className="font-mono text-[10px] tracking-wide text-black/45">
                Modifié le {new Date(p.updated_at).toLocaleDateString("fr-FR")}
              </div>
              <Link
                href={`/admin/pages/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#003f7e] px-3 py-1.5 text-[12px] font-semibold tracking-wide text-white transition-colors hover:bg-[#002d5c]"
              >
                Modifier <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}

        {pages.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-black/15 px-6 py-12 text-center text-[13px] text-black/55">
            Aucune page seedée. Lance la migration{" "}
            <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[11px]">
              0005_pages_cms.sql
            </code>
            .
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "draft" | "published" }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-emerald-700 uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        En ligne
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Brouillon
    </span>
  );
}
