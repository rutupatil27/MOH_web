import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import SiteHeader from "@/components/SiteHeader";
import { musicSchoolJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Music Academy in ${site.place.city}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    `music academy in ${site.place.city}`,
    `music classes in ${site.place.city}`,
    `guitar classes ${site.place.city}`,
    `keyboard classes ${site.place.city}`,
    `drum classes ${site.place.city}`,
    `singing classes ${site.place.city}`,
    "ISO certified music academy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.legalName,
    title: `${site.name} | Music Academy in ${site.place.city}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Music Academy in ${site.place.city}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-black text-ivory antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-100 focus:rounded-sm focus:bg-black-warm focus:px-5 focus:py-3 focus:text-sm focus:text-gold"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
        </SmoothScroll>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(musicSchoolJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
