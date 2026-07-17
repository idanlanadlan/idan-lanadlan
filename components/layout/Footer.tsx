"use client";

import Link from "@/components/LocaleLink";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Footer() {
  const { t } = useLanguage();
  const s = useSettings();

  const socialLinks = [
    { href: s.facebook, label: "Facebook" },
    s.instagram ? { href: s.instagram, label: "Instagram" } : null,
    { href: s.tiktok, label: "TikTok" },
    { href: s.linkedin, label: "LinkedIn" },
    { href: s.maps_url, label: "Google" },
  ].filter(Boolean) as { href: string; label: string }[];
  const f = t.footer;
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/nadlan", label: t.nav.properties },
    { href: "/blog", label: t.nav.blog },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-charcoal border-t border-gray-dark" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="עידן לנדל״ן"
              width={130}
              height={65}
              className="object-contain"
            />
            <p className="text-gray-light text-sm leading-relaxed max-w-xs">
              {f.tagline}
            </p>
            {/* License number — required by Israeli real estate law */}
            <p className="text-[11px] text-gray-light tracking-wide">
              {f.license}: <span className="text-gold">3205360</span>
            </p>
            <div className="flex gap-4 mt-1" aria-label="רשתות חברתיות">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-light hover:text-gold transition-colors"
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase font-semibold mb-2">
              {f.quick_nav}
            </h3>
            <nav aria-label="קישורים מהירים">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-light hover:text-gold transition-colors mb-3"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase font-semibold mb-2">
              {f.contact}
            </h3>
            <a
              href={`tel:+${s.phone_raw}`}
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
              aria-label={`התקשר ${s.phone}`}
            >
              <Phone size={14} aria-hidden="true" />
              {s.phone}
            </a>
            <a
              href={`https://wa.me/${s.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
              aria-label="שלח הודעת WhatsApp"
            >
              <MessageCircle size={14} aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={`mailto:${s.email}`}
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
              aria-label="שלח מייל"
            >
              <Mail size={14} aria-hidden="true" />
              {s.email}
            </a>
            <span className="flex items-center gap-3 text-sm text-cream">
              <MapPin size={14} className="text-gold shrink-0" aria-hidden="true" />
              {s.address}
            </span>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase font-semibold mb-2">
              {f.legal}
            </h3>
            <Link
              href="/privacy"
              className="text-sm text-gray-light hover:text-gold transition-colors"
            >
              {f.privacy}
            </Link>
            <Link
              href="/accessibility"
              className="text-sm text-gray-light hover:text-gold transition-colors"
            >
              {f.accessibility}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-light hover:text-gold transition-colors"
            >
              {f.terms}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-dark flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-light">
          <p className="text-gray-light">© {year} {f.copyright}</p>
          <a
            href={s.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
            aria-label="ביקורות גוגל — 5 כוכבים"
          >
            ★ 5.0 Google
          </a>
        </div>
      </div>
    </footer>
  );
}
