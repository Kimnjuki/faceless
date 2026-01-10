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

export default function HomePage() {
  return (
    <>
      <Header />
      <ExitIntentModal />
      <main>
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
