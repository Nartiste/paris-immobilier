"use client";

import { ChevronRight, Calculator, Shield, Home, Truck } from "lucide-react";
import type { Commune, Profile } from "@/lib/types";
import { buildCTAs, type Partner } from "@/lib/monetize";
import { track } from "@/lib/analytics";

const ICONS: Record<Partner, React.ComponentType<{ className?: string }>> = {
  pretto: Calculator,
  luko: Shield,
  liberkeys: Home,
  moveasy: Truck,
};

const PARTNER_COLOR: Record<Partner, string> = {
  pretto: "text-emerald-700 bg-emerald-50",
  luko: "text-violet-700 bg-violet-50",
  liberkeys: "text-blue-700 bg-blue-50",
  moveasy: "text-amber-700 bg-amber-50",
};

type Props = {
  commune: Commune;
  profile: Profile;
};

export default function MonetizeBlock({ commune, profile }: Props) {
  const ctas = buildCTAs(commune, profile);

  if (ctas.length === 0) return null;

  return (
    <div className="border-t border-neutral-100 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400">
          Votre projet à {commune.nom}
        </span>
      </div>
      <div className="space-y-1.5">
        {ctas.map((cta) => {
          const Icon = ICONS[cta.partner];
          const tone = PARTNER_COLOR[cta.partner];
          return (
            <a
              key={cta.partner}
              href={cta.url}
              target="_blank"
              rel="noopener sponsored"
              onClick={() =>
                track("monetize_cta_click", {
                  partner: cta.partner,
                  insee: commune.code_insee,
                  commune: commune.nom,
                })
              }
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${tone}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-neutral-900">
                  {cta.label}
                </span>
                <span className="block truncate text-[10px] text-neutral-500">
                  {cta.description}
                </span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
            </a>
          );
        })}
      </div>
      <p className="mt-2 text-[9px] text-neutral-400">
        Liens partenaires sponsorisés. Cela soutient le service, sans coût
        supplémentaire pour vous.
      </p>
    </div>
  );
}
