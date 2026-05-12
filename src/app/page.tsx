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

  return (
    <>
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
