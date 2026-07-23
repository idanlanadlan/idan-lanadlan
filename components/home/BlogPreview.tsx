"use client";

import { motion } from "framer-motion";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { pickCopy } from "@/lib/site-copy";
import { localizedBlogField, localizedBlogKeywords } from "@/lib/blog-utils";
import type { BlogPost } from "@/lib/types";

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const { t, locale } = useLanguage();
  const settings = useSettings();
  const b = t.sections.blog;
  const eyebrow = pickCopy(settings, "blog_eyebrow", locale, b.eyebrow);
  const title = pickCopy(settings, "blog_title", locale, b.title);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-black" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h2 id="blog-heading" className="font-display text-4xl sm:text-5xl font-light text-white">
              {title}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            {b.all}
            <ArrowLeft size={16} className="rtl-flip" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const title = localizedBlogField(post, "title", locale);
            const excerpt = localizedBlogField(post, "excerpt", locale);
            const keywords = localizedBlogKeywords(post, locale);
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block card-luxury rounded-lg overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-charcoal">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {keywords.slice(0, 2).map((kw) => (
                        <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-dark text-gold">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-cream mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-light line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
