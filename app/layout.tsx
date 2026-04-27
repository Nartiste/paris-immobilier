import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivre près de Paris — Comparateur des villes",
    description:
      "Tu cherches où vivre près de Paris ? On compare prix, transports, qualité de vie pour t'aider à choisir.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
// URL du script Plausible "tagged" propre au site (généré par Plausible
// quand on coche outbound-links / file-downloads / form-submissions).
// Si non défini, on retombe sur le script générique avec data-domain.
const PLAUSIBLE_SCRIPT_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
        {children}
        {PLAUSIBLE_SCRIPT_SRC ? (
          <>
            <Script async src={PLAUSIBLE_SCRIPT_SRC} strategy="afterInteractive" />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({});`}
            </Script>
          </>
        ) : PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
