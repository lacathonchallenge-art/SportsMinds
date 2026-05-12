import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin · Sports Minds", template: "%s · Admin Sports Minds" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000003",
};

/**
 * Thin root layout for /admin. The protected sidebar layout lives in the
 * (authed) route group below — that way /admin/login does NOT render the
 * sidebar shell.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
