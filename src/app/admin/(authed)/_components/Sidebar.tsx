"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Tv,
  Building2,
  Images,
  Settings,
  LogOut,
  ArrowLeft,
  FileText,
} from "lucide-react";
import type { AppRole } from "@/lib/auth";

const NAV = [
  { href: "/admin",             label: "Dashboard",       icon: LayoutDashboard },
  { href: "/admin/pages",       label: "Pages du site",   icon: FileText },
  { href: "/admin/events",      label: "Événements",      icon: CalendarDays },
  { href: "/admin/productions", label: "Productions",     icon: Tv },
  { href: "/admin/references",  label: "Références",      icon: Building2 },
  { href: "/admin/media",       label: "Galerie média",   icon: Images },
] as const;

const ADMIN_NAV = [
  { href: "/admin/settings",    label: "Paramètres",      icon: Settings },
] as const;

export function Sidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-black/[0.07] bg-white">
      {/* Brand */}
      <div className="border-b border-black/[0.07] px-6 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="bg-brand-blue flex h-9 w-9 items-center justify-center rounded-md">
            <span className="font-display text-[15px] leading-none font-bold text-white">SM</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-wide uppercase">Sports Minds</div>
            <div className="font-mono text-[9px] tracking-[0.22em] text-black/45 uppercase">CRM</div>
          </div>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-2 px-3 font-mono text-[10px] tracking-[0.22em] text-black/40 uppercase">
          Gestion
        </div>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </ul>

        {role === "admin" && (
          <>
            <div className="mt-6 mb-2 px-3 font-mono text-[10px] tracking-[0.22em] text-black/40 uppercase">
              Admin
            </div>
            <ul className="flex flex-col gap-0.5">
              {ADMIN_NAV.map((item) => (
                <NavLink key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-black/[0.07] px-3 py-4">
        <Link
          href="/"
          className="hover:bg-brand-orange/10 hover:text-brand-orange flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-black/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voir le site
        </Link>
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-black/60 transition-colors hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={[
          "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
          active
            ? "bg-[#003f7e] text-white"
            : "text-black/70 hover:bg-black/[0.04] hover:text-black",
        ].join(" ")}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
        {active && (
          <span className="bg-brand-orange absolute top-1/2 right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
        )}
      </Link>
    </li>
  );
}
