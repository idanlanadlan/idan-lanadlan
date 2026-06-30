import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock, Mail, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "צור קשר | עידן לנדל״ן",
  description: "צרו קשר עם עידן חולי — מומחה נדל״ן. שלחו פנייה, WhatsApp, טלפון ועוד.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">בואו נדבר</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              צור קשר
            </h1>
            <p className="text-gray-light max-w-xl">
              יש לכם שאלה? מחפשים נכס? רוצים למכור? עידן ישמח לעזור.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">

              {/* Contact Form */}
              <div className="bg-charcoal border border-gray-dark rounded-2xl p-8">
                <h2 className="font-display text-2xl text-white font-light mb-6">
                  שלחו פנייה
                </h2>
                <ContactForm />
              </div>

              {/* Contact options */}
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-2xl text-white font-light mb-2">
                  דרכי יצירת קשר
                </h2>

                <a
                  href="https://wa.me/972549791171?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A2%D7%99%D7%93%D7%9F%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5 hover:border-gold transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">WhatsApp</p>
                    <p className="text-xs text-gray-light mt-0.5">הדרך המהירה ביותר לדבר עם עידן</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/c/972549791171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5 hover:border-gold transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">קטלוג נכסים ב-WhatsApp</p>
                    <p className="text-xs text-gray-light mt-0.5">עיינו בכל הנכסים הזמינים</p>
                  </div>
                </a>

                <a
                  href="tel:+972549791171"
                  className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5 hover:border-gold transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">054-979-1171</p>
                    <p className="text-xs text-gray-light mt-0.5">שיחה טלפונית ישירה</p>
                  </div>
                </a>

                <a
                  href="mailto:idanlanadlan@gmail.com"
                  className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5 hover:border-gold transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">idanlanadlan@gmail.com</p>
                    <p className="text-xs text-gray-light mt-0.5">שלחו מייל ישירות</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5">
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">הירקון 319, נמל ת"א</p>
                    <p className="text-xs text-gray-light mt-0.5">פועל בתל אביב וסביבתה</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 bg-charcoal border border-gray-dark rounded-xl p-5">
                  <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">שעות פעילות</p>
                    <p className="text-xs text-gray-light mt-0.5">א׳–ה׳: 08:00–20:00 | ו׳: 08:00–14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-16">
              <div className="rounded-xl overflow-hidden border border-gray-dark h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6758.8!2d34.7745!3d32.0967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x623925c3b3e86005%3A0xc1b477d47abc24da!2z16LXoNeC16kgXCLXoX1UX10g16TXlteR16og15TXldGEINeR16fXlQ!5e0!3m2!1siw!2sil!4v1625000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="מפת מיקום עידן לנדל״ן — הירקון 319, תל אביב"
                />
              </div>
              <div className="mt-3 text-center">
                <a
                  href="https://maps.app.goo.gl/RG3BgZUUxTh1g9u89"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                >
                  פתח בגוגל מפות ←
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
