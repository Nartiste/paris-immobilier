"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, ArrowRight, Calendar, Search, X } from "lucide-react";
import MiniSearch from "minisearch";
import type { BlogSearchableDoc } from "@/lib/blog-search";

/**
 * Shell client du blog : moteur de recherche MiniSearch + filtre catégorie
 * combinés, URL sync `?q=` et `?cat=`, debounce 150ms.
 *
 * Le composant reçoit la liste complète des posts + les docs indexables. À la
 * première render (SSR), aucun filtre n'est appliqué donc le HTML produit
 * contient tous les articles → SEO crawlable.
 */

export type PostListItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
};

type Props = {
  posts: PostListItem[];
  searchDocs: BlogSearchableDoc[];
  categories: readonly string[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryGradients: Record<string, string>;
  categoryCounts: Record<string, number>;
};

export default function BlogClientShell({
  posts,
  searchDocs,
  categories,
  categoryLabels,
  categoryColors,
  categoryGradients,
  categoryCounts,
}: Props) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("cat") ?? "all";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  // URL sync (replaceState pour ne pas spammer l'historique)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (activeCategory !== "all") params.set("cat", activeCategory);
    const qs = params.toString();
    const newSearch = qs ? `?${qs}` : "";
    if (window.location.search !== newSearch) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${newSearch}`,
      );
    }
  }, [debouncedQuery, activeCategory]);

  // Index MiniSearch (mémorisé, construit une fois côté client)
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ["title", "description", "body"],
      storeFields: ["slug"],
      idField: "slug",
      searchOptions: {
        boost: { title: 4, description: 2, body: 1 },
        prefix: true,
        fuzzy: 0.15,
        combineWith: "AND",
      },
    });
    ms.addAll(searchDocs);
    return ms;
  }, [searchDocs]);

  // Articles filtrés
  const { filteredPosts, scoreMap, hasSearch } = useMemo(() => {
    const q = debouncedQuery.trim();
    const isSearching = q.length >= 2;
    let result = posts;
    let scores: Map<string, number> | null = null;

    if (isSearching) {
      const matches = miniSearch.search(q);
      scores = new Map(matches.map((m) => [m.id as string, m.score]));
      result = result.filter((p) => scores!.has(p.slug));
      result = [...result].sort(
        (a, b) => (scores!.get(b.slug) ?? 0) - (scores!.get(a.slug) ?? 0),
      );
    }

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    return { filteredPosts: result, scoreMap: scores, hasSearch: isSearching };
  }, [posts, debouncedQuery, activeCategory, miniSearch]);

  // Featured uniquement si pas de recherche ET catégorie all
  const showFeatured = !hasSearch && activeCategory === "all";
  const featured = showFeatured ? filteredPosts[0] : null;
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  return (
    <>
      {/* SEARCH BAR */}
      <div className="mb-6">
        <label className="relative block">
          <span className="sr-only">Rechercher un article</span>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cherche un article : annecy, prêt, GPE, télétravail…"
            className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-12 text-sm shadow-[0_1px_3px_rgba(82,98,122,0.04)] placeholder:text-neutral-400 focus:border-brand-iris/40 focus:outline-none focus:ring-2 focus:ring-brand-iris/15"
            aria-label="Rechercher dans le blog"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-brand-bleu"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
        {hasSearch && (
          <p className="mt-2 px-2 text-xs text-neutral-500">
            {filteredPosts.length} résultat
            {filteredPosts.length !== 1 ? "s" : ""} pour{" "}
            <strong className="text-brand-bleu">« {debouncedQuery.trim()} »</strong>
            {scoreMap && filteredPosts.length > 0 && (
              <span className="text-neutral-400">
                {" "}· triés par pertinence
              </span>
            )}
          </p>
        )}
      </div>

      {/* FILTRES CATÉGORIES */}
      <nav
        aria-label="Catégories d'articles"
        className="mb-10 flex flex-wrap gap-2"
      >
        {categories.map((c) => {
          const isActive = activeCategory === c;
          const label = c === "all" ? "Tous" : categoryLabels[c] ?? c;
          const count = categoryCounts[c] ?? 0;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={
                isActive
                  ? "inline-flex items-center gap-1.5 rounded-full bg-brand-bleu px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)]"
                  : "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-iris/40 hover:text-brand-bleu"
              }
              aria-pressed={isActive}
            >
              {label}
              <span className={isActive ? "text-white/70" : "text-neutral-400"}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* FEATURED */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative mb-12 block overflow-hidden rounded-3xl border border-brand-bleu/10 shadow-[0_4px_16px_rgba(82,98,122,0.08)] transition-all hover:shadow-[0_12px_32px_rgba(82,98,122,0.16)]"
        >
          <div
            className={`bg-gradient-to-br ${categoryGradients[featured.category] ?? "from-brand-iris-soft via-white to-brand-vert-soft"} px-7 py-10 sm:px-10 sm:py-14`}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)]">
                ✦ À la une
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${categoryColors[featured.category] ?? ""}`}
              >
                {categoryLabels[featured.category] ?? featured.category}
              </span>
            </div>

            <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-4xl">
              {featured.title}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-bleu/75 sm:text-lg">
              {featured.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-brand-bleu/60">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={featured.publishedAt}>
                  {new Date(featured.publishedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {featured.readingMinutes} min de lecture
              </span>
            </div>

            <div className="mt-6 inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform group-hover:scale-[1.02]">
              Lire l&apos;article
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      )}

      {/* GRID */}
      {gridPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 p-10 text-center">
          {hasSearch ? (
            <>
              <p className="text-sm font-medium text-brand-bleu">
                Aucun article ne correspond à « {debouncedQuery.trim()} ».
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Essaie un terme plus court ou plus général : « annecy »,
                « investir », « RER B », « famille »…
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-bleu px-4 py-2 text-xs font-semibold text-white"
              >
                Réinitialiser
              </button>
            </>
          ) : (
            <p className="text-sm text-neutral-500">
              Aucun article dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {gridPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_8px_rgba(82,98,122,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-iris/20 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
            >
              <div
                className={`h-1.5 bg-gradient-to-r ${categoryGradients[p.category] ?? "from-brand-iris-soft to-brand-vert-soft"}`}
              />

              <div className="flex flex-1 flex-col p-6">
                <span
                  className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryColors[p.category] ?? ""}`}
                >
                  {categoryLabels[p.category] ?? p.category}
                </span>

                <h3 className="mt-3 font-display text-xl font-medium leading-snug tracking-tight text-brand-bleu group-hover:text-brand-iris-strong">
                  {p.title}
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                  {p.description}
                </p>

                <div className="mt-5 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {p.readingMinutes} min
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-brand-iris-strong opacity-70 transition-opacity group-hover:opacity-100">
                    Lire
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
