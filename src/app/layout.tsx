import type { Metadata, Viewport } from "next";
import { Suspense, ViewTransition } from "react";
import { Inter, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "./_components/BackToTop";
import PopupForm from "./_components/PopupForm";
import GoogleTag from "./_components/GoogleTag";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_NAME = "River City Digital Co.";
const SITE_URL = "https://rivercitydigitalco.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | St. Louis Digital Marketing Agency`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "St. Louis digital marketing studio combining Google SEO with AI search visibility. Custom websites, local SEO, Google Ads, Meta Ads. Personally handled.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  generator: "Next.js",
  keywords: [
    "St. Louis digital marketing",
    "St. Louis SEO",
    "AI search visibility",
    "Google Business Profile",
    "Local SEO",
    "Website design St. Louis",
    "Google Ads St. Louis",
  ],
  icons: {
    icon: [
      { url: "/assets/favicon.webp", type: "image/webp" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Local Roots. Built to Be Found.`,
    description:
      "St. Louis digital marketing studio. Custom websites, local SEO, AI search visibility. Personally handled.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Local Roots. Built to Be Found.`,
    description:
      "St. Louis digital marketing studio. Custom websites, local SEO, AI search visibility.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-color.webp`,
  email: "hello@rivercitydigitalco.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Greater St. Louis Metropolitan Area",
  },
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#business`,
  name: SITE_NAME,
  url: SITE_URL,
  email: "hello@rivercitydigitalco.com",
  image: `${SITE_URL}/assets/logo-color.webp`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.627,
    longitude: -90.1994,
  },
  areaServed: [
    { "@type": "City", name: "St. Louis" },
    { "@type": "City", name: "Clayton" },
    { "@type": "City", name: "Chesterfield" },
    { "@type": "City", name: "O'Fallon" },
    { "@type": "City", name: "St. Charles" },
    { "@type": "City", name: "Kirkwood" },
    { "@type": "City", name: "Webster Groves" },
    { "@type": "City", name: "Ballwin" },
    { "@type": "City", name: "Wentzville" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable} ${mono.variable}`}>
      <GoogleTag />
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_LD) }}
        />
        <ViewTransition
          enter="rcd-page-enter"
          exit="rcd-page-exit"
          default="none"
        >
          {children}
        </ViewTransition>
        <BackToTop />
        <Suspense fallback={null}>
          <PopupForm />
        </Suspense>
      </body>
    </html>
  );
}
