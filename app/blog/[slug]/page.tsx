import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from "@/lib/blog-posts";
import { BLOG_CONTENT } from "@/lib/blog-content";
import CityFooter from "@/components/CityFooter";

export const dynamicParams = false;

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) return { title: "Article introuvable" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "fr_FR",
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  guide: "Guide",
  transport: "Transport",
  finance: "Finance",
  persona: "Profil",
  tendance: "Tendance",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) notFound();

  const content = BLOG_CONTENT[slug];

  // Articles connexes : 3 articles différents, par catégorie similaire en priorité
  const related = BLOG_POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === post.category ? 1 : 0;
      const bSame = b.category === post.category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: "Vivre près de Paris" },
    publisher: { "@type": "Organization", name: "Vivre près de Paris" },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
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
          <Link href="/blog" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Tous les articles
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Accueil
          </Link>
          {" / "}
          <Link href="/blog" className="hover:text-neutral-900">
            Blog
          </Link>
          {" / "}
          <span className="text-neutral-900">{post.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingMinutes} min de lecture
          </span>
          <span>·</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-3 text-base leading-relaxed text-neutral-600">
          {post.description}
        </p>

        <div className="prose prose-neutral mt-8 max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-6 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-neutral-800 prose-a:text-neutral-900 prose-a:underline prose-strong:text-neutral-900 prose-li:text-neutral-800">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-neutral-500">
              <em>Article en cours de finalisation. Reviens bientôt.</em>
            </p>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-neutral-200 pt-8">
            <h2 className="text-xl font-semibold text-neutral-900">
              À lire aussi
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                    {CATEGORY_LABELS[p.category] ?? p.category}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-neutral-900">
                    {p.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-700">
            Tu veux comparer concrètement les villes citées dans cet article ?
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Ouvrir le comparateur interactif
          </Link>
        </section>
      </article>

      <CityFooter />
    </div>
  );
}
