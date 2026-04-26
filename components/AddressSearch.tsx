"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { AddressFeature } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  onSelect: (feature: AddressFeature) => void;
};

export default function AddressSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [features, setFeatures] = useState<AddressFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) {
      setFeatures([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setFeatures(data.features ?? []);
        setOpen(true);
      } catch {
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => features.length > 0 && setOpen(true)}
          placeholder="Rechercher une adresse, ville, code postal…"
          className={cn(
            "w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-9 text-sm",
            "placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none",
            "shadow-sm transition-colors",
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setFeatures([]);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (features.length > 0 || loading) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {loading && (
            <div className="px-3 py-2 text-xs text-neutral-500">
              Recherche…
            </div>
          )}
          {features.map((f, i) => (
            <button
              key={`${f.label}-${i}`}
              onClick={() => {
                onSelect(f);
                setQuery(f.label);
                setOpen(false);
              }}
              className="flex w-full items-start gap-2 border-b border-neutral-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-neutral-50"
            >
              <span className="mt-0.5 text-neutral-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1">
                <div className="font-medium text-neutral-900">{f.label}</div>
                <div className="text-xs text-neutral-500">
                  {f.postcode} {f.city}
                </div>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
