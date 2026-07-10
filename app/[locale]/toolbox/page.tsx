import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Scale,
  ClipboardCheck,
  Compass,
  BookOpen,
  Plane,
  Landmark,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "ארגז כלים | עידן לנדל״ן",
  description: "מחשבונים וכלים אינטראקטיביים לרוכשים, מוכרים ומשקיעים — תשואה, שיפוץ, מיסוי ועוד.",
};

const TOOLS = [
  { href: "/toolbox/roi-calculator", Icon: TrendingUp, title: "מחשבון תשואה להשקעה", description: "חשבו את התשואה השנתית הנטו הצפויה מנכס להשקעה" },
  { href: "/toolbox/mortgage-calculator", Icon: Landmark, title: "מחשבון משכנתא", description: "החזר חודשי, סך ריבית ואחוז מימון מול מגבלות בנק ישראל" },
  { href: "/toolbox/tax-simulator", Icon: Receipt, title: "סימולטור מיסים בעסקת נדל״ן", description: "מס רכישה לפי סטטוס הרוכש ומס שבח בעת מכירה עתידית" },
  { href: "/toolbox/buy-vs-rent", Icon: Scale, title: "קנייה מול שכירות", description: "השוואת שווי נטו בעוד 10 שנים — לקנות או לשכור" },
  { href: "/toolbox/inspection-checklist", Icon: ClipboardCheck, title: "צ'קליסט בדק בית", description: "מה לבדוק בביקור בנכס לפני שרוכשים" },
  { href: "/toolbox/property-match", Icon: Compass, title: "שאלון התאמת נכס", description: "3 שאלות שמאתרות את פרופיל הנכס המתאים לכם" },
  { href: "/toolbox/glossary", Icon: BookOpen, title: "מילון מונחי נדל״ן", description: "טאבו, הערת אזהרה, מס שבח ועוד — בעברית פשוטה" },
  { href: "/toolbox/oleh-tax", Icon: Plane, title: "סימולטור מס לעולים חדשים", description: "מס רכישה מוזל ומפת דרכים לרכישה בישראל" },
];

export default function ToolboxPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24">
        <section className="py-12 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">כלים ללקוח</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">ארגז כלים</h1>
            <p className="text-gray-light max-w-xl">
              מחשבונים וכלים אינטראקטיביים שיעזרו לכם לקבל החלטות מושכלות — לרכישה, מכירה או השקעה.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS.map(({ href, Icon, title, description }) => (
                <Link key={href} href={href} className="group block h-full">
                  <div className="card-luxury h-full rounded-xl p-6 flex flex-col">
                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-gold" />
                    </div>
                    <h2 className="text-white font-semibold mb-1.5 group-hover:text-gold transition-colors">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-light leading-relaxed mb-4">{description}</p>
                    <span className="mt-auto flex items-center gap-1.5 text-xs text-gold uppercase tracking-widest">
                      פתח כלי
                      <ArrowLeft size={12} className="rtl-flip" />
                    </span>
                  </div>
                </Link>
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
