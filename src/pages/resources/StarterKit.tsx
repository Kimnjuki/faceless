import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLeads } from "@/hooks/useLeads";
import { trackButtonClick } from "@/utils/analytics";
import { SITE_URL } from "@/lib/site-url";

const breadcrumbItems = [
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Starter Kit", url: `${SITE_URL}/starter-kit` },
];

const resources = [
  {
    title: "30-Day Content Calendar",
    description:
      "Pre-planned publishing schedule with themes, hooks, and batch-create windows.",
    icon: Calendar,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Niche Validator Worksheet",
    description:
      "Fillable worksheet: 5 criteria for audience, demand, competition, monetization, sustainability.",
    icon: Target,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Content Blueprint Templates",
    description:
      "7 templates for scripts, thumbnails, hooks, and outlines — Google Docs & Notion.",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
  },
];

const howToSteps = [
  {
    name: "Enter Your Email",
    text: "Enter your email address. We respect your privacy and never share it.",
  },
  {
    name: "Download the Kit",
    text: "Check your inbox for the download link. If you don't see it, check spam.",
  },
  {
    name: "Build Your First Content",
    text: "Follow the 5-step workflow guide to create your first faceless content.",
  },
];

export default function StarterKit() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { createLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLead(email, "starter-kit");
      toast.success("Starter kit download link sent to your inbox!");
      setEmail("");
    } catch {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Free Faceless Content Starter Kit — Templates, Calendar, Validator"
        description="Download the free Starter Kit: 30-day calendar, niche validator worksheet, 7 content templates. Build your brand anonymously."
        url={`${SITE_URL}/starter-kit`}
        canonical={`${SITE_URL}/starter-kit`}
        howToData={{
          name: "How to Get Your Free Starter Kit",
          description: "Three steps to download and start using your free starter kit.",
          steps: howToSteps,
        }}
        faqData={[
          {
            question: "Is the starter kit really free?",
            answer: "Yes, absolutely. No credit card required. Just your email.",
          },
          {
            question: "Can I use this as a complete beginner?",
            answer: "Yes. The kit includes step-by-step guides and fillable templates.",
          },
          {
            question: "Will I get spam emails?",
            answer: "No spam ever. Weekly newsletter only, unsubscribe anytime.",
          },
        ]}
        breadcrumbItems={breadcrumbItems}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Free Download
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Free Faceless Content <span className="gradient-text">Starter Kit</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Templates, niche validator, and a 30-day content calendar to
                launch your anonymous content brand — <strong>free</strong>, no
                credit card, no spam.
              </p>

              {/* Email Capture */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
              >
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  autoComplete="email"
                  required
                  onClick={() => trackButtonClick("email-input-focus", "starter-kit")}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="gradient-primary hover:shadow-glow"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By downloading, you agree to our{" "}
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        </section>
        {/* Resources */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                What's Inside the Kit
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Everything you need to validate, plan, and create your first 30
                days of faceless content.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card
                      key={resource.title}
                      className="border-2 hover:border-primary/50 transition-colors text-center"
                    >
                      <CardContent className="pt-8 pb-6">
                        <div
                          className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mx-auto mb-4 text-white shadow-glow`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-xl mb-3">
                          {resource.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">
                How to Use the Kit
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Follow these three steps to get started in under 10 minutes.
              </p>
              <div className="space-y-8">
                {howToSteps.map((step, i) => (
                  <div key={step.name} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                        {i + 1}
                      </div>
                      {i < howToSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{step.name}</h3>
                      <p className="text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
