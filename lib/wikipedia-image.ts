/**
 * Récupération automatique de l'image principale d'une commune via
 * l'API REST de Wikipedia FR. La quasi-totalité des communes françaises
 * ont une photo libre sur Wikipedia avec attribution (généralement
 * CC-BY-SA via Wikimedia Commons).
 *
 * Cache : 24 h (les photos changent rarement). Appelé côté serveur au
 * build via le ISR de Next.js, donc pas de coût client.
 *
 * Override : pour les communes "vitrines" où on veut une photo garantie
 * (pas de dépendance build-time à Wikipedia, qui peut rate-limit), on
 * hardcode l'URL Wikimedia Commons dans COMMUNE_IMAGE_OVERRIDES.
 */

export type WikiImage = {
  /** URL de la version réduite (640px max par défaut Wikipedia) */
  thumbnail: string;
  /** URL de l'image originale (résolution max) */
  original: string;
  /** Crédit textuel à afficher */
  credit: string;
  /** Lien vers l'article Wikipedia source */
  sourceUrl: string;
};

/**
 * Overrides hardcodés par code INSEE. Utile pour :
 *  - Garantir une photo sur les communes vitrines (Annecy, Chambéry, etc.)
 *    sans dépendre du build-time fetch Wikipedia (rate-limits possibles).
 *  - Choisir une photo plus représentative que celle par défaut de l'article.
 *
 * Les URL pointent directement sur upload.wikimedia.org (whitelisté dans
 * next.config.ts → next/image optimise en WebP/AVIF automatiquement).
 */
const COMMUNE_IMAGE_OVERRIDES: Record<string, WikiImage> = {
  "74010": {
    // Annecy : vue panoramique du lac et de la vieille ville
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Annecy%2C_France_%2837635411615%29.jpg/1280px-Annecy%2C_France_%2837635411615%29.jpg",
    original:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Annecy%2C_France_%2837635411615%29.jpg/3840px-Annecy%2C_France_%2837635411615%29.jpg",
    credit: "Photo : Wikipedia · Annecy",
    sourceUrl: "https://fr.wikipedia.org/wiki/Annecy",
  },
  "73065": {
    // Chambéry : vue depuis les monts vers le centre-ville
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chamb%C3%A9ry_depuis_les_Monts.JPG/1280px-Chamb%C3%A9ry_depuis_les_Monts.JPG",
    original:
      "https://upload.wikimedia.org/wikipedia/commons/9/98/Chamb%C3%A9ry_depuis_les_Monts.JPG",
    credit: "Photo : Wikipedia · Chambéry",
    sourceUrl: "https://fr.wikipedia.org/wiki/Chamb%C3%A9ry",
  },
  "73008": {
    // Aix-les-Bains : vue de la ville et du lac du Bourget depuis le Revard
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Aix-les-Bains_depuis_Revard_%28mars_2021%29.jpg/1280px-Aix-les-Bains_depuis_Revard_%28mars_2021%29.jpg",
    original:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Aix-les-Bains_depuis_Revard_%28mars_2021%29.jpg/3840px-Aix-les-Bains_depuis_Revard_%28mars_2021%29.jpg",
    credit: "Photo : Wikipedia · Aix-les-Bains",
    sourceUrl: "https://fr.wikipedia.org/wiki/Aix-les-Bains",
  },
};

type WikiSummaryResponse = {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  titles?: { normalized: string };
  content_urls?: { desktop?: { page: string } };
};

/**
 * Fetch l'image principale d'une page Wikipedia FR.
 * Returns null si pas de page ou pas d'image.
 */
export async function getWikipediaImage(
  pageTitle: string,
): Promise<WikiImage | null> {
  try {
    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache 24 h
      headers: {
        "User-Agent": "VivrePresDeParis/1.0 (https://vivre-pres-de-paris.fr)",
      },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as WikiSummaryResponse;

    if (!data.thumbnail?.source) return null;

    return {
      thumbnail: data.thumbnail.source,
      original: data.originalimage?.source ?? data.thumbnail.source,
      credit: `Photo : Wikipedia · ${data.titles?.normalized ?? pageTitle}`,
      sourceUrl:
        data.content_urls?.desktop?.page ??
        `https://fr.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
    };
  } catch {
    return null;
  }
}

/**
 * Tentatives multiples pour trouver l'image d'une commune.
 * Stratégie : override INSEE (déterministe, prioritaire), puis nom direct,
 * puis disambiguation "(commune française)" si le nom est ambigu.
 */
export async function getCommuneImage(
  communeName: string,
  departement?: string,
  insee?: string,
): Promise<WikiImage | null> {
  // 0. Override hardcodé prioritaire (pas de fetch, pas de risque rate-limit)
  if (insee && COMMUNE_IMAGE_OVERRIDES[insee]) {
    return COMMUNE_IMAGE_OVERRIDES[insee];
  }

  // 1ère tentative : nom direct
  const direct = await getWikipediaImage(communeName);
  if (direct) return direct;

  // 2e tentative : avec disambiguation département
  if (departement) {
    const withDept = await getWikipediaImage(`${communeName} (${departement})`);
    if (withDept) return withDept;
  }

  // 3e tentative : disambiguation générique
  const withDisambig = await getWikipediaImage(
    `${communeName} (commune française)`,
  );
  if (withDisambig) return withDisambig;

  return null;
}
