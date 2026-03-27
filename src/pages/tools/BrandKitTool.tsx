import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BrandKitPanel from "@/components/creator-studio/BrandKitPanel";

export default function BrandKitTool() {
  return (
    <>
      <SEO
        title="Faceless Channel Name & Brand Kit Generator | ContentAnonymity"
        description="Generate anonymous channel names, taglines, colors, and a style guide for faceless YouTube, TikTok, or Instagram."
        canonical="https://contentanonymity.com/tools/brand-kit"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Brand kit generator</h1>
        <p className="text-muted-foreground mb-8">
          AI-assisted identity for faceless channels — no personal details required.
        </p>
        <BrandKitPanel />
      </main>
      <Footer />
    </>
  );
}
