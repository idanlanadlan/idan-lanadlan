"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/nadlan", label: "נכסים" },
  { href: "/blog", label: "בלוג" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-gray-dark py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="עידן לנדל״ן"
            width={110}
            height={55}
            className="object-contain brightness-0 invert"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider text-gray-light hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+972549791171"
            className="flex items-center gap-2 text-sm text-gray-light hover:text-gold transition-colors"
          >
            <Phone size={15} />
            <span>054-979-1171</span>
          </a>
          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-5 py-2 rounded text-sm"
          >
            שלח הודעה
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-cream p-1"
          onClick={() => setOpen(!open)}
          aria-label="תפריט"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-charcoal border-t border-gray-dark px-4 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-cream hover:text-gold transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/972549791171"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-5 py-3 rounded text-center text-sm mt-2"
          >
            שלח הודעה
          </a>
        </div>
      )}
    </header>
  );
}
