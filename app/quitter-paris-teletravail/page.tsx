import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PERSONAS_BY_SLUG } from "@/lib/persona";
import PersonaPage from "@/components/PersonaPage";

const persona = PERSONAS_BY_SLUG["quitter-paris-teletravail"];

export const metadata: Metadata = {
  title: persona?.metaTitle ?? "Quitter Paris en télétravail",
  description: persona?.metaDescription,
  alternates: { canonical: "/quitter-paris-teletravail" },
  openGraph: {
    title: persona?.metaTitle,
    description: persona?.metaDescription,
    type: "article",
    locale: "fr_FR",
    url: "/quitter-paris-teletravail",
  },
};

export default function Page() {
  if (!persona) notFound();
  return <PersonaPage persona={persona} />;
}
