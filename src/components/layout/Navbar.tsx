"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow } from "@/components/ui/Atoms";

type NavItem = {
  label: string;
  href: string;
  /** For active-state detection. Matches pathname if route, or hash on home. */
  match?: { type: "route"; path: string } | { type: "hash"; anchor: string } | { type: "home" };
};

const ITEMS: NavItem[] = [
  { label: "Accueil", href: "/", match: { type: "home" } },
  {
    label: "Qui sommes-nous",
    href: "/qui-sommes-nous",
    match: { type: "route", path: "/qui-sommes-nous" },
  },
  {
    label: "Expertises",
    href: "/#expertises",
    match: { type: "hash", anchor: "expertises" },
  },
  {
    label: "Événements & productions",
    href: "/evenements-productions",
    match: { type: "route", path: "/evenements-productions" },
  },
  {
    label: "Contact",
    href: "/#contact",
    match: { type: "hash", anchor: "contact" },
  },
];

function isActive(item: NavItem, pathname: string): boolean {
  if (!item.match) return false;
  if (item.match.type === "home") return pathname === "/";
  if (item.match.type === "route") return pathname === item.match.path;
  if (item.match.type === "hash") return false; // hash links don't set active by route
  return false;
}

export function Navbar({ accent = "var(--orange)" }: { accent?: string }) {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close overlay on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navStyle: CSSProperties = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      maxWidth: "100%",
      zIndex: 50,
      padding: scrolled ? "10px 40px" : "20px 56px",
      transition:
        "padding .35s cubic-bezier(.2,.7,.2,1), background .3s ease",
      background: scrolled
        ? "rgba(0,0,3,.82)"
        : "linear-gradient(180deg, rgba(0,0,3,.30) 0%, rgba(0,0,3,0) 100%)",
      backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
    }),
    [scrolled],
  );

  return (
    <Fragment>
      <nav style={navStyle}>
        <Link
          href="/"
          aria-label="Sports Minds — Accueil"
          className="nav-logo-link"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <Logomark />
        </Link>

        {/* Desktop menu */}
        <ul
          className="nav-desktop"
          style={{
            display: "flex",
            gap: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          {ITEMS.map((it, i) => {
            const active = isActive(it, pathname);
            const isInternal = it.href.startsWith("/") && !it.href.includes("#");
            const LinkTag = isInternal ? Link : "a";
            const idx = String(i + 1).padStart(2, "0");
            return (
              <li key={it.label} style={{ position: "relative" }}>
                <LinkTag
                  href={it.href}
                  className={`nav-link oswald ${active ? "nav-link-active" : ""}`}
                >
                  <span className="nav-link-idx" aria-hidden>
                    {idx}
                  </span>
                  <span className="nav-link-label">{it.label}</span>
                </LinkTag>
              </li>
            );
          })}
        </ul>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <a
            href="/#contact"
            className="nav-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              background: accent,
              color: "var(--ink)",
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              position: "relative",
              transition:
                "transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease, background .25s ease",
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>Lancer un projet</span>
            <span
              className="nav-cta-arrow"
              aria-hidden
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "transform .35s cubic-bezier(.2,.7,.2,1)",
              }}
            >
              <Arrow size={12} />
            </span>
          </a>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="nav-burger"
            style={{
              display: "none",
              width: 48,
              height: 48,
              border: "1px solid rgba(255,255,255,.25)",
              background: scrolled ? "rgba(0,0,3,.65)" : "rgba(0,0,3,.45)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              padding: 0,
              position: "relative",
              zIndex: 51,
              pointerEvents: "auto",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              transition: "background .25s ease, border-color .25s ease",
            }}
          >
            <Bars open={open} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        aria-hidden={!open}
        className="nav-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          maxWidth: "100%",
          height: "100dvh",
          zIndex: 49,
          background: `
            radial-gradient(ellipse at top right, rgba(3,62,125,.55) 0%, transparent 55%),
            radial-gradient(ellipse at bottom left, rgba(240,148,62,.18) 0%, transparent 50%),
            linear-gradient(180deg, #000003 0%, #00060f 100%)
          `,
          backdropFilter: "blur(20px)",
          padding: "88px 24px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: open ? "translateY(0)" : "translateY(-100%)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "transform .45s cubic-bezier(.2,.7,.2,1), opacity .35s ease",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,.12)",
            background: "rgba(3,62,125,.30)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: accent,
              borderRadius: "50%",
              animation: "pulse-ring 2s infinite",
            }}
          />
          <span
            className="label"
            style={{ color: "rgba(255,255,255,.85)", fontSize: 10 }}
          >
            SPORT <span style={{ color: accent }}>/</span> MÉDIA{" "}
            <span style={{ color: accent }}>/</span> ÉVÉNEMENTIEL
          </span>
        </div>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            flex: 1,
          }}
        >
          {ITEMS.map((it, i) => {
            const active = isActive(it, pathname);
            const isInternal = it.href.startsWith("/") && !it.href.includes("#");
            const LinkTag = isInternal ? Link : "a";
            return (
              <li
                key={it.label}
                className="nav-overlay-item"
                style={
                  {
                    borderBottom: "1px solid rgba(255,255,255,.10)",
                    "--idx": i,
                  } as CSSProperties
                }
              >
                <LinkTag
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="oswald"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 4px",
                    color: "var(--white)",
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                    position: "relative",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        background: active ? accent : "#033e7d",
                        color: active ? "var(--ink)" : "var(--white)",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 10,
                        letterSpacing: ".05em",
                        transition: "background .25s ease, color .25s ease",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        color: active ? accent : "var(--white)",
                        transition: "color .25s ease",
                      }}
                    >
                      {it.label}
                    </span>
                  </span>
                  <span style={{ color: accent, display: "inline-flex" }}>
                    <Arrow size={14} />
                  </span>
                </LinkTag>
              </li>
            );
          })}
        </ul>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              padding: "14px 16px",
              background: "rgba(3,62,125,.28)",
              border: "1px solid rgba(3,62,125,.55)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                className="label"
                style={{ color: accent, fontSize: 9, marginBottom: 6 }}
              >
                EMAIL
              </div>
              <a
                href="mailto:monaciri@sportsminds.ma"
                className="oswald"
                style={{
                  color: "var(--white)",
                  fontSize: 11.5,
                  fontWeight: 500,
                  wordBreak: "break-all",
                  display: "block",
                }}
              >
                monaciri@sportsminds.ma
              </a>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                className="label"
                style={{ color: accent, fontSize: 9, marginBottom: 6 }}
              >
                TEL.
              </div>
              <a
                href="tel:+212661173444"
                className="oswald"
                style={{
                  color: "var(--white)",
                  fontSize: 11.5,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                +212 6 61 17 34 44
              </a>
            </div>
          </div>

          <a
            href="/#contact"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "16px 18px",
              background: accent,
              color: "var(--ink)",
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            <span>Lancer un projet</span>
            <Arrow size={14} />
          </a>
        </div>
      </div>
    </Fragment>
  );
}

function Bars({ open }: { open: boolean }) {
  const bar: CSSProperties = {
    position: "absolute",
    left: 14,
    right: 14,
    height: 2,
    background: "var(--white)",
    pointerEvents: "none",
    transition: "transform .3s ease, opacity .2s ease, top .3s ease",
  };
  return (
    <Fragment>
      <span
        style={{
          ...bar,
          top: open ? 23 : 16,
          transform: open ? "rotate(45deg)" : "none",
        }}
      />
      <span style={{ ...bar, top: 23, opacity: open ? 0 : 1 }} />
      <span
        style={{
          ...bar,
          top: open ? 23 : 30,
          transform: open ? "rotate(-45deg)" : "none",
        }}
      />
    </Fragment>
  );
}

function Logomark() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/sportsmindslogo.jpeg"
      alt="Sports Minds"
      className="nav-logo-img"
      style={{
        display: "block",
        height: 56,
        width: "auto",
        transition: "transform .35s cubic-bezier(.2,.7,.2,1), filter .25s ease",
      }}
    />
  );
}
