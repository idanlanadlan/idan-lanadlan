import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { David_Libre, Assistant } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import CookieBanner from "@/components/CookieBanner";
import Advisor from "@/components/Advisor";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientBackground from "@/components/AmbientBackground";
import { getSettings } from "@/lib/db";
import { locales, isLocale } from "@/lib/locale-path";
import { translations } from "@/lib/translations";
import { safeJsonLd } from "@/lib/json-ld";

const davidLibre = David_Libre({
  variable: "--font-david-libre",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE = "https://idanlanadlan.co.il";
const OG_LOCALES: Record<string, string> = { he: "he_IL", en: "en_US", fr: "fr_FR", es: "es_ES" };

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
        es: `${BASE}/es`,
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
      className={`${davidLibre.variable} ${assistant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen bg-black text-cream antialiased">
        {/* Google Consent Mode v2 default — must run before the GA tag (which
            loads afterInteractive) so the first pageview hit respects any
            stored cookie-banner choice instead of firing ungated. */}
        <Script
          id="consent-default-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}var granted=false;try{var raw=localStorage.getItem('cookie-consent');if(raw){try{granted=JSON.parse(raw).choice==='accepted';}catch(e){granted=raw==='accepted';}}}catch(e){}var state=granted?'granted':'denied';gtag('consent','default',{ad_storage:state,ad_user_data:state,ad_personalization:state,analytics_storage:state});})();`,
          }}
        />
        {/* Anti-flash: set theme + accessibility prefs before first paint.
            Per Next.js docs, beforeInteractive scripts are always hoisted into
            <head> regardless of where they're placed — must live in <body>,
            not manually inside <head>, or it fights Next's own injection. */}
        <Script
          id="theme-a11y-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var t=localStorage.getItem('theme')||'dark';d.setAttribute('data-theme',t);try{var a=JSON.parse(localStorage.getItem('a11y-prefs')||'{}');if(a.font===1||a.font===2)d.setAttribute('data-a11y-font',String(a.font));if(a.contrast)d.setAttribute('data-a11y-contrast','high');if(a.motion)d.setAttribute('data-a11y-motion','stop');if(a.links)d.setAttribute('data-a11y-links','on');}catch(e){}})();`,
          }}
        />
        {/* Skip navigation for keyboard/screen-reader users */}
        <a href="#main-content" className="skip-nav">
          דלג לתוכן הראשי
        </a>
        <AmbientBackground />
        <ThemeProvider>
          <LanguageProvider key={locale} initialLocale={locale}>
            <SettingsProvider settings={settings}>
              {children}
              <CookieBanner />
              <Advisor />
              <AccessibilityWidget />
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
