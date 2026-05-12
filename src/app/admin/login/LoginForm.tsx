"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const supabase = createSupabaseBrowserClient();
  const target = next && next.startsWith("/") ? next : "/admin";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(target)}`,
      },
    });
    if (error) setError(error.message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(target)}`,
        },
      });
      if (error) setError(error.message);
      else setInfo("Lien de connexion envoyé. Vérifie ta boîte mail.");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.replace(target);
      router.refresh();
    });
  }

  return (
    <div className="mt-7 flex flex-col gap-5">
      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.10]"
      >
        <GoogleIcon />
        Continuer avec Google
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">
          OU
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          placeholder="vous@sportsminds.ma"
        />

        {mode === "password" && (
          <Field
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        )}

        {error && (
          <div className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
        {info && (
          <div className="border-brand-orange/40 bg-brand-orange/10 rounded border px-3 py-2 text-xs text-white/90">
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-brand-orange text-foreground hover:bg-brand-orange/90 mt-1 inline-flex items-center justify-between gap-2 rounded-md px-4 py-3 font-mono text-xs font-bold tracking-[0.16em] uppercase transition-colors disabled:opacity-60"
        >
          <span>{pending ? "Connexion…" : mode === "magic" ? "Envoyer le lien" : "Se connecter"}</span>
          <span aria-hidden>→</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "password" ? "magic" : "password"));
            setError(null);
            setInfo(null);
          }}
          className="hover:text-brand-orange mt-1 self-start font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase transition-colors"
        >
          {mode === "password" ? "Recevoir un lien magique" : "Utiliser un mot de passe"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  ...input
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const { value, onChange, ...rest } = input;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] tracking-[0.22em] text-white/55 uppercase">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:border-brand-orange focus:ring-brand-orange/40 rounded-md border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:ring-2"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71a5.42 5.42 0 0 1 0-3.42V4.96H.95a9 9 0 0 0 0 8.08l3.02-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 .95 4.96l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
