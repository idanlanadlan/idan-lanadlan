import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { mockBlogPosts } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = mockBlogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | עידן לנדל״ן`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover_image }],
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = mockBlogPosts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    author: {
      "@type": "Person",
      name: "עידן חולי",
      url: "https://idanlanadlan.co.il/about",
    },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    articleBody: post.content || undefined,
    keywords: post.keywords.join(", "),
    publisher: {
      "@type": "Organization",
      name: "עידן לנדל״ן",
      url: "https://idanlanadlan.co.il",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="min-h-screen pt-24">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs text-gray-light">
          <Link href="/" className="hover:text-gold transition-colors">בית</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <Link href="/blog" className="hover:text-gold transition-colors">בלוג</Link>
          <ArrowRight size={12} className="rtl-flip" />
          <span className="text-cream line-clamp-1">{post.title}</span>
        </div>

        {/* Cover image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
          <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.keywords.map((kw) => (
              <span key={kw} className="text-xs px-3 py-1 rounded-full bg-charcoal text-gold border border-gray-dark">
                {kw}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-base text-gray-light leading-relaxed mb-8 border-r-2 border-gold pr-4">
            {post.excerpt}
          </p>

          <div className="text-gray-light leading-relaxed space-y-5">
            {post.content
              ? post.content.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              : <p>תוכן המאמר יופיע כאן בקרוב.</p>}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-charcoal rounded-xl border border-gray-dark p-8 text-center">
            <p className="text-xs tracking-widest text-gold uppercase mb-2">יש לכם שאלות?</p>
            <h3 className="font-display text-2xl text-white font-light mb-4">
              דברו ישירות עם עידן
            </h3>
            <a
              href="https://wa.me/972549791171"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2"
            >
              <MessageCircle size={16} />
              שלח הודעה ב-WhatsApp
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
