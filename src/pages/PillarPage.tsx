import { useParams } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
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

  const pillarTitle = pillarSlug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || 'Content Guide';
  const pageTitle = `${pillarTitle} - Complete Faceless Content Guide`;
  const pageDescription = `Master ${pillarTitle.toLowerCase()} for your faceless content business. Learn proven strategies, tools, and tactics to build a profitable anonymous content empire.`;
  const canonicalUrl = `https://contentanonymity.com/${pillarSlug || ''}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${pillarTitle.toLowerCase()}, faceless content strategy, anonymous content creation, faceless business guide`}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="article"
      />
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
                  Comprehensive guide to mastering {pillarSlug?.replace(/-/g, " ")} for your faceless business. This in-depth resource covers everything you need to know to build a profitable anonymous content empire, from foundational concepts to advanced monetization strategies.
                </p>

                {sections.map((section, i) => (
                  <section key={i} id={section.toLowerCase().replace(/\s/g, "-")} className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">{section}</h2>
                    {section === "Introduction" && (
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Welcome to the complete guide on {pillarTitle.toLowerCase()} for faceless content creators. Whether you're just starting your anonymous content journey or looking to scale your existing business, this comprehensive resource provides actionable strategies, proven frameworks, and real-world examples to help you succeed.
                        </p>
                        <p>
                          Faceless content creation has emerged as one of the most profitable and scalable business models in 2025. By leveraging AI tools, strategic content planning, and proven monetization methods, thousands of creators are building six-figure businesses without ever showing their face. This guide will walk you through every aspect of building a successful faceless content empire.
                        </p>
                        <p>
                          Throughout this guide, you'll learn how to choose the right niche, create engaging content at scale, implement effective monetization strategies, and build systems that allow your business to grow while maintaining complete anonymity. Each section includes practical examples, tool recommendations, and step-by-step instructions you can implement immediately.
                        </p>
                      </div>
                    )}
                    {section === "Getting Started" && (
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Getting started with {pillarTitle.toLowerCase()} requires a strategic approach from day one. The first step is understanding your target audience and identifying the specific problems you'll solve for them. Research successful creators in your chosen niche to understand what content performs well, what formats audiences prefer, and how top creators structure their content.
                        </p>
                        <p>
                          Next, you'll need to set up your content creation system. This includes selecting the right AI tools for your niche, establishing a consistent brand voice, and creating templates that streamline your workflow. Many successful faceless creators start with free tools like Canva, CapCut, and free stock footage libraries, then gradually invest in premium tools as their revenue grows.
                        </p>
                        <p>
                          Finally, develop a content calendar that ensures consistent posting. Aim for at least 3-5 pieces of content per week to build algorithm momentum. Consistency is more important than perfection when starting out. Focus on creating value-driven content that solves specific problems for your audience, and iterate based on performance data and feedback.
                        </p>
                      </div>
                    )}
                    {section === "Advanced Strategies" && (
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Once you've established a foundation, advanced strategies can help you scale your faceless content business more efficiently. Automation is key to scaling without burning out. Invest in tools that streamline your workflow, from content ideation to publishing. Use AI for script generation, voice cloning for consistent narration, and automated scheduling to maintain consistent posting.
                        </p>
                        <p>
                          Content diversification is another critical advanced strategy. Don't rely on a single platform or content format. Repurpose your YouTube videos into TikTok content, Instagram Reels, blog posts, and email newsletters. This multi-platform approach maximizes your reach and creates multiple revenue streams while reducing your dependence on any single algorithm.
                        </p>
                        <p>
                          Building systems and processes for every aspect of your business is essential for sustainable growth. Document your workflows for content research, script writing, video editing, thumbnail creation, and promotion. This allows you to outsource tasks that don't require your unique expertise, freeing up time for high-value activities like strategy and content planning.
                        </p>
                      </div>
                    )}
                    {section === "Tools & Resources" && (
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          The right tools can make the difference between struggling to create content and building a scalable content empire. For faceless creators, essential tools include AI voice generators for consistent narration, video editing software for professional production, stock footage libraries for visual content, and automation tools for workflow efficiency.
                        </p>
                        <p>
                          When selecting tools, prioritize those that integrate well with your existing workflow and offer features specific to your niche. Many successful faceless creators use a combination of free and paid tools, starting with free options and upgrading as their revenue grows. Always test tools with a free trial before committing to a paid subscription.
                        </p>
                        <p>
                          Beyond software tools, resources like content templates, script frameworks, and community support can significantly accelerate your growth. Join communities of faceless creators to learn from others' experiences, share strategies, and stay updated on the latest tools and techniques. Many successful creators credit their community connections as a key factor in their success.
                        </p>
                      </div>
                    )}
                    {section === "Case Studies" && (
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Real-world case studies provide valuable insights into what actually works in faceless content creation. One notable case study involves a horror story channel that reached $15,000 per month in revenue without ever showing a face. The creator used AI voice generation, stock footage, and strategic content planning to build a highly engaged audience.
                        </p>
                        <p>
                          Another successful case study features a philosophy channel that leveraged stoic content to build a six-figure business. By focusing on timeless wisdom and using consistent branding, the creator attracted a dedicated audience willing to pay for premium content and courses. The key was finding a niche with passionate audiences and creating content that provided genuine value.
                        </p>
                        <p>
                          These case studies demonstrate that success in faceless content creation is achievable with the right strategy, tools, and consistency. The common threads among successful creators include choosing profitable niches, creating value-driven content, implementing multiple monetization streams, and maintaining consistent posting schedules. By following proven frameworks and learning from successful examples, you can build your own profitable faceless content business.
                        </p>
                      </div>
                    )}
                    {!["Introduction", "Getting Started", "Advanced Strategies", "Tools & Resources", "Case Studies"].includes(section) && (
                      <p className="text-muted-foreground mb-4">
                        Detailed content about {section.toLowerCase()} would go here. This includes strategies, examples, and actionable steps to implement in your faceless business.
                      </p>
                    )}
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
