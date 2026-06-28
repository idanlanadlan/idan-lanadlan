"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=100086018108373", label: "Facebook" },
  { href: "https://www.tiktok.com/@idan.lanadlan", label: "TikTok" },
  { href: "https://www.linkedin.com/in/idan-huli/", label: "LinkedIn" },
  { href: "https://maps.app.goo.gl/RG3BgZUUxTh1g9u89", label: "Google" },
];

export default function Footer() {
  const { t } = useLanguage();
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
            <p className="text-[11px] text-gray/60 tracking-wide">
              {f.license}: <span className="text-gold/60">3205360</span>
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
              href="tel:+972549791171"
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
              aria-label="התקשר 054-979-1171"
            >
              <Phone size={14} aria-hidden="true" />
              054-979-1171
            </a>
            <a
              href="https://wa.me/972549791171"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
              aria-label="שלח הודעת WhatsApp"
            >
              <Mail size={14} aria-hidden="true" />
              WhatsApp
            </a>
            <span className="flex items-center gap-3 text-sm text-gray-light">
              <MapPin size={14} aria-hidden="true" />
              הירקון 319, נמל ת"א
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-dark flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray">
          <p>© {year} {f.copyright}</p>
          <a
            href="https://maps.app.goo.gl/RG3BgZUUxTh1g9u89"
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
