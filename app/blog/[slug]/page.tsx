import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Sparkles, ArrowRight, ArrowRightLeft, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from "@/lib/blog-posts";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { COMMUNE_COUNT, SAMPLE_COMMUNES } from "@/lib/sample-data";
import { PUBLISHED_BLOG_POSTS } from "@/lib/blog-published";
import { getBlogCoverImage } from "@/lib/blog-images";
import { nameToSlug } from "@/lib/slug";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildCommuneFAQs, faqJsonLd, type FAQ } from "@/lib/commune-faqs";
import AffiliateStrip from "@/components/AffiliateStrip";
import BlogReadingProgress from "@/components/blog/BlogReadingProgress";
import BlogTOC from "@/components/blog/BlogTOC";
import NewsletterGate from "@/components/NewsletterGate";

/** Slugs des articles qui déclenchent l'opt-in newsletter (gated content). */
const GATED_ARTICLES = new Set<string>(["top-10-villes-pour-quitter-paris-2026"]);

/**
 * Coupe le markdown au début du N-ième H2 (1-indexé) et retourne (avant, après).
 * Le H2 lui-même est dans la partie "après" pour que le titre soit blurré.
 */
function splitMarkdownAtHeading(
  markdown: string,
  headingIndex: number,
): { before: string; after: string } {
  const matches = [...markdown.matchAll(/^##\s+.+$/gm)];
  if (matches.length < headingIndex) return { before: markdown, after: "" };
  const target = matches[headingIndex - 1];
  if (!target?.index && target?.index !== 0) return { before: markdown, after: "" };
  return {
    before: markdown.slice(0, target.index),
    after: markdown.slice(target.index),
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export const dynamicParams = false;

export async function generateStaticParams() {
  // Seuls les articles avec contenu réel sont pré-générés.
  return PUBLISHED_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) return { title: "Article introuvable" };

  const cover = getBlogCoverImage(slug);
  // Si on a une cover image dédiée, on l'utilise comme OG/Twitter ; sinon fallback brand.
  const ogImage = cover
    ? { url: cover.url, width: cover.width, height: cover.height, alt: cover.alt }
    : { url: "/brand/og.png", width: 1200, height: 630, alt: post.title };

  return {
    title: post.title,
    description: post.description,
    keywords: post.brief.references ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "fr_FR",
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: ["Vivre près de Paris"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage.url],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  guide: "Guide",
  transport: "Transport",
  finance: "Finance",
  persona: "Profil",
  tendance: "Investir",
};

const CATEGORY_COLORS: Record<string, string> = {
  guide: "bg-brand-iris-soft text-brand-iris-strong",
  transport: "bg-emerald-50 text-emerald-700",
  finance: "bg-amber-50 text-amber-700",
  persona: "bg-rose-50 text-rose-700",
  tendance: "bg-blue-50 text-blue-700",
};

/** Extrait les H2 du markdown pour générer la table des matières. */
function extractHeadings(markdown: string): { id: string; text: string }[] {
  const matches = markdown.matchAll(/^##\s+(.+)$/gm);
  const headings: { id: string; text: string }[] = [];
  for (const m of matches) {
    const text = m[1].trim();
    headings.push({ id: nameToSlug(text), text });
  }
  return headings;
}

const FAQ_HEADING_RE = /^##\s+(questions fr[ée]quentes|faq)\b/i;

/** Vrai si l'article contient déjà une section FAQ rédigée (futurs articles). */
function hasInlineFaq(markdown: string): boolean {
  return markdown.split("\n").some((l) => FAQ_HEADING_RE.test(l.trim()));
}

/** Nettoie le markdown inline (gras, liens) pour le texte de schema. */
function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse une section "## Questions fréquentes" (### question / réponse) en FAQ. */
function extractFaq(markdown: string): FAQ[] {
  const lines = markdown.split("\n");
  const start = lines.findIndex((l) => FAQ_HEADING_RE.test(l.trim()));
  if (start === -1) return [];
  const out: FAQ[] = [];
  let q: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    const answer = stripInlineMarkdown(buf.join(" "));
    if (q && answer) out.push({ question: stripInlineMarkdown(q), answer });
    q = null;
    buf = [];
  };
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line)) break; // fin de la section FAQ
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flush();
      q = h3[1].trim();
      continue;
    }
    if (q) buf.push(line.trim());
  }
  flush();
  return out;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) notFound();

  const content = BLOG_CONTENT[slug];
  // Brief existant mais contenu pas encore généré : on ne publie pas de page vide.
  if (!content || content.trim().length === 0) notFound();
  const allHeadings = content ? extractHeadings(content) : [];
  const cover = getBlogCoverImage(slug);
  // Pour les articles gated, on n'expose que les H2 visibles avant le blur
  // (les autres seraient la "réponse" qu'on veut justement faire désirer).
  const isGated = GATED_ARTICLES.has(slug);
  const headings = isGated ? allHeadings.slice(0, 4) : allHeadings;

  // === GEO : FAQ (FAQPage JSON-LD + bloc visible) ===
  // Futurs articles : FAQ rédigée dans le markdown ("## Questions fréquentes").
  // Articles existants : on dérive une FAQ des données réelles de la commune
  // (1re référence du brief) pour le schema + un bloc visible, sans régénérer.
  const inlineFaq = hasInlineFaq(content);
  // Commune de référence de l'article (1re référence du brief). Sert au bloc
  // data "en bref" des pages « Vivre à … » (data moat) et à la FAQ dérivée.
  const articleCommune = SAMPLE_COMMUNES.find(
    (c) => c.nom === post.brief.references?.[0],
  );
  const isVivreA = slug.startsWith("vivre-a-");
  const refCommune = !inlineFaq ? articleCommune : undefined;
  const fallbackFaq = refCommune ? buildCommuneFAQs(refCommune).slice(0, 5) : [];
  const faqs: FAQ[] = inlineFaq ? extractFaq(content) : fallbackFaq;
  const faqLd = !isGated && faqs.length >= 2 ? faqJsonLd(faqs) : null;
  // Bloc FAQ visible uniquement en fallback (sinon elle est déjà dans le markdown).
  const showFaqBlock = !inlineFaq && !isGated && fallbackFaq.length >= 2;

  // Articles connexes : 3, par catégorie similaire en priorité
  const related = BLOG_POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === post.category ? 1 : 0;
      const bSame = b.category === post.category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, 3);

  // === JSON-LD ===
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "fr-FR",
    keywords: post.brief.references?.join(", "),
    author: {
      "@type": "Organization",
      name: "Vivre près de Paris",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vivre près de Paris",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/icon-512.png` },
    },
    image: cover?.url ?? `${SITE_URL}/brand/og.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    wordCount: content?.split(/\s+/).length ?? 0,
    articleSection: CATEGORY_LABELS[post.category] ?? post.category,
    // Entité ville : ancre la page sur la commune (utile pour "Vivre à {Ville}").
    ...(articleCommune
      ? {
          about: {
            "@type": "City",
            name: articleCommune.nom,
            address: {
              "@type": "PostalAddress",
              postalCode: articleCommune.code_postal,
              addressLocality: articleCommune.nom,
              addressRegion: articleCommune.departement,
              addressCountry: "FR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: articleCommune.lat,
              longitude: articleCommune.lon,
            },
          },
        }
      : {}),
  };

  const breadcrumbsLd = breadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title },
  ]);

  // === Custom markdown components — typo + ancres pour TOC ===
  const mdComponents: Components = {
    h2: ({ children }) => {
      const text = String(children);
      const id = nameToSlug(text);
      return (
        <h2
          id={id}
          className="mt-12 mb-4 scroll-mt-28 font-display text-2xl font-medium tracking-tight text-brand-bleu sm:text-3xl"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-xl font-medium text-brand-bleu">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mt-4 text-base leading-[1.75] text-neutral-800">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-brand-iris bg-brand-iris-soft/30 px-5 py-4 italic text-brand-bleu">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="mt-4 space-y-2 pl-5 text-base leading-relaxed text-neutral-800 [&>li]:relative [&>li]:before:absolute [&>li]:before:-left-4 [&>li]:before:top-3 [&>li]:before:h-1 [&>li]:before:w-1 [&>li]:before:rounded-full [&>li]:before:bg-brand-iris">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-neutral-800 marker:text-brand-iris marker:font-semibold">
        {children}
      </ol>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-medium text-brand-iris-strong underline decoration-brand-iris/30 underline-offset-2 transition-colors hover:decoration-brand-iris-strong"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-bleu">{children}</strong>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-2xl border border-neutral-100">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-neutral-50 text-left text-[11px] uppercase tracking-wider text-brand-bleu/60">
        {children}
      </thead>
    ),
    th: ({ children }) => <th className="px-4 py-2.5 font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-t border-neutral-100 px-4 py-3 text-neutral-700">{children}</td>,
    hr: () => <hr className="my-12 border-t border-neutral-200" />,
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <BlogReadingProgress />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft/60 via-white to-brand-vert-soft/40 px-5 pt-10 pb-12 sm:px-7">
        <div aria-hidden className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-brand-iris/15 blur-3xl" />
        <div aria-hidden className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand-vert/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-brand-bleu/60">
            <Link href="/" className="hover:text-brand-bleu">Accueil</Link>
            {" / "}
            <Link href="/blog" className="hover:text-brand-bleu">Blog</Link>
            {" / "}
            <span className="text-brand-bleu">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? "bg-neutral-100 text-neutral-700"}`}>
              <Tag className="h-3 w-3" />
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-brand-bleu/60">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min de lecture
            </span>
            <span className="text-brand-bleu/30">·</span>
            <span className="inline-flex items-center gap-1 text-xs text-brand-bleu/60">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-brand-bleu/75">
            {post.description}
          </p>
        </div>
      </section>

      {/* HERO IMAGE : optimisée AVIF/WebP via next/image, priority pour LCP */}
      {cover && (
        <figure className="mx-auto max-w-5xl px-5 sm:px-7">
          <div className="relative -mt-6 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_8px_24px_rgba(82,98,122,0.12)]">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <figcaption className="mt-2 text-right text-[11px] text-neutral-400">
            {cover.credit}
          </figcaption>
        </figure>
      )}

      {/* MAIN LAYOUT : article + TOC sticky */}
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-7">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
          <article className="min-w-0 max-w-3xl">
            {/* "Vivre à {Ville} en bref" — données réelles (data moat), answer-first.
                Snippet / AI Overview friendly, propre aux pages vivre-a. */}
            {isVivreA && articleCommune && (
              <section
                aria-label={`Vivre à ${articleCommune.nom} en bref`}
                className="mb-10 rounded-3xl border border-brand-iris/15 bg-gradient-to-br from-brand-iris-soft/30 via-white to-brand-vert-soft/20 p-6"
              >
                <h2 className="mb-3 font-display text-lg font-medium text-brand-bleu">
                  Vivre à {articleCommune.nom} en bref
                </h2>
                <p className="text-base leading-relaxed text-brand-bleu/85">
                  {(() => {
                    const c = articleCommune;
                    const bits: string[] = [];
                    if (c.prix_m2_median)
                      bits.push(
                        `compter environ ${c.prix_m2_median.toLocaleString("fr-FR")} €/m² à l'achat`,
                      );
                    bits.push(
                      `Paris en ${c.temps_trajet_paris_min} min${c.ligne_principale ? ` via ${c.ligne_principale}` : ""}`,
                    );
                    bits.push(`${c.population.toLocaleString("fr-FR")} habitants`);
                    return `Vivre à ${c.nom} (${c.code_postal}, ${c.departement}), c'est ${bits.join(", ")}.`;
                  })()}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {articleCommune.prix_m2_median != null && (
                    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                        Prix médian
                      </dt>
                      <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                        {articleCommune.prix_m2_median.toLocaleString("fr-FR")} €/m²
                      </dd>
                    </div>
                  )}
                  <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                      Paris en
                    </dt>
                    <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                      {articleCommune.temps_trajet_paris_min} min
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                      Population
                    </dt>
                    <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                      {articleCommune.population.toLocaleString("fr-FR")}
                    </dd>
                  </div>
                  {articleCommune.ligne_principale && (
                    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                        Transport
                      </dt>
                      <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                        {articleCommune.ligne_principale}
                      </dd>
                    </div>
                  )}
                  {articleCommune.espaces_verts_pct != null && (
                    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                        Espaces verts
                      </dt>
                      <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                        {articleCommune.espaces_verts_pct} %
                      </dd>
                    </div>
                  )}
                  {articleCommune.rendement_locatif != null && (
                    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-brand-bleu/5">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/50">
                        Rendement locatif
                      </dt>
                      <dd className="mt-0.5 font-display text-lg font-medium text-brand-bleu">
                        {articleCommune.rendement_locatif} %
                      </dd>
                    </div>
                  )}
                </dl>
                <Link
                  href={`/vivre-a/${nameToSlug(articleCommune.nom)}-${articleCommune.code_insee}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-iris-strong hover:underline"
                >
                  Voir la fiche data complète de {articleCommune.nom}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            )}

            {/* TLDR / Points clés */}
            {headings.length >= 3 && (
              <aside
                aria-label="Points clés"
                className="mb-10 rounded-3xl border border-brand-bleu/10 bg-gradient-to-br from-white to-brand-iris-soft/20 p-6"
              >
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bleu/60">
                  Au menu
                </p>
                <ul className="space-y-1.5 text-sm text-brand-bleu/85">
                  {headings.slice(0, Math.min(headings.length, 6)).map((h, i) => (
                    <li key={h.id} className="flex gap-2">
                      <span className="text-brand-iris-strong tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a href={`#${h.id}`} className="hover:text-brand-bleu hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Contenu markdown — avec gate newsletter si article gated */}
            <div className="text-neutral-800">
              {content ? (
                GATED_ARTICLES.has(slug) ? (
                  (() => {
                    // Gate après le 5e H2 : laisse voir intro + items 1, 2, 3, 4
                    // (intro = H2 #1, puis 4 items = H2 #2, #3, #4, #5)
                    const { before, after } = splitMarkdownAtHeading(content, 5);
                    return (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                          {before}
                        </ReactMarkdown>
                        {after && (
                          <NewsletterGate sourceArticleSlug={slug}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                              {after}
                            </ReactMarkdown>
                          </NewsletterGate>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {content}
                  </ReactMarkdown>
                )
              ) : (
                <p className="text-neutral-500 italic">Article en cours de finalisation. Reviens bientôt.</p>
              )}
            </div>

            {/* CTA mid/fin d'article : Concierge IA */}
            <aside className="my-12 overflow-hidden rounded-3xl border border-brand-iris/20 bg-gradient-to-br from-brand-iris-soft/40 via-white to-brand-vert-soft/40 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-iris text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-lg font-medium text-brand-bleu">
                    Tu hésites encore sur ta ville ?
                  </h2>
                  <p className="mt-1 text-sm text-brand-bleu/70">
                    Notre concierge IA croise tes critères avec les {COMMUNE_COUNT} communes étudiées et te répond en moins d'une minute.
                  </p>
                  <Link
                    href="/"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-brand-iris px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-all hover:bg-brand-iris-strong"
                  >
                    Demander au concierge
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Bandeau affiliation */}
            <AffiliateStrip page={`blog-${slug}`} />

            {/* CTA final : comparateur */}
            <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-bleu via-brand-bleu to-brand-iris p-8 text-center shadow-[0_8px_24px_rgba(82,98,122,0.18)]">
              <h2 className="font-display text-2xl font-medium text-white sm:text-3xl">
                Passe de la lecture à l'action
              </h2>
              <p className="mt-3 text-base text-white/80">
                Compare deux villes côte à côte ou explore-les sur la carte.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/comparer"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-bleu shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02]"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Ouvrir le comparateur
                </Link>
                <Link
                  href="/ou-vivre-pres-de-paris"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-transform hover:scale-[1.02] hover:bg-white/20"
                >
                  Voir le guide complet
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

            {/* FAQ (GEO) — bloc visible dérivé des données commune pour les
                articles sans FAQ rédigée. Schema FAQPage émis en parallèle. */}
            {showFaqBlock && (
              <section className="mt-16 border-t border-neutral-100 pt-10">
                <h2 className="font-display text-2xl font-medium tracking-tight text-brand-bleu">
                  Questions fréquentes
                </h2>
                <div className="mt-5 space-y-3">
                  {faqs.map((f, i) => (
                    <details
                      key={i}
                      className="group rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.04)]"
                    >
                      <summary className="cursor-pointer list-none font-display text-base font-medium text-brand-bleu marker:content-none">
                        {f.question}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                        {f.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Articles connexes */}
            {related.length > 0 && (
              <section className="mt-16 border-t border-neutral-100 pt-10">
                <h2 className="font-display text-2xl font-medium tracking-tight text-brand-bleu">
                  À lire aussi
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group block rounded-3xl border border-neutral-100 bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
                    >
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[p.category] ?? "bg-neutral-100 text-neutral-700"}`}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </span>
                      <h3 className="mt-2.5 font-display text-base font-medium leading-snug text-brand-bleu">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs text-brand-bleu/60">
                        {p.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-iris-strong">
                        Lire
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* TOC desktop sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <BlogTOC headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
