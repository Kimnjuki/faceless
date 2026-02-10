import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dailySchedule = [
  { day: 1, title: "Niche Selection Mastery", description: "Find your profitable niche in under 2 hours" },
  { day: 2, title: "Content Creation System", description: "Build your content workflow and templates" },
  { day: 3, title: "Automation Setup", description: "Implement tools to save 10+ hours per week" },
  { day: 4, title: "Monetization Strategy", description: "Set up multiple revenue streams" },
  { day: 5, title: "Launch & Scale", description: "Go live and start generating income" }
];

export default function ChallengeFunnel() {
  const { name } = useParams();
  const challengeName = name ? name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Launch Your Faceless Business";
  const canonicalUrl = name ? `https://contentanonymity.com/challenge/${name}` : "https://contentanonymity.com/challenge";

  return (
    <>
      <SEO
        title={name ? `5-Day Challenge: ${challengeName} | ContentAnonymity` : "5-Day Challenge: Launch Your Faceless Business | ContentAnonymity"}
        description="Join 5,000+ creators in our free 5-day challenge to launch your faceless business. Step-by-step system to build a profitable anonymous content empire."
        keywords="faceless business challenge, 5 day challenge, faceless content challenge, free challenge"
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="event"
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">5-DAY CHALLENGE</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Launch Your Faceless Business in 5 Days
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join 5,000+ creators who transformed their income with our proven step-by-step challenge
              </p>
              
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">Join the Challenge</h2>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                    </div>
                    <Button size="lg" className="w-full">Start Free Challenge</Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Starts January 20, 2025
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">5-Day Roadmap</h2>
              <div className="space-y-4">
                {dailySchedule.map((day) => (
                  <Card key={day.day}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{day.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{day.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-muted/50 mb-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">What's Included:</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Daily video training",
                    "Downloadable worksheets",
                    "Private community access",
                    "Live Q&A sessions",
                    "Bonus templates & tools",
                    "Certificate of completion"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground mb-8">
                "I launched my first faceless channel during the challenge and made my first $500 in week 2!" - Alex M.
              </p>
              <Button size="lg">Join 5,000+ Creators</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}