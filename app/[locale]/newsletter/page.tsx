import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import NewsletterSignup from "@/components/NewsletterSignup";
import { translations } from "@/lib/translations";
import { isLocale, canonicalAlternates } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const n = translations[l].newsletter;
  return {
    title: n.meta_title,
    description: n.meta_description,
    alternates: canonicalAlternates("/newsletter", l),
  };
}

export default async function NewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ confirmed?: string; unsub?: string }>;
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const l = isLocale(locale) ? locale : "he";
  const n = translations[l].newsletter;

  const banner =
    sp.confirmed === "1"
      ? { title: n.confirmed_title, note: n.confirmed_note, tone: "ok" as const }
      : sp.unsub === "1"
        ? { title: n.unsub_title, note: n.unsub_note, tone: "info" as const, resub: true }
        : sp.confirmed === "0" || sp.unsub === "0"
          ? { title: n.bad_link, note: "", tone: "err" as const }
          : null;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          {banner && (
            <div
              className={`mb-8 rounded-xl border p-5 ${
                banner.tone === "ok"
                  ? "border-gold/40 bg-gold/10"
                  : banner.tone === "err"
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-gray-dark bg-charcoal"
              }`}
            >
              <p className="font-semibold text-white">{banner.title}</p>
              {banner.note && <p className="text-sm text-gray-light mt-1">{banner.note}</p>}
              {banner.resub && (
                <p className="mt-2 text-sm">
                  <a href="#signup" className="text-gold underline underline-offset-2">
                    {n.resubscribe}
                  </a>
                </p>
              )}
            </div>
          )}

          <div id="signup">
            <NewsletterSignup variant="page" />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
