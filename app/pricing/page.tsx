import type { Metadata } from "next";
import Link from "next/link";
import EarlyAccessForm from "./EarlyAccessForm";

export const metadata: Metadata = {
  title: "Tarifs Premium — Paris Immobilier",
  description:
    "Accédez aux comparaisons illimitées, alertes prix, concierge IA avancé et données fines DVF. 7,90 €/mois ou 69 €/an.",
};

const FEATURES_FREE = [
  "Comparateur de communes (toute la France)",
  "Top 10 personnalisé",
  "Concierge IA — 5 questions / jour",
  "Données prix m², trajets, qualité de vie",
  "Liens partenaires courtiers / assurance",
];

const FEATURES_PREMIUM = [
  "Comparaisons illimitées (jusqu'à 5 villes)",
  "Concierge IA illimité avec mémoire de session",
  "Alertes : variation de prix, nouvelles transactions",
  "Export PDF de chaque fiche commune",
  "DVF transaction par transaction",
  "Comparateur d'écoles (résultats brevet/bac)",
  "Carte des projets d'urbanisme à venir",
  "Sans liens sponsorisés",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-white">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white">
              PI
            </div>
            <span className="text-sm font-semibold text-neutral-900">Paris Immobilier</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Retour à la carte
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="text-center">
          <p className="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            Lancement prévu été 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Trouvez où vivre près de Paris,
            <br />
            <span className="text-violet-600">sans le stress du choix</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600">
            Le comparateur reste 100 % gratuit. Premium ajoute des outils
            avancés pour ceux qui passent à l'action.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <PlanCard
            title="Gratuit"
            price="0 €"
            period=""
            description="Tout ce qu'il faut pour explorer."
            features={FEATURES_FREE}
            ctaLabel="Continuer en gratuit"
            ctaHref="/"
            primary={false}
          />
          <PlanCard
            title="Premium"
            price="7,90 €"
            period="/mois"
            description="69 € / an (-27 %) après lancement."
            features={FEATURES_PREMIUM}
            ctaLabel="Réservez votre accès anticipé"
            ctaHref="#early-access"
            primary
            badge="-50 % à vie pour les early adopters"
          />
        </div>

        <section
          id="early-access"
          className="mt-16 rounded-2xl border border-violet-200 bg-white p-6 sm:p-10"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
              Bénéficiez de -50 % à vie
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Les 100 premiers inscrits paieront 3,95 €/mois à vie quand le
              Premium sortira. On vous prévient par mail dès l'ouverture, sans
              spam.
            </p>
            <EarlyAccessForm />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-center text-xl font-semibold text-neutral-900">
            Questions fréquentes
          </h2>
          <div className="mt-6 space-y-3">
            <Faq
              q="Le service restera-t-il gratuit ?"
              a="Oui, l'usage de base (carte, top 10, fiche commune, recherche d'adresse, IA limitée à 5 questions/jour) restera gratuit pour toujours."
            />
            <Faq
              q="Pourquoi un Premium ?"
              a="Pour financer les abonnements aux APIs (DVF, MeilleursAgents, Anthropic Claude) et permettre à l'équipe de continuer à développer le produit indépendamment."
            />
            <Faq
              q="Vendez-vous mes données ?"
              a="Non. Aucun tracker tiers, aucun cookie publicitaire. Seule analyse : Plausible (RGPD-friendly, pas de cookies). Les liens partenaires sont marqués comme sponsorisés."
            />
            <Faq
              q="Puis-je résilier à tout moment ?"
              a="Oui. Aucun engagement. Résiliation en 1 clic depuis votre compte."
            />
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-neutral-200 bg-neutral-50 py-8 text-center text-xs text-neutral-500">
        Paris Immobilier · {new Date().getFullYear()} ·
        <Link href="/" className="ml-1 hover:text-neutral-900">
          Retour à la carte
        </Link>
      </footer>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  description,
  features,
  ctaLabel,
  ctaHref,
  primary,
  badge,
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  primary: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        primary
          ? "border-violet-300 bg-gradient-to-b from-violet-50/60 to-white shadow-lg"
          : "border-neutral-200 bg-white"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-neutral-900">{price}</span>
        <span className="text-sm text-neutral-500">{period}</span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
      <ul className="mt-6 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-neutral-700">
            <span
              className={`mt-0.5 inline-block h-4 w-4 flex-shrink-0 rounded-full ${
                primary ? "bg-violet-600 text-white" : "bg-neutral-200 text-neutral-700"
              } text-center text-[10px] leading-4`}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium ${
          primary
            ? "bg-violet-600 text-white hover:bg-violet-700"
            : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <summary className="cursor-pointer list-none text-sm font-medium text-neutral-900">
        {q}
      </summary>
      <p className="mt-2 text-sm text-neutral-600">{a}</p>
    </details>
  );
}
