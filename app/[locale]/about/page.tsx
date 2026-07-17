import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const a = translations[l].about;
  return { title: a.meta_title, description: a.meta_description };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const a = translations[l].about;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24">
        {/* Hero */}
        <section className="py-20 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{a.eyebrow}</p>
                <div className="divider-gold mb-6" />
                <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-6 leading-tight">
                  {a.heading_line1}
                  <br />
                  <span className="text-gold-gradient italic">{a.heading_line2}</span>
                </h1>
                <p className="text-gray-light leading-relaxed mb-4">{a.bio1}</p>
                <p className="text-gray-light leading-relaxed mb-4">{a.bio2}</p>
                <p className="text-gray-light leading-relaxed mb-8">{a.bio3}</p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/972549791171"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-6 py-3 rounded-lg text-sm flex items-center gap-2"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+972549791171"
                    className="btn-outline-gold px-6 py-3 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Phone size={15} />
                    054-979-1171
                  </a>
                </div>
              </div>

              {/* Photo */}
              <div className="relative">
                <div className="h-96 rounded-xl overflow-hidden relative">
                  <Image
                    src="/idan-photo.jpg"
                    alt={a.photo_alt}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black/90 border border-gold/40 rounded-xl px-5 py-4">
                  <p className="font-display text-3xl text-gold font-light">{a.photo_value}</p>
                  <p className="text-xs text-gray-light">{a.photo_label}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{a.values_eyebrow}</p>
            <div className="divider-gold mx-auto mb-8" />
            <h2 className="font-display text-4xl font-light text-white mb-10">
              {a.values_title}
            </h2>
            <ul className="text-right flex flex-col gap-4 max-w-2xl mx-auto">
              {a.values.map((v) => (
                <li key={v} className="flex items-center gap-4 bg-charcoal border border-gray-dark rounded-lg p-4">
                  <CheckCircle size={18} className="text-gold shrink-0" />
                  <span className="text-cream text-sm">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3 text-center">{a.services_eyebrow}</p>
            <div className="divider-gold mx-auto mb-8" />
            <h2 className="font-display text-4xl font-light text-white mb-12 text-center">
              {a.services_title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {a.services.map((s) => (
                <div key={s.title} className="bg-black border border-gray-dark rounded-xl p-6 hover:border-gold transition-colors">
                  <div className="divider-gold mb-4" />
                  <h3 className="text-base font-semibold text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-gray-light leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
