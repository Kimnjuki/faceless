import { useParams } from "react-router-dom";
import { Film, TrendingUp, Shield, Play, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_URL } from "@/lib/site-url";

type SubTopic = "ai-workflows" | "quality-control" | "youtube" | "monetization";

const subTopicConfig: Record<SubTopic, {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  breadcrumb: string;
  pages: { label: string; href: string }[];
}> = {
  "ai-workflows": {
    title: "AI Workflows for Faceless Content",
    description: "Step-by-step AI-powered production workflows for anonymous creators.",
    icon: Play,
    color: "from-violet-500 to-purple-500",
    breadcrumb: "AI Workflows",
    pages: [
      { label: "Script Generation with AI", href: "/faceless-content/ai-workflows#script-generation" },
      { label: "AI Voiceover Guide", href: "/faceless-content/ai-workflows#voiceover" },
      { label: "Automated Editing", href: "/faceless-content/ai-workflows#editing" },
    ],
  },
  "quality-control": {
    title: "Quality Control for Faceless Content",
    description: "Maintain high editorial and production standards across your anonymous content pipeline.",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    breadcrumb: "Quality Control",
    pages: [
      { label: "Fact-Checking Framework", href: "/faceless-content/quality-control#fact-checking" },
      { label: "Brand Voice Guidelines", href: "/faceless-content/quality-control#brand-voice" },
      { label: "Pre-Publish Checklist", href: "/faceless-content/quality-control#checklist" },
    ],
  },
  youtube: {
    title: "YouTube Playbook for Faceless Channels",
    description: "Complete YouTube strategy for anonymous creators: niche selection, SEO, and monetization paths.",
    icon: Film,
    color: "from-red-500 to-pink-500",
    breadcrumb: "YouTube Playbook",
    pages: [
      { label: "Niche Selection", href: "/faceless-content/youtube#niche" },
      { label: "YouTube SEO", href: "/faceless-content/youtube#seo" },
      { label: "Thumbnail System", href: "/faceless-content/youtube#thumbnails" },
    ],
  },
  monetization: {
    title: "Monetize Your Faceless Content",
    description: "Revenue strategies for anonymous creators: ads, affiliate, digital products, and sponsorships.",
    icon: TrendingUp,
    color: "from-pink-500 to-rose-500",
    breadcrumb: "Monetization",
    pages: [
      { label: "Ad Revenue", href: "/faceless-content/monetization#ads" },
      { label: "Affiliate Marketing", href: "/faceless-content/monetization#affiliate" },
      { label: "Digital Products", href: "/faceless-content/monetization#products" },
    ],
  },
};

const mainGuideSections = [
  {
    id: "planning",
    title: "Planning & Strategy",
    description: "Niche research, content planning, and anonymous branding foundations.",
    color: "from-blue-500 to-cyan-500",
    icon: Target,
    content: [
      { title: "Niche Selection", text: "Pick underserved topics with demand and low creator-faceability requirements." },
      { title: "Content Calendar", text: "Batch-plan 30 days of content without revealing your identity." },
      { title: "Brand Identity", text: "Build an anonymous brand voice and visual style guide." },
    ],
  },
  {
    id: "production",
    title: "AI Production Pipeline",
    description: "End-to-end workflows for script generation, voiceover, and video editing.",
    color: "from-violet-500 to-purple-500",
    icon: Play,
    content: [
      { title: "Script Writing", text: "Use LLM prompts to generate hooks, outlines, and full scripts." },
      { title: "Voice Generation", text: "AI voice tools that sound natural for faceless narration." },
      { title: "Video Assembly", text: "Stock footage, B-roll, and automated editing tools." },
    ],
  },
  {
    id: "growth",
    title: "Growth & Distribution",
    description: "SEO, platform algorithms, and cross-channel promotion tactics.",
    color: "from-emerald-500 to-teal-500",
    icon: TrendingUp,
    content: [
      { title: "Platform SEO", text: "YouTube SEO, TikTok hashtags, and Reddit growth hacks." },
      { title: "Thumbnail Design", text: "Templates and tools for click-worthy thumbnails." },
      { title: "Community Building", text: "Engagement strategies without personal disclosure." },
    ],
  },
  {
    id: "monetization",
    title: "Monetization & Scale",
    description: "Multiple revenue streams and scaling your anonymous content business.",
    color: "from-pink-500 to-rose-500",
    icon: TrendingUp,
    content: [
      { title: "Ad Revenue", text: "YouTube ad optimization and TikTok monetization." },
      { title: "Affiliate Marketing", text: "High-converting faceless affiliate funnels." },
      { title: "Digital Products", text: "Create and sell courses, templates, and guides anonymously." },
    ],
  },
];

const howToSteps = [
  {
    name: "Choose Your Niche",
    text: "Research underserved topics where faceless content has high demand. Look for niches with strong search volume and low personal-brand requirements.",
  },
  {
    name: "Set Up Anonymous Infrastructure",
    text: "Create a dedicated email, brand name, and social accounts. Never use your personal identity for faceless channels.",
  },
  {
    name: "Build Your AI Workflow",
    text: "Use AI tools for script writing, voice-generation, and automated video editing to produce content at scale.",
  },
  {
    name: "Publish & Optimize",
    text: "Upload consistently, track performance, and A/B test thumbnails, titles, and hooks to improve CTR.",
  },
  {
    name: "Monetize & Scale",
    text: "Once you hit monetization thresholds, add affiliate links, digital products, and sponsorships to diversify revenue.",
  },
];

