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
import ArticleGrid from "../components/ArticleGrid";
import ExploreSection from "../components/ExploreSection";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import SEO from "../components/SEO";
import AdSenseDisplay from "../components/AdSenseDisplay";
import ForeMediaAd from "../components/ForeMediaAd";
import { faqs as faqData } from "../components/FAQ";

export default function HomePage() {
  return (
    <>
      <SEO
        title="7 Proven Ways to Build a Faceless Content Empire in 2026"
        description="Discover the exact system 10,000+ creators use to earn 6-figures anonymously. AI automation, monetization strategies & step-by-step courses. Start building today—free."
        keywords="faceless content business, anonymous content creator, faceless YouTube channel, faceless TikTok, faceless Instagram, AI content creation, faceless business 2026, how to make money without showing face"
        url="https://contentanonymity.com"
        canonical="https://contentanonymity.com"
        faqData={faqData}
        reviewData={{ rating: 4.8, reviewCount: 10000, bestRating: 5, worstRating: 1 }}
        softwareApplication={{
          name: "ContentAnonymity",
          description: "AI-powered platform for building profitable faceless content businesses. Complete toolkit for anonymous digital entrepreneurship with AI automation, monetization strategies, and step-by-step courses.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            price: "0.00",
            priceCurrency: "USD"
          }
        }}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ContentAnonymity",
            "operatingSystem": "All",
            "applicationCategory": "AI Content Tool",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            },
            "description": "AI-powered platform for building profitable faceless content businesses. Complete toolkit for anonymous digital entrepreneurship.",
            "url": "https://contentanonymity.com",
            "applicationSubCategory": "Content Creation Software",
            "screenshot": "https://contentanonymity.com/og-image.jpg"
          },
          {
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
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ContentAnonymity",
            "url": "https://contentanonymity.com",
            "logo": "https://contentanonymity.com/logo-icon.svg",
            "description": "The definitive platform for anonymous digital entrepreneurship. Build profitable faceless content businesses with AI automation and complete privacy.",
            "sameAs": [
              "https://twitter.com/contentanonymity",
              "https://www.youtube.com/@contentanonymity",
              "https://www.linkedin.com/company/contentanonymity"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@contentanonymity.com"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Faceless Automation Blueprint",
            "description": "Complete course to build and automate your faceless content business. Learn proven strategies for creating profitable faceless content across YouTube, TikTok, Instagram, and more.",
            "provider": {
              "@type": "Organization",
              "name": "ContentAnonymity",
              "url": "https://contentanonymity.com"
            },
            "courseCode": "FAB-2025",
            "educationalLevel": "Beginner to Advanced",
            "teaches": [
              "Faceless content creation",
              "AI-powered content automation",
              "Monetization strategies",
              "Niche selection and validation",
              "Channel growth and optimization"
            ],
            "offers": {
              "@type": "Offer",
              "price": "197",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Do I really need to show my face to make money online?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely not! Thousands of creators are earning 6-figures without ever showing their face. Our platform teaches you proven strategies for faceless content across YouTube, TikTok, Instagram, and more. You'll learn to use AI voices, stock footage, animations, and other techniques to create engaging content while staying completely anonymous."
                }
              },
              {
                "@type": "Question",
                "name": "How much money can I realistically make with faceless content?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Earnings vary based on niche, consistency, and monetization strategies. Our community members report earnings ranging from $1K-$50K+ per month. Beginners typically start seeing their first $1K-$3K within 3-6 months. The key is choosing the right niche, following our proven systems, and staying consistent."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to start making money?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most creators see their first earnings within 2-4 months. However, this depends on your niche, content quality, and consistency. Some niches like meditation content can monetize within 1-2 months, while others like finance education might take 3-4 months. Our platform helps you choose the fastest path to profitability for your situation."
                }
              },
              {
                "@type": "Question",
                "name": "I have no experience with content creation. Can I still succeed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Most of our successful members started with zero experience. Our step-by-step courses walk you through everything from niche selection to content creation to monetization. You'll get templates, scripts, and done-for-you resources that make the process simple, even if you're a complete beginner."
                }
              },
              {
                "@type": "Question",
                "name": "What's included in the membership?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You get access to our complete course library (50+ hours), AI tool discounts, done-for-you templates and scripts, weekly live coaching calls, private community access, niche finder tools, profitability calculator, and ongoing updates. Everything you need to build a profitable faceless content business is included."
                }
              }
            ]
          }
        ]}
      />
      <Header />
      <ExitIntentModal />
      <main id="main-content" role="main">
        <Hero />
        <WhyAnonymity />
        {/* ForeMedia E1 - top content */}
        <div className="flex justify-center my-6">
          <ForeMediaAd slot="e1" className="min-h-[90px]" wrapperClassName="w-full max-w-[970px] mx-auto" />
        </div>
        <CompetitorComparison />
        <Stats />
        <TrustIndicators />
        {/* Ad Banner */}
        <AdSenseDisplay size="728x90" className="my-8" />
        <Features />
        {/* ForeMedia C3 */}
        <div className="flex justify-center my-6">
          <ForeMediaAd slot="c3" className="min-h-[250px]" wrapperClassName="w-full max-w-[336px] mx-auto" />
        </div>
        <NichesShowcase />
        <ToolsShowcase />
        {/* ForeMedia C4, C5 */}
        <div className="flex flex-wrap justify-center gap-6 my-8">
          <ForeMediaAd slot="c4" className="min-h-[250px]" wrapperClassName="w-full max-w-[336px]" />
          <ForeMediaAd slot="c5" className="min-h-[250px]" wrapperClassName="w-full max-w-[336px]" />
        </div>
        <ArticleGrid />
        {/* Ad Banner */}
        <AdSenseDisplay size="300x250" className="my-8" />
        <Testimonials />
        <ProductLadder />
        <ExploreSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
