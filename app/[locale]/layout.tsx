import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heebo, Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import CookieBanner from "@/components/CookieBanner";
import Advisor from "@/components/Advisor";
import { getSettings } from "@/lib/db";
import { locales, isLocale } from "@/lib/locale-path";
import { translations } from "@/lib/translations";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frankruhl",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
});

const BASE = "https://idanlanadlan.co.il";
const OG_LOCALES: Record<string, string> = { he: "he_IL", en: "en_US", fr: "fr_FR" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const meta = translations[l].meta;
  const canonical = l === "he" ? BASE : `${BASE}/${l}`;
  return {
    title: meta.site_title,
    description: meta.site_description,
    keywords: [
      "תיווך נדל\"ן תל אביב",
      "עידן חולי",
      "נדל\"ן יוקרה תל אביב",
      "דירות למכירה תל אביב",
      "נמל תל אביב נדל\"ן",
      "משרד תיווך",
      "שיווק פרויקטים",
      "ייעוץ נדל\"ן",
      "Tel Aviv real estate",
      "luxury real estate Tel Aviv",
      "immobilier Tel Aviv",
    ],
    authors: [{ name: "עידן חולי", url: BASE }],
    creator: "עידן חולי",
    openGraph: {
      type: "website",
      locale: OG_LOCALES[l],
      url: canonical,
      siteName: meta.site_name,
      title: meta.og_title,
      description: meta.og_description,
      images: [
        {
          url: `${BASE}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: meta.site_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.og_title,
      description: meta.og_description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: {
      canonical,
      languages: {
        he: BASE,
        en: `${BASE}/en`,
        fr: `${BASE}/fr`,
        "x-default": BASE,
      },
    },
  };
}

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://idanlanadlan.co.il/#agent",
      name: "עידן חולי — עידן לנדל\"ן",
      url: "https://idanlanadlan.co.il",
      telephone: "+972-54-979-1171",
      image: "https://idanlanadlan.co.il/idan-photo.jpg",
      description:
        "משרד תיווך ושיווק נדל\"ן עם כעשור של ניסיון בתל אביב וסביבתה. מס׳ רישיון 3205360.",
      areaServed: ["תל אביב", "תל אביב וסביבתה", "המרכז"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "הירקון 319",
        addressLocality: "תל אביב",
        addressCountry: "IL",
      },
      sameAs: [
        "https://www.facebook.com/profile.php?id=100086018108373",
        "https://www.tiktok.com/@idan.lanadlan",
        "https://www.linkedin.com/in/idan-huli/",
        "https://maps.app.goo.gl/RG3BgZUUxTh1g9u89",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://idanlanadlan.co.il/#business",
      name: "עידן לנדל\"ן",
      url: "https://idanlanadlan.co.il",
      telephone: "+972-54-979-1171",
      address: {
        "@type": "PostalAddress",
        streetAddress: "הירקון 319",
        addressLocality: "תל אביב",
        addressCountry: "IL",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.0927,
        longitude: 34.7707,
      },
    },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const settings = await getSettings();
  return (
    <html
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
      className={`${heebo.variable} ${cormorant.variable} ${frankRuhl.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: set theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen bg-black text-cream antialiased">
        {/* Skip navigation for keyboard/screen-reader users */}
        <a href="#main-content" className="skip-nav">
          דלג לתוכן הראשי
        </a>
        <ThemeProvider>
          <LanguageProvider key={locale} initialLocale={locale}>
            <SettingsProvider settings={settings}>
              {children}
              <CookieBanner />
              <Advisor />
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
