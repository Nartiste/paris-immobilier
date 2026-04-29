import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

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
      <article className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Accueil
          </Link>
          {" / "}
          <span className="text-neutral-900">Blog</span>
        </nav>

        <h1 className="font-display text-3xl font-medium tracking-tight text-brand-bleu sm:text-4xl">
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
              className="block rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
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
    </div>
  );
}
