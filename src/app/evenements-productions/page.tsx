import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPublishedEvents } from "@/lib/data/events";
import { getPublishedProductions } from "@/lib/data/productions";
import { eventRowToItem } from "@/lib/mappers/event-to-item";
import { prodRowToItem } from "@/lib/mappers/production-to-item";
import { EventsGallery } from "./EventsGallery";
import { Productions } from "@/components/sections/Productions";

export const dynamic = "force-dynamic";

const EVENTS_OG_IMAGE =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&h=630&q=80";

export const metadata: Metadata = {
  title: "Portfolio — Événements & Productions sportives",
  description:
    "Portfolio complet de nos événements sportifs et productions médias au Maroc : Marathon des Sables, Coupe Danone, Grand Prix Hassan II, Tournée des Plages. +320 projets livrés.",
  keywords: [
    "portfolio événements sportifs Maroc",
    "productions médias sport",
    "Marathon des Sables",
    "Coupe Danone Maroc",
    "Grand Prix Hassan II",
    "événementiel sportif Casablanca",
    "captation TV sport",
  ],
  alternates: { canonical: "/evenements-productions" },
  openGraph: {
    title: "Portfolio — Événements & Productions sportives · SPORTS MINDS",
    description:
      "Tous nos cases sportifs, médiatiques et événementiels au Maroc — triés par catégorie.",
    url: "/evenements-productions",
    images: [
      {
        url: EVENTS_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Portfolio SPORTS MINDS — Événements & Productions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Événements & Productions sportives · SPORTS MINDS",
    description:
      "Tous nos cases sportifs au Maroc — Marathon des Sables, Coupe Danone, Grand Prix Hassan II…",
    images: [EVENTS_OG_IMAGE],
  },
};

export default async function EventsProductionsPage() {
  const [eventRows, prodRows] = await Promise.all([
    getPublishedEvents(),
    getPublishedProductions(),
  ]);
  const events = eventRows.map(eventRowToItem);
  const productions = prodRows.map(prodRowToItem);

  return (
    <>
      <Navbar />
      <EventsGallery events={events} />
      <Productions productions={productions} />
      <Footer />
    </>
  );
}
