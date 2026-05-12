"use client";

import {
  Fragment,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
} from "react";
import { Arrow, LiveDot } from "@/components/ui/Atoms";

const FOOTER_NAVY = "#033e7d";

interface FooterLink {
  l: string;
  h: string;
}
interface FooterCol {
  title: string;
  items: FooterLink[];
}
interface Social {
  name: string;
  href: string;
  icon: "in" | "ig" | "yt" | "vm" | "pdf";
}

const FOOTER_COLS: FooterCol[] = [
  {
    title: "Agence",
    items: [
      { l: "Qui sommes-nous", h: "#about" },
      { l: "Vision",          h: "#about" },
      { l: "Valeurs",         h: "#about" },
      { l: "Équipe",          h: "#about" },
      { l: "Carrières",       h: "#contact" },
    ],
  },
  {
    title: "Expertises",
    items: [
      { l: "Événementiel",     h: "#expertises" },
      { l: "Production média", h: "#expertises" },
      { l: "Activation",       h: "#expertises" },
      { l: "Talents",          h: "#expertises" },
      { l: "Conseil",          h: "#expertises" },
    ],
  },
  {
    title: "Travaux",
    items: [
      { l: "Événements",    h: "#events" },
      { l: "TV & Radio",    h: "#events" },
      { l: "Études de cas", h: "#events" },
      { l: "Awards",        h: "#events" },
    ],
  },
];

const SOCIALS: Social[] = [
  { name: "LinkedIn",  href: "#", icon: "in" },
  { name: "Instagram", href: "#", icon: "ig" },
  { name: "YouTube",   href: "#", icon: "yt" },
  { name: "Vimeo",     href: "#", icon: "vm" },
];

