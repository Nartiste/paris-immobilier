/**
 * Récupération automatique de l'image principale d'une commune via
 * l'API REST de Wikipedia FR. La quasi-totalité des communes françaises
 * ont une photo libre sur Wikipedia avec attribution (généralement
 * CC-BY-SA via Wikimedia Commons).
 *
 * Cache : 24 h (les photos changent rarement). Appelé côté serveur au
 * build via le ISR de Next.js, donc pas de coût client.
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
 * Stratégie : essayer le nom direct, puis avec disambiguation
 * "(commune française)" si le nom est ambigu.
 */
export async function getCommuneImage(
  communeName: string,
  departement?: string,
): Promise<WikiImage | null> {
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
