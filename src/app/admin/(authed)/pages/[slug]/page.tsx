import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPageBySlugAdmin } from "@/lib/data/cms";
import { PageEditor } from "./_components/PageEditor";

export const dynamic = "force-dynamic";

const PUBLIC_URLS: Record<string, string> = {
  home: "/",
  about: "/qui-sommes-nous",
  expertises: "/#expertises",
  "events-productions": "/#events",
  contact: "/#contact",
};

export default async function PageEditorRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPageBySlugAdmin(slug);
  if (!data) notFound();

  const publicUrl = PUBLIC_URLS[slug] ?? `/${slug}`;

  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/pages"
            className="hover:text-brand-orange inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-black/55 uppercase transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Retour aux pages
          </Link>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">{data.name}</h2>
          <p className="mt-1 font-mono text-[11px] text-black/45">
            {data.sections.length} section{data.sections.length > 1 ? "s" : ""} ·{" "}
            {data.sections.filter((s) => s.is_visible).length} visible
            {data.sections.filter((s) => s.is_visible).length > 1 ? "s" : ""}
          </p>
        </div>
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3.5 py-2 text-[12.5px] font-semibold tracking-wide text-black/80 hover:bg-black/[0.03]"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Voir sur le site
        </a>
      </header>

      <PageEditor pageSlug={slug} sections={data.sections} />
    </div>
  );
}
