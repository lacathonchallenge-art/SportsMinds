import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "./_components/Sidebar";
import { Topbar } from "./_components/Topbar";

export default async function AuthedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#000003]">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
