import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import AboutSnippet from "@/components/home/AboutSnippet";
import Testimonials from "@/components/home/Testimonials";
import SocialFeed from "@/components/home/SocialFeed";
import BlogPreview from "@/components/home/BlogPreview";
import CtaSection from "@/components/home/CtaSection";
import FaqSection from "@/components/home/FaqSection";
import MapSection from "@/components/home/MapSection";
import { getFeaturedProperties, getProperties, getFeaturedBlogPosts, getSettings } from "@/lib/db";

export default async function HomePage() {
  const [featuredProperties, allProperties, blogPosts, settings] = await Promise.all([
    getFeaturedProperties(),
    getProperties(),
    getFeaturedBlogPosts(),
    getSettings(),
  ]);
  const heroSubtitles = {
    he: settings.hero_subtitle_he,
    en: settings.hero_subtitle_en,
    fr: settings.hero_subtitle_fr,
    es: settings.hero_subtitle_es,
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero subtitleOverride={heroSubtitles} />
        <StatsBar />
        <FeaturedProperties properties={featuredProperties} />
        <MapSection properties={allProperties} />
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
