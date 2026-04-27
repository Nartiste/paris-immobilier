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
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paris-immobilier-git-main-prception.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Où vivre près de Paris ? Comparateur de communes 2026",
    template: "%s | Paris Immobilier",
  },
  description:
    "Comparez plus de 80 communes selon le prix immobilier, le temps de trajet vers Paris (TGV, RER, voiture), la qualité de vie et les futures gares du Grand Paris Express. Concierge IA gratuit.",
  keywords: [
    "où vivre près de Paris",
    "comparateur communes",
    "quitter Paris",
    "immobilier Île-de-France",
    "prix m² 2026",
    "Grand Paris Express",
    "vivre en banlieue parisienne",
    "TGV Paris",
    "RER",
  ],
  authors: [{ name: "Paris Immobilier" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Paris Immobilier",
    title: "Où vivre près de Paris ? Comparateur de communes 2026",
    description:
      "Comparez +80 communes : prix m², temps Paris, qualité de vie, futures gares Grand Paris Express. Concierge IA inclus.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Où vivre près de Paris ? — Paris Immobilier",
    description:
      "Le comparateur de communes pour Parisiens en quête d'air frais. Données réelles, IA, gratuit.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

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
        {children}
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
