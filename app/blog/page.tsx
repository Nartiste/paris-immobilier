import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";
import CityFooter from "@/components/CityFooter";

export const metadata: Metadata = {
  title: "Blog : guides pour quitter Paris en 2026",
  description:
    "Articles, guides et analyses pour t'aider à choisir ta prochaine ville en quittant Paris. Données réelles, ton complice, sans bullshit immobilier.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog Vivre près de Paris",
    description:
      "Articles et guides pour t'aider à choisir ta prochaine ville en quittant Paris.",
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

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Vivre près de Paris — Blog",
    description:
      "Articles, guides et analyses sur la mobilité résidentielle entre Paris et le reste de la France.",
    inLanguage: "fr-FR",
    blogPost: posts.map((p) => ({
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

      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90">
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
          </Link>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            Carte interactive →
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Accueil
          </Link>
          {" / "}
          <span className="text-neutral-900">Blog</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Le blog
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">
          Guides, analyses et conseils pour t&apos;aider à choisir ta prochaine
          ville si tu envisages de quitter Paris. Données réelles (DVF, INSEE,
          SNCF Connect, IDFM), ton complice, sans bullshit immobilier.
        </p>

        <section className="mt-10 space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                  {CATEGORY_LABELS[p.category] ?? p.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {p.readingMinutes} min de lecture
                </span>
                <span>·</span>
                <time dateTime={p.publishedAt}>
                  {new Date(p.publishedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-neutral-900">
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {p.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-900">
                Lire l&apos;article
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </section>
      </article>

      <CityFooter />
    </div>
  );
}
