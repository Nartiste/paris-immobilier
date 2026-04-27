/**
 * Logo "Vivre près de Paris" — version SVG line-art pour usage UI.
 *
 * Reprend les éléments clés de la charte :
 *  • Pin teardrop en Bleu Minéral
 *  • Tour Eiffel + maison à toit pentu (Bleu Minéral)
 *  • Deux arbres (Vert Brume)
 *  • Petits oiseaux + nuage (touches Iris Doux)
 *  • Chemin lavande (Iris Doux)
 *
 * Pour la version pixel-perfect (rendu watercolor), exporter le logo
 * officiel en SVG ou PNG haute résolution dans /public/brand/logo.svg
 * et remplacer ce composant par <Image src="/brand/logo.svg" /> ou
 * inliner le SVG officiel.
 */
type Props = {
  className?: string;
  monochrome?: boolean;
};

export default function BrandMark({ className, monochrome = false }: Props) {
  const bleu = monochrome ? "currentColor" : "var(--brand-bleu)";
  const iris = monochrome ? "currentColor" : "var(--brand-iris)";
  const vert = monochrome ? "currentColor" : "var(--brand-vert)";

  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Pin teardrop */}
      <path
        d="M40 4 C22 4 10 16 10 32 C10 56 40 96 40 96 C40 96 70 56 70 32 C70 16 58 4 40 4 Z"
        fill="white"
        stroke={bleu}
        strokeWidth="1.7"
      />

      {/* Oiseaux décoratifs */}
      <g stroke={bleu} strokeWidth="0.7" opacity="0.85">
        <path d="M53 21 q1.5 -1.5 3 0 q1.5 -1.5 3 0" />
        <path d="M59 26 q1 -1 2 0 q1 -1 2 0" />
        <path d="M55 28 q1 -1 2 0 q1 -1 2 0" />
      </g>

      {/* Petits nuages (iris doux) */}
      <g stroke={iris} strokeWidth="0.7" opacity="0.55">
        <path d="M19 25 q3 -2.5 6 0 q2 -2 4 0" />
        <path d="M22 30 q2 -1.5 4 0" />
      </g>

      {/* Tour Eiffel */}
      <g stroke={bleu} strokeWidth="1.1" fill="none">
        <path d="M37 38 L40 16 L43 38" />
        <path d="M39 26 L41 26" />
        <path d="M38.4 30 L41.6 30" />
        <path d="M37.5 34 L42.5 34" />
        <path d="M36.5 38 L43.5 38" />
      </g>

      {/* Maison avec toit pentu + cheminée */}
      <g stroke={bleu} strokeWidth="1.4" fill="none" strokeLinejoin="round">
        <path d="M30 56 L42 44 L54 56" />
        <path d="M48 47 L48 43 L51 43 L51 50" />
        <path d="M33 56 L33 66 L51 66 L51 56" />
        <rect x="38" y="58" width="6" height="6" rx="0.5" />
      </g>

      {/* Arbres latéraux */}
      <g stroke={vert} strokeWidth="1.2" fill="none">
        <path d="M22 60 q-3 -8 0 -14 q3 6 0 14" />
        <path d="M22 60 L22 66" />
        <path d="M58 62 q-3 -8 0 -14 q3 6 0 14" />
        <path d="M58 62 L58 68" />
      </g>

      {/* Chemin lavande au bas du pin */}
      <path
        d="M22 75 q6 -4 14 0 q8 4 22 -2"
        stroke={iris}
        strokeWidth="3"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M22 75 q6 -4 14 0 q8 4 22 -2"
        stroke={iris}
        strokeWidth="1.2"
        opacity="0.85"
      />
    </svg>
  );
}
