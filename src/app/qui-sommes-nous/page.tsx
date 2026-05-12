import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSections, ABOUT_HERO_FALLBACK, type AboutHeroContent } from "./AboutSections";
import { getPublishedPage } from "@/lib/data/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublishedPage("about");
  return {
    title: data?.page.seo_title || "Qui sommes-nous · SPORTS MINDS",
    description:
      data?.page.seo_description ||
      "De KANA PRODUCTION à SPORTS MINDS : 18+ années d'expérience au service du sport, des médias et de l'événementiel.",
  };
}

export default async function AboutPage() {
  const data = await getPublishedPage("about");
  const heroSection = data?.sections.hero;
  const s = data?.sections ?? {};

  const hero: AboutHeroContent = heroSection
    ? {
        eyebrow:
          (heroSection.content_json.eyebrow as string) ||
          heroSection.subtitle ||
          ABOUT_HERO_FALLBACK.eyebrow,
        title: heroSection.title || ABOUT_HERO_FALLBACK.title,
        subhead:
          (heroSection.content_json.subhead as string) || ABOUT_HERO_FALLBACK.subhead,
        body: (heroSection.content_json.body as string) || ABOUT_HERO_FALLBACK.body,
        image:
          (heroSection.media_json.image as string) || ABOUT_HERO_FALLBACK.image,
      }
    : ABOUT_HERO_FALLBACK;

  return (
    <>
      <Navbar />
      <AboutSections
        hero={hero}
        cms={{
          history: s.history,
          founder: s.founder,
          achievements: s.achievements,
          vision: s.vision,
          objectives: s.objectives,
          cta: s.cta,
        }}
      />
      <Footer />
    </>
  );
}
