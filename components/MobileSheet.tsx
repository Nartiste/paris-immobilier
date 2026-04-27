"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Hauteur max en vh, par défaut 85 */
  maxHeightVh?: number;
};

/**
 * Bottom sheet mobile-first.
 *
 * - Backdrop noir cliquable pour fermer
 * - Drawer en bas, coins arrondis, drag-handle visuelle
 * - Bloque le scroll du body quand ouvert
 * - z-50 pour être au-dessus du contenu mais en dessous des dialogs critiques
 */
export default function MobileSheet({
  open,
  onClose,
  title,
  children,
  maxHeightVh = 85,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t border-neutral-200 bg-white shadow-2xl"
        style={{ maxHeight: `${maxHeightVh}vh` }}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <div className="flex flex-1 justify-center">
            <span
              aria-hidden
              className="block h-1 w-10 rounded-full bg-neutral-300"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          {title ? (
            <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          {children}
        </div>
      </div>
    </div>
  );
}
