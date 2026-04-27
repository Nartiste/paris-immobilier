import Link from "next/link";
import { Train, ChevronRight } from "lucide-react";
import {
  matchLines,
  reputationColor,
  reputationLabel,
  type TransportLine,
} from "@/lib/transport-lines";

type Props = {
  ligneStr: string | null | undefined;
  /** Si true, rendu compact (pour la CommuneCard) sinon complet (pages SEO). */
  compact?: boolean;
};

export default function TransportPanel({ ligneStr, compact = false }: Props) {
  const lines = matchLines(ligneStr);

  if (lines.length === 0) return null;

  if (compact) {
    return (
      <div className="border-t border-neutral-100 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">
            Lignes de transport
          </span>
        </div>
        <div className="space-y-1.5">
          {lines.slice(0, 3).map((l) => (
            <CompactLineRow key={l.id} line={l} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-neutral-900">
        Comment tu rejoins Paris
      </h2>
      <p className="text-sm text-neutral-600">
        {lines.length === 1
          ? "Une ligne principale dessert cette commune. Voici sa réputation et ses caractéristiques."
          : `${lines.length} lignes principales desservent cette commune. Voici leurs réputations.`}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {lines.map((l) => (
          <LineCard key={l.id} line={l} />
        ))}
      </div>
    </section>
  );
}

function CompactLineRow({ line }: { line: TransportLine }) {
  const color = reputationColor(line.reputation.score);
  return (
    <Link
      href={`/lignes/${line.id}`}
      className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 hover:border-neutral-300"
    >
      <Train className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
      <span className="flex-shrink-0 text-xs font-semibold text-neutral-900">
        {line.code}
      </span>
      <span
        className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {line.reputation.score}/5
      </span>
      <span className="min-w-0 flex-1 truncate text-[11px] text-neutral-500">
        {line.reputation.tags.slice(0, 2).join(" · ")}
      </span>
      <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-neutral-300" />
    </Link>
  );
}

function LineCard({ line }: { line: TransportLine }) {
  const color = reputationColor(line.reputation.score);
  return (
    <Link
      href={`/lignes/${line.id}`}
      className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold text-neutral-900">
          {line.code}
        </span>
        <span
          className="rounded-md px-2 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {line.reputation.score}/5 · {reputationLabel(line.reputation.score)}
        </span>
      </div>
      <p className="mt-1 text-xs text-neutral-500">
        Vers {line.terminusParis}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">
        {line.reputation.summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {line.reputation.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-700">
        En savoir plus sur la {line.code}
        <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
