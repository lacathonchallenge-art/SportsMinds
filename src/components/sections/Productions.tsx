"use client";

import { useState } from "react";
import { Arrow, LiveDot, Reveal, Section } from "@/components/ui/Atoms";

const NAVY = "#033e7d";

export interface Production {
  name: string;
  fmt: "TV" | "RADIO";
  date: string;
  sponsor?: string;
  type?: string;
  host?: string;
}

export function Productions({
  accent = "var(--orange)",
  productions,
}: {
  accent?: string;
  productions: Production[];
}) {
  if (productions.length === 0) return null;
  return (
    <Section
      dark={false}
      padY={50}
      style={{ borderTop: "1px solid rgba(0,0,3,.08)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 64,
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            className="label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "rgba(0,0,3,.65)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                border: `1px solid ${NAVY}`,
                color: NAVY,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
              }}
            >
              05
            </span>
            <span style={{ height: 1, width: 38, background: "rgba(0,0,3,.25)" }} />
            <span>PRODUCTIONS MÉDIAS</span>
          </div>
          <Reveal
            as="h2"
            delay={1}
            className="display h2-section"
            style={{
              marginTop: 24,
              textTransform: "uppercase",
              maxWidth: 1000,
              color: "var(--ink)",
            }}
          >
            On signal —<br />365 jours<br />par&nbsp;<span style={{ color: accent }}>an.</span>
          </Reveal>
        </div>
        <Reveal
          delay={2}
          className="body-text"
          style={{ maxWidth: 380, color: "rgba(0,0,3,.65)" }}
        >
          De la captation multicam au plateau, du magazine au format court — un atelier de
          production intégré pour les diffuseurs nationaux.
        </Reveal>
      </div>

      <Reveal delay={2}>
        <div
          className="prod-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 20px",
            border: "1px solid rgba(0,0,3,.12)",
            background: "rgba(3,62,125,.06)",
            marginBottom: 1,
            flexWrap: "wrap",
          }}
        >
          <span
            className="label"
            style={{
              padding: "4px 10px",
              background: NAVY,
              color: "var(--white)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LiveDot color={accent} /> CATALOGUE
          </span>
          <span
            className="oswald"
            style={{ fontSize: 14, letterSpacing: ".1em", color: "var(--ink)" }}
          >
            HISTORIQUE DES PRODUCTIONS
          </span>
        </div>
      </Reveal>

      <div style={{ border: "1px solid rgba(0,0,3,.12)", borderTop: "none" }}>
        {productions.map((p, i) => (
          <Reveal key={p.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <ProdRow p={p} accent={accent} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProdRow({
  p,
  accent,
  index,
}: {
  p: Production;
  accent: string;
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const meta = [
    p.type,
    p.host && `avec ${p.host}`,
    p.sponsor && `pour ${p.sponsor}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="prod-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 24,
        alignItems: "center",
        padding: "24px 20px",
        background: hover ? "rgba(3,62,125,.07)" : "transparent",
        borderTop: index ? "1px solid rgba(0,0,3,.10)" : "none",
        transition: "background .3s ease",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <span className="prod-row-idx label" style={{ color: "rgba(0,0,3,.45)", width: 40 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="prod-row-title" style={{ minWidth: 0 }}>
        <div
          className="oswald prod-row-name"
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: ".04em",
            color: "var(--ink)",
            wordBreak: "break-word",
          }}
        >
          «&nbsp;{p.name}&nbsp;»
        </div>
        <div style={{ marginTop: 6, fontSize: 12.5, color: "rgba(0,0,3,.55)" }}>{meta}</div>
      </div>
      <div
        className="prod-row-aside"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexShrink: 0,
        }}
      >
        <span
          className="label"
          style={{
            padding: "5px 9px",
            border: `1px solid ${p.fmt === "TV" ? accent : "rgba(0,0,3,.18)"}`,
            color: p.fmt === "TV" ? accent : "rgba(0,0,3,.75)",
            minWidth: 54,
            textAlign: "center",
          }}
        >
          {p.fmt}
        </span>
        <span
          className="oswald prod-row-date"
          style={{
            fontSize: 14,
            letterSpacing: ".06em",
            color: NAVY,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
          }}
        >
          {p.date}
        </span>
        <span
          className="prod-row-arrow"
          style={{
            color: accent,
            transition: "transform .3s ease",
            transform: hover ? "translateX(6px)" : "none",
          }}
        >
          <Arrow size={16} />
        </span>
      </div>
    </div>
  );
}
