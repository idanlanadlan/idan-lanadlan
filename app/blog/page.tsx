import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { mockBlogPosts } from "@/lib/mock-data";

export const metadata = {
  title: "בלוג נדל״ן | עידן לנדל״ן",
  description:
    "טיפים, מדריכים וניתוחי שוק נדל״ן מאת עידן חולי — מומחה נדל״ן עם 20 שנות ניסיון.",
};

export default function BlogPage() {
  const posts = mockBlogPosts.filter((p) => p.published);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28">
        {/* Header */}
        <section className="py-16 bg-charcoal border-b border-gray-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">ידע ותובנות</p>
            <div className="divider-gold mb-4" />
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-4">
              בלוג נדל״ן
            </h1>
            <p className="text-gray-light max-w-xl">
              מאמרים, טיפים ומדריכים ממומחה הנדל״ן עידן חולי. כתבות מקצועיות שיעזרו לכם לקבל החלטות נכונות.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="card-luxury rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.keywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-dark text-gold">
                            {kw}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-base font-semibold text-cream mb-3 flex-1 group-hover:text-gold transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-light leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="flex items-center gap-2 text-xs text-gold group-hover:gap-3 transition-all">
                        קרא עוד
                        <ArrowLeft size={13} className="rtl-flip" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
