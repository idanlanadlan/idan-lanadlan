import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getBlogPostBySlug } from "@/lib/db";
import { localizedBlogField, localizedBlogKeywords } from "@/lib/blog-utils";
import { translations, type Locale } from "@/lib/translations";
import { isLocale } from "@/lib/locale-path";
import { safeJsonLd } from "@/lib/json-ld";

const BASE = "https://idanlanadlan.co.il";

function postUrl(slug: string, locale: Locale) {
  return locale === "he" ? `${BASE}/blog/${slug}` : `${BASE}/${locale}/blog/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const title = localizedBlogField(post, "title", l);
  const excerpt = localizedBlogField(post, "excerpt", l);
  const keywords = localizedBlogKeywords(post, l);
  const meta = translations[l].meta;

  return {
    title: `${title} | ${meta.site_name}`,
    description: excerpt,
    keywords,
    openGraph: {
      title,
      description: excerpt,
      images: [{ url: post.cover_image }],
      type: "article",
    },
    alternates: {
      canonical: postUrl(slug, l),
      languages: {
        he: postUrl(slug, "he"),
        en: postUrl(slug, "en"),
        fr: postUrl(slug, "fr"),
        es: postUrl(slug, "es"),
        "x-default": postUrl(slug, "he"),
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const bp = translations[l].blog_post;
  const nav = translations[l].nav;
  const blogPage = translations[l].blog_page;
  const authorName = translations[l].about.heading_line1;
  const siteName = translations[l].meta.site_name;

  const title = localizedBlogField(post, "title", l);
  const excerpt = localizedBlogField(post, "excerpt", l);
  const content = localizedBlogField(post, "content", l);
  const keywords = localizedBlogKeywords(post, l);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: post.cover_image,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${BASE}/about`,
    },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    articleBody: content ? content.replace(/^#{2,3} /gm, "") : undefined,
    keywords: keywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: BASE,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Header />
      <main id="main-content" className="min-h-screen pt-28">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs text-gray-light">
          <Link href="/" className="hover:text-gold transition-colors">{nav.home}</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <Link href="/blog" className="hover:text-gold transition-colors">{blogPage.eyebrow}</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <span className="text-cream line-clamp-1">{title}</span>
        </div>

        {/* Cover image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden bg-charcoal">
            {post.cover_image ? (
              <>
                <Image
                  src={post.cover_image}
                  alt={title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] tracking-widest text-gray-light/40 uppercase">תמונה בקרוב</span>
              </div>
            )}
          </div>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((kw) => (
              <span key={kw} className="text-xs px-3 py-1 rounded-full bg-charcoal text-gold border border-gray-dark">
                {kw}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-base text-gray-light leading-relaxed mb-8 border-r-2 border-gold pr-4">
            {excerpt}
          </p>

          <div className="text-gray-light leading-relaxed space-y-5">
            {content
              ? content.split(/\r?\n\r?\n/).map((para, i) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={i} className="font-display text-lg text-white font-normal !mt-10 !mb-1">
                        {para.slice(4)}
                      </h3>
                    );
                  }
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={i} className="font-display text-2xl text-white font-light !mt-12 !mb-2">
                        {para.slice(3)}
                      </h2>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })
              : <p>{bp.content_coming_soon}</p>}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-charcoal rounded-xl border border-gray-dark p-8 text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">{bp.questions_eyebrow}</p>
            <h3 className="font-display text-2xl text-white font-light mb-4">
              {bp.questions_title}
            </h3>
            <a
              href="https://wa.me/972549791171"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2"
            >
              <MessageCircle size={16} />
              {bp.whatsapp_button}
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
