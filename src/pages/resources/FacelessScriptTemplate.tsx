import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLeads } from "@/hooks/useLeads";
import { SITE_URL } from "@/lib/site-url";

const breadcrumbItems = [
  { name: "Home", url: `${SITE_URL}/` },
  {
    name: "Faceless YouTube Script Template",
    url: `${SITE_URL}/templates/faceless-youtube-script-template`,
  },
];

const templateSections = [
  {
    name: "Hook Framework (0:00–0:08)",
    description:
      "3-line hook: problem statement, curiosity gap, promise — stops the scroll instantly.",
  },
  {
    name: "Story Arc (0:08–3:00)",
    description:
      "3-act narrative flow: setup, conflict, resolution, with AI B-roll cues.",
  },
  {
    name: "CTA & Outro (3:00–end)",
    description:
      "Soft monetization hook, subscribe prompt, community plug — all faceless.",
  },
];

const faqData = [
  {
    question: "Is this template really free?",
    answer:
      "Yes. No credit card required — just your email to send the Google Doc link.",
  },
  {
    question: "Can I edit the template?",
    answer:
      "Yes — it's a Google Docs template. Click 'File → Make a copy' to edit it.",
  },
  {
    question: "Do I need any special software?",
    answer:
      "No. Just a Google account and a free AI voiceover tool (we link recommendations inside).",
  },
];

export default function FacelessScriptTemplate() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { createLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLead(email, "script-template");
      toast.success("Your template is ready! Check your inbox.");
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
        title="Free Faceless YouTube Script Template (Google Doc) — 2026"
        description="Download our proven faceless YouTube script template. Hook framework, 3-act story arc, CTA outro — ready in Google Docs."
        url={`${SITE_URL}/templates/faceless-youtube-script-template`}
        canonical={`${SITE_URL}/templates/faceless-youtube-script-template`}
        softwareApplication={{
          name: "Faceless YouTube Script Template",
          description:
            "A Google Docs template for creating scroll-stopping faceless YouTube videos.",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: { price: "0", priceCurrency: "USD" },
        }}
        faqData={faqData}
        breadcrumbItems={breadcrumbItems}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                Free Google Docs Template
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Faceless YouTube{" "}
                <span className="gradient-text">Script Template</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Hook framework, 3-act story arc, and CTA outro — all in a
                ready-to-edit Google Doc. Download free, no credit card.
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
                />
                <Button type="submit" disabled={loading} className="gradient-primary">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
        {/* Template Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">
                What's in the Template
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                A battle-tested structure for faceless videos that stop the
                scroll, hold attention, and drive engagement.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templateSections.map((section) => (
                  <Card key={section.name} className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">
                Why This Template Works
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Designed specifically for faceless creators who can't rely on
                on-camera presence or personal charisma.
              </p>
              <div className="space-y-4">
                {[
                  "Hook framework proven to boost retention in first 8 seconds",
                  "Story arc optimized for AI voiceover pacing and B-roll cues",
                  "CTA framework that works without face or personal brand",
                  "Used by 500+ anonymous creators in our community",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">{benefit}</p>
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
