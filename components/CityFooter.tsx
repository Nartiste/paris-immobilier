import Link from "next/link";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES } from "@/lib/transport-lines";
import { communeToSlug } from "@/lib/slug";

/**
 * Footer global affiché sur toutes les pages.
 *
 * Maillage interne SEO + GEO :
 * - Section "Toutes les villes" alphabétique → 80+ liens contextuels
 * - Section "Lignes de transport" → 24 hubs ligne
 * - Section "Pages utiles" → blog, comparatifs, persona
 */

export default function CityFooter() {
  const sorted = [...SAMPLE_COMMUNES].sort((a, b) =>
    a.nom.localeCompare(b.nom, "fr"),
  );

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Bloc identité */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                Vivre près de Paris
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-600">
              Le comparateur de communes pour les Parisiens en réflexion sur
              la mobilité. Données réelles de prix, transports, qualité de
              vie. Concierge IA inclus, gratuit.
            </p>
            <p className="mt-3 text-[10px] text-neutral-500">
              Sources : DVF (data.gouv.fr), INSEE FILOSOFI, SNCF Connect,
              MeilleursAgents, IDF Mobilités.
            </p>
          </div>

          {/* Bloc pages utiles */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Explorer
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-neutral-900">
                  Carte interactive
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-neutral-900">
                  Blog : guides et conseils
                </Link>
              </li>
              <li>
                <Link
                  href="/quitter-paris-en-famille"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Quitter Paris en famille
                </Link>
              </li>
              <li>
                <Link
                  href="/quitter-paris-teletravail"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Quitter Paris en télétravail
                </Link>
              </li>
              <li>
                <Link
                  href="/quitter-paris-investisseur"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Quitter Paris pour investir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hub lignes de transport */}
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-700">
            Lignes de transport ({TRANSPORT_LINES.length})
          </h3>
          <ul
            className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 200px" }}
          >
            {TRANSPORT_LINES.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/lignes/${l.id}`}
                  className="block truncate text-neutral-600 hover:text-neutral-900 hover:underline"
                  title={`${l.code} : ${l.reputation.summary}`}
                >
                  {l.code}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hub principal : toutes les villes */}
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-700">
            Toutes les villes ({sorted.length})
          </h3>
          <ul
            className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            style={{ contentVisibility: "auto", containIntrinsicSize: "auto 600px" }}
          >
            {sorted.map((c) => (
              <li key={c.code_insee}>
                <Link
                  href={`/vivre-a/${communeToSlug(c)}`}
                  className="block truncate text-neutral-600 hover:text-neutral-900 hover:underline"
                  title={`Vivre à ${c.nom}`}
                >
                  {c.nom}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-4 text-center text-[10px] text-neutral-500">
          © {new Date().getFullYear()} Vivre près de Paris. Données
          indicatives, vérifiez toujours auprès de professionnels avant tout
          engagement.
        </div>
      </div>
    </footer>
  );
}
