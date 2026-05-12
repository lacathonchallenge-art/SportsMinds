"use client";

import { useState } from "react";
import { Reveal, Section } from "@/components/ui/Atoms";

const NAVY = "#033e7d";

export interface Client {
  name: string;
  url: string;
}

export function References({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;
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
          marginBottom: 56,
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
              color: "rgba(0,0,3,.6)",
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
              03
            </span>
            <span style={{ height: 1, width: 38, background: "rgba(0,0,3,.25)" }} />
            <span>RÉFÉRENCES</span>
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
            Ils nous ont fait<br />
            <span style={{ color: NAVY }}>confiance.</span>
          </Reveal>
        </div>
        <Reveal
          delay={2}
          className="body-text"
          style={{ maxWidth: 360, color: "rgba(0,0,3,.65)" }}
        >
          Des marques nationales et internationales — sport, lifestyle, automobile, banque,
          télécom, média — toutes connectées par la même obsession : l&apos;impact.
        </Reveal>
      </div>

      <Reveal delay={3}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            background: "rgba(0,0,3,.08)",
            border: "1px solid rgba(0,0,3,.08)",
          }}
        >
          {clients.map((c) => (
            <LogoTile key={c.name} name={c.name} url={c.url} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

function LogoTile({ name, url }: Client) {
  const [hover, setHover] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = url && !imgFailed;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? NAVY : "var(--white)",
        height: 110,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background .3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          style={{
            maxHeight: 52,
            maxWidth: "72%",
            objectFit: "contain",
            filter: hover ? "brightness(0) invert(1)" : "grayscale(1) brightness(.4)",
            opacity: hover ? 1 : 0.85,
            transition: "filter .3s ease, opacity .3s ease",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: hover ? "var(--white)" : "rgba(0,0,3,.55)",
            transition: "color .3s ease",
            textAlign: "center",
            padding: "0 12px",
          }}
        >
          {name}
        </span>
      )}
      <span
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 6,
          height: 6,
          background: "var(--white)",
          opacity: hover ? 1 : 0,
          transition: "opacity .3s ease",
        }}
      />
    </div>
  );
}
