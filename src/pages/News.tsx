import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import SEO from "@/components/SEO";

export default function News() {
  return (
    <>
      <SEO
        title="LiveWire – News Feed | ContentAnonymity"
        description="Real-time news and agency updates for content creators and faceless businesses. Stay informed on industry trends."
        url="https://contentanonymity.com/news"
        canonical="https://contentanonymity.com/news"
        breadcrumbItems={[{ name: 'News', url: 'https://contentanonymity.com/news' }]}
      />
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <NewsFeed />
      </main>
      <Footer />
    </>
  );
}
