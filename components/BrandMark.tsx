import Image from "next/image";

/**
 * Logo "Vivre près de Paris" — version officielle de la charte.
 *
 * Variants disponibles :
 *  - "icon" : juste le pin (idéal navbar / favicon / app icon)
 *  - "full" : pin + texte + tagline (idéal hero, marketing)
 *
 * Sources préparées dans /public/brand/ :
 *  - icon-128.png (~21 KB), icon-192.png, icon-512.png
 *  - logo-1200.png (full)
 *  - og.png (1200×630, pour OpenGraph)
 *
 * Next/Image gère automatiquement la conversion en WebP/AVIF + le
 * lazy-loading + le srcset par taille d'écran.
 */

type Props = {
  className?: string;
  /** Taille en pixels affichée. Next/Image servira la résolution adaptée. */
  size?: number;
  variant?: "icon" | "full";
  priority?: boolean;
};

export default function BrandMark({
  className,
  size = 40,
  variant = "icon",
  priority = false,
}: Props) {
  if (variant === "full") {
    return (
      <Image
        src="/brand/logo-1200.png"
        alt="Vivre près de Paris"
        width={1200}
        height={925}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src="/brand/icon-512.png"
      alt="Vivre près de Paris"
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}
