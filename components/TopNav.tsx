import Link from "next/link";
import { Sparkles } from "lucide-react";
import AddressSearchClient from "./AddressSearchClient";

/**
 * Barre de navigation supérieure, sticky, server-rendered.
 *
 * - Logo + brand à gauche → /
 * - Search bar (client island) au centre
 * - Liens de navigation à droite
 *
 * SEO : tous les liens sont des <Link> Next.js → préfetch + crawlable.
 */
export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 lg:px-6">
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2 hover:opacity-90"
          aria-label="Accueil Vivre près de Paris"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-semibold leading-tight text-neutral-900">
              Vivre près de Paris
            </span>
            <span className="block text-[10px] text-neutral-500">
              Comparateur de communes
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          <NavLink href="/blog">Blog</NavLink>
          <NavDropdown
            label="Quitter Paris"
            items={[
              { href: "/quitter-paris-en-famille", label: "En famille" },
              { href: "/quitter-paris-teletravail", label: "En télétravail" },
              { href: "/quitter-paris-investisseur", label: "Pour investir" },
            ]}
          />
          <NavDropdown
            label="Par temps"
            items={[
              { href: "/a-15-minutes-de-paris", label: "15 minutes" },
              { href: "/a-30-minutes-de-paris", label: "30 minutes" },
              { href: "/a-45-minutes-de-paris", label: "45 minutes" },
              { href: "/a-60-minutes-de-paris", label: "1 heure" },
              { href: "/a-90-minutes-de-paris", label: "1 h 30" },
              { href: "/a-120-minutes-de-paris", label: "2 heures" },
            ]}
          />
        </nav>

        <div className="hidden flex-shrink-0 sm:block sm:w-64 md:w-80">
          <AddressSearchClient />
        </div>

        <Link
          href="#concierge"
          className="hidden flex-shrink-0 items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 sm:inline-flex"
        >
          <Sparkles className="h-3 w-3" />
          IA
        </Link>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
    >
      {children}
    </Link>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900">
        {label}
        <svg
          className="h-3 w-3 transition-transform group-open:rotate-180"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden
        >
          <path d="M6 9 1 4h10z" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {it.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
