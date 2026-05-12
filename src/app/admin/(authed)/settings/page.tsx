import { requireAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/data/users";
import { UsersAdmin } from "./_components/UsersAdmin";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await requireAdmin();
  const users = await listUsers();
  return (
    <div className="px-6 py-8 lg:px-10 lg:py-10 space-y-8">
      <header>
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#003f7e] uppercase">
          CRM · Paramètres
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Paramètres</h2>
        <p className="mt-2 max-w-xl text-[13px] text-black/55">
          Espace réservé aux administrateurs. Tu peux y promouvoir un membre de l&apos;équipe
          en administrateur ou le redescendre en éditeur.
        </p>
      </header>

      <section className="rounded-xl border border-black/[0.07] bg-white p-5">
        <h3 className="text-[14px] font-semibold tracking-tight">Compte connecté</h3>
        <div className="mt-3 grid gap-2 text-[13px] sm:grid-cols-3">
          <KV k="Email">{me.email}</KV>
          <KV k="Rôle">
            <RoleBadge role={me.role} />
          </KV>
          <KV k="ID utilisateur" mono>
            {me.id}
          </KV>
        </div>
      </section>

      <section className="rounded-xl border border-black/[0.07] bg-white">
        <header className="border-b border-black/[0.06] px-5 py-4">
          <h3 className="text-[14px] font-semibold tracking-tight">
            Équipe · {users.length} utilisateur{users.length > 1 ? "s" : ""}
          </h3>
          <p className="mt-1 text-[12.5px] text-black/55">
            Les utilisateurs sont créés automatiquement quand quelqu&apos;un se connecte via
            Google ou email/password. Le rôle par défaut est <strong>éditeur</strong>.
          </p>
        </header>
        <UsersAdmin users={users} currentUserId={me.id} />
      </section>
    </div>
  );
}

function KV({
  k,
  children,
  mono,
}: {
  k: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="font-mono text-[9.5px] tracking-[0.22em] text-black/45 uppercase">{k}</div>
      <div className={mono ? "mt-1 font-mono text-[11.5px] text-black/75 break-all" : "mt-1 text-[13px] text-black/80"}>
        {children}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: "admin" | "editor" }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#003f7e]/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-[#003f7e] uppercase">
        Administrateur
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-amber-700 uppercase">
      Éditeur
    </span>
  );
}
