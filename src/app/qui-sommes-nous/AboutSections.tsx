"use client";

import {
  Btn,
  CornerGlow,
  CountUp,
  Reveal,
  Section,
} from "@/components/ui/Atoms";
import {
  pickImage,
  pickLink,
  pickStr,
  txt,
  type SectionCms,
} from "@/lib/cms/section";

const NAVY = "#033e7d";

const HERO_IMG_DEFAULT = "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80";
const HISTORY_IMG = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80";
const VISION_IMG = "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=80";
const CTA_IMG = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80";

export interface AboutHeroContent {
  eyebrow: string;
  title: string;
  subhead: string;
  body: string;
  image: string;
}

export const ABOUT_HERO_FALLBACK: AboutHeroContent = {
  eyebrow: "QUI SOMMES-NOUS",
  title: "Une agence de terrain.",
  subhead:
    "De KANA PRODUCTION à SPORTS MINDS — une histoire construite autour du sport, des médias et de l'événementiel.",
  body: "Depuis plus de 18 ans, l'agence accompagne marques, institutions et acteurs du sport dans la création d'événements, de productions médias et de projets à forte valeur ajoutée.",
  image: HERO_IMG_DEFAULT,
};

/**
 * Splits a headline on the last space to highlight the closing word(s) in orange.
 * "Une agence de terrain." → "Une agence" / "de terrain."
 * Author can override the split point with " | ".
 */
function renderHeadline(text: string) {
  if (!text) return null;
  if (text.includes("|")) {
    const [head, tail] = text.split("|", 2);
    return (
      <>
        {head.trim()}
        <br />
        <span style={{ color: "var(--orange)" }}>{tail.trim()}</span>
      </>
    );
  }
  // Fallback: split on last 2 words
  const words = text.split(" ");
  if (words.length <= 2) return <span style={{ color: "var(--orange)" }}>{text}</span>;
  const head = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const tail = words.slice(Math.ceil(words.length / 2)).join(" ");
  return (
    <>
      {head}
      <br />
      <span style={{ color: "var(--orange)" }}>{tail}</span>
    </>
  );
}

export interface AboutSectionsCms {
  history?: SectionCms;
  founder?: SectionCms;
  achievements?: SectionCms;
  vision?: SectionCms;
  objectives?: SectionCms;
  cta?: SectionCms;
}

export function AboutSections({
  hero,
  cms,
}: {
  hero: AboutHeroContent;
  cms?: AboutSectionsCms;
}) {
  return (
    <>
      <AboutHero content={hero} />
      <HistorySection cms={cms?.history} />
      <FounderSection cms={cms?.founder} />
      <AchievementsSection cms={cms?.achievements} />
      <VisionSection cms={cms?.vision} />
      <ObjectivesSection cms={cms?.objectives} />
      <FinalCTA cms={cms?.cta} />
    </>
  );
}

/* ────────────────────────────────────────────────────────
   1) HERO
   ──────────────────────────────────────────────────────── */
