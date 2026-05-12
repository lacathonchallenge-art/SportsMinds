"use client";

import { Fragment, useEffect, useState } from "react";
import { Btn, Reveal } from "@/components/ui/Atoms";
import { Navbar } from "@/components/layout/Navbar";
import { pickLink, pickStr, txt, type SectionCms } from "@/lib/cms/section";

export type HeroMotion = "kinetic" | "still";

interface HeroProps {
  accent?: string;
  motion?: HeroMotion;
  cms?: SectionCms;
}

export function Hero({ accent = "var(--orange)", motion = "kinetic", cms }: HeroProps) {
  const eyebrow = pickStr(
    cms?.content_json,
    "eyebrow",
    "AGENCE CONSEIL · COMMUNICATION SPORTIVE",
  );
  const tagline = txt(cms?.subtitle, "SPORT / MÉDIA / ÉVÉNEMENTIEL / IMPACT");
  const body = pickStr(
    cms?.content_json,
    "body",
    "Nous concevons des expériences sportives, des productions médias et des activations de marque à forte visibilité — du brief stratégique à la captation live.",
  );
  const cta1 = pickLink(cms?.content_json, "cta_primary", {
    label: "Découvrir nos expertises",
    href: "/#expertises",
  });
  const cta2 = pickLink(cms?.content_json, "cta_secondary", {
    label: "Lancer un projet",
    href: "/#contact",
  });
  const taglineParts = tagline.split("/").map((p) => p.trim()).filter(Boolean);
  return (
    <section
      id="home"
      data-screen-label="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "var(--ink)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <HeroSlider accent={accent} motion={motion} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              linear-gradient(90deg, rgba(0,0,3,.85) 0%, rgba(0,0,3,.55) 45%, rgba(0,0,3,.35) 100%),
              linear-gradient(180deg, rgba(0,0,3,.35) 0%, rgba(0,0,3,.0) 30%, rgba(0,0,3,.0) 60%, rgba(0,0,3,.85) 100%),
              radial-gradient(ellipse at 65% 40%, rgba(0,63,126,.35) 0%, transparent 60%)
            `,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.5,
            background: `
              repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 1px, transparent 1px 80px),
              repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0 1px, transparent 1px 80px)
            `,
          }}
        />
        <FieldLines />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: 1200,
            height: 600,
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse at center top, rgba(255,255,255,.10) 0%, transparent 55%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        {motion !== "still" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "40%",
                background: `linear-gradient(90deg, transparent 0%, ${accent}26 50%, transparent 100%)`,
                animation: "scan-x 8s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      <Navbar accent={accent} />

      <div
        className="hero-main"
        style={{
          position: "relative",
          flex: 1,
          display: "block",
          padding: "140px 56px 0",
        }}
      >
        <div
          className="section-content"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100%",
          }}
        >
          <div>
            <Reveal className="label" style={{ color: "rgba(255,255,255,.6)", marginBottom: 28 }}>
              <span style={{ color: accent }}>●</span> &nbsp;{eyebrow}
            </Reveal>

            <Reveal delay={1}>
              <h1
                className="display"
                style={{
                  fontSize: "clamp(80px, 11vw, 192px)",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ display: "block" }}>SPORTS</span>
                <span style={{ display: "block", position: "relative" }}>
                  <span
                    style={{
                      WebkitTextStroke: `1.5px ${accent}`,
                      color: "transparent",
                      background: "transparent",
                    }}
                  >
                    MINDS
                    <span style={{ color: accent, WebkitTextStroke: "0" }}>.</span>
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal
              delay={2}
              className="oswald hero-tagline"
              style={{
                marginTop: 24,
                fontSize: 22,
                letterSpacing: ".18em",
                color: "rgba(255,255,255,.85)",
              }}
            >
              {taglineParts.map((part, i) => (
                <Fragment key={`${part}-${i}`}>
                  {i > 0 && (
                    <>
                      &nbsp;<span style={{ color: accent }}>/</span>&nbsp;
                    </>
                  )}
                  {part}
                </Fragment>
              ))}
            </Reveal>

            <Reveal
              delay={3}
              style={{
                maxWidth: 560,
                marginTop: 32,
                fontSize: 17,
                lineHeight: 1.55,
                color: "rgba(255,255,255,.7)",
                textWrap: "pretty" as never,
              }}
            >
              {body}
            </Reveal>

            <Reveal
              delay={4}
              style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}
            >
              <Btn accent="#033e7d" color="var(--white)" href={cta1.href}>
                {cta1.label}
              </Btn>
              <Btn kind="ghost" href={cta2.href}>{cta2.label}</Btn>
            </Reveal>
          </div>

          <div
            className="hero-stats"
            style={{
              display: "flex",
              gap: 0,
              marginTop: 80,
              marginBottom: 32,
              borderTop: "1px solid var(--line)",
              paddingTop: 24,
            }}
          >
            {(
              [
                ["18+", "Années", "sur le terrain"],
                ["320+", "Événements", "livrés"],
                ["80M+", "Spectateurs", "touchés"],
                ["7", "Productions TV", "en diffusion"],
              ] as const
            ).map(([n, l, s], i) => (
              <div
                key={l}
                style={{
                  flex: 1,
                  paddingRight: 24,
                  borderRight: i < 3 ? "1px solid var(--line)" : "none",
                  paddingLeft: i ? 24 : 0,
                }}
              >
                <div className="display" style={{ fontSize: 38, color: accent, lineHeight: 1 }}>
                  {n}
                </div>
                <div
                  className="oswald"
                  style={{ fontSize: 12, marginTop: 8, color: "rgba(255,255,255,.85)" }}
                >
                  {l}
                </div>
                <div
                  className="label"
                  style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 4 }}
                >
                  {s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Marquee accent={accent} />
    </section>
  );
}

function FieldLines() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.18,
        pointerEvents: "none",
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1600 1000"
    >
      <defs>
        <linearGradient id="fl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset=".5" stopColor="white" stopOpacity=".55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#fl)" strokeWidth="1" fill="none">
        <path d="M0,1000 L800,400 L1600,1000" />
        <path d="M-200,1000 L800,300 L1800,1000" />
        <ellipse cx="800" cy="400" rx="120" ry="32" />
        <line x1="0" y1="600" x2="1600" y2="600" />
        <line x1="0" y1="750" x2="1600" y2="750" />
      </g>
    </svg>
  );
}

const HERO_SLIDES = [
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80", tag: "FOOTBALL",  caption: "Stade · captation live" },
  { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80",   tag: "BASKETBALL", caption: "Action · arena" },
  { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80", tag: "ATHLÉTISME", caption: "Piste · performance" },
  { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",   tag: "TENNIS",     caption: "Court · finale" },
  { src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80", tag: "STADE",      caption: "Vue large · 80k spectateurs" },
];

function HeroSlider({ accent, motion }: { accent: string; motion: HeroMotion }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (motion === "still") return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 4200);
    return () => clearInterval(t);
  }, [motion]);

  const total = HERO_SLIDES.length;
  const cur = HERO_SLIDES[idx];

  return (
    <Fragment>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.src}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${s.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1.4s cubic-bezier(.2,.7,.2,1), transform 7s linear",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          right: 56,
          top: 160,
          zIndex: 5,
          padding: "6px 10px",
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--line-strong)",
        }}
      >
        <span className="label" style={{ color: "var(--white)", fontSize: 10 }}>
          <span style={{ color: accent }}>{String(idx + 1).padStart(2, "0")}</span> /{" "}
          {String(total).padStart(2, "0")}
          &nbsp;·&nbsp;
          <span style={{ color: "rgba(255,255,255,.65)" }}>{cur.tag}</span>
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 56,
          bottom: 96,
          zIndex: 5,
          display: "flex",
          gap: 6,
        }}
      >
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === idx ? 28 : 12,
              height: 3,
              border: 0,
              padding: 0,
              cursor: "pointer",
              background: i === idx ? accent : "rgba(255,255,255,.35)",
              transition: "width .4s ease, background .4s ease",
            }}
          />
        ))}
      </div>
    </Fragment>
  );
}

function Marquee({ accent }: { accent: string }) {
  const items = [
    "DANONE NATIONS CUP",
    "GRAND PRIX HASSAN II",
    "MARATHON DES SABLES",
    "MARATHON DE CASABLANCA",
    "LACOSTE CUP MOROCCO",
    "CFAO SUMMER DRIVE",
    "TOURNOI NOJOUM DOUARS",
    "JET SKI CASABLANCA",
    "PLANÈTE FOOT",
    "EN ROUTE POUR LA TUNISIE",
    "EL GUERROUJ À CŒUR OUVERT",
  ];
  const row = [...items, ...items];
  return (
    <div
      style={{
        position: "relative",
        marginTop: 48,
        marginBottom: 0,
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "18px 0",
        overflow: "hidden",
        background: "rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 60s linear infinite",
          gap: 48,
        }}
      >
        {row.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="oswald"
            style={{
              fontSize: 16,
              letterSpacing: ".16em",
              color: "rgba(255,255,255,.7)",
              display: "inline-flex",
              alignItems: "center",
              gap: 48,
            }}
          >
            <span style={{ width: 6, height: 6, background: accent, display: "inline-block" }} />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
