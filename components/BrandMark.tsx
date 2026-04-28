/**
 * Logo "Vivre près de Paris" — SVG vectoriel natif, lisible à toute taille.
 *
 * Composé en 4 plans pour la lisibilité :
 *  1. Pin teardrop (Bleu Minéral) avec fond Blanc Nuage
 *  2. Plan ciel : oiseaux + nuages (haut)
 *  3. Plan illustration : Tour Eiffel + maison + arbres (milieu)
 *  4. Plan sol : chemin lavande (bas)
 *
 * Solides + line-art combinés pour reconnaissance immédiate :
 *  • Toit de la maison plein Bleu Minéral
 *  • Arbres pleins Vert Brume + tronc Bleu Minéral
 *  • Tour Eiffel en silhouette épaissie
 *  • Chemin Iris Doux semi-translucide
 */

type Props = {
  className?: string;
  monochrome?: boolean;
};

export default function BrandMark({ className, monochrome = false }: Props) {
  const bleu = monochrome ? "currentColor" : "#52627A";
  const iris = monochrome ? "currentColor" : "#9D8CF2";
  const vert = monochrome ? "currentColor" : "#AFC6BE";
  const irisSoft = monochrome ? "currentColor" : "rgba(157,140,242,0.55)";

  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vivre près de Paris"
    >
      <defs>
        <clipPath id="pinClip">
          <path d="M50 4 C24 4 8 21 8 44 C8 76 50 126 50 126 C50 126 92 76 92 44 C92 21 76 4 50 4 Z" />
        </clipPath>
      </defs>

      {/* Fond intérieur du pin */}
      <g clipPath="url(#pinClip)">
        <rect width="100" height="130" fill="#F8FAFF" />

        {/* Plan ciel : nuages iris + oiseaux bleu */}
        <g stroke={iris} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M16 26 q3.5 -3 7 0 q2.5 -2.5 5 0" />
          <path d="M21 32 q2.5 -2 5 0 q2 -2 4 0" />
        </g>
        <g stroke={bleu} strokeWidth="1.2" strokeLinecap="round" fill="none">
          <path d="M67 26 q2.4 -2.4 4.8 0 q2.4 -2.4 4.8 0" />
          <path d="M73 33 q2 -2 4 0 q2 -2 4 0" />
          <path d="M67 39 q1.8 -1.8 3.6 0 q1.8 -1.8 3.6 0" />
        </g>

        {/* Plan sol : chemin lavande sinueux */}
        <path
          d="M0 95 Q22 86 46 92 Q72 100 100 88 L100 130 L0 130 Z"
          fill={irisSoft}
        />
        <path
          d="M0 95 Q22 86 46 92 Q72 100 100 88"
          stroke={iris}
          strokeWidth="1.4"
          fill="none"
          opacity="0.75"
        />

        {/* Plan illustration : arbres en arrière-plan */}
        <g>
          {/* Arbre gauche (devant la tour) */}
          <ellipse cx="22" cy="62" rx="7.5" ry="11" fill={vert} />
          <rect x="20.5" y="69" width="3" height="9" fill={bleu} rx="1" />
          {/* Arbre milieu-droit (derrière la maison) */}
          <ellipse cx="74" cy="58" rx="6.5" ry="10" fill={vert} />
          <rect x="72.5" y="64" width="3" height="9" fill={bleu} rx="1" />
          {/* Petit buisson droit */}
          <ellipse cx="84" cy="72" rx="6" ry="5" fill={vert} />
        </g>

        {/* Tour Eiffel — silhouette épaissie */}
        <g stroke={bleu} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Antenne */}
          <line x1="50" y1="13" x2="50" y2="20" strokeWidth="1.1" />
          <circle cx="50" cy="12" r="0.9" fill={bleu} />
          {/* Sommet */}
          <path d="M47.5 22 L50 14 L52.5 22 Z" fill={bleu} stroke="none" />
          {/* Premier étage */}
          <path d="M45 32 L48 22 L52 22 L55 32 Z" fill={bleu} fillOpacity="0.15" />
          <line x1="45" y1="32" x2="55" y2="32" strokeWidth="1.6" />
          {/* Deuxième étage */}
          <path d="M42 44 L45 32 L55 32 L58 44 Z" fill={bleu} fillOpacity="0.1" />
          <line x1="42" y1="44" x2="58" y2="44" strokeWidth="1.6" />
          {/* Bas + arche */}
          <path d="M39 58 L42 44 L58 44 L61 58" />
          <path d="M42 58 Q50 48 58 58" strokeWidth="1.2" />
          {/* Lignes verticales décoratives */}
          <line x1="46" y1="44" x2="46" y2="58" strokeWidth="0.6" opacity="0.6" />
          <line x1="54" y1="44" x2="54" y2="58" strokeWidth="0.6" opacity="0.6" />
          <line x1="50" y1="44" x2="50" y2="58" strokeWidth="0.6" opacity="0.6" />
        </g>

        {/* Maison à toit pentu (devant tour) */}
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Corps */}
          <rect
            x="38"
            y="68"
            width="24"
            height="22"
            fill="white"
            stroke={bleu}
            strokeWidth="1.4"
          />
          {/* Toit pentu */}
          <path
            d="M34 68 L50 51 L66 68 Z"
            fill={bleu}
            stroke={bleu}
            strokeWidth="1.4"
          />
          {/* Cheminée */}
          <rect x="58" y="55" width="4" height="9" fill={bleu} stroke={bleu} strokeWidth="1" />
          {/* Fenêtre 4 carreaux */}
          <rect
            x="44"
            y="74"
            width="12"
            height="12"
            fill="white"
            stroke={bleu}
            strokeWidth="1.1"
          />
          <line x1="50" y1="74" x2="50" y2="86" stroke={bleu} strokeWidth="0.8" />
          <line x1="44" y1="80" x2="56" y2="80" stroke={bleu} strokeWidth="0.8" />
        </g>
      </g>

      {/* Contour pin par-dessus, plus marqué */}
      <path
        d="M50 4 C24 4 8 21 8 44 C8 76 50 126 50 126 C50 126 92 76 92 44 C92 21 76 4 50 4 Z"
        stroke={bleu}
        strokeWidth="2.2"
        fill="none"
      />
    </svg>
  );
}
