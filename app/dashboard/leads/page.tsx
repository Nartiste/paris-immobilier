import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";

/**
 * Dashboard interne "leads ville-attribuables".
 *
 * Agrège les rapports IA personnels par commune recommandée (communes_insee)
 * pour montrer, ville par ville, combien d'acheteurs intentionnistes le Hub a
 * générés. C'est le KPI qui sert à vendre puis renouveler le slot référent
 * d'un agent ("ta ville t'a apporté X contacts ce mois-ci").
 *
 * Accès : gated par un token (env ADMIN_DASHBOARD_TOKEN, passé en ?token=).
 * noindex, force-dynamic, emails masqués par défaut (le détail complet reste
 * dans Supabase). Pensé pour être montrable en capture à un agent prospect.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads par ville",
  robots: { index: false, follow: false },
};

type QuizAnswers = {
  profil?: string;
  frequenceParis?: string;
  budgetMode?: string;
  budgetValue?: number;
  surfaceVisee?: number;
  villeEnvisagee?: string | null;
};

type ReportRow = {
  prenom: string;
  email: string;
  quiz_answers: QuizAnswers;
  communes_insee: string[] | null;
  created_at: string;
  views_count: number;
};

const INSEE_TO_NAME = new Map(SAMPLE_COMMUNES.map((c) => [c.code_insee, c.nom]));

// Emails internes / QA exclus par défaut (ne polluent pas les vrais leads).
// Domaine de l'équipe + convention des tests de diagnostic (diag-*).
const TEST_EMAIL_DOMAINS = ["prception.co"];
function isTestEmail(email: string): boolean {
  const e = (email ?? "").toLowerCase();
  if (e.startsWith("diag-")) return true;
  return TEST_EMAIL_DOMAINS.some((d) => e.endsWith("@" + d));
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const head = user.slice(0, 1);
  return `${head}${"*".repeat(Math.max(2, user.length - 1))}@${domain}`;
}

function formatBudget(q: QuizAnswers): string {
  if (q.budgetValue == null) return "n.c.";
  const v = q.budgetValue.toLocaleString("fr-FR");
  switch (q.budgetMode) {
    case "mensualite":
      return `${v} €/mois`;
    case "loyer":
      return `${v} €/mois (loyer)`;
    case "m2_achat":
      return `${v} €/m²`;
    default:
      return `${v} €`;
  }
}

function avgBudgetMensualite(reports: ReportRow[]): number | null {
  const vals = reports
    .map((r) => r.quiz_answers)
    .filter((q) => q.budgetMode === "mensualite" && typeof q.budgetValue === "number")
    .map((q) => q.budgetValue as number);
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

type CityAgg = {
  insee: string;
  name: string;
  total: number; // apparitions dans communes_insee (verdict + backups)
  asVerdict: number; // fois où c'est le verdict principal (index 0)
  reports: ReportRow[];
};

export default async function LeadsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; test?: string }>;
}) {
  const { token, test } = await searchParams;
  const includeTest = test === "1";
  const expected = process.env.ADMIN_DASHBOARD_TOKEN;

  // Refus si pas de token configuré ou mauvais token : pas d'exposition accidentelle.
  if (!expected || token !== expected) {
    notFound();
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("personal_reports")
    .select("prenom, email, quiz_answers, communes_insee, created_at, views_count")
    .order("created_at", { ascending: false })
    .limit(1000);

  const reports = (error || !data ? [] : (data as ReportRow[])).filter(
    (r) => r.quiz_answers != null && (includeTest || !isTestEmail(r.email)),
  );

  // Agrégation par commune recommandée
  const byCity = new Map<string, CityAgg>();
  for (const r of reports) {
    const inseeList = r.communes_insee ?? [];
    inseeList.forEach((insee, idx) => {
      if (!insee) return;
      let agg = byCity.get(insee);
      if (!agg) {
        agg = {
          insee,
          name: INSEE_TO_NAME.get(insee) ?? insee,
          total: 0,
          asVerdict: 0,
          reports: [],
        };
        byCity.set(insee, agg);
      }
      agg.total += 1;
      if (idx === 0) agg.asVerdict += 1;
      agg.reports.push(r);
    });
  }

  const cities = [...byCity.values()].sort((a, b) => b.total - a.total);
  const totalReports = reports.length;
  const lastDate = reports[0]?.created_at;

  return (
    <div className="min-h-screen bg-neutral-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-iris-strong">
            Dashboard interne
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium text-brand-bleu">
            Leads par ville
          </h1>
          <p className="mt-2 text-sm text-brand-bleu/70">
            {totalReports} rapports IA générés
            {lastDate
              ? ` · dernier le ${new Date(lastDate).toLocaleDateString("fr-FR")}`
              : ""}
            . Chaque rapport recommande 3 communes (1 verdict + 2 alternatives),
            comptées comme leads attribuables à ces villes.
          </p>
        </header>

        {cities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">
            Aucun lead pour le moment. Les rapports IA générés via le quiz
            apparaîtront ici, agrégés par ville recommandée.
          </div>
        ) : (
          <>
            {/* Cartes par ville */}
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => {
                const avg = avgBudgetMensualite(c.reports);
                return (
                  <div
                    key={c.insee}
                    className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.05)]"
                  >
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-display text-lg font-medium text-brand-bleu">
                        {c.name}
                      </h2>
                      <span className="text-2xl font-bold tabular-nums text-brand-iris-strong">
                        {c.total}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-400">
                      leads attribuables
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-brand-bleu/75">
                      <div className="flex justify-between">
                        <span>Dont verdict principal</span>
                        <span className="font-semibold tabular-nums">
                          {c.asVerdict}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget moyen (mensualité)</span>
                        <span className="font-semibold tabular-nums">
                          {avg ? `${avg.toLocaleString("fr-FR")} €/mois` : "n.c."}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Détail des leads récents */}
            <section className="mt-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-bleu/60">
                Leads récents (50 derniers)
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 text-left text-[11px] uppercase tracking-wider text-brand-bleu/60">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Date</th>
                      <th className="px-4 py-2.5 font-semibold">Prénom</th>
                      <th className="px-4 py-2.5 font-semibold">Email</th>
                      <th className="px-4 py-2.5 font-semibold">Profil</th>
                      <th className="px-4 py-2.5 font-semibold">Budget</th>
                      <th className="px-4 py-2.5 font-semibold">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 50).map((r, i) => {
                      const verdictInsee = (r.communes_insee ?? [])[0];
                      const verdict = verdictInsee
                        ? INSEE_TO_NAME.get(verdictInsee) ?? verdictInsee
                        : "n.c.";
                      return (
                        <tr key={i} className="border-t border-neutral-100">
                          <td className="px-4 py-2.5 tabular-nums text-neutral-500">
                            {new Date(r.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-2.5 text-neutral-800">
                            {r.prenom}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-neutral-500">
                            {maskEmail(r.email)}
                          </td>
                          <td className="px-4 py-2.5 text-neutral-600">
                            {r.quiz_answers.profil ?? "n.c."}
                          </td>
                          <td className="px-4 py-2.5 tabular-nums text-neutral-600">
                            {formatBudget(r.quiz_answers)}
                          </td>
                          <td className="px-4 py-2.5 font-medium text-brand-bleu">
                            {verdict}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <p className="mt-8 text-[11px] text-neutral-400">
          Emails masqués pour la confidentialité. Détail complet dans Supabase.
          Page non indexée, accès par token.{" "}
          {includeTest
            ? "Mode test : emails internes (prception.co, diag-) inclus."
            : "Emails internes (prception.co, diag-) exclus. Ajoute ?test=1 pour les réafficher."}
        </p>
      </div>
    </div>
  );
}
