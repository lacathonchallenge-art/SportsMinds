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

export const metadata: Metadata = {
  title: "Événements & Productions · SPORTS MINDS",
  description:
    "L'ensemble de nos projets sportifs, médiatiques et événementiels — du brief stratégique à la captation live. Tous nos cases triés par catégorie.",
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
