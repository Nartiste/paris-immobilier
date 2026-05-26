import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getBlogSearchDocs } from "@/lib/blog-search";
import BlogClientShell, { type PostListItem } from "@/components/BlogClientShell";

export const metadata: Metadata = {
  title: "Blog : guides pour acheter ou investir près de Paris en 2026",
  description:
    "Articles, guides et analyses pour t'aider à acheter ou investir en Île-de-France et près de Paris. Recherche par mot-clé, filtre par catégorie. Données réelles, ton complice, sans bullshit immobilier.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Vivre près de Paris",
    description:
      "Articles et guides pour t'aider à acheter ou investir près de Paris. Recherche par mot-clé.",
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
  tendance: "Investir",
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

// 'tendance' est le slug interne pour la catégorie 'Investir' (label utilisateur)
const CATEGORIES = ["all", "guide", "finance", "tendance", "persona", "transport"] as const;

export default async function BlogIndexPage() {
  const allPosts = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  // On ne sérialise au client que ce qu'il a besoin pour render la grille.
  // Pas de brief, pas de content : il faut rester light pour le bundle.
  const posts: PostListItem[] = allPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes,
  }));

  const searchDocs = getBlogSearchDocs();

  // Stats
  const totalMinutes = BLOG_POSTS.reduce((sum, p) => sum + p.readingMinutes, 0);

  // Catégories disponibles avec compte
  const categoryCounts: Record<string, number> = { all: allPosts.length };
  for (const c of CATEGORIES) {
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

      {/* HERO (server-rendered, SEO-friendly) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft/60 via-white to-brand-vert-soft/40 px-5 pt-12 pb-14 sm:px-7">
        <div
          aria-hidden
          className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-brand-iris/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand-vert/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl">
          <nav
            aria-label="Fil d'ariane"
            className="mb-6 text-xs text-brand-bleu/60"
          >
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
            Acheter, investir, choisir.
            <br />
            <span className="italic text-brand-iris">
              Sans bullshit immobilier.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-bleu/75">
            Guides, analyses et stratégies pour t&apos;aider à acheter ou
            investir près de Paris. Données réelles (DVF, INSEE, SNCF Connect,
            IDFM), ton complice, vraies opinions.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-bleu/80">
            <span>
              <strong className="text-brand-bleu">{BLOG_POSTS.length}</strong>{" "}
              articles
            </span>
            <span>
              <strong className="text-brand-bleu">
                {Math.round((totalMinutes / 60) * 10) / 10}h
              </strong>{" "}
              de lecture
            </span>
            <span>
              <strong className="text-brand-bleu">175</strong> communes étudiées
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-7">
        {/* SEARCH + FILTERS + GRID (client, hydraté) */}
        <Suspense fallback={null}>
          <BlogClientShell
            posts={posts}
            searchDocs={searchDocs}
            categories={CATEGORIES}
            categoryLabels={CATEGORY_LABELS}
            categoryColors={CATEGORY_COLORS}
            categoryGradients={CATEGORY_GRADIENTS}
            categoryCounts={categoryCounts}
          />
        </Suspense>
      </div>
    </div>
  );
}
