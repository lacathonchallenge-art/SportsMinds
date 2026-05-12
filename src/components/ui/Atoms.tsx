"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";

/* ─── Reveal on scroll ─── */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  opts: IntersectionObserverInit = { threshold: 0.15 },
) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      });
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return seen;
}

interface RevealProps {
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  // pass-through (e.g. onClick) — kept loose intentionally
  [key: string]: unknown;
}
export function Reveal({
  as: Tag = "div",
  delay = 0,
  children,
  className = "",
  ...rest
}: RevealProps) {
  const r = useRef<HTMLElement>(null);
  const seen = useInView(r);
  const cls = `reveal ${seen ? "in" : ""} ${className}`.trim();
  const delayCls = delay ? ` reveal-delay-${delay}` : "";
  return (
    <Tag ref={r} className={cls + delayCls} {...rest}>
      {children}
    </Tag>
  );
}

/* ─── Image placeholder (legacy debug helper) ─── */
export function Placeholder({
  label,
  tag = "IMAGE",
  height = 260,
  tone = "dark",
  accent,
}: {
  label: string;
  tag?: string;
  height?: number | string;
  tone?: "dark" | "light";
  accent?: string;
}) {
  const dark = tone === "dark";
  const a = accent || "var(--orange)";
  const stripe = dark
    ? "repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 14px, rgba(255,255,255,.08) 14px 28px)"
    : "repeating-linear-gradient(135deg, rgba(0,0,0,.05) 0 14px, rgba(0,0,0,.08) 14px 28px)";
  return (
    <div
      style={{
        position: "relative",
        height,
        width: "100%",
        background: `${stripe}, ${dark ? "#0a0a0d" : "#e9e6df"}`,
        border: `1px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
        color: dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "14px 16px",
      }}
    >
      <span className="label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            background: a,
            display: "inline-block",
            borderRadius: 1,
          }}
        />
        {tag}
      </span>
      <span className="label" style={{ opacity: 0.6, maxWidth: "70%", textAlign: "right" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Section wrapper ─── */
export function Section({
  id,
  dark = true,
  children,
  style = {},
  padY = 50,
  padX = 56,
}: {
  id?: string;
  dark?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  padY?: number;
  padX?: number;
}) {
  return (
    <section
      id={id}
      data-screen-label={id}
      className="section-pad"
      style={{
        position: "relative",
        background: dark ? "var(--ink)" : "var(--paper)",
        color: dark ? "var(--white)" : "var(--ink)",
        padding: `${padY}px ${padX}px`,
        ...style,
      }}
    >
      <div className="section-content">{children}</div>
    </section>
  );
}

/* ─── Eyebrow (small numbered label) ─── */
export function Eyebrow({
  num,
  children,
  accent = "var(--orange)",
}: {
  num: string;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="label"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        color: "rgba(255,255,255,.65)",
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
          color: accent,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
        }}
      >
        {num}
      </span>
      <span style={{ height: 1, width: 38, background: "rgba(255,255,255,.25)" }} />
      <span>{children}</span>
    </div>
  );
}

/* ─── Animated count-up ─── */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(Math.round(to * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

/* ─── Stadium-light corner glow ─── */
export function CornerGlow({
  color = "var(--navy)",
  position = "tl",
  size = 520,
}: {
  color?: string;
  position?: "tl" | "tr" | "bl" | "br";
  size?: number;
}) {
  const half = size / 2;
  const map: Record<typeof position, CSSProperties> = {
    tl: { top: -half, left: -half },
    tr: { top: -half, right: -half },
    bl: { bottom: -half, left: -half },
    br: { bottom: -half, right: -half },
  };
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        filter: "blur(20px)",
        opacity: 0.55,
        pointerEvents: "none",
        ...map[position],
      }}
    />
  );
}

/* ─── Pill button ─── */
export function Btn({
  kind = "primary",
  children,
  icon,
  onClick,
  accent = "var(--orange)",
  color,
  href,
}: {
  kind?: "primary" | "ghost" | "subtle";
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  accent?: string;
  color?: string;
  href?: string;
}) {
  const [hover, setHover] = useState(false);
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 22px 16px 24px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Oswald',sans-serif",
    fontWeight: 600,
    letterSpacing: ".08em",
    fontSize: 13,
    textTransform: "uppercase",
    transition: "transform .25s ease, background .25s ease, color .25s ease",
    transform: hover ? "translateY(-2px)" : "none",
    position: "relative",
    overflow: "hidden",
  };
  const styles: CSSProperties =
    kind === "primary"
      ? {
          ...base,
          background: accent,
          color: color || "var(--ink)",
          boxShadow: hover ? `0 18px 40px -10px ${accent}` : "0 0 0 transparent",
        }
      : kind === "ghost"
        ? {
            ...base,
            background: "transparent",
            color: "var(--white)",
            border: "1px solid rgba(255,255,255,.35)",
          }
        : {
            ...base,
            background: "rgba(255,255,255,.06)",
            color: "var(--white)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.18)",
          };
  const inner = (
    <>
      <span>{children}</span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          transition: "transform .35s ease",
          transform: hover ? "translateX(4px)" : "none",
        }}
      >
        {icon || <Arrow />}
      </span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...styles, textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={styles}
    >
      {inner}
    </button>
  );
}

/* ─── Inline icons ─── */
export function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M1 7h12M8 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function LiveDot({ color = "var(--orange)" }: { color?: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          animation: "pulse-ring 2s infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
}

export function CornerArrow({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path
        d="M5 17L17 5M9 5h8v8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
