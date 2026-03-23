import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function About() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const author = useQuery(api.profiles.getAuthorProfile, hasConvex ? {} : "skip");

  return (
    <>
      <SEO
        title="About Us — ContentAnonymity | Faceless Creator Platform"
        description="Who we are, why we built ContentAnonymity, and how we help creators worldwide earn anonymously with AI-native workflows—especially across Africa."
        url="https://contentanonymity.com/about"
        canonical="https://contentanonymity.com/about"
        breadcrumbItems={[{ name: "About", url: "https://contentanonymity.com/about" }]}
      />
      <Header />
      <div className="min-h-screen py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-4">About ContentAnonymity</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ContentAnonymity</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Real people, a clear mission, and tools built for anonymous digital entrepreneurship.
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold">Who runs ContentAnonymity — and why</h2>
              <p>
                ContentAnonymity exists because faceless content is no longer a side curiosity—it is a legitimate path to
                global income. Many of us started as solo operators: building scripts after work, testing AI voice tools on
                weekends, and publishing without ever turning on a camera. That experience shaped this platform: we wanted
                one place where anonymity is a feature, not a limitation—where “faceless” means focus, privacy, and scale—not
                low quality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Our mission</h2>
              <p>
                We are democratising anonymous income for creators globally. Whether you are in Nairobi, Lagos, London, or
                anywhere with a laptop and bandwidth, you should be able to research niches, plan content, and monetise
                without building a personal brand you do not want. Our mission is to give you education, tools, and data
                so you can compete on ideas and execution—not on showing your face.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">What makes us different</h2>
              <p>
                <strong>Africa-first perspective:</strong> We explicitly design for creators on the continent—payment rails,
                time zones, and real-world constraints—while helping you earn in strong global currencies where it makes sense.
                <br />
                <br />
                <strong>AI-native workflows:</strong> From niche research to script outlines and platform guides, our content
                assumes you will use modern AI responsibly to ship faster—not to spam low-value pages, but to scale
                production you still own and edit.
              </p>
            </section>

            {hasConvex && author === undefined && (
              <div className="flex items-center gap-2 text-muted-foreground not-prose">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading team profile…
              </div>
            )}

            {author && (
              <Card className="not-prose border-primary/20">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-2">Editorial lead</h2>
                  <p className="font-medium">{author.fullName ?? "ContentAnonymity Editorial"}</p>
                  {author.verifiedExpert && (
                    <Badge variant="secondary" className="mt-2">
                      Verified expert
                    </Badge>
                  )}
                  {author.credentials && author.credentials.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">{author.credentials.join(" · ")}</p>
                  )}
                  {author.bio && <p className="text-muted-foreground mt-4 leading-relaxed">{author.bio}</p>}
                  {author.knowsAbout && author.knowsAbout.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {author.knowsAbout.map((k) => (
                        <Badge key={k} variant="outline">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!hasConvex && (
              <p className="text-muted-foreground not-prose">
                Connect Convex to surface a live verified author profile from our database.
              </p>
            )}

            <section>
              <h2 className="text-2xl font-semibold">Contact</h2>
              <p>
                Questions, partnerships, or press? Reach us through the{" "}
                <Link to="/contact" className="text-primary underline">
                  contact form
                </Link>
                . We read every message.
              </p>
            </section>

            <div className="not-prose pt-4">
              <Button asChild size="lg">
                <Link to="/contact">Get in touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
