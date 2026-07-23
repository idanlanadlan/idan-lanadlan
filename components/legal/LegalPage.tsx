import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import LocaleLink from "@/components/LocaleLink";
import { renderRich } from "@/lib/rich-text";
import type { LegalSection, T } from "@/lib/translations";

const h2 = "font-display text-2xl text-white font-light mb-4";
const p = "text-sm leading-[2] mt-3 first:mt-0";
const ul = "text-sm leading-[2.2] list-disc list-inside space-y-1 marker:text-gold mt-3 first:mt-0";

export default function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
  contactName,
  contactNote,
  common,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
  contactName: string;
  contactNote?: string;
  common: T["legal"]["common"];
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">{title}</h1>
            <p className="text-gray-light text-sm">{updated}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 prose-luxury">
            <div className="space-y-10 text-gray-light leading-relaxed">
              {sections.map((section) => (
                <div key={section.heading}>
                  <h2 className={h2}>{section.heading}</h2>
                  {section.blocks.map((block, i) => {
                    if (block.type === "p") {
                      return (
                        <p key={i} className={p}>
                          {renderRich(block.text, "text-cream")}
                        </p>
                      );
                    }
                    if (block.type === "list") {
                      return (
                        <ul key={i} className={ul}>
                          {block.items.map((item, j) => (
                            <li key={j}>{renderRich(item, "text-cream")}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "link") {
                      return (
                        <p key={i} className={p}>
                          {block.before}
                          {block.internal ? (
                            <LocaleLink href={block.href} className="text-gold hover:underline">
                              {block.linkText}
                            </LocaleLink>
                          ) : (
                            <a
                              href={block.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold hover:underline"
                            >
                              {block.linkText}
                            </a>
                          )}
                          {block.after}
                        </p>
                      );
                    }
                    return (
                      <div key={i} className="border border-gray-dark rounded p-6 space-y-2 mt-3 first:mt-0">
                        <p className="text-sm">
                          <span className="text-gold">{common.label_name}</span> {contactName}
                        </p>
                        <p className="text-sm">
                          <span className="text-gold">{common.label_phone}</span>{" "}
                          <a href="tel:+972549791171" className="hover:text-gold transition-colors">
                            054-979-1171
                          </a>
                        </p>
                        <p className="text-sm">
                          <span className="text-gold">{common.label_email}</span>{" "}
                          <a href="mailto:idanlanadlan@gmail.com" className="hover:text-gold transition-colors">
                            idanlanadlan@gmail.com
                          </a>
                        </p>
                        <p className="text-sm">
                          <span className="text-gold">{common.label_address}</span> {common.address}
                        </p>
                        {contactNote ? <p className="text-sm text-gray-light mt-2">{contactNote}</p> : null}
                      </div>
                    );
                  })}
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
