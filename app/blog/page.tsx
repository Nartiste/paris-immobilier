import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog : guides pour acheter ou investir près de Paris en 2026",
  description:
    "Articles, guides et analyses pour t'aider à acheter ou investir en Île-de-France et près de Paris. Données réelles, ton complice, sans bullshit immobilier.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Vivre près de Paris",
    description:
      "Articles et guides pour t'aider à acheter ou investir près de Paris.",
    type: "website",
    locale: "fr_FR",
    url: "/blog",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  guide: "Guide",
  transport: "Transport",
  finance: "Finance",
  persona: "Profil",
  tendance: "Tendance",
};

const CATEGORY_COLORS: Record<string, string> = {
  guide: "bg-brand-iris-soft text-brand-iris-strong border-brand-iris/20",
  transport: "bg-emerald-50 text-emerald-700 border-emerald-200",
  finance: "bg-amber-50 text-amber-700 border-amber-200",
  persona: "bg-rose-50 text-rose-700 border-rose-200",
  tendance: "bg-blue-50 text-blue-700 border-blue-200",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  guide: "from-brand-iris-soft via-white to-brand-vert-soft",
  transport: "from-emerald-50 via-white to-emerald-50/40",
  finance: "from-amber-50 via-white to-amber-50/40",
  persona: "from-rose-50 via-white to-rose-50/40",
  tendance: "from-blue-50 via-white to-blue-50/40",
};

type Props = {
  searchParams: Promise<{ cat?: string }>;
};

export default async function BlogIndexPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const activeCategory = cat ?? "all";

  const allPosts = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const filteredPosts =
    activeCategory === "all"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  // Stats
  const totalMinutes = BLOG_POSTS.reduce((sum, p) => sum + p.readingMinutes, 0);

  // Article à la une (le plus récent global, indépendant du filtre)
  const featured = allPosts[0];
  const otherFiltered = filteredPosts.filter((p) => p.slug !== featured.slug);
  const showFeatured = activeCategory === "all";

  // Catégories disponibles avec compte
  const categories = ["all", "guide", "finance", "tendance", "persona", "transport"] as const;
  const categoryCounts: Record<string, number> = { all: allPosts.length };
  for (const c of categories) {
    if (c === "all") continue;
    categoryCounts[c] = allPosts.filter((p) => p.category === c).length;
  }

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Vivre près de Paris — Blog",
    description:
      "Articles, guides et analyses sur l'achat et l'investissement immobilier près de Paris.",
    inLanguage: "fr-FR",
    blogPost: allPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      url: `/blog/${p.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft/60 via-white to-brand-vert-soft/40 px-5 pt-12 pb-14 sm:px-7">
        <div aria-hidden className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-brand-iris/15 blur-3xl" />
        <div aria-hidden className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand-vert/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-brand-bleu/60">
            <Link href="/" className="hover:text-brand-bleu">
              Accueil
            </Link>
            {" / "}
            <span className="text-brand-bleu">Blog</span>
          </nav>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-iris-strong">
            <BookOpen className="h-3.5 w-3.5" />
            Le blog
          </div>

          <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-5xl">
            Acheter, investir, choisir.<br />
            <span className="italic text-brand-iris">Sans bullshit immobilier.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-bleu/75">
            Guides, analyses et stratégies pour t&apos;aider à acheter ou investir près de Paris.
            Données réelles (DVF, INSEE, SNCF Connect, IDFM), ton complice, vraies opinions.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-bleu/80">
            <span><strong className="text-brand-bleu">{BLOG_POSTS.length}</strong> articles</span>
            <span><strong className="text-brand-bleu">{Math.round(totalMinutes / 60 * 10) / 10}h</strong> de lecture</span>
            <span><strong className="text-brand-bleu">86</strong> communes étudiées</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-7">
        {/* FILTRES CATÉGORIES */}
        <nav aria-label="Catégories d'articles" className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => {
            const isActive = activeCategory === c;
            const label = c === "all" ? "Tous" : CATEGORY_LABELS[c] ?? c;
            const count = categoryCounts[c];
            const href = c === "all" ? "/blog" : `/blog?cat=${c}`;
            return (
              <Link
                key={c}
                href={href}
                className={
                  isActive
                    ? "inline-flex items-center gap-1.5 rounded-full bg-brand-bleu px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)]"
                    : "inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-iris/40 hover:text-brand-bleu"
                }
              >
                {label}
                <span className={isActive ? "text-white/70" : "text-neutral-400"}>
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ARTICLE FEATURED — uniquement sur 'Tous' */}
        {showFeatured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative mb-12 block overflow-hidden rounded-3xl border border-brand-bleu/10 shadow-[0_4px_16px_rgba(82,98,122,0.08)] transition-all hover:shadow-[0_12px_32px_rgba(82,98,122,0.16)]"
          >
            <div className={`bg-gradient-to-br ${CATEGORY_GRADIENTS[featured.category] ?? "from-brand-iris-soft via-white to-brand-vert-soft"} px-7 py-10 sm:px-10 sm:py-14`}>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)]">
                  ✦ À la une
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[featured.category] ?? ""}`}>
                  {CATEGORY_LABELS[featured.category] ?? featured.category}
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

        {/* GRID DES ARTICLES */}
        {otherFiltered.length === 0 ? (
          <p className="rounded-2xl bg-neutral-50 p-8 text-center text-sm text-neutral-500">
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {(showFeatured ? otherFiltered : filteredPosts).map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_8px_rgba(82,98,122,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-iris/20 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
              >
                {/* Bande catégorie */}
                <div className={`h-1.5 bg-gradient-to-r ${CATEGORY_GRADIENTS[p.category] ?? "from-brand-iris-soft to-brand-vert-soft"}`} />

                <div className="flex flex-1 flex-col p-6">
                  <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[p.category] ?? ""}`}>
                    {CATEGORY_LABELS[p.category] ?? p.category}
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
      </div>
    </div>
  );
}
