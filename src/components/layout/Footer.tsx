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
            gridTemplateColumns: "1.6fr repeat(3,1fr)",
            gap: 48,
          }}
        >
          <div>
            <a
              href="/"
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
                  value="monaciri@sportsminds.ma"
                  href="mailto:monaciri@sportsminds.ma"
                  accent={accent}
                />
              </li>
              <li>
                <FooterContact
                  label="TEL."
                  value="+212 6 61 17 34 44"
                  href="tel:+212661173444"
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
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
            cursor: "pointer",
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

function Logomark(): React.ReactElement {
  const style: CSSProperties = { display: "block", height: 40, width: "auto" };
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src="/sportsmindslogo.jpeg" alt="Sports Minds" style={style} />
  );
}
