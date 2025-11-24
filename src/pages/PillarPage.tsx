import { useParams } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export default function PillarPage() {
  const { pillarSlug } = useParams();
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress((scrolled / total) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    "Introduction",
    "Getting Started",
    "Advanced Strategies",
    "Tools & Resources",
    "Case Studies"
  ];

  return (
    <>
      <Progress value={readProgress} className="fixed top-0 left-0 right-0 z-50 h-1 rounded-none" />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {sections.map((section, i) => (
                      <a
                        key={i}
                        href={`#${section.toLowerCase().replace(/\s/g, "-")}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {section}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            <article className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {pillarSlug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    25 min read
                  </span>
                  <span>Updated Jan 2025</span>
                </div>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Guide
                </Button>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  Comprehensive guide to mastering {pillarSlug?.replace(/-/g, " ")} for your faceless business.
                </p>

                {sections.map((section, i) => (
                  <section key={i} id={section.toLowerCase().replace(/\s/g, "-")} className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">{section}</h2>
                    <p className="text-muted-foreground mb-4">
                      Detailed content about {section.toLowerCase()} would go here. This includes strategies,
                      examples, and actionable steps to implement in your faceless business.
                    </p>
                  </section>
                ))}
              </div>

              <Card className="bg-primary text-primary-foreground mt-12">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">Ready to Take Action?</h3>
                  <p className="mb-4 opacity-90">Get our complete implementation toolkit</p>
                  <Button variant="secondary">Get Started Now</Button>
                </CardContent>
              </Card>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
