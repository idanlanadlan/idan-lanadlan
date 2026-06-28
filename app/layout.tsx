import type { Metadata } from "next";
import { Heebo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CookieBanner from "@/components/CookieBanner";

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

export const metadata: Metadata = {
  title: "עידן לנדל\"ן — עידן חולי | תיווך ושיווק נדל\"ן יוקרה",
  description:
    "עידן חולי — 20 שנות ניסיון בתיווך, יזמות ושיווק נדל\"ן יוקרה בגוש דן. מכירה, השכרה, שיווק פרויקטים וייעוץ משקיעים.",
  keywords: [
    "תיווך נדל\"ן תל אביב",
    "עידן חולי",
    "נדל\"ן יוקרה גוש דן",
    "דירות למכירה תל אביב",
    "נמל תל אביב נדל\"ן",
    "משרד תיווך",
    "שיווק פרויקטים",
    "ייעוץ נדל\"ן",
  ],
  authors: [{ name: "עידן חולי", url: "https://idanlanadlan.co.il" }],
  creator: "עידן חולי",
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://idanlanadlan.co.il",
    siteName: "עידן לנדל\"ן",
    title: "עידן לנדל\"ן — עידן חולי | נדל\"ן יוקרה",
    description:
      "20 שנות ניסיון בתיווך, יזמות ושיווק נדל\"ן יוקרה בגוש דן.",
    images: [
      {
        url: "https://idanlanadlan.co.il/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "עידן לנדל\"ן",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "עידן לנדל\"ן — נדל\"ן יוקרה",
    description: "20 שנות ניסיון בתיווך ושיווק נדל\"ן יוקרה.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://idanlanadlan.co.il",
  },
};

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
        "משרד תיווך ושיווק נדל\"ן עם 20 שנות ניסיון בגוש דן. מס׳ רישיון 3205360.",
      areaServed: ["תל אביב", "גוש דן", "המרכז"],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${cormorant.variable}`}
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
          <LanguageProvider>
            {children}
            <CookieBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
