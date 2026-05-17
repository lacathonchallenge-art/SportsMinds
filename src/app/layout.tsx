import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SPORTS MINDS — Agence de communication sportive · Maroc",
    template: "%s · SPORTS MINDS",
  },
  description:
    "SPORTS MINDS — Agence conseil spécialisée en communication sportive, événementiel et production média au Maroc. 18 ans d'expérience, +320 événements livrés.",
  keywords: [
    "SPORTS MINDS",
    "agence communication sportive",
    "événementiel sportif Maroc",
    "production média sport",
    "activation marque sport",
    "Casablanca agence sport",
    "Mohamed Naciri",
  ],
  authors: [{ name: "SPORTS MINDS" }],
  creator: "SPORTS MINDS",
  publisher: "SPORTS MINDS",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE_URL,
    siteName: "SPORTS MINDS",
    title: "SPORTS MINDS — Agence de communication sportive · Maroc",
    description:
      "Agence conseil spécialisée en communication sportive, événementiel et production média au Maroc. 18 ans d'expérience.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "SPORTS MINDS — Sport · Média · Événementiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPORTS MINDS — Agence de communication sportive · Maroc",
    description:
      "Événementiel sportif, production média et activations de marque à forte visibilité.",
    images: [
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "-WUYJWkzczoKg52f6esoQQrTFsxuirKgxlrynxed6vU",
  },
  icons: {
    icon: "/sportsmindslogo.jpeg",
    apple: "/sportsmindslogo.jpeg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000003",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
