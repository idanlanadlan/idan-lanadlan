import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { href: "/nadlan", label: "נכסים" },
  { href: "/blog", label: "בלוג" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
];

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=100086018108373", label: "Facebook" },
  { href: "https://www.tiktok.com/@idan.lanadlan", label: "TikTok" },
  { href: "https://www.linkedin.com/in/idan-huli/", label: "LinkedIn" },
  { href: "https://maps.app.goo.gl/RG3BgZUUxTh1g9u89", label: "Google" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gray-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="עידן לנדל״ן"
              width={130}
              height={65}
              className="object-contain brightness-0 invert"
            />
            <p className="text-gray-light text-sm leading-relaxed max-w-xs">
              20 שנות ניסיון בתיווך ושיווק נדל״ן יוקרה באזור רמת השרון ותל אביב.
            </p>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-light hover:text-gold transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase font-semibold mb-2">
              ניווט מהיר
            </h3>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-light hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase font-semibold mb-2">
              צור קשר
            </h3>
            <a
              href="tel:+972549791171"
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
            >
              <Phone size={14} />
              054-979-1171
            </a>
            <a
              href="https://wa.me/972549791171"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-light hover:text-gold transition-colors"
            >
              <Mail size={14} />
              WhatsApp
            </a>
            <span className="flex items-center gap-3 text-sm text-gray-light">
              <MapPin size={14} />
              רמת השרון, המרכז
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-dark flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray">
          <p>© {year} עידן לנדל״ן — כל הזכויות שמורות</p>
          <p className="text-gray">
            <a href="https://maps.app.goo.gl/RG3BgZUUxTh1g9u89" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              ★ 5.0 בגוגל
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
