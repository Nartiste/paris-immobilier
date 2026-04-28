"use client";

import { Calculator, Shield } from "lucide-react";
import { track } from "@/lib/analytics";

const SITE = "vivre-pres-de-paris";

function utm(partner: string, page: string) {
  return new URLSearchParams({
    utm_source: SITE,
    utm_medium: "affiliate",
    utm_campaign: partner,
    utm_content: page,
  }).toString();
}

type Props = {
  page: string;
};

export default function AffiliateStrip({ page }: Props) {
  const prettoBase =
    process.env.NEXT_PUBLIC_AFFILIATE_PRETTO_URL ??
    "https://www.pretto.fr/capacite-emprunt/";
  const lukoBase =
    process.env.NEXT_PUBLIC_AFFILIATE_LUKO_URL ?? "https://fr.luko.eu/devis/";

  const links = [
    {
      key: "pretto",
      icon: Calculator,
      label: "Calculer ma capacité d'emprunt",
      description: "Simulation gratuite, taux 2026 actualisés.",
      url: `${prettoBase}?${utm("pretto", page)}`,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      key: "luko",
      icon: Shield,
      label: "Devis assurance habitation",
      description: "100 % en ligne, résiliable à tout moment.",
      url: `${lukoBase}?${utm("luko", page)}`,
      tone: "text-brand-iris-strong bg-brand-iris-soft",
    },
  ];

  return (
    <section className="mt-10 rounded-2xl border border-brand-bleu/10 bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.06)]">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-bleu/50">
        Pour aller plus loin
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {links.map(({ key, icon: Icon, label, description, url, tone }) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener sponsored"
            onClick={() => track("monetize_cta_click", { partner: key, page })}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3 transition-all hover:-translate-y-0.5 hover:border-brand-iris/20 hover:shadow-[0_4px_12px_rgba(82,98,122,0.1)]"
          >
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-neutral-900">
                {label}
              </span>
              <span className="block text-[11px] text-neutral-500">
                {description}
              </span>
            </span>
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[9px] text-neutral-400">
        Liens partenaires sponsorisés — sans surcoût pour vous.
      </p>
    </section>
  );
}