function AboutHero({ content }: { content: AboutHeroContent }) {
  const heroImage = content.image || HERO_IMG_DEFAULT;
  return (
    <section
      style={{
        position: "relative",
        minHeight: "82vh",
        background: "var(--ink)",
        color: "var(--white)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Background image with parallax-style fixed attachment */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Dark overlays */}
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
      {/* Animated diagonal orange lines */}
      <DiagonalLines />

      <div
        className="hero-main hero-main-about"
        style={{ position: "relative", padding: "180px 56px 80px" }}
      >
        <div className="section-content">
          <Reveal
            className="label"
            style={{
              color: "rgba(255,255,255,.7)",
              marginBottom: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 32, height: 1, background: "var(--orange)" }} />
            {content.eyebrow}
          </Reveal>

          <Reveal delay={1}>
            <h1
              className="display"
              style={{
                fontSize: "clamp(64px, 9vw, 156px)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: ".005em",
                lineHeight: 0.9,
              }}
            >
              {renderHeadline(content.title)}
            </h1>
          </Reveal>

          <Reveal
            delay={2}
            className="oswald"
            style={{
              marginTop: 26,
              fontSize: 18,
              letterSpacing: ".14em",
              color: "rgba(255,255,255,.85)",
              maxWidth: 820,
            }}
          >
            {content.subhead}
          </Reveal>

          <Reveal
            delay={3}
            className="body-text"
            style={{
              marginTop: 22,
              maxWidth: 720,
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.7,
            }}
          >
            {content.body}
          </Reveal>

          {/* Inline stat strip */}
          <Reveal
            delay={4}
            style={{
              marginTop: 60,
              display: "flex",
              gap: 0,
              flexWrap: "wrap",
              borderTop: "1px solid var(--line)",
              paddingTop: 28,
              maxWidth: 920,
            }}
          >
            {[
              ["18+", "années", "sur le terrain"],
              ["320+", "événements", "livrés"],
              ["80M+", "spectateurs", "touchés"],
              ["2", "marques", "fortes"],
            ].map(([n, k, s], i, arr) => (
              <div
                key={String(n)}
                style={{
                  flex: 1,
                  minWidth: 130,
                  paddingRight: 24,
                  paddingLeft: i ? 24 : 0,
                  borderRight: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  className="display"
                  style={{ fontSize: 38, color: "var(--orange)", lineHeight: 1 }}
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
  );
}

function DiagonalLines() {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.22,
        pointerEvents: "none",
      }}
      preserveAspectRatio="none"
      viewBox="0 0 1600 1000"
    >
      <defs>
        <linearGradient id="line-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#f0943e" stopOpacity="0" />
          <stop offset=".5" stopColor="#f0943e" stopOpacity=".7" />
          <stop offset="1" stopColor="#f0943e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#line-grad)" strokeWidth="1.4" fill="none">
        <line x1="-200" y1="800" x2="1800" y2="200" />
        <line x1="-200" y1="900" x2="1800" y2="300" />
        <line x1="-200" y1="950" x2="1800" y2="350" />
      </g>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────
   2) HISTOIRE — KANA PRODUCTION → SPORTS MINDS
   ──────────────────────────────────────────────────────── */
function HistorySection({ cms }: { cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "HISTOIRE");
  const titleStr = txt(cms?.title, "De KANA Production à SPORTS MINDS.");
  const body1 = pickStr(
    cms?.content_json,
    "body",
    "KANA PRODUCTION s'est imposée au fil des années comme un acteur reconnu dans l'univers du sport, de l'événementiel et de la production média. À travers de nombreux projets sportifs, institutionnels et médiatiques, l'agence a développé une expertise solide dans la conception, l'organisation et la valorisation d'événements à fort impact.",
  );
  const badge = pickStr(cms?.content_json, "badge", "★ Nouvelle identité");
  const historyImg = pickImage(cms?.media_json, "image", HISTORY_IMG);
  return (
    <Section dark={false} padY={50}>
      <CornerGlow color="rgba(3,62,125,.15)" position="tr" size={700} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 80,
          alignItems: "center",
          position: "relative",
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
              marginBottom: 18,
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
              01
            </span>
            <span style={{ height: 1, width: 38, background: "rgba(0,0,3,.25)" }} />
            <span>{eyebrow}</span>
          </div>

          <Reveal
            as="h2"
            className="display h2-section"
            style={{ textTransform: "uppercase", color: NAVY }}
          >
            {titleStr === "De KANA Production à SPORTS MINDS." ? (
              <>
                De <span style={{ color: "var(--orange)" }}>KANA</span> Production
                <br />à <span style={{ color: NAVY }}>SPORTS MINDS</span>.
              </>
            ) : (
              titleStr
            )}
          </Reveal>

          {/* Mini timeline */}
          <Reveal delay={1}>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 12,
              }}
            >
              <TimelineDot label="2007" sub="KANA PROD." />
              <TimelineLine />
              <TimelineDot label="2024" sub="Transition" filled />
              <TimelineLine accent />
              <TimelineDot label="2026" sub="SPORTS MINDS" highlight />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p
              className="body-text"
              style={{
                color: "rgba(0,0,3,.8)",
                marginTop: 28,
                lineHeight: 1.65,
                maxWidth: 580,
                whiteSpace: "pre-line",
              }}
            >
              {body1}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <p
              className="body-text"
              style={{
                color: "rgba(0,0,3,.8)",
                marginTop: 16,
                lineHeight: 1.65,
                maxWidth: 580,
              }}
            >
              Aujourd&apos;hui, KANA PRODUCTION évolue et devient{" "}
              <strong style={{ color: NAVY }}>SPORTS MINDS</strong>, avec une ambition claire :
              capitaliser sur cette expérience pour développer des projets sportifs plus
              structurés, plus innovants et plus durables.
            </p>
          </Reveal>

          <Reveal delay={4}>
            <p
              className="body-text"
              style={{
                color: "rgba(0,0,3,.65)",
                marginTop: 16,
                lineHeight: 1.65,
                maxWidth: 580,
              }}
            >
              SPORTS MINDS conserve l&apos;ADN de KANA PRODUCTION : la passion du sport, la
              maîtrise de l&apos;événementiel, la proximité avec les marques et la capacité à
              créer des expériences fortes pour le public.
            </p>
          </Reveal>
        </div>

        {/* Visual right column */}
        <Reveal delay={2}>
          <div
            style={{
              position: "relative",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              border: `1px solid rgba(0,0,3,.10)`,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${historyImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "saturate(.9)",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,3,0) 40%, rgba(0,0,3,.85) 100%)",
              }}
            />

            {/* Badge "Nouvelle identité" */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "rgba(240,148,62,.95)",
                color: "var(--ink)",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>

            {/* Bottom name plate */}
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 24,
                color: "var(--white)",
              }}
            >
              <div className="label" style={{ color: "var(--orange)", marginBottom: 6 }}>
                Depuis 2007 · Casablanca
              </div>
              <div
                className="display"
                style={{
                  fontSize: 38,
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "rgba(255,255,255,.55)" }}>KANA PROD.</span>{" "}
                <span style={{ color: "var(--orange)" }}>→</span>{" "}
                SPORTS&nbsp;MINDS
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function TimelineDot({
  label,
  sub,
  filled,
  highlight,
}: {
  label: string;
  sub: string;
  filled?: boolean;
  highlight?: boolean;
}) {
  return (
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <span
        style={{
          display: "inline-block",
          width: highlight ? 14 : filled ? 12 : 10,
          height: highlight ? 14 : filled ? 12 : 10,
          borderRadius: "50%",
          background: highlight ? "var(--orange)" : filled ? NAVY : "transparent",
          border: highlight
            ? `2px solid var(--orange)`
            : filled
              ? `2px solid ${NAVY}`
              : `2px solid rgba(0,0,3,.35)`,
          boxShadow: highlight ? "0 0 0 6px rgba(240,148,62,.15)" : "none",
        }}
      />
      <div
        className="oswald"
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginTop: 6,
          color: highlight ? "var(--orange)" : NAVY,
        }}
      >
        {label}
      </div>
      <div
        className="label"
        style={{ fontSize: 9, marginTop: 2, color: "rgba(0,0,3,.55)" }}
      >
        {sub}
      </div>
    </div>
  );
}

function TimelineLine({ accent }: { accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        height: 1,
        background: accent
          ? "linear-gradient(90deg, rgba(0,63,126,.5), var(--orange))"
          : "rgba(0,0,3,.18)",
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────
   3) FONDATEUR — MOHAMED NACIRI
   ──────────────────────────────────────────────────────── */
function FounderSection({ cms }: { cms?: SectionCms }) {
  const cards = [
    { icon: "ball", title: "Ancien joueur de football", sub: "Havre Athletic Club (HAC)" },
    { icon: "shield", title: "Sponsoring FRMF", sub: "Avec le Groupe Darmon" },
    { icon: "flag", title: "Fondateur", sub: "KANA PRODUCTION" },
    { icon: "spark", title: "Dirigeant", sub: "SPORTS MINDS" },
    { icon: "broadcast", title: "Expert", sub: "Événementiel · sponsoring · production média" },
  ] as const;
  const eyebrow = txt(cms?.subtitle, "FONDATEUR");
  const titleStr = txt(cms?.title, "Une vision portée par Mohamed Naciri.");
  const body = pickStr(
    cms?.content_json,
    "body",
    "Mohamed Naciri, ancien joueur de football au Havre AC et acteur reconnu dans l'univers du sport et du sponsoring, dirige SPORTS MINDS. Son parcours l'a amené à collaborer avec le Groupe Darmon sur le sponsoring de la FRMF avant de fonder KANA PRODUCTION.",
  );
  const portrait = pickImage(cms?.media_json, "image", "");

  return (
    <Section dark padY={50} style={{ position: "relative", overflow: "hidden" }}>
      <CornerGlow color="rgba(0,63,126,.55)" position="tl" size={780} />
      <CornerGlow color="rgba(240,148,62,.25)" position="br" size={700} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: 72,
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Portrait card (placeholder) */}
        <Reveal>
          <div
            style={{
              position: "relative",
              aspectRatio: "4 / 5",
              background:
                "linear-gradient(180deg, rgba(3,62,125,.85) 0%, rgba(0,0,3,.95) 100%)",
              border: `1px solid rgba(255,255,255,.10)`,
              overflow: "hidden",
            }}
          >
            {/* Portrait image (from admin media_json.image) */}
            {portrait && (
              <>
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${portrait})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,3,.15) 0%, rgba(0,0,3,0) 35%, rgba(0,0,3,.85) 100%)",
                  }}
                />
              </>
            )}

            {/* Crosshair corners */}
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />

            {/* Big monogram (fallback when no image) */}
            {!portrait && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  className="display"
                  style={{
                    fontSize: 180,
                    letterSpacing: ".02em",
                    background: `linear-gradient(180deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.10) 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  MN.
                </div>
              </div>
            )}

            {/* REC tag (atmospheric) */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 9px",
                background: "rgba(0,0,3,.6)",
                border: "1px solid var(--line-strong)",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                letterSpacing: ".16em",
                color: "var(--white)",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "var(--orange)",
                  animation: "flicker 1.2s infinite",
                }}
              />
              Portrait · Direction
            </div>

            {/* Name plate */}
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 24 }}>
              <div className="label" style={{ color: "var(--orange)", marginBottom: 8 }}>
                Fondateur · Dirigeant
              </div>
              <div
                className="display"
                style={{
                  fontSize: 40,
                  lineHeight: 1,
                  color: "var(--white)",
                  textTransform: "uppercase",
                }}
              >
                Mohamed
                <br />
                <span style={{ color: "var(--orange)" }}>Naciri.</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right text + cards */}
        <div>
          <div
            className="label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "rgba(255,255,255,.65)",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                border: `1px solid var(--orange)`,
                color: "var(--orange)",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
              }}
            >
              02
            </span>
            <span style={{ height: 1, width: 38, background: "rgba(255,255,255,.25)" }} />
            <span>{eyebrow}</span>
          </div>

          <Reveal as="h2" className="display h2-section" style={{ textTransform: "uppercase" }}>
            {titleStr === "Une vision portée par Mohamed Naciri." ? (
              <>
                Une vision portée par
                <br />
                <span style={{ color: "var(--orange)" }}>Mohamed Naciri.</span>
              </>
            ) : (
              titleStr
            )}
          </Reveal>

          <Reveal delay={1}>
            <p
              className="body-text"
              style={{
                marginTop: 24,
                color: "rgba(255,255,255,.85)",
                lineHeight: 1.7,
                maxWidth: 640,
                whiteSpace: "pre-line",
              }}
            >
              {body}
            </p>
          </Reveal>

          {/* Path cards */}
          <Reveal delay={3}>
            <div
              style={{
                marginTop: 36,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 10,
              }}
            >
              {cards.map((c, i) => (
                <FounderCard key={c.title} {...c} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function FounderCard({
  icon,
  title,
  sub,
  index,
}: {
  icon: "ball" | "shield" | "flag" | "spark" | "broadcast";
  title: string;
  sub: string;
  index: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "16px 18px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid var(--line-strong)",
        backdropFilter: "blur(8px)",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        transition: "transform .3s ease, border-color .3s ease, background .3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--orange)";
        e.currentTarget.style.background = "rgba(240,148,62,.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "var(--line-strong)";
        e.currentTarget.style.background = "rgba(255,255,255,.04)";
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: 36,
          height: 36,
          background: "rgba(3,62,125,.55)",
          color: "var(--orange)",
        }}
      >
        <FounderIcon name={icon} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          className="label"
          style={{ color: "var(--orange)", marginBottom: 4, fontSize: 9 }}
        >
          0{index + 1}
        </div>
        <div
          className="oswald"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--white)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
            lineHeight: 1.25,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.65)", marginTop: 3 }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

function FounderIcon({ name }: { name: "ball" | "shield" | "flag" | "spark" | "broadcast" }) {
  const c = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "ball") return (
    <svg {...c}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 14 8l5 1-4 4 1 5-4-2-4 2 1-5-4-4 5-1z" />
    </svg>
  );
  if (name === "shield") return (
    <svg {...c}>
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
  if (name === "flag") return (
    <svg {...c}>
      <path d="M5 3v18M5 4h12l-3 4 3 4H5" />
    </svg>
  );
  if (name === "spark") return (
    <svg {...c}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" />
    </svg>
  );
  // broadcast
  return (
    <svg {...c}>
      <circle cx="12" cy="12" r="3" />
      <path d="M5 5a8 8 0 0 0 0 12M19 5a8 8 0 0 1 0 12M7.5 7.5a4.5 4.5 0 0 0 0 9M16.5 7.5a4.5 4.5 0 0 1 0 9" />
    </svg>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const m: Record<typeof pos, React.CSSProperties> = {
    tl: { top: 12, left: 12, borderTop: "1.5px solid var(--orange)", borderLeft: "1.5px solid var(--orange)" },
    tr: { top: 12, right: 12, borderTop: "1.5px solid var(--orange)", borderRight: "1.5px solid var(--orange)" },
    bl: { bottom: 12, left: 12, borderBottom: "1.5px solid var(--orange)", borderLeft: "1.5px solid var(--orange)" },
    br: { bottom: 12, right: 12, borderBottom: "1.5px solid var(--orange)", borderRight: "1.5px solid var(--orange)" },
  };
  return <span style={{ position: "absolute", width: 18, height: 18, ...m[pos] }} />;
}

/* ────────────────────────────────────────────────────────
   4) RÉALISATIONS MAJEURES
   ──────────────────────────────────────────────────────── */
function AchievementsSection({ cms }: { cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "RÉALISATIONS MAJEURES");
  const titleStr = txt(cms?.title, "Une expérience construite sur des événements majeurs.");
  const body = pickStr(
    cms?.content_json,
    "body",
    "L'expérience de SPORTS MINDS repose sur des projets sportifs et événementiels d'envergure, réalisés pour des marques, institutions et événements reconnus.",
  );
  const items = [
    {
      num: 17,
      suffix: "",
      tag: "Tennis · ATP",
      title: "Grand Prix Hassan II",
      desc:
        "Participation à 17 éditions d'un événement sportif majeur, réunissant visibilité, organisation, production et valorisation média.",
      img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
      pillarLabel: "ÉDITIONS",
    },
    {
      num: 1,
      suffix: "",
      tag: "Ultra-trail · Désert",
      title: "Marathon des Sables",
      desc:
        "Accompagnement d'un événement emblématique du sport d'endurance, reconnu pour son exigence, son rayonnement et sa dimension internationale.",
      img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      pillarLabel: "ÉVÉNEMENT EMBLÉMATIQUE",
    },
    {
      num: 15,
      suffix: "",
      tag: "Football jeunesse",
      title: "Coupe Danone",
      desc:
        "15 éditions autour d'un tournoi jeunesse international, combinant sport, activation de marque, production et transmission de valeurs.",
      img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
      pillarLabel: "ÉDITIONS",
    },
    {
      num: 1,
      suffix: "",
      tag: "Tournée nationale",
      title: "Tournée des Plages — Crédit du Maroc",
      desc:
        "Mise en place d'un dispositif sportif et événementiel au service de l'animation des plages et de l'engagement du public.",
      img: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80",
      pillarLabel: "DISPOSITIF NATIONAL",
    },
  ];

  return (
    <Section dark={false} padY={50}>
      <div style={{ marginBottom: 56, maxWidth: 980 }}>
        <div
          className="label"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "rgba(0,0,3,.65)",
            marginBottom: 18,
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
          <span>{eyebrow}</span>
        </div>

        <Reveal
          as="h2"
          className="display h2-section"
          style={{ textTransform: "uppercase", color: NAVY }}
        >
          {titleStr === "Une expérience construite sur des événements majeurs." ? (
            <>
              Une expérience construite
              <br />
              sur des événements <span style={{ color: "var(--orange)" }}>majeurs.</span>
            </>
          ) : (
            titleStr
          )}
        </Reveal>

        <Reveal delay={1}>
          <p
            className="body-text"
            style={{
              marginTop: 22,
              color: "rgba(0,0,3,.75)",
              lineHeight: 1.65,
              maxWidth: 680,
              whiteSpace: "pre-line",
            }}
          >
            {body}
          </p>
        </Reveal>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 18,
        }}
      >
        {items.map((it, i) => (
          <Reveal key={it.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <AchievementCard {...it} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function AchievementCard({
  num,
  suffix,
  tag,
  title,
  desc,
  img,
  pillarLabel,
}: {
  num: number;
  suffix: string;
  tag: string;
  title: string;
  desc: string;
  img: string;
  pillarLabel: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(0,0,3,.10)",
        background: "var(--white)",
        transition:
          "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 22px 50px -22px rgba(0,0,3,.30)";
        e.currentTarget.style.borderColor = "rgba(0,0,3,.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(0,0,3,.10)";
      }}
    >
      {/* Image top */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,3,0) 30%, rgba(0,0,3,.80) 100%)",
          }}
        />
        <span
          className="label"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            padding: "5px 10px",
            background: NAVY,
            color: "var(--white)",
            fontSize: 9,
          }}
        >
          {tag.toUpperCase()}
        </span>
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 14,
            color: "var(--white)",
          }}
        >
          <h3
            className="display ach-card-title"
            style={{
              fontSize: 34,
              margin: 0,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="ach-card-body" style={{ padding: "22px 22px 24px", display: "flex", gap: 24, alignItems: "flex-start" }}>
        {num > 1 ? (
          <div style={{ flexShrink: 0, minWidth: 110 }}>
            <div
              className="display"
              style={{
                fontSize: 64,
                lineHeight: 1,
                color: NAVY,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                alignItems: "baseline",
                gap: 4,
              }}
            >
              <CountUp to={num} />
              {suffix && <span style={{ color: "var(--orange)", fontSize: 40 }}>{suffix}</span>}
            </div>
            <div
              className="label"
              style={{ color: "rgba(0,0,3,.55)", marginTop: 6, fontSize: 9 }}
            >
              {pillarLabel}
            </div>
          </div>
        ) : (
          <div style={{ flexShrink: 0, minWidth: 110 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                background: "var(--orange)",
                color: "var(--ink)",
                fontFamily: "'Oswald',sans-serif",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              ★ {pillarLabel}
            </div>
          </div>
        )}
        <p
          className="body-text"
          style={{
            margin: 0,
            color: "rgba(0,0,3,.7)",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   5) VISION
   ──────────────────────────────────────────────────────── */
function VisionSection({ cms }: { cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "VISION");
  const titleStr = txt(
    cms?.title,
    "Le sport comme levier de transmission et d'attractivité.",
  );
  const body = pickStr(
    cms?.content_json,
    "body",
    "SPORTS MINDS ambitionne de développer des projets sportifs structurants, capables de rassembler les publics, d'accompagner les marques et de créer une valeur durable pour les territoires.",
  );
  const visionImg = pickImage(cms?.media_json, "image", VISION_IMG);
  return (
    <section
      style={{
        position: "relative",
        minHeight: "92vh",
        overflow: "hidden",
        color: "var(--white)",
        background: "var(--ink)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${visionImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(90deg, rgba(0,0,3,.92) 0%, rgba(0,0,3,.7) 50%, rgba(0,0,3,.45) 100%),
            radial-gradient(ellipse at 25% 50%, rgba(3,62,125,.45) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="section-pad"
        style={{ position: "relative", padding: "50px 56px", width: "100%" }}
      >
        <div className="section-content">
          <div
            className="label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "rgba(255,255,255,.7)",
              marginBottom: 22,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                border: `1px solid var(--orange)`,
                color: "var(--orange)",
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
              }}
            >
              04
            </span>
            <span style={{ height: 1, width: 38, background: "rgba(255,255,255,.25)" }} />
            <span>{eyebrow}</span>
          </div>

          <Reveal
            as="h2"
            className="display"
            style={{
              fontSize: "clamp(48px, 7vw, 110px)",
              margin: 0,
              textTransform: "uppercase",
              lineHeight: 0.95,
              maxWidth: 1100,
            }}
          >
            {titleStr === "Le sport comme levier de transmission et d'attractivité." ? (
              <>
                Le <span style={{ color: "var(--orange)" }}>sport</span> comme levier
                <br />
                de transmission et
                <br />
                d&apos;<span style={{ color: "var(--orange)" }}>attractivité</span>.
              </>
            ) : (
              titleStr
            )}
          </Reveal>

          <Reveal delay={1}>
            <p
              className="body-text"
              style={{
                marginTop: 32,
                color: "rgba(255,255,255,.82)",
                maxWidth: 760,
                lineHeight: 1.7,
                fontSize: 17,
                whiteSpace: "pre-line",
              }}
            >
              {body}
            </p>
          </Reveal>

          <Reveal delay={2}>
            <p
              className="body-text"
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,.65)",
                maxWidth: 760,
                lineHeight: 1.7,
              }}
            >
              À travers ses projets, l&apos;agence souhaite créer des expériences sportives
              accessibles, organisées, propres et réplicables, avec une attention particulière
              portée à l&apos;
              <span style={{ color: "var(--orange)" }}>environnement</span>, à la{" "}
              <span style={{ color: "var(--orange)" }}>jeunesse</span> et à
              l&apos;expérience du public.
            </p>
          </Reveal>

          {/* Key principles inline */}
          <Reveal delay={3}>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {[
                "Accessibles",
                "Organisés",
                "Propres",
                "Réplicables",
                "Durables",
              ].map((tag) => (
                <span
                  key={tag}
                  className="label"
                  style={{
                    padding: "8px 14px",
                    background: "rgba(3,62,125,.4)",
                    border: "1px solid rgba(255,255,255,.18)",
                    backdropFilter: "blur(8px)",
                    color: "var(--white)",
                    fontSize: 11,
                  }}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   6) OBJECTIFS
   ──────────────────────────────────────────────────────── */
function ObjectivesSection({ cms }: { cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "NOS OBJECTIFS");
  const titleStr = txt(cms?.title, "Cinq engagements pour 2026 et au-delà.");
  const goals = [
    {
      icon: "beach" as const,
      title: "Modèle de plage multisport permanent",
      desc:
        "Développer un concept de plages organisées, propres et structurées, capable d'être dupliqué à travers tout le Royaume.",
    },
    {
      icon: "compass" as const,
      title: "Développer le tourisme balnéaire et sportif",
      desc:
        "Faire du sport un levier d'attractivité pour les destinations balnéaires, en créant des expériences accessibles, modernes et fédératrices.",
    },
    {
      icon: "leaf" as const,
      title: "Transmettre aux jeunes générations",
      desc:
        "Créer des espaces où la pratique sportive, l'éducation, la citoyenneté et la sensibilisation environnementale se rencontrent.",
    },
    {
      icon: "heart" as const,
      title: "Enrichir l'expérience client",
      desc:
        "Proposer des dispositifs sportifs et événementiels qui améliorent l'expérience des visiteurs, des familles, des jeunes et des partenaires.",
    },
    {
      icon: "pin" as const,
      title: "Créer de la valeur durable",
      desc:
        "Développer des projets utiles, durables et duplicables, capables de générer de l'impact pour les territoires, les marques et les communautés.",
    },
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
      <CornerGlow color="rgba(240,148,62,.18)" position="tl" size={680} />
      <CornerGlow color="rgba(0,63,126,.45)" position="br" size={780} />

      <div style={{ marginBottom: 56, maxWidth: 960, position: "relative" }}>
        <div
          className="label"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "rgba(255,255,255,.65)",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              border: `1px solid var(--orange)`,
              color: "var(--orange)",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
            }}
          >
            05
          </span>
          <span style={{ height: 1, width: 38, background: "rgba(255,255,255,.25)" }} />
          <span>{eyebrow}</span>
        </div>

        <Reveal as="h2" className="display h2-section" style={{ textTransform: "uppercase" }}>
          {titleStr === "Cinq engagements pour 2026 et au-delà." ? (
            <>
              Cinq engagements
              <br />
              pour <span style={{ color: "var(--orange)" }}>2026</span> et au-delà.
            </>
          ) : (
            titleStr
          )}
        </Reveal>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
          position: "relative",
        }}
      >
        {goals.map((g, i) => (
          <Reveal key={g.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
            <ObjectiveCard {...g} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ObjectiveCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: "beach" | "compass" | "leaf" | "heart" | "pin";
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(0,0,3,.65)",
        padding: "36px 28px 32px",
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        transition: "background .35s ease, transform .35s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(3,62,125,.45)";
        const bar = e.currentTarget.querySelector(
          "[data-bottom-bar]",
        ) as HTMLElement | null;
        if (bar) bar.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0,0,3,.65)";
        const bar = e.currentTarget.querySelector(
          "[data-bottom-bar]",
        ) as HTMLElement | null;
        if (bar) bar.style.transform = "scaleX(0)";
      }}
    >
      {/* Number top right */}
      <span
        className="display"
        style={{
          position: "absolute",
          top: 18,
          right: 24,
          fontSize: 56,
          color: "rgba(255,255,255,.05)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div style={{ position: "relative" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            background: "rgba(240,148,62,.15)",
            color: "var(--orange)",
            marginBottom: 24,
          }}
        >
          <ObjectiveIcon name={icon} />
        </span>

        <div
          className="label"
          style={{ color: "var(--orange)", marginBottom: 10, fontSize: 9 }}
        >
          OBJECTIF · 0{index + 1}
        </div>

        <h3
          className="oswald"
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.2,
            margin: 0,
            textTransform: "uppercase",
            color: "var(--white)",
            letterSpacing: ".02em",
            maxWidth: 320,
          }}
        >
          {title}
        </h3>

        <p
          className="body-text"
          style={{
            marginTop: 14,
            color: "rgba(255,255,255,.75)",
            lineHeight: 1.6,
            maxWidth: 360,
          }}
        >
          {desc}
        </p>
      </div>

      <div
        data-bottom-bar
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "var(--orange)",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform .45s cubic-bezier(.2,.7,.2,1)",
        }}
      />
    </div>
  );
}

function ObjectiveIcon({
  name,
}: {
  name: "beach" | "compass" | "leaf" | "heart" | "pin";
}) {
  const c = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "beach") return (
    <svg {...c}>
      <path d="M2 20h20" />
      <path d="M12 4v16" />
      <path d="M12 4l-6 5M12 4l6 5M12 4l-4 8M12 4l4 8" />
    </svg>
  );
  if (name === "compass") return (
    <svg {...c}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6z" />
    </svg>
  );
  if (name === "leaf") return (
    <svg {...c}>
      <path d="M21 3c-7 0-13 5-13 12 0 3 1 5 3 6 1-7 5-11 10-13" />
      <path d="M8 21c1-6 6-10 13-12" />
    </svg>
  );
  if (name === "heart") return (
    <svg {...c}>
      <path d="M12 21S4 14 4 8a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 13-8 13z" />
    </svg>
  );
  return (
    <svg {...c}>
      <path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────
   7) CTA FINAL
   ──────────────────────────────────────────────────────── */
function FinalCTA({ cms }: { cms?: SectionCms }) {
  const eyebrow = txt(cms?.subtitle, "● ON SIGNAL");
  const titleStr = txt(cms?.title, "Construisons ensemble les nouveaux terrains du sport.");
  const body = pickStr(
    cms?.content_json,
    "body",
    "SPORTS MINDS accompagne les marques, institutions et territoires dans la création de projets sportifs, événementiels et média à fort impact.",
  );
  const cta1 = pickLink(cms?.content_json, "cta_primary", {
    label: "Nous contacter",
    href: "/#contact",
  });
  const cta2 = pickLink(cms?.content_json, "cta_secondary", {
    label: "Découvrir nos événements",
    href: "/#events",
  });
  const ctaImg = pickImage(cms?.media_json, "image", CTA_IMG);
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        color: "var(--white)",
        background: "var(--ink)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${ctaImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(0,0,3,.92) 0%, rgba(0,0,3,.78) 100%),
            radial-gradient(ellipse at 70% 30%, rgba(3,62,125,.5) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="section-pad"
        style={{ position: "relative", padding: "50px 56px" }}
      >
        <div
          className="section-content"
          style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}
        >
          <div>
            <Reveal
              className="label"
              style={{
                color: "var(--orange)",
                marginBottom: 22,
              }}
            >
              {eyebrow}
            </Reveal>

            <Reveal
              as="h2"
              delay={1}
              className="display"
              style={{
                fontSize: "clamp(44px, 6.4vw, 96px)",
                margin: 0,
                textTransform: "uppercase",
                lineHeight: 0.95,
              }}
            >
              {titleStr === "Construisons ensemble les nouveaux terrains du sport." ? (
                <>
                  Construisons ensemble
                  <br />
                  les nouveaux <span style={{ color: "var(--orange)" }}>terrains</span>
                  <br />
                  du sport.
                </>
              ) : (
                titleStr
              )}
            </Reveal>

            <Reveal
              delay={2}
              className="body-text"
              style={{
                marginTop: 28,
                color: "rgba(255,255,255,.75)",
                maxWidth: 560,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {body}
            </Reveal>

            <Reveal
              delay={3}
              style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}
            >
              <a
                href={cta1.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 22px 16px 24px",
                  background: "var(--orange)",
                  color: "var(--ink)",
                  fontFamily: "'Oswald',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  transition: "transform .25s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                {cta1.label} →
              </a>
              <Btn kind="ghost" href={cta2.href}>{cta2.label}</Btn>
            </Reveal>
          </div>

          {/* Right side: signature card */}
          <Reveal delay={2}>
            <div
              style={{
                position: "relative",
                padding: "32px 32px 28px",
                background: "rgba(0,0,3,.55)",
                border: "1px solid var(--line-strong)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="label" style={{ color: "var(--orange)", marginBottom: 14 }}>
                CONTACT DIRECT
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <ContactLine label="Email" value="monaciri@hotmail.fr" href="mailto:monaciri@hotmail.fr" />
                <ContactLine label="Téléphone" value="+212 661-173444" href="tel:+212661173444" />
                <ContactLine label="HQ" value="23, Rue de l'Atlas · Maârif · Casablanca" />
              </ul>

              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span className="label" style={{ color: "rgba(255,255,255,.45)" }}>
                  Réponse sous 48h
                </span>
                <span
                  className="label"
                  style={{
                    padding: "5px 9px",
                    background: NAVY,
                    color: "var(--white)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: "var(--orange)",
                      borderRadius: "50%",
                      animation: "flicker 1.2s infinite",
                    }}
                  />
                  EN ACTIVITÉ
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactLine({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="label" style={{ color: "var(--orange)", fontSize: 9, minWidth: 70 }}>
        {label}
      </span>
      <span className="oswald" style={{ fontSize: 14, fontWeight: 500, color: "var(--white)" }}>
        {value}
      </span>
    </>
  );
  if (href) {
    return (
      <li>
        <a
          href={href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            transition: "opacity .2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = ".75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>{inner}</li>
  );
}
