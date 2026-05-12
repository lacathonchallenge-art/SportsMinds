import { cn } from "@/lib/utils";
import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light" | "mark";
  asLink?: boolean;
  className?: string;
};

/**
 * SPORTS MINDS — typographic placeholder for the official logo.
 * Used in /admin (the public site uses the JPEG asset directly).
 */
export function Logo({ variant = "light", asLink = true, className }: LogoProps) {
  const inner =
    variant === "mark" ? <LogoMark /> : <LogoFull variant={variant} />;

  if (!asLink) {
    return <span className={cn("inline-flex items-center", className)}>{inner}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="SPORTS MINDS — Retour à l'accueil"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep rounded",
        className,
      )}
    >
      {inner}
    </Link>
  );
}

function LogoFull({ variant }: { variant: "default" | "light" }) {
  const sportsClass = variant === "default" ? "text-brand-blue" : "text-white";

  return (
    <span
      className={cn(
        "font-display flex flex-col leading-[0.85] tracking-wide select-none",
        variant === "default" &&
          "border-2 border-brand-blue bg-white px-3 py-2 rounded-sm",
      )}
    >
      <span className={cn("text-2xl sm:text-[26px]", sportsClass)}>SPORTS</span>
      <span className="-mt-0.5 text-base sm:text-[17px] tracking-[0.05em]">
        <span className="text-brand-orange lowercase">minds</span>
        <span className="text-brand-blue">.</span>
      </span>
    </span>
  );
}

function LogoMark() {
  return (
    <span className="font-display text-xl tracking-wider select-none">
      <span className="text-white">S</span>
      <span className="text-brand-orange">M</span>
      <span className="text-brand-blue">.</span>
    </span>
  );
}
