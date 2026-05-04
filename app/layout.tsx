import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import TopNav from "@/components/TopNav";
import dynamic from "next/dynamic";

// Le bouton flottant + le panneau Concierge sont lazy : non critiques
// au LCP, chargés en parallèle après le first paint.
const ConciergeButton = dynamic(() => import("@/components/ConciergeButton"));
const Concierge = dynamic(() => import("@/components/Concierge"));
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fraunces : serif moderne, italiques élégantes, parfait pour les titres
// "premium / refuge" de la charte graphique.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vivre près de Paris — Comparateur des villes pour quitter Paris",
    template: "%s | Vivre près de Paris",
  },
  description:
    "Tu rêves de quitter Paris ? On compare 80+ communes selon le prix immobilier, le temps de trajet (TGV, RER, voiture), la qualité de vie et le Grand Paris Express. Avec un concierge IA pour t'aider à choisir.",
  keywords: [
    "vivre près de Paris",
    "quitter Paris",
    "où vivre près de Paris",
    "comparateur communes",
    "déménager de Paris",
    "immobilier Île-de-France",
    "prix m² 2026",
    "Grand Paris Express",
    "vivre en banlieue parisienne",
    "TGV Paris",
    "RER B avis",
    "RER E",
    "ville à 30 minutes de Paris",
  ],
  authors: [{ name: "Vivre près de Paris" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Vivre près de Paris",
    title: "Vivre près de Paris — Comparateur des villes pour quitter Paris",
    description:
      "Compare 80+ communes pour quitter Paris : prix m², temps de trajet, qualité de vie, futures gares Grand Paris Express. Concierge IA inclus.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Vivre près de Paris" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivre près de Paris — Comparateur des villes",
    description:
      "Tu cherches où vivre près de Paris ? On compare prix, transports, qualité de vie pour t'aider à choisir.",
    images: ["/brand/og.png"],
  },
  icons: {
    icon: [
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/brand/icon-192.png", sizes: "192x192" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
// URL du script Plausible "tagged" propre au site (généré par Plausible
// quand on coche outbound-links / file-downloads / form-submissions).
// Si non défini, on retombe sur le script générique avec data-domain.
const PLAUSIBLE_SCRIPT_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC;

// Google Tag Manager. Format attendu : "GTM-XXXXXXX".
// Si non défini, aucun script GTM n'est chargé.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect : économise ~300 ms LCP sur les origines tierces */}
        <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://a.tile.openstreetmap.org" crossOrigin="anonymous" />
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "Vivre près de Paris",
                  url: SITE_URL,
                  description:
                    "Comparateur indépendant de communes pour les Parisiens en réflexion sur leur déménagement. Données DVF, INSEE, SNCF, IDFM.",
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Vivre près de Paris",
                  description:
                    "Compare 80+ communes pour quitter Paris : prix m², trajet vers Paris, qualité de vie, futures gares Grand Paris Express.",
                  inLanguage: "fr-FR",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        <TopNav />
        {children}
        <ConciergeButton />
        <Concierge />
        {PLAUSIBLE_SCRIPT_SRC ? (
          <>
            <Script async src={PLAUSIBLE_SCRIPT_SRC} strategy="lazyOnload" />
            <Script id="plausible-init" strategy="lazyOnload">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({});`}
            </Script>
          </>
        ) : PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
