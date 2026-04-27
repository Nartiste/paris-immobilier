"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, ArrowRight, Sparkles } from "lucide-react";
import type { Commune } from "@/lib/types";
import { communeToSlug } from "@/lib/slug";
import CommuneSelect from "@/components/CommuneSelect";

type Props = { communes: Commune[]; initialA?: Commune | null };

export default function ComparerPicker({ communes, initialA = null }: Props) {
  const router = useRouter();
  const [a, setA] = useState<Commune | null>(initialA);
  const [b, setB] = useState<Commune | null>(null);

  const canCompare = a && b && a.code_insee !== b.code_insee;

  const handleCompare = () => {
    if (!canCompare || !a || !b) return;
    // Tri stable par INSEE pour cohérence avec les pré-générées
    const [first, second] = [a, b].sort((x, y) =>
      x.code_insee.localeCompare(y.code_insee),
    );
    router.push(
      `/comparer/${communeToSlug(first)}-vs-${communeToSlug(second)}`,
    );
  };

  const handleSwap = () => {
    setA(b);
    setB(a);
  };

  const handleRandom = () => {
    const usable = communes.filter((c) => c.prix_m2_median != null);
    const pickA = usable[Math.floor(Math.random() * usable.length)];
    let pickB = usable[Math.floor(Math.random() * usable.length)];
    while (pickB.code_insee === pickA.code_insee) {
      pickB = usable[Math.floor(Math.random() * usable.length)];
    }
    setA(pickA);
    setB(pickB);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_4px_24px_rgba(82,98,122,0.08)] sm:p-7">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <CommuneSelect
          communes={communes}
          value={a}
          onChange={setA}
          label="Première ville"
          placeholder="Ex : Vincennes…"
          excludeInsee={b ? [b.code_insee] : []}
        />

        <button
          type="button"
          onClick={handleSwap}
          disabled={!a && !b}
          className="hidden h-12 w-12 items-center justify-center self-end rounded-2xl bg-brand-iris-soft text-brand-iris-strong transition-all hover:bg-brand-iris hover:text-white disabled:opacity-30 sm:flex"
          aria-label="Inverser les deux villes"
          title="Inverser"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <CommuneSelect
          communes={communes}
          value={b}
          onChange={setB}
          label="Deuxième ville"
          placeholder="Ex : Saint-Mandé…"
          excludeInsee={a ? [a.code_insee] : []}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleRandom}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-iris-soft px-3.5 py-2 text-xs font-medium text-brand-iris-strong transition-colors hover:bg-brand-iris/30"
        >
          <Sparkles className="h-3 w-3" />
          Surprends-moi
        </button>

        <button
          type="button"
          onClick={handleCompare}
          disabled={!canCompare}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.3)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-brand-bleu/30 disabled:shadow-none disabled:hover:scale-100"
        >
          Lancer la comparaison
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {!a && !b && (
        <p className="mt-3 text-center text-xs text-brand-bleu/50 sm:text-left">
          Choisis 2 villes ci-dessus pour les comparer côte à côte.
        </p>
      )}
    </div>
  );
}