const faqData = [
  {
    question: "What is faceless content?",
    answer: "Faceless content is any media — typically videos, posts, or podcasts — that delivers value without requiring the creator's face or personal identity to be shown or heard.",
  },
  {
    question: "Do I need a camera or microphone?",
    answer: "No. Faceless creators rely on AI voice generators, stock footage, screen recordings, text-to-speech, and royalty-free music and visuals to produce professional content.",
  },
  {
    question: "Can I still scale a faceless channel?",
    answer: "Yes. Many faceless channels reach millions of views by batching content, automating editing workflows, and optimizing for SEO across multiple platforms.",
  },
  {
    question: "How much money can I make?",
    answer: "Revenue varies widely based on niche, content quality, audience size, and monetization mix. Some faceless creators achieve part-time or full-time income, while most are still building toward consistent monetization. Treat any projection as illustrative, not guaranteed—test and measure your own results.",
  },
  {
    question: "Is it legal to use AI for content?",
    answer: "Yes, AI-generated content is legal. Always disclose AI usage where required, attribute stock footage/music correctly, and avoid copyright infringement.",
  },
];

export default function FacelessContentGuide() {
  const { subTopic } = useParams<{ subTopic?: SubTopic }>();
  const isSubTopic = !!subTopic;
  const config = subTopic ? subTopicConfig[subTopic as SubTopic] : null;

  const pageTitle = isSubTopic && config
    ? config.title
    : "Faceless Content Guide — Build Anonymous Content";

  const pageDescription = isSubTopic && config
    ? config.description
    : "Complete guide to creating, growing, and monetizing faceless content without showing your face. Step-by-step AI workflows, YouTube strategy, and monetization tactics for anonymous creators.";

  const canonicalUrl = `${SITE_URL}/faceless-content${isSubTopic ? `/${subTopic}` : ""}`;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Faceless Content Guide", url: `${SITE_URL}/faceless-content` },
    ...(isSubTopic && config
      ? [{ name: config.breadcrumb, url: canonicalUrl }]
      : []),
  ];

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="website"
        reviewData={{ rating: 4.9, reviewCount: 120, bestRating: 5, worstRating: 1 }}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: pageTitle,
          description: pageDescription,
          url: canonicalUrl,
        }}
        breadcrumbItems={breadcrumbItems}
        faqData={isSubTopic ? undefined : faqData}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {isSubTopic && config ? (
          <>
            <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
              <div className="container mx-auto px-4 text-center">
                <Badge className="mx-auto mb-6" variant="outline">
                  {config.breadcrumb}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{config.title}</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {config.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-10">
                  {config.pages.map((page) => (
                    <a
                      key={page.label}
                      href={page.href}
                      className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-colors"
                    >
                      {page.label}
                    </a>
                  ))}
                </div>
                <Button variant="outline" asChild className="mt-8">
                  <a href="/faceless-content">Back to Main Guide</a>
                </Button>
              </div>
            </section>

            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-12">
                    {config.pages.map((page) => (
                      <div key={page.label} className="border-b pb-8 last:border-0">
                        <h3 id={page.label} className="text-2xl font-bold mb-2">{page.label}</h3>
                        <p className="text-muted-foreground mb-6">
                          Comprehensive guidance on {page.label.toLowerCase()} for faceless content creators.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                          <Card className="border-2 p-6">
                            <CardHeader>
                              <CardTitle>Best Practices</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                Approaches for {page.label.toLowerCase()} that work for anonymous creators.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border-2 p-6">
                            <CardHeader>
                              <CardTitle>Tools & Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                Recommended software, templates, and frameworks for {page.label.toLowerCase()}.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border-2 p-6">
                            <CardHeader>
                              <CardTitle>Common Mistakes</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                Pitfalls to avoid when implementing {page.label.toLowerCase()}.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Faceless Content Guide</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to build, grow, and monetize faceless content — from AI workflows
                  to YouTube strategy.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-10">
                  {Object.entries(subTopicConfig).map(([key, cfg]) => (
                    <a
                      key={key}
                      href={`/faceless-content/${key}`}
                      className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-colors"
                    >
                      {cfg.breadcrumb}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">What You'll Learn</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {mainGuideSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id} className="p-6 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-500 transition-colors">
                        <div className="w-12 h-12 rounded-lg gradient mb-4 flex items-center justify-center" style={{ background: section.color }}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                        <p className="text-muted-foreground mb-4">{section.description}</p>
                        <div className="space-y-2">
                          {section.content.map((item, i) => (
                            <div key={i} className="text-sm text-muted-foreground">
                              <strong>{item.title}:</strong> {item.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="py-20 bg-slate-900/50">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Quick Start Steps</h2>
                  <ol className="space-y-6">
                    {howToSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{step.name}</h3>
                          <p className="text-muted-foreground">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqData.map((faq, i) => (
                      <div key={i} className="p-6 rounded-xl border border-slate-700 bg-slate-800/50">
                        <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
