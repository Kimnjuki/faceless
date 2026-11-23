import { Link } from "react-router-dom";
import { FileText, Scale, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/site-url";
import { trustSections } from "@/config/trustSafety";

const iconComponents: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  FileText, Scale, AlertTriangle, CheckCircle, Shield,
};

const breadcrumbItems = [
  { name: "Home", url: `${SITE_URL}/` },
  { name: "Trust & Safety", url: `${SITE_URL}/trust-and-safety` },
];

export default function TrustSafety() {
  return (
    <>
      <SEO
        title="Trust & Safety | Editorial Standards, AI Policy, Copyright & Privacy"
        description="Our commitment to editorial independence, AI ethics, copyright compliance, affiliate transparency, and creator privacy."
        url={`${SITE_URL}/trust-and-safety`}
        canonical={`${SITE_URL}/trust-and-safety`}
        breadcrumbItems={breadcrumbItems}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Trust & Safety",
          description:
            "Our policies on editorial standards, AI use, copyright, affiliate relationships, and creator privacy.",
          url: `${SITE_URL}/trust-and-safety`,
        }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4" variant="secondary">
                Trust & Safety
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Our Commitment to Responsible Creation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                At ContentAnonymity, we believe in building a sustainable,
                ethical, and privacy-first ecosystem for anonymous creators.
                These policies govern how we operate and how our community
                should operate.
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {trustSections.map((section) => {
                const Icon = iconComponents[section.iconName] ?? FileText;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-20"
                    aria-labelledby={`${section.id}-heading`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-glow shrink-0`}
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {section.title}
                        </Badge>
                        <h2
                          id={`${section.id}-heading`}
                          className="text-2xl md:text-3xl font-bold"
                        >
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-0 lg:ml-16 space-y-6">
                      {section.content.map((block) => (
                        <div key={block.title} className="prose prose-sm max-w-none">
                          <h3 className="text-xl font-semibold mb-2">
                            {block.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {block.text}
                          </p>
                          {block.list && (
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                              {block.list.map((item, i) => (
                                <li key={`list-${item.slice(0, 20)}-${i}`}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {section.related && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {section.related.map((rel) => (
                            <Button key={rel.href} variant="link" size="sm" asChild>
                              <Link to={rel.href}>{rel.label}</Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-16 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Related Resources
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="outline" asChild className="justify-start">
                  <Link to="/privacy-policy">
                    <FileText className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link to="/terms">
                    <Scale className="mr-2 h-4 w-4" />
                    Terms of Service
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link to="/affiliate-disclosure">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Affiliate Disclosure
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link to="/privacy/threat-models">
                    <Shield className="mr-2 h-4 w-4" />
                    Threat Models Guide
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
