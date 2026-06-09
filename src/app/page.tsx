import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Expertises } from "@/components/sections/Expertises";
import { References } from "@/components/sections/References";
import { Events } from "@/components/sections/Events";
import { Productions } from "@/components/sections/Productions";
import { Stats } from "@/components/sections/Stats";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { getPublishedEvents } from "@/lib/data/events";
import { getVisibleReferences } from "@/lib/data/references";
import { getPublishedProductions } from "@/lib/data/productions";
import { getPublishedPage } from "@/lib/data/cms";
import { eventRowToItem } from "@/lib/mappers/event-to-item";
import { refRowToClient } from "@/lib/mappers/reference-to-client";
import { prodRowToItem } from "@/lib/mappers/production-to-item";

export const dynamic = "force-dynamic";

const HOME_OG_IMAGE =
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  title: "SPORTS MINDS — Agence de communication sportive · Maroc",
  description:
    "SPORTS MINDS — Agence conseil spécialisée en communication sportive, événementiel et production média au Maroc. 18 ans d'expérience, +320 événements livrés, 80M+ spectateurs touchés.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SPORTS MINDS — Agence de communication sportive · Maroc",
    description:
      "Agence conseil spécialisée en communication sportive, événementiel et production média au Maroc.",
    url: "/",
    images: [{ url: HOME_OG_IMAGE, width: 1200, height: 630, alt: "SPORTS MINDS — Sport, Média, Événementiel" }],
  },
};

export default async function HomePage() {
  const [eventRows, refRows, prodRows, homeCms] = await Promise.all([
    getPublishedEvents(),
    getVisibleReferences(),
    getPublishedProductions(),
    getPublishedPage("home"),
  ]);

  const events = eventRows.map(eventRowToItem);
  const clients = refRows.map(refRowToClient);
  const productions = prodRows.map(prodRowToItem);
  const s = homeCms?.sections ?? {};

  // Home: only show the 4 most recent events (featured first by data-layer sort)
  const homeEvents = events.slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SPORTS MINDS",
    legalName: "Sports Minds",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsminds.ma",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsminds.ma"}/sportsmindslogo.jpeg`,
    description:
      "Agence conseil spécialisée en communication sportive, événementiel et production média au Maroc.",
    foundingDate: "2007",
    founder: { "@type": "Person", name: "Mohamed Naciri" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "23, Rue de l'Atlas, Maârif",
      addressLocality: "Casablanca",
      postalCode: "20100",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212661173444",
      email: "monaciri@hotmail.fr",
      contactType: "customer service",
      areaServed: "MA",
      availableLanguage: ["French", "English", "Arabic"],
    },
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero cms={s.hero} />
      <Intro cms={s.intro} />
      <Expertises cms={s.expertises} />
      <References clients={clients} />
      <Events events={homeEvents} portfolioHref="/evenements-productions" hideFilters />
      <Productions productions={productions} />
      <Stats cms={s.stats} />
      <CTA cms={s.cta} />
      <Footer />
    </>
  );
}
