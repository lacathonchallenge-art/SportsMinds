"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Shield, ShieldOff, User as UserIcon } from "lucide-react";
import type { AppUserRow } from "@/lib/data/users";
import { setUserRole } from "../actions";

export function UsersAdmin({
  users,
  currentUserId,
}: {
  users: AppUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  function flash(kind: "ok" | "err", msg: string) {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleToggle(u: AppUserRow) {
    const next = u.role === "admin" ? "editor" : "admin";
    setBusyId(u.id);
    startTransition(async () => {
      const res = await setUserRole(u.id, next);
      setBusyId(null);
      if (res.ok) {
        flash("ok", `Rôle mis à jour : ${u.email} est désormais ${next}.`);
        router.refresh();
      } else flash("err", res.error || "Échec");
    });
  }

  return (
    <div>
      {feedback && (
        <div
          className={`mx-5 mt-4 rounded-md border px-4 py-2.5 text-[13px] ${
            feedback.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <ul className="divide-y divide-black/[0.06]">
        {users.length === 0 && (
          <li className="px-5 py-10 text-center text-[13px] text-black/55">
            Aucun utilisateur. Quelqu&apos;un doit se connecter au moins une fois pour apparaître ici.
          </li>
        )}
        {users.map((u) => {
          const isMe = u.id === currentUserId;
          const isAdmin = u.role === "admin";
          return (
            <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-brand-blue/10 text-brand-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-semibold uppercase">
                  {u.email[0] ?? "?"}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-medium text-black">{u.email}</span>
                    {isMe && (
                      <span className="rounded-sm bg-black/[0.06] px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-black/55 uppercase">
                        Toi
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-wide text-black/40">
                    Créé le {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#003f7e]/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-[#003f7e] uppercase">
                    <Shield className="h-3 w-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
                    <UserIcon className="h-3 w-3" /> Éditeur
                  </span>
                )}
                {!isMe && (
                  <button
                    type="button"
                    onClick={() => handleToggle(u)}
                    disabled={pending && busyId === u.id}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] font-semibold tracking-wide transition-colors disabled:opacity-60 ${
                      isAdmin
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "border-[#003f7e]/30 text-[#003f7e] hover:bg-[#003f7e]/[0.06]"
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <ShieldOff className="h-3 w-3" />
                        {pending && busyId === u.id ? "…" : "Rétrograder"}
                      </>
                    ) : (
                      <>
                        <Shield className="h-3 w-3" />
                        {pending && busyId === u.id ? "…" : "Promouvoir admin"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
