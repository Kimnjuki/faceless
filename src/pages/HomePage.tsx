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
import LatestArticles from "../components/LatestArticles";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import SEO from "../components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="ContentAnonymity - Build Your Faceless Content Empire | Earn 6-Figures Anonymously"
        description="Build a profitable faceless content business in 2025. Complete platform with AI automation, proven monetization strategies, and step-by-step courses. Join 10,000+ creators earning anonymously. Start free trial."
        keywords="faceless content business, anonymous content creator, faceless YouTube channel, faceless TikTok, faceless Instagram, AI content creation, anonymous entrepreneurship, faceless business 2025, how to make money without showing face"
        url="https://contentanonymity.com"
        canonical="https://contentanonymity.com"
        structuredData={[
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
        <CompetitorComparison />
        <Stats />
        <TrustIndicators />
        <Features />
        <NichesShowcase />
        <ToolsShowcase />
        <LatestArticles />
        <Testimonials />
        <ProductLadder />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
