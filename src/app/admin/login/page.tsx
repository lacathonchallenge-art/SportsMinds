import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion · Admin Sports Minds",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>;
}) {
  return <LoginScreen searchParams={searchParams} />;
}

async function LoginScreen({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="bg-brand-deep relative flex min-h-screen items-center justify-center overflow-hidden p-6 text-white">
      {/* Decorative orange glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,148,62,.45) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,63,126,.55) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-10 flex flex-col items-start">
          <Logo variant="light" />
          <p className="text-brand-orange mt-3 font-mono text-[11px] tracking-[0.3em] uppercase">
            CRM · ACCÈS PRIVÉ
          </p>
        </div>

        <div className="rounded-lg border border-white/12 bg-black/40 p-8 backdrop-blur-xl">
          <h1 className="font-display text-3xl tracking-wide uppercase">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-white/65">
            Authentification réservée à l&apos;équipe Sports Minds.
          </p>

          {sp.error && (
            <div className="mt-6 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {sp.error}
            </div>
          )}
          {sp.message && (
            <div className="border-brand-orange/40 bg-brand-orange/10 mt-6 rounded border px-4 py-3 text-sm text-white/90">
              {sp.message}
            </div>
          )}

          <LoginForm next={sp.next} />
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
          ← <a href="/" className="hover:text-white">Retour au site</a>
        </p>
      </div>
    </div>
  );
}
