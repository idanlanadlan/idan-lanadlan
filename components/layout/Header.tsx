"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/translations";

const LOCALES: { code: Locale; flag: string; label: string }[] = [
  { code: "he", flag: "🇮🇱", label: "עברית" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const { locale, t, setLocale } = useLanguage();

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  useEffect(() => {
    if (open) {
      firstMenuItemRef.current?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [open]);

  const isLight = theme === "light";

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/nadlan", label: t.nav.properties },
    { href: "/groups", label: t.nav.groups },
    { href: "/blog", label: t.nav.blog },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? `${isLight ? "bg-white/95" : "bg-black/95"} backdrop-blur-sm border-b border-gray-dark py-3`
          : `bg-gradient-to-b ${isLight ? "from-white/85" : "from-black/90"} to-transparent py-5`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="עידן לנדל״ן — ראשי">
          <Image
            src="/logo.png"
            alt="עידן לנדל״ן"
            width={130}
            height={65}
            className={`object-contain transition-all ${isLight ? "brightness-0" : ""}`}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="ניווט ראשי">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wider transition-colors duration-200 hover:text-gold ${isLight ? "text-gray-dark" : "text-cream"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <div
            className="flex items-center gap-0.5 border border-gray-dark/40 rounded px-1 py-0.5"
            role="group"
            aria-label="בחירת שפה"
          >
            {LOCALES.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                aria-label={`שפה: ${label}`}
                title={label}
                className={`px-1.5 py-0.5 text-base leading-none rounded transition-all ${
                  locale === code
                    ? "opacity-100 scale-110"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isLight ? t.theme.dark : t.theme.light}
            className={`p-1.5 rounded transition-colors ${isLight ? "text-gray hover:text-gold" : "text-gray-light hover:text-gold"}`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Phone */}
          <a
            href="tel:+972549791171"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold ${isLight ? "text-gray-dark" : "text-cream"}`}
            aria-label="התקשר לעידן חולי"
          >
            <Phone size={15} />
            <span className="hidden lg:inline">054-979-1171</span>
          </a>

          {/* CTA */}
          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-5 py-2 rounded text-sm"
            aria-label={`${t.nav.message} (נפתח בחלון חדש)`}
          >
            {t.nav.message}
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={isLight ? t.theme.dark : t.theme.light}
            className={`p-1.5 transition-colors hover:text-gold ${isLight ? "text-gray" : "text-gray-light"}`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            ref={hamburgerRef}
            className={`p-2 border rounded transition-colors ${
              isLight
                ? "text-gray border-gray-dark/50 hover:border-gold/50 hover:text-gold"
                : "text-cream border-gray-dark/50 hover:border-gold/50 hover:text-gold"
            }`}
            onClick={() => setOpen(!open)}
            aria-label={open ? t.nav.close : t.nav.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className={`md:hidden border-t border-gray-dark px-4 py-6 flex flex-col gap-5 ${isLight ? "bg-white" : "bg-charcoal"}`}
          role="navigation"
          aria-label="תפריט ניידים"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={i === 0 ? firstMenuItemRef : undefined}
              className={`text-base hover:text-gold transition-colors ${isLight ? "text-gray" : "text-cream"}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Language picker in mobile menu */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-dark/50" role="group" aria-label="בחירת שפה">
            {LOCALES.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => { setLocale(code); setOpen(false); }}
                aria-pressed={locale === code}
                aria-label={`שפה: ${label}`}
                title={label}
                className={`text-2xl leading-none transition-all ${
                  locale === code ? "opacity-100 scale-110" : "opacity-40 hover:opacity-80"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>

          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-5 py-3 rounded text-center text-sm mt-1"
            aria-label={`${t.nav.message} (נפתח בחלון חדש)`}
          >
            {t.nav.message}
          </a>
        </div>
      )}
    </header>
  );
}
