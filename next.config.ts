import type { NextConfig } from "next";
import path from "node:path";

/**
 * Anciens slugs /vivre-a/ portant un code INSEE erroné (fiches indexées),
 * corrigés le 2026-08-28 après croisement avec geo.api.gouv.fr.
 * Ne pas supprimer : les redirections permanentes préservent l'indexation.
 * Cas particulier : Issoncourt, commune fusionnée, pointe vers
 * Les Trois-Domaines (55254), la commune actuelle.
 */
const LEGACY_VIVRE_A_SLUGS: Array<[string, string]> = [
  ["etampes-91174", "etampes-91223"],
  ["palaiseau-91471", "palaiseau-91477"],
  ["nemours-77316", "nemours-77333"],
  ["coulommiers-77442", "coulommiers-77131"],
  ["montargis-45253", "montargis-45208"],
  ["sance-71410", "sance-71497"],
  ["prisse-71353", "prisse-71360"],
  ["davaye-71158", "davaye-71169"],
  ["vergisson-71569", "vergisson-71567"],
  ["solutre-pouilly-71527", "solutre-pouilly-71526"],
  ["saint-ouen-41212", "saint-ouen-41226"],
  ["naveil-41152", "naveil-41158"],
  ["meslay-41135", "meslay-41138"],
  ["yvre-l-eveque-72381", "yvre-l-eveque-72386"],
  ["coulaines-72088", "coulaines-72095"],
  ["saint-pavace-72279", "saint-pavace-72310"],
  ["champagne-72059", "champagne-72054"],
  ["sarge-les-le-mans-72325", "sarge-les-le-mans-72328"],
  ["vernou-sur-brenne-37272", "vernou-sur-brenne-37270"],
  ["larcay-37127", "larcay-37124"],
  ["trelaze-49328", "trelaze-49353"],
  ["sainte-gemmes-sur-loire-49284", "sainte-gemmes-sur-loire-49278"],
  ["saint-gregoire-35275", "saint-gregoire-35278"],
  ["migne-auxances-86157", "migne-auxances-86158"],
  ["vouneuil-sous-biard-86294", "vouneuil-sous-biard-86297"],
  ["naintre-86169", "naintre-86174"],
  ["cenon-sur-vienne-86048", "cenon-sur-vienne-86046"],
  ["ingrandes-86113", "ingrandes-86111"],
  ["sainte-catherine-62739", "sainte-catherine-62744"],
  ["anzin-saint-aubin-62034", "anzin-saint-aubin-62037"],
  ["beaurains-62091", "beaurains-62099"],
  ["wailly-62867", "wailly-62869"],
  ["wattignies-59650", "wattignies-59648"],
  ["sin-le-noble-59544", "sin-le-noble-59569"],
  ["lambres-lez-douai-59325", "lambres-lez-douai-59329"],
  ["bezannes-51055", "bezannes-51058"],
  ["champfleury-51118", "champfleury-51115"],
  ["trois-puits-51579", "trois-puits-51584"],
  ["les-mesneux-51364", "les-mesneux-51365"],
  ["issoncourt-55259", "les-trois-domaines-55254"],
  ["lemmes-55289", "lemmes-55286"],
  ["recourt-le-creux-55410", "recourt-le-creux-55420"],
  ["saint-memmie-51519", "saint-memmie-51506"],
  ["compertrix-51161", "compertrix-51160"],
  ["sarry-51531", "sarry-51525"],
  ["louvigny-57418", "louvigny-57422"],
  ["cheminot-57139", "cheminot-57137"],
  ["pagny-les-goin-57514", "pagny-les-goin-57532"],
  ["augny-57017", "augny-57039"],
  ["montchanin-71307", "montchanin-71310"],
  ["saint-laurent-d-andenay-71462", "saint-laurent-d-andenay-71436"],
  ["ecuisses-71193", "ecuisses-71187"],
  ["saint-remy-71437", "saint-remy-71475"],
  ["chatenoy-le-royal-71103", "chatenoy-le-royal-71118"],
  ["crissey-71153", "crissey-71154"],
  ["maromme-76414", "maromme-76410"],
  ["pommard-21505", "pommard-21492"],
  ["volnay-21630", "volnay-21712"],
  ["meursault-21426", "meursault-21412"],
  ["schiltigheim-67482", "schiltigheim-67447"],
  ["eckbolsheim-67152", "eckbolsheim-67118"],
  ["h-nheim-67212", "h-nheim-67204"],
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Autoriser les photos Wikipedia / Wikimedia Commons (haute résolution
    // optimisée auto en WebP/AVIF par next/image).
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
  },
  async redirects() {
    return LEGACY_VIVRE_A_SLUGS.map(([oldSlug, newSlug]) => ({
      source: `/vivre-a/${oldSlug}`,
      destination: `/vivre-a/${newSlug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
