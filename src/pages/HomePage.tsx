import Header from "../components/Header";
import Hero from "../components/Hero";
import WhyAnonymity from "../components/WhyAnonymity";
import CompetitorComparison from "../components/CompetitorComparison";
import Stats from "../components/Stats";
import Features from "../components/Features";
import NichesShowcase from "../components/NichesShowcase";
import ToolsShowcase from "../components/ToolsShowcase";
import ProductLadder from "../components/ProductLadder";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import TrustIndicators from "../components/TrustIndicators";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import SEO from "../components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="ContentAnonymity - Build Your Faceless Content Empire"
        description="The definitive platform for anonymous digital entrepreneurship. Build profitable faceless content businesses with AI automation and complete privacy. Join thousands of creators building anonymous content empires."
        keywords="faceless content, anonymous content creator, content anonymity, faceless business, AI content creation, anonymous entrepreneurship, faceless YouTube, anonymous blog, privacy-focused content"
        url="https://contentanonymity.com"
        canonical="https://contentanonymity.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ContentAnonymity",
          "url": "https://contentanonymity.com",
          "description": "The definitive platform for anonymous digital entrepreneurship. Build profitable faceless content businesses with AI automation.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://contentanonymity.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ContentAnonymity",
            "logo": {
              "@type": "ImageObject",
              "url": "https://contentanonymity.com/logo-icon.svg"
            }
          }
        }}
      />
      <Header />
      <ExitIntentModal />
      <main id="main-content" role="main">
        <Hero />
        <WhyAnonymity />
        <CompetitorComparison />
        <Stats />
        <TrustIndicators />
        <Features />
        <NichesShowcase />
        <ToolsShowcase />
        <Testimonials />
        <ProductLadder />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
