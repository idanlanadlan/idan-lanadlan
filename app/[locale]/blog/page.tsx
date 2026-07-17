import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getPublishedBlogPosts } from "@/lib/db";
import { localizedBlogField, localizedBlogKeywords } from "@/lib/blog-utils";
import { translations } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const b = translations[l].blog_page;
  return { title: b.meta_title, description: b.meta_description };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const b = translations[l].blog_page;
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">{b.eyebrow}</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              {b.title}
            </h1>
            <p className="text-gray-light max-w-xl">{b.subtitle}</p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = localizedBlogField(post, "title", l);
                const excerpt = localizedBlogField(post, "excerpt", l);
                const keywords = localizedBlogKeywords(post, l);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <article className="card-luxury rounded-xl overflow-hidden h-full flex flex-col">
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.cover_image}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {keywords.slice(0, 3).map((kw) => (
                            <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-dark text-gold">
                              {kw}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-base font-semibold text-cream mb-3 flex-1 group-hover:text-gold transition-colors leading-snug">
                          {title}
                        </h2>
                        <p className="text-xs text-gray-light leading-relaxed mb-4 line-clamp-3">
                          {excerpt}
                        </p>
                        <span className="flex items-center gap-2 text-xs text-gold group-hover:gap-3 transition-all">
                          {b.read_more}
                          <ArrowLeft size={13} className="rtl-flip" />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
