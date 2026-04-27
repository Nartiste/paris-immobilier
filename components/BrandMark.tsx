/**
 * Logo "Vivre près de Paris" — SVG vectoriel natif.
 *
 * Hand-drawn paths qui reprennent les éléments de la charte officielle :
 *  • Pin teardrop (Bleu Minéral)
 *  • Tour Eiffel stylisée (Bleu Minéral)
 *  • Maison à toit pentu + cheminée (Bleu Minéral)
 *  • Trois arbres (Vert Brume, deux à droite + un à gauche)
 *  • Trois oiseaux (Bleu Minéral)
 *  • Deux nuages (Iris Doux)
 *  • Chemin lavande (Iris Doux)
 *
 * Avantages vs PNG :
 *  • Scale parfait à toute taille
 *  • Pas de requête HTTP supplémentaire (inline)
 *  • ~4 KB au lieu de 200 KB+
 *  • Couleurs pilotables via prop monochrome
 */

type Props = {
  className?: string;
  /** Couleur unique pour la version monochrome (ex: dark mode). */
  monochrome?: boolean;
  /** Avec étiquette texte à droite (variant horizontal). */
  withText?: boolean;
};

export default function BrandMark({
  className,
  monochrome = false,
  withText = false,
}: Props) {
  const bleu = monochrome ? "currentColor" : "#52627A";
  const iris = monochrome ? "currentColor" : "#9D8CF2";
  const vert = monochrome ? "currentColor" : "#AFC6BE";
  const irisSoft = monochrome ? "currentColor" : "rgba(157,140,242,0.45)";

  if (withText) {
    return (
      <svg
        viewBox="0 0 320 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Vivre près de Paris"
      >
        <g transform="translate(0,0)">
          <PinIllustration bleu={bleu} iris={iris} vert={vert} irisSoft={irisSoft} />
        </g>
        <g transform="translate(120,0)" fill={bleu}>
          <text
            x="0"
            y="60"
            fontFamily="var(--font-fraunces), Georgia, serif"
            fontSize="32"
            fontWeight="500"
          >
            Vivre{" "}
            <tspan fill={iris} fontStyle="italic">
              près
            </tspan>{" "}
            de Paris
          </text>
          <line x1="0" y1="78" x2="20" y2="78" stroke={iris} strokeWidth="1.2" />
          <text
            x="0"
            y="100"
            fontFamily="var(--font-geist-sans), Arial, sans-serif"
            fontSize="9"
            letterSpacing="3"
            fill={bleu}
            opacity="0.7"
          >
            TROUVER SON REFUGE
          </text>
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vivre près de Paris"
    >
      <PinIllustration bleu={bleu} iris={iris} vert={vert} irisSoft={irisSoft} />
    </svg>
  );
}

/**
 * Illustration intérieure du pin (réutilisable pour les variantes).
 */
function PinIllustration({
  bleu,
  iris,
  vert,
  irisSoft,
}: {
  bleu: string;
  iris: string;
  vert: string;
  irisSoft: string;
}) {
  // Un id stable pour le clipPath — unique pour éviter les collisions
  // si plusieurs BrandMark sont rendus dans la même page.
  const clipId = "pinClip";
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d="M50 5 C25 5 10 22 10 45 C10 75 50 125 50 125 C50 125 90 75 90 45 C90 22 75 5 50 5 Z" />
        </clipPath>
      </defs>

      {/* Contenu intérieur clippé par le pin */}
      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="130" fill="white" />

        {/* Chemin lavande au bas du pin */}
        <path
          d="M0 92 Q22 84 45 90 Q70 96 100 86 L100 130 L0 130 Z"
          fill={irisSoft}
        />
        <path
          d="M0 92 Q22 84 45 90 Q70 96 100 86"
          stroke={iris}
          strokeWidth="0.9"
          fill="none"
          opacity="0.7"
        />

        {/* Arbres (Vert Brume) */}
        <g fill={vert}>
          {/* Grand arbre gauche */}
          <ellipse cx="22" cy="60" rx="6" ry="9" />
          <rect x="21" y="65" width="2" height="6" fill={bleu} opacity="0.6" />
          {/* Buisson droit */}
          <ellipse cx="78" cy="68" rx="7" ry="6" />
          {/* Petit arbre derrière la maison */}
          <ellipse cx="74" cy="58" rx="5" ry="7" />
          <rect x="73" y="62" width="2" height="5" fill={bleu} opacity="0.6" />
        </g>

        {/* Maison (Bleu Minéral) */}
        <g
          stroke={bleu}
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* Corps */}
          <rect x="40" y="64" width="22" height="22" fill="white" />
          {/* Toit triangle plein */}
          <path d="M37 64 L51 49 L65 64 Z" fill={bleu} />
          {/* Cheminée */}
          <path d="M58 56 L58 49 L62 49 L62 60" fill={bleu} />
          {/* Fenêtre */}
          <rect x="46" y="70" width="10" height="10" fill="white" strokeWidth="0.8" />
          <line x1="51" y1="70" x2="51" y2="80" strokeWidth="0.6" />
          <line x1="46" y1="75" x2="56" y2="75" strokeWidth="0.6" />
        </g>

        {/* Tour Eiffel (Bleu Minéral) */}
        <g
          stroke={bleu}
          strokeWidth="1.0"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Antenne sommet */}
          <line x1="50" y1="14" x2="50" y2="20" strokeWidth="0.8" />
          <circle cx="50" cy="13" r="0.7" fill={bleu} />
          {/* Pointe haute (en triangle aigu) */}
          <path d="M48 22 L50 14 L52 22" />
          {/* Premier étage */}
          <path d="M46 30 L48 22 L52 22 L54 30" />
          <line x1="46.5" y1="30" x2="53.5" y2="30" />
          {/* Deuxième étage */}
          <path d="M44 40 L46 30 L54 30 L56 40" />
          <line x1="44.5" y1="40" x2="55.5" y2="40" />
          {/* Étage bas + arche */}
          <path d="M42 52 L44 40 L56 40 L58 52" />
          <path d="M44 52 Q50 44 56 52" />
          {/* Lignes verticales décoratives */}
          <line x1="48" y1="40" x2="48" y2="52" strokeWidth="0.5" />
          <line x1="52" y1="40" x2="52" y2="52" strokeWidth="0.5" />
        </g>

        {/* Oiseaux (Bleu Minéral, en haut à droite) */}
        <g
          stroke={bleu}
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M68 26 q2.2 -2.2 4.4 0 q2.2 -2.2 4.4 0" />
          <path d="M73 33 q1.8 -1.8 3.6 0 q1.8 -1.8 3.6 0" />
          <path d="M68 38 q1.6 -1.6 3.2 0 q1.6 -1.6 3.2 0" />
        </g>

        {/* Nuages (Iris Doux, en haut à gauche) */}
        <g
          stroke={iris}
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        >
          <path d="M18 24 q3.2 -3 6.4 0 q2 -2 4 0" />
          <path d="M22 30 q2 -2 4 0 q1.6 -1.6 3.2 0" />
        </g>
      </g>

      {/* Contour du pin par-dessus */}
      <path
        d="M50 5 C25 5 10 22 10 45 C10 75 50 125 50 125 C50 125 90 75 90 45 C90 22 75 5 50 5 Z"
        stroke={bleu}
        strokeWidth="1.6"
        fill="none"
      />
    </g>
  );
}
