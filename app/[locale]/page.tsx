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
import { getFeaturedProperties, getProperties, getPublishedBlogPosts } from "@/lib/db";

export default async function HomePage() {
  const [featuredProperties, allProperties, blogPosts] = await Promise.all([
    getFeaturedProperties(),
    getProperties(),
    getPublishedBlogPosts(),
  ]);

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <FeaturedProperties properties={featuredProperties} />
        <MapSection properties={allProperties} />
        <AboutSnippet />
        <Testimonials />
        <BlogPreview posts={blogPosts.slice(0, 3)} />
        <SocialFeed />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
