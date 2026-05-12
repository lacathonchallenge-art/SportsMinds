"use client";

import { usePathname } from "next/navigation";
import type { AppUser } from "@/lib/auth";

const TITLES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/events": "Événements",
  "/admin/productions": "Productions médias",
  "/admin/references": "Références",
  "/admin/media": "Galerie média",
  "/admin/settings": "Paramètres",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  for (const [prefix, label] of Object.entries(TITLES)) {
    if (prefix !== "/admin" && pathname.startsWith(prefix)) return label;
  }
  return "Admin";
}

export function Topbar({ user }: { user: AppUser }) {
  const pathname = usePathname();
  const title = titleFor(pathname);
  const initial = (user.email[0] ?? "?").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/[0.07] bg-white/85 px-6 backdrop-blur-md">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] tracking-[0.22em] text-black/45 uppercase">
          {user.role === "admin" ? "Administrateur" : "Éditeur"}
        </span>
        <h1 className="text-[18px] font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden flex-col text-right md:flex">
          <span className="text-[13px] font-medium text-black/80">{user.email}</span>
          <span className="font-mono text-[9px] tracking-[0.22em] text-black/40 uppercase">
            En ligne
          </span>
        </div>
        <div className="bg-brand-blue/10 text-brand-blue flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-semibold">
          {initial}
        </div>
      </div>
    </header>
  );
}
