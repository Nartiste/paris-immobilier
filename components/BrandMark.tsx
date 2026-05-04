import Image from "next/image";

/**
 * Logo officiel "Vivre près de Paris" — pin emblématique.
 *
 * Source : /public/brand/icon-512.png (pin extrait du logo officiel
 * vivre_pres_de_paris_logo_grand_format.svg, 512×512, optimisé).
 *
 * Le texte "Vivre près de Paris" est rendu en HTML à côté du pin
 * (cf. TopNav) pour rester sélectionnable, accessible et SEO-friendly.
 *
 * Pour les usages monochromes (ex: footer dark), passer monochrome=true
 * applique un filter CSS pour l'aplatir en currentColor.
 */
type Props = {
  className?: string;
  monochrome?: boolean;
  priority?: boolean;
};

export default function BrandMark({ className, monochrome = false, priority = false }: Props) {
  return (
    <Image
      src="/brand/icon-512.png"
      alt="Vivre près de Paris"
      width={64}
      height={64}
      sizes="(min-width: 640px) 64px, 56px"
      priority={priority}
      className={className}
      style={
        monochrome
          ? { filter: "grayscale(1) brightness(0.7) contrast(1.2)" }
          : undefined
      }
    />
  );
}
