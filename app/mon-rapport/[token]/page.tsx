import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  Sparkles,
  MessageCircle,
  Calendar,
  Share2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { getSupabaseServer } from "@/lib/supabase";
import { SAMPLE_COMMUNES, COMMUNE_COUNT } from "@/lib/sample-data";
import { injectCommuneLinks } from "@/lib/personal-report-linkify";
import RapportAnalytics from "./RapportAnalytics";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

type PersonalReport = {
  id: string;
  email: string;
  prenom: string;
  report_markdown: string;
  created_at: string;
  views_count: number;
  communes_insee: string[] | null;
};

async function fetchReport(
  token: string,
  options: { incrementViews?: boolean } = {},
): Promise<PersonalReport | null> {
  if (!token || !UUID_RE.test(token)) return null;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("personal_reports")
    .select("id, email, prenom, report_markdown, created_at, views_count, communes_insee")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;

  // Incrémente views_count (best-effort, fire-and-forget, sans bloquer le rendu).
  // Seulement quand demandé pour ne pas doubler avec generateMetadata.
  if (options.incrementViews) {
    supabase
      .from("personal_reports")
      .update({ views_count: (data.views_count ?? 0) + 1 })
      .eq("id", data.id)
      .then(() => undefined, () => undefined);
  }

  return data as PersonalReport;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const report = await fetchReport(token);
  if (!report) {
    return { title: "Rapport introuvable" };
  }

  const title = `${report.prenom}, ton verdict personnalisé`;
  const description = `Le hack : ${COMMUNE_COUNT} communes scannées, 1 ville sort. La tienne. Plus 2 alternatives. Score de match, quartiers à viser, pièges à éviter.`;

  return {
    title,
    description,
    robots: { index: false, follow: false }, // privé : non indexable
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
    },
  };
}

export default async function MonRapportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token || !UUID_RE.test(token)) {
    notFound();
  }

  const report = await fetchReport(token, { incrementViews: true });
  if (!report) {
    notFound();
  }

  const dateStr = new Date(report.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mdComponents: Components = {
    h1: ({ children }) => (
      <h1 className="mt-2 mb-3 font-display text-4xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-display text-2xl font-medium tracking-tight text-brand-bleu sm:text-3xl">
        {children}
      </h2>
    ),
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
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-bleu">{children}</strong>
    ),
    a: ({ children, href }) => {
      const isInternal = typeof href === "string" && href.startsWith("/");
      const className =
        "font-medium text-brand-iris-strong underline decoration-brand-iris/30 underline-offset-2 transition-colors hover:decoration-brand-iris-strong";
      if (isInternal) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    },
    hr: () => <hr className="my-12 border-t border-neutral-200" />,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Cookie unlock côté client + tracking analytics */}
      <RapportAnalytics token={token} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft/60 via-white to-brand-vert-soft/40 px-5 pt-10 pb-12 sm:px-7">
        <div
          aria-hidden
          className="absolute -right-32 -top-20 h-80 w-80 rounded-full bg-brand-iris/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand-vert/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl">
          <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-brand-bleu/60">
            <Link href="/" className="hover:text-brand-bleu">
              Accueil
            </Link>
            {" / "}
            <span className="text-brand-bleu">Ton verdict</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-iris-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-iris-strong">
              <Sparkles className="h-3 w-3" />
              Le hack · Ton verdict
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-brand-bleu/60">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={report.created_at}>{dateStr}</time>
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-brand-bleu/75">
            Pas de top 10 mou. Une recommandation. <strong>La tienne, {report.prenom}.</strong> {COMMUNE_COUNT} communes
            scannées contre tes 6 réponses au quiz. Aucun autre Parisien n&apos;aura exactement le même verdict.
          </p>
        </div>
      </section>

      {/* CONTENU MARKDOWN */}
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-7">
        <article className="text-neutral-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {injectCommuneLinks(report.report_markdown, SAMPLE_COMMUNES)}
          </ReactMarkdown>
        </article>

        {/* CTA finaux */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link
            href="/ou-vivre-pres-de-paris"
            className="group flex flex-col gap-2 rounded-3xl border border-neutral-100 bg-gradient-to-br from-brand-iris-soft/40 via-white to-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
          >
            <Sparkles className="h-5 w-5 text-brand-iris-strong" />
            <h3 className="font-display text-base font-medium text-brand-bleu">
              Voir le ranking complet
            </h3>
            <p className="text-xs leading-relaxed text-brand-bleu/65">
              {COMMUNE_COUNT} communes analysées, filtres ajustables.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-iris-strong">
              Explorer
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/comparer"
            className="group flex flex-col gap-2 rounded-3xl border border-neutral-100 bg-gradient-to-br from-brand-vert-soft/40 via-white to-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
          >
            <ArrowRightLeft className="h-5 w-5 text-brand-iris-strong" />
            <h3 className="font-display text-base font-medium text-brand-bleu">
              Comparer 2 communes
            </h3>
            <p className="text-xs leading-relaxed text-brand-bleu/65">
              Met-les côte à côte sur tous les critères.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-iris-strong">
              Comparer
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/?concierge=open"
            className="group flex flex-col gap-2 rounded-3xl border border-neutral-100 bg-gradient-to-br from-brand-iris-soft/40 via-white to-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,98,122,0.1)]"
          >
            <MessageCircle className="h-5 w-5 text-brand-iris-strong" />
            <h3 className="font-display text-base font-medium text-brand-bleu">
              Parler au concierge
            </h3>
            <p className="text-xs leading-relaxed text-brand-bleu/65">
              Une question précise sur une commune ? L&apos;IA répond.
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-iris-strong">
              Demander
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </section>

        {/* Lien de partage */}
        <section className="mt-10 rounded-3xl border border-brand-iris/20 bg-gradient-to-br from-brand-iris-soft/30 via-white to-brand-vert-soft/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-iris text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)]">
              <Share2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-medium text-brand-bleu">
                Ce rapport est à toi
              </h2>
              <p className="mt-1 text-sm text-brand-bleu/70">
                Garde ce lien, il reste actif. Tu peux le partager avec ton/ta conjoint·e,
                ta famille, ou le rouvrir depuis n&apos;importe quel appareil.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs text-brand-bleu/80">
                <code className="break-all font-mono text-[11px]">
                  {SITE_URL}/mon-rapport/{token}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Footer mini */}
        <p className="mt-10 text-center text-[11px] text-neutral-400">
          Rapport généré par IA à partir de tes réponses au quiz. Données chiffrées issues
          de l&apos;INSEE, DVF, MeilleursAgents et SNCF Connect (avril 2026).
        </p>
      </div>
    </div>
  );
}
