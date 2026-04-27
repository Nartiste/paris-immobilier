"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Check } from "lucide-react";
import type { Commune } from "@/lib/types";

type Props = {
  /** Liste des communes parmi lesquelles choisir. */
  communes: Commune[];
  /** Commune actuellement sélectionnée. */
  value: Commune | null;
  /** Appelé quand l'utilisateur sélectionne une commune. */
  onChange: (c: Commune | null) => void;
  /** Placeholder du champ de recherche. */
  placeholder?: string;
  /** Label affiché au-dessus. */
  label?: string;
  /** INSEE codes à exclure (ex : commune A déjà sélectionnée). */
  excludeInsee?: string[];
};

/**
 * Combobox d'autocomplete sur la liste des SAMPLE_COMMUNES.
 *
 * UX :
 *  - Click sur le champ → liste s'ouvre, montre top 12 communes
 *  - Tape → filtre par nom (insensible aux accents/case)
 *  - Click sur un résultat → sélectionne + ferme
 *  - Bouton X efface la sélection
 *  - Click hors du composant ferme la liste
 */
export default function CommuneSelect({
  communes,
  value,
  onChange,
  placeholder = "Choisir une ville…",
  label,
  excludeInsee = [],
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

  const filtered = useMemo(() => {
    const q = norm(query);
    return communes
      .filter((c) => !excludeInsee.includes(c.code_insee))
      .filter((c) => (q ? norm(c.nom).includes(q) : true))
      .slice(0, 30);
  }, [communes, query, excludeInsee]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-brand-bleu">
          {label}
        </label>
      )}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-bleu/50" />
        <input
          type="text"
          value={value ? value.nom : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (value) onChange(null); // si on retape, on dé-sélectionne
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-brand-bleu/15 bg-white py-3 pl-10 pr-10 text-sm text-brand-bleu placeholder:text-brand-bleu/40 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
        />
        {(value || query) && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-brand-bleu/40 hover:bg-brand-iris-soft hover:text-brand-bleu"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-brand-bleu/10 bg-white shadow-[0_8px_24px_rgba(82,98,122,0.12)]">
          <ul className="py-1.5">
            {filtered.map((c) => (
              <li key={c.code_insee}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-brand-bleu hover:bg-brand-iris-soft"
                >
                  <span className="flex-1 truncate">
                    <span className="font-medium">{c.nom}</span>
                    <span className="ml-2 text-[11px] text-brand-bleu/50">
                      {c.code_postal} · {c.departement}
                    </span>
                  </span>
                  <span className="flex-shrink-0 text-[11px] text-brand-bleu/60 tabular-nums">
                    {c.temps_trajet_paris_min}min
                  </span>
                  {value?.code_insee === c.code_insee && (
                    <Check className="h-3.5 w-3.5 text-brand-iris" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && filtered.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-brand-bleu/10 bg-white p-4 text-center text-xs text-brand-bleu/50 shadow-[0_8px_24px_rgba(82,98,122,0.12)]">
          Aucune commune trouvée pour « {query} »
        </div>
      )}
    </div>
  );
}
