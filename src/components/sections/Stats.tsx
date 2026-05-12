"use client";

import type { ReactNode } from "react";
import { CornerGlow, CountUp, Eyebrow, Reveal, Section } from "@/components/ui/Atoms";
import { txt, type SectionCms } from "@/lib/cms/section";

interface StatItem {
  n: number;
  suf: string;
  k: string;
  d: string;
  icon: ReactNode;
}

export function Stats({ accent = "var(--orange)", cms }: { accent?: string; cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "CHIFFRES CLÉS");
  const titleStr = txt(cms?.title, "La preuve par les chiffres.");
  const items: StatItem[] = [
    { n: 18,  suf: "+", k: "années",     d: "d'expérience sur le terrain depuis 2007", icon: <IcCal accent={accent} /> },
    { n: 120, suf: "+", k: "marques",    d: "nationales et internationales accompagnées", icon: <IcStar accent={accent} /> },
    { n: 320, suf: "+", k: "événements", d: "sportifs majeurs livrés",                   icon: <IcFlag accent={accent} /> },
    { n: 480, suf: "h", k: "TV / Radio", d: "de productions diffusées chaque saison",    icon: <IcBroad accent={accent} /> },
  ];

  return (
    <Section
      dark
      padY={50}
      style={{
        background: `linear-gradient(180deg, var(--ink) 0%, var(--navy-deep) 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CornerGlow color="rgba(240,148,62,.25)" position="tl" size={700} />
      <CornerGlow color="rgba(0,63,126,.45)" position="br" size={800} />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 64,
          gap: 32,
          position: "relative",
        }}
      >
        <div>
          <Eyebrow num="06" accent={accent}>
            {eyebrow}
          </Eyebrow>
          <Reveal
            as="h2"
            delay={1}
            className="display h2-section"
            style={{ marginTop: 24, textTransform: "uppercase", maxWidth: 900 }}
          >
            {titleStr === "La preuve par les chiffres." ? (
              <>
                La preuve par<br />
                <span style={{ color: accent }}>les chiffres.</span>
              </>
            ) : (
              titleStr
            )}
          </Reveal>
        </div>
        <Reveal
          delay={2}
          className="label"
          style={{ color: "rgba(255,255,255,.55)" }}
        >
          MIS À JOUR · MAI&nbsp;2026
        </Reveal>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.18)",
          position: "relative",
        }}
      >
        {items.map((it, i) => (
          <Reveal key={it.k} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <StatCell {...it} accent={accent} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function StatCell({ n, suf, k, d, accent, icon }: StatItem & { accent: string }) {
  return (
    <div
      style={{
        background: "rgba(0,0,3,.65)",
        padding: "40px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 280,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div>
        <div
          className="display"
          style={{
            fontSize: 96,
            lineHeight: 1,
            color: "var(--white)",
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <CountUp to={n} />
          <span style={{ color: accent, fontSize: 60 }}>{suf}</span>
        </div>
        <div
          className="oswald"
          style={{ fontSize: 16, fontWeight: 600, marginTop: 14, color: "var(--white)" }}
        >
          {k.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "rgba(255,255,255,.55)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {d}
        </div>
      </div>
      <div
        style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2, padding: 14 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 2,
              height: 8,
              background: i < 3 ? accent : "rgba(255,255,255,.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const IcCal = ({ accent }: { accent: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2.5" y="4.5" width="17" height="14" stroke={accent} strokeWidth="1.3" />
    <path d="M2.5 9h17M7 2v4M15 2v4" stroke={accent} strokeWidth="1.3" />
  </svg>
);
const IcStar = ({ accent }: { accent: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2l2.6 6 6.4.5-4.9 4.3 1.6 6.3L11 16l-5.7 3.1 1.6-6.3L2 8.5 8.4 8 11 2z" stroke={accent} strokeWidth="1.3" />
  </svg>
);
const IcFlag = ({ accent }: { accent: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M5 2v18M5 3h11l-3 4 3 4H5" stroke={accent} strokeWidth="1.3" />
  </svg>
);
const IcBroad = ({ accent }: { accent: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="3" stroke={accent} strokeWidth="1.3" />
    <path
      d="M5 5a8 8 0 0 0 0 12M17 5a8 8 0 0 1 0 12M7.5 7.5a4.5 4.5 0 0 0 0 7M14.5 7.5a4.5 4.5 0 0 1 0 7"
      stroke={accent}
      strokeWidth="1.3"
    />
  </svg>
);
