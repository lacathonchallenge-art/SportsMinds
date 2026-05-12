import type { ReactNode } from "react";

export function PlaceholderSection({
  title,
  description,
  jalon,
  children,
}: {
  title: string;
  description: string;
  jalon: 2 | 3;
  children?: ReactNode;
}) {
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          Jalon {jalon}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-black/60">
          {description}
        </p>
      </div>

      <div className="bg-brand-orange/8 border-brand-orange/30 rounded-xl border-2 border-dashed p-10 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          En cours de construction
        </p>
        <p className="mt-3 text-[15px] font-medium text-black/80">
          Ce module arrive au Jalon {jalon}.
        </p>
        <p className="mt-1 text-[13px] text-black/55">
          Authentification et tableau de bord (Jalon 1) opérationnels.
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
