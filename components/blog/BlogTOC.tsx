"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/**
 * Table des matières sticky côté droit (desktop). Surveille les sections
 * H2 via IntersectionObserver et met en avant la section actuellement
 * lue. Aide à la rétention et à la navigation dans les articles longs.
 */
export default function BlogTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Sommaire de l'article" className="text-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bleu/50">
        Sommaire
      </p>
      <ol className="space-y-2 border-l border-brand-bleu/10">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block border-l-2 pl-3 -ml-px py-0.5 leading-snug transition-colors ${
                activeId === h.id
                  ? "border-brand-iris text-brand-bleu font-medium"
                  : "border-transparent text-brand-bleu/60 hover:text-brand-bleu"
              }`}
            >
              <span className="mr-1.5 text-[11px] tabular-nums text-brand-bleu/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
