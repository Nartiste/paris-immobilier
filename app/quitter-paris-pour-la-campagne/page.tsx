import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PERSONAS_BY_SLUG } from "@/lib/persona";
import PersonaPage from "@/components/PersonaPage";

const persona = PERSONAS_BY_SLUG["quitter-paris-pour-la-campagne"];

export const metadata: Metadata = {
  title: persona?.metaTitle ?? "Quitter Paris pour la campagne",
  description: persona?.metaDescription,
  alternates: { canonical: "/quitter-paris-pour-la-campagne" },
  openGraph: {
    title: persona?.metaTitle,
    description: persona?.metaDescription,
    type: "article",
    locale: "fr_FR",
    url: "/quitter-paris-pour-la-campagne",
  },
};

export default function Page() {
  if (!persona) notFound();
  return <PersonaPage persona={persona} />;
}
