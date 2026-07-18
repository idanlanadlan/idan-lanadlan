"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const { t, setLocale } = useLanguage();

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
    { href: "/projects", label: t.nav.projects },
    { href: "/nadlan", label: t.nav.properties },
    { href: "/toolbox", label: t.nav.tools },
    { href: "/groups", label: t.nav.groups },
    { href: "/sellers", label: t.nav.sellers },
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

        {/* Controls — always visible, all breakpoints */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isLight ? t.theme.dark : t.theme.light}
            className={`p-1.5 rounded transition-colors ${isLight ? "text-gray hover:text-gold" : "text-gray-light hover:text-gold"}`}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Language switcher */}
          <div className="hidden sm:block border border-gray-dark/40 rounded px-1 py-0.5">
            <LanguageSwitcher size="sm" />
          </div>

          {/* Phone */}
          <a
            href="tel:+972549791171"
            className={`hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold ${isLight ? "text-gray-dark" : "text-cream"}`}
            aria-label="התקשר לעידן חולי"
          >
            <Phone size={15} />
            <span className="hidden lg:inline whitespace-nowrap">054-979-1171</span>
          </a>

          {/* CTA */}
          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-gold px-5 py-2 rounded text-sm"
            aria-label={`${t.nav.message} (נפתח בחלון חדש)`}
          >
            {t.nav.message}
          </a>

          {/* Hamburger — opens the full nav panel, all breakpoints */}
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
            aria-controls="nav-panel"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Nav panel — full navigation, all breakpoints */}
      {open && (
        <div
          id="nav-panel"
          className={`border-t border-gray-dark px-4 py-5 sm:py-6 flex flex-col items-center gap-3 sm:gap-4 overflow-y-auto overscroll-contain max-h-[calc(100dvh-6rem)] ${isLight ? "bg-white" : "bg-charcoal"}`}
          role="navigation"
          aria-label="ניווט ראשי"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={i === 0 ? firstMenuItemRef : undefined}
              className={`font-display text-base sm:text-lg font-light tracking-wide hover:text-gold transition-colors ${isLight ? "text-gray" : "text-cream"}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Language picker */}
          <div className="pt-3 border-t border-gray-dark/50 w-full max-w-xs flex justify-center shrink-0">
            <LanguageSwitcher size="lg" onSelect={() => setOpen(false)} />
          </div>

          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-8 py-3 rounded text-center text-sm sm:hidden shrink-0"
            aria-label={`${t.nav.message} (נפתח בחלון חדש)`}
          >
            {t.nav.message}
          </a>
        </div>
      )}
    </header>
  );
}
