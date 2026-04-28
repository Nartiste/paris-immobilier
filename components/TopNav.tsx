"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRightLeft } from "lucide-react";
import AddressSearchClient from "./AddressSearchClient";
import BrandMark from "./BrandMark";
import { useAppStore } from "@/lib/store";

/**
 * Barre de navigation supérieure, sticky.
 *
 * Desktop (md+) : logo + recherche + nav links + CTA IA
 * Mobile (< md) : logo + burger → ouvre un panneau plein largeur avec
 *                 search + tous les liens + CTA IA
 *
 * SEO : tous les liens sont des <Link> Next.js, crawlable même quand le
 * menu est fermé (le panneau mobile reste dans le DOM).
 */
export default function TopNav() {
  const [open, setOpen] = useState(false);
  const { setConciergeOpen } = useAppStore();

  // Ferme le menu si la fenêtre passe en desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Bloque scroll body quand menu ouvert
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-bleu/10 bg-white/85 shadow-[0_1px_2px_rgba(82,98,122,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-3 px-4 lg:px-6">
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="Accueil Vivre près de Paris"
        >
          <BrandMark className="h-14 w-14 sm:h-16 sm:w-16" priority />
          <div className="hidden sm:block">
            <span className="block font-display text-lg font-medium leading-none tracking-tight text-brand-bleu">
              Vivre <span className="italic text-brand-iris">près</span> de Paris
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-brand-bleu/60">
              Trouver son refuge
            </span>
          </div>
        </Link>

        {/* Desktop nav (md+) */}
        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <nav aria-label="Navigation principale" className="flex items-center gap-1">
            <NavLink href="/blog">Blog</NavLink>
            <NavDropdown
              label="Quitter Paris"
              items={[
                { href: "/quitter-paris-en-famille", label: "En famille" },
                { href: "/quitter-paris-teletravail", label: "En télétravail" },
                { href: "/quitter-paris-investisseur", label: "Pour investir" },
              ]}
            />
          </nav>
          <div className="ml-2 w-56 lg:w-64">
            <AddressSearchClient />
          </div>
          <Link
            href="/comparer"
            className="ml-1 inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-all hover:bg-brand-bleu/90 hover:shadow-[0_6px_18px_rgba(82,98,122,0.35)]"
          >
            <ArrowRightLeft className="h-3 w-3" />
            Comparer
          </Link>
          <button
            type="button"
            onClick={() => setConciergeOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-iris px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-all hover:bg-brand-iris-strong hover:shadow-[0_6px_18px_rgba(157,140,242,0.55)]"
          >
            <Sparkles className="h-3 w-3" />
            Concierge IA
          </button>
        </div>

        {/* Mobile : burger seul */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-0 max-h-[90vh] overflow-y-auto rounded-b-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-neutral-100 px-4">
              <span className="text-sm font-semibold text-neutral-900">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <AddressSearchClient />
              <Link
                href="/comparer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-brand-bleu px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)]"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Comparer 2 villes
              </Link>
            </div>
            <nav
              aria-label="Navigation mobile"
              className="space-y-0.5 px-2 pb-4"
            >
              <MobileNavLink href="/blog" onClick={() => setOpen(false)}>
                Blog
              </MobileNavLink>
              <div className="pt-2 pb-1 pl-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Quitter Paris
              </div>
              <MobileNavLink href="/quitter-paris-en-famille" onClick={() => setOpen(false)}>
                En famille
              </MobileNavLink>
              <MobileNavLink href="/quitter-paris-teletravail" onClick={() => setOpen(false)}>
                En télétravail
              </MobileNavLink>
              <MobileNavLink href="/quitter-paris-investisseur" onClick={() => setOpen(false)}>
                Pour investir
              </MobileNavLink>
              <div className="pt-2 pb-1 pl-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Outils
              </div>
              <button
                type="button"
                onClick={() => {
                  setConciergeOpen(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-brand-iris-strong hover:bg-brand-iris-soft"
              >
                <Sparkles className="h-4 w-4" />
                Concierge IA
              </button>
            </nav>
          </div>
        </div>
      )}
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
      className="rounded-xl px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2.5 text-sm text-neutral-800 hover:bg-neutral-100"
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
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-xl px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
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
      <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-2xl border border-neutral-200/60 bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block rounded-xl px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {it.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
