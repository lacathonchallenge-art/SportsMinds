"use client";

import { useMemo } from "react";
import { Reveal } from "@/components/ui/Atoms";
import { Events, type EventItem } from "@/components/sections/Events";

const HERO_IMG =
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1800&q=80";

export function EventsGallery({
  events,
  accent = "var(--orange)",
}: {
  events: EventItem[];
  accent?: string;
}) {
  const categoryCount = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.cat && set.add(e.cat));
    return set.size;
  }, [events]);

  const flagshipCount = events.filter((e) => e.featured).length;

  return (
    <>
      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "70vh",
          background: "var(--ink)",
          color: "var(--white)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(0,0,3,.55) 0%, rgba(0,0,3,.55) 40%, rgba(0,0,3,.94) 100%),
              radial-gradient(ellipse at 25% 30%, rgba(3,62,125,.35) 0%, transparent 60%)
            `,
          }}
        />

        <div
          className="hero-main hero-main-about"
          style={{ position: "relative", padding: "180px 56px 80px" }}
        >
          <div className="section-content">
            <Reveal
              className="label"
              style={{
                color: accent,
                marginBottom: 22,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  border: `1px solid ${accent}`,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                }}
              >
                04
              </span>
              <span style={{ height: 1, width: 38, background: "rgba(255,255,255,.25)" }} />
              <span>PORTFOLIO COMPLET</span>
            </Reveal>

            <Reveal
              as="h1"
              delay={1}
              className="display"
              style={{
                fontSize: "clamp(64px, 9vw, 156px)",
                margin: 0,
                textTransform: "uppercase",
                lineHeight: 0.95,
              }}
            >
              Événements
              <br />& <span style={{ color: accent }}>productions.</span>
            </Reveal>

            <Reveal
              delay={2}
              className="body-text"
              style={{
                marginTop: 22,
                maxWidth: 760,
                color: "rgba(255,255,255,.78)",
                lineHeight: 1.7,
              }}
            >
              L&apos;ensemble de nos cases sportifs, médiatiques et événementiels —
              du brief stratégique à la captation live. Plus de {events.length} projets
              livrés à travers {categoryCount} catégories.
            </Reveal>

            {/* Inline stat strip */}
            <Reveal
              delay={3}
              style={{
                marginTop: 56,
                display: "flex",
                gap: 0,
                flexWrap: "wrap",
                borderTop: "1px solid var(--line)",
                paddingTop: 28,
                maxWidth: 920,
              }}
            >
              {[
                [String(events.length), "événements", "au catalogue"],
                [String(flagshipCount), "flagship", "cases majeurs"],
                [String(categoryCount), "catégories", "sportives"],
              ].map(([n, k, s], i, arr) => (
                <div
                  key={String(k)}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    paddingRight: 24,
                    paddingLeft: i ? 24 : 0,
                    borderRight: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div
                    className="display"
                    style={{ fontSize: 38, color: accent, lineHeight: 1 }}
                  >
                    {n}
                  </div>
                  <div
                    className="oswald"
                    style={{ fontSize: 12, marginTop: 8, color: "rgba(255,255,255,.85)" }}
                  >
                    {k}
                  </div>
                  <div
                    className="label"
                    style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 4 }}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Same display as the home Events section, but with ALL events ─── */}
      <Events events={events} accent={accent} hidePortfolioLink />
    </>
  );
}
