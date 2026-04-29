"use client";

import { useEffect, useState } from "react";

/**
 * Barre de progression fine en haut du viewport, qui se remplit au fur
 * et à mesure que l'utilisateur scrolle dans l'article. Aide à
 * l'engagement (l'utilisateur voit qu'il avance) et signal de rétention.
 */
export default function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-20 z-30 h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-iris to-brand-iris-strong transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
