"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Bell } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import GroupModal from "@/components/GroupModal";
import { useLanguage } from "@/contexts/LanguageContext";

type GroupType = "sale" | "rent";

export default function GroupsPage() {
  const [activeModal, setActiveModal] = useState<GroupType | null>(null);
  const { t } = useLanguage();
  const g = t.sections.groups;

  const groups = [
    {
      type: "sale" as GroupType,
      badge: g.sale_badge,
      title: g.sale_title,
      subtitle: g.sale_subtitle,
      description: g.sale_description,
      items: g.sale_items,
    },
    {
      type: "rent" as GroupType,
      badge: g.rent_badge,
      title: g.rent_title,
      subtitle: g.rent_subtitle,
      description: g.rent_description,
      items: g.rent_items,
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Page header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{g.eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              {g.title}
            </h1>
            <p className="text-gray-light max-w-xl text-lg">
              {g.subtitle}
            </p>
          </div>
        </section>

        {/* Groups grid */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {groups.map((group, i) => (
                <motion.div
                  key={group.type}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, #141414 0%, #0e0e0e 100%)",
                    border: "1px solid rgba(201,169,110,0.2)",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="px-6 py-5 flex items-center gap-3"
                    style={{ borderBottom: "1px solid rgba(201,169,110,0.12)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)" }}
                    >
                      <Lock size={16} className="text-gold" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] text-gold uppercase">{group.badge}</span>
                      <p className="text-white font-semibold text-sm leading-tight">{group.title}</p>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-6 py-6 flex flex-col gap-5 flex-1">
                    <div>
                      <h2 className="font-display text-2xl text-white font-light mb-2">
                        {group.subtitle}
                      </h2>
                      <p className="text-sm text-gray-light leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    <ul className="flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-cream">
                          <Bell size={13} className="text-gold shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => setActiveModal(group.type)}
                        className="btn-gold w-full py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Lock size={14} />
                        {g.request_button}
                      </button>
                      <p className="text-[11px] text-gray-light text-center mt-2">
                        {g.card_footer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-light mt-12"
            >
              {g.managed_note}
              <br />
              {g.share_note}
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <GroupModal
            groupType={activeModal}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
