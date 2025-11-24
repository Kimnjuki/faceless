import Header from "../components/Header";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import NichesShowcase from "../components/NichesShowcase";
import ProductLadder from "../components/ProductLadder";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";

export default function HomePage() {
  return (
    <>
      <Header />
      <ExitIntentModal />
      <main>
        <Hero />
        <Stats />
        <Features />
        <NichesShowcase />
        <Testimonials />
        <ProductLadder />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
