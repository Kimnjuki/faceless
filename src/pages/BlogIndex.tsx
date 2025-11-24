import { useState } from "react";
import { Search, TrendingUp, Download } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ExitIntentModal from "../components/ExitIntentModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabaseApi } from "@/config/supabase";

const categories = ["All", "YouTube", "AI Tools", "Monetization", "Automation", "Niche Selection"];

const articles = [
  {
    title: "How to Start a Faceless YouTube Channel in 2025",
    excerpt: "Complete guide to launching and monetizing an anonymous content channel",
    category: "YouTube",
    readTime: "12 min",
    trending: true,
    slug: "faceless-youtube-channel-guide"
  },
  {
    title: "Top 10 AI Tools for Content Creators",
    excerpt: "Automate your content workflow with these powerful AI solutions",
    category: "AI Tools",
    readTime: "8 min",
    trending: true,
    slug: "ai-tools-content-creators"
  },
  {
    title: "Niche Selection Framework for 2025",
    excerpt: "Data-driven approach to finding profitable, low-competition niches",
    category: "Niche Selection",
    readTime: "15 min",
    trending: false,
    slug: "niche-selection-framework"
  }
];

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLeadMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabaseApi.createLead(email, 'blog-lead-magnet');
      toast.success("Success! Check your email for the Niche Finder Checklist.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ExitIntentModal />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Faceless Business Resources
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Guides, strategies, and insights to build your anonymous content empire
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article, index) => (
              <Card key={index} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    {article.trending && (
                      <Badge className="bg-primary/10 text-primary">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{article.readTime} read</span>
                    <Button variant="link" className="p-0">Read More →</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Niche Finder Checklist</h2>
              <p className="text-muted-foreground mb-6">
                Get our proven checklist with 100+ profitable niches, validation framework, and competition analysis
              </p>
              <form onSubmit={handleLeadMagnet} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="whitespace-nowrap">
                  Download Free
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam • Unsubscribe anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
