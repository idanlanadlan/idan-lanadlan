import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import NewsletterSignup from "@/components/NewsletterSignup";
import AboutSnippet from "@/components/home/AboutSnippet";
import Testimonials from "@/components/home/Testimonials";
import SocialFeed from "@/components/home/SocialFeed";
import BlogPreview from "@/components/home/BlogPreview";
import CtaSection from "@/components/home/CtaSection";
import FaqSection from "@/components/home/FaqSection";
import { getFeaturedProperties, getFeaturedBlogPosts } from "@/lib/db";
import { isLocale, canonicalAlternates } from "@/lib/locale-path";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "he";
  return { alternates: canonicalAlternates("", l) };
}

export default async function HomePage() {
  const [featuredProperties, blogPosts] = await Promise.all([
    getFeaturedProperties(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <FeaturedProperties properties={featuredProperties} />
        <section className="relative border-y border-gray-dark/50 bg-charcoal overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse 55% 75% at 75% 50%, rgba(47,80,87,0.14) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
            <NewsletterSignup variant="band" />
          </div>
        </section>
        <AboutSnippet />
        <Testimonials />
        <BlogPreview posts={blogPosts} />
        <SocialFeed />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