export function Footer({ accent = "var(--orange)" }: { accent?: string }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "var(--white)",
        borderTop: "1px solid var(--line)",
      }}
    >
      {/* Newsletter strip */}
      <div
        className="section-pad"
        style={{
          background: `linear-gradient(120deg, ${FOOTER_NAVY} 0%, #052852 60%, #000820 100%)`,
          padding: "40px 56px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(240,148,62,.25) 0%, transparent 65%)`,
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="section-content"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="label"
              style={{
                color: accent,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LiveDot color={accent} /> NEWSLETTER · COULISSES
            </div>
            <div
              className="oswald"
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: ".02em",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              Restez dans le <span style={{ color: accent }}>vestiaire</span>
            </div>
            <p
              className="body-text"
              style={{ color: "rgba(255,255,255,.78)", marginTop: 10, maxWidth: 480 }}
            >
              Productions, événements, coulisses et études de cas — une fois par mois, jamais
              plus.
            </p>
          </div>
          <form
            onSubmit={subscribe}
            style={{
              display: "flex",
              gap: 0,
              background: "rgba(0,0,3,.55)",
              border: "1px solid rgba(255,255,255,.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                subscribed ? "✓  Merci, à bientôt dans vos mails." : "Votre email professionnel"
              }
              disabled={subscribed}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--white)",
                padding: "18px 22px",
                fontSize: 15,
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={subscribed}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 28px",
                background: subscribed ? "transparent" : accent,
                color: "var(--ink)",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                border: "none",
                cursor: subscribed ? "default" : "pointer",
                transition: "background .25s ease",
              }}
            >
              {subscribed ? (
                <span style={{ color: accent }}>OK</span>
              ) : (
                <Fragment>
                  S&apos;inscrire <Arrow size={12} />
                </Fragment>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div
        className="section-pad"
        style={{ padding: "72px 56px 48px", borderBottom: "1px solid var(--line)" }}
      >
        <div
          className="section-content"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr repeat(4,1fr)",
            gap: 48,
          }}
        >
          <div>
            <a
              href="#home"
              aria-label="Sports Minds — Accueil"
              style={{ display: "inline-flex", alignItems: "center", marginBottom: 20 }}
            >
              <Logomark />
            </a>
            <p
              className="body-text"
              style={{
                color: "rgba(255,255,255,.65)",
                maxWidth: 340,
                marginTop: 0,
                marginBottom: 24,
              }}
            >
              Depuis 2007, l&apos;agence qui connecte le sport, les marques et les médias à
              travers des événements, productions et activations à fort impact.
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <li>
                <FooterContact
                  label="EMAIL"
                  value="hello@sportsminds.ma"
                  href="mailto:hello@sportsminds.ma"
                  accent={accent}
                />
              </li>
              <li>
                <FooterContact
                  label="TEL."
                  value="+212 522 00 00 00"
                  href="tel:+212522000000"
                  accent={accent}
                />
              </li>
              <li>
                <FooterContact
                  label="HQ"
                  value="23, Rue de l'Atlas · Maârif · Casablanca"
                  accent={accent}
                />
              </li>
            </ul>

            <div style={{ marginTop: 24, display: "flex", gap: 10, alignItems: "center" }}>
              <span
                className="label"
                style={{
                  padding: "5px 9px",
                  background: FOOTER_NAVY,
                  color: "var(--white)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <LiveDot color={accent} /> EN ACTIVITÉ
              </span>
              <span className="label" style={{ color: "rgba(255,255,255,.45)" }}>
                CASABLANCA · PARIS
              </span>
            </div>
          </div>

          {FOOTER_COLS.map((c) => (
            <div key={c.title}>
              <div
                className="label"
                style={{
                  color: accent,
                  marginBottom: 18,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${FOOTER_NAVY}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    background: accent,
                    display: "inline-block",
                  }}
                />
                {c.title.toUpperCase()}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {c.items.map((it) => (
                  <li key={it.l}>
                    <a
                      href={it.h}
                      className="oswald"
                      style={{
                        fontSize: 13,
                        letterSpacing: ".05em",
                        color: "rgba(255,255,255,.72)",
                        display: "inline-block",
                        padding: "2px 0",
                        transition: "color .2s ease, transform .2s ease",
                      }}
                      onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.currentTarget.style.color = "var(--white)";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.currentTarget.style.color = "rgba(255,255,255,.72)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      {it.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div
              className="label"
              style={{
                color: accent,
                marginBottom: 18,
                paddingBottom: 10,
                borderBottom: `1px solid ${FOOTER_NAVY}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{ width: 4, height: 4, background: accent, display: "inline-block" }}
              />
              SUIVRE
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 8,
              }}
            >
              {SOCIALS.map((s) => (
                <SocialBtn key={s.name} {...s} accent={accent} />
              ))}
            </div>
            <a
              href="#"
              className="oswald"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                color: accent,
                fontSize: 12,
                letterSpacing: ".1em",
              }}
            >
              <SocialIcon name="pdf" /> PRESS KIT
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div
        className="section-pad"
        style={{
          padding: "56px 56px",
          overflow: "hidden",
          position: "relative",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 200,
            background: `radial-gradient(ellipse at center, rgba(3,62,125,.55) 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="display"
          style={{
            position: "relative",
            fontSize: "clamp(110px, 18vw, 320px)",
            lineHeight: 0.85,
            textTransform: "uppercase",
            background: `linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.06) 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            whiteSpace: "nowrap",
            textAlign: "center",
            letterSpacing: "-.02em",
          }}
        >
          SPORTS MINDS
          <span style={{ color: accent, WebkitTextFillColor: accent }}>.</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="section-pad" style={{ padding: "22px 56px" }}>
        <div
          className="section-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            className="label"
          style={{
            color: "rgba(255,255,255,.45)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: accent }}>©</span> 2026 SPORTS MINDS · TOUS DROITS RÉSERVÉS
        </span>
        <div
          className="label"
          style={{
            display: "flex",
            gap: 24,
            color: "rgba(255,255,255,.45)",
            flexWrap: "wrap",
          }}
        >
          {(["MENTIONS LÉGALES", "CONFIDENTIALITÉ", "CRÉDITS"] as const).map((l) => (
            <a
              key={l}
              href="#"
              style={{ transition: "color .2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}
            >
              {l}
            </a>
          ))}
        </div>
        <a
          href="#home"
          className="oswald"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            border: "1px solid rgba(255,255,255,.18)",
            color: "var(--white)",
            fontSize: 11,
            letterSpacing: ".12em",
          }}
        >
          <span style={{ transform: "rotate(-90deg)", display: "inline-flex" }}>
            <Arrow size={11} />
          </span>
          REMONTER
        </a>
        </div>
      </div>
    </footer>
  );
}

function FooterContact({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string;
  href?: string;
  accent: string;
}) {
  const inner = (
    <Fragment>
      <span
        className="label"
        style={{ color: accent, fontSize: 9, minWidth: 42 }}
      >
        {label}
      </span>
      <span
        className="oswald"
        style={{ fontSize: 13, fontWeight: 500, color: "var(--white)" }}
      >
        {value}
      </span>
    </Fragment>
  );
  return href ? (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        transition: "opacity .2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = ".78")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {inner}
    </a>
  ) : (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>{inner}</div>
  );
}

function SocialBtn({ name, href, icon, accent }: Social & { accent: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      aria-label={name}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 10px",
        border: `1px solid ${hover ? accent : "rgba(255,255,255,.18)"}`,
        background: hover ? "rgba(240,148,62,.10)" : "rgba(255,255,255,.03)",
        color: hover ? accent : "rgba(255,255,255,.85)",
        transition: "all .25s ease",
      }}
    >
      <SocialIcon name={icon} />
      <span className="label" style={{ fontSize: 10, color: "inherit" }}>
        {name.toUpperCase()}
      </span>
    </a>
  );
}

function SocialIcon({ name }: { name: Social["icon"] }) {
  const common = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor" } as const;
  if (name === "in")
    return (
      <svg {...common}>
        <path d="M4 4h4v16H4zM6 2.5A1.5 1.5 0 1 1 6 5.5 1.5 1.5 0 0 1 6 2.5zM10 8h3.8v2.2h.05c.53-1 1.85-2.05 3.8-2.05 4.05 0 4.8 2.65 4.8 6.1V20H18.5v-5.5c0-1.3-.02-3-1.85-3-1.85 0-2.13 1.45-2.13 2.9V20H10z" />
      </svg>
    );
  if (name === "ig")
    return (
      <svg {...common}>
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zM12 6.85a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7zm5.35-8.74a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
      </svg>
    );
  if (name === "yt")
    return (
      <svg {...common}>
        <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8a31 31 0 0 0-.5-4.8zM10 15.5v-7l6 3.5z" />
      </svg>
    );
  if (name === "vm")
    return (
      <svg {...common}>
        <path d="M22.99 7.04c-.1 2.2-1.65 5.22-4.65 9.04-3.1 3.99-5.72 5.98-7.86 5.98-1.32 0-2.45-1.22-3.36-3.66l-1.83-6.7c-.68-2.44-1.41-3.66-2.19-3.66-.17 0-.76.36-1.78 1.06L0 7.69c1.13-.99 2.24-1.99 3.34-2.99 1.5-1.3 2.63-1.98 3.39-2.05 1.79-.17 2.89 1.05 3.31 3.66.45 2.83.76 4.59.93 5.26.5 2.3 1.04 3.45 1.65 3.45.46 0 1.16-.74 2.1-2.21.93-1.47 1.43-2.59 1.5-3.36.13-1.27-.37-1.91-1.5-1.91-.53 0-1.08.12-1.65.36 1.1-3.6 3.2-5.35 6.3-5.25 2.3.07 3.38 1.55 3.27 4.47z" />
      </svg>
    );
  if (name === "pdf")
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
      </svg>
    );
  return null;
}

function Logomark(): React.ReactElement {
  const style: CSSProperties = { display: "block", height: 40, width: "auto" };
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src="/sportsmindslogo.jpeg" alt="Sports Minds" style={style} />
  );
}
