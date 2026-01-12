import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComparisonRow {
  feature: string;
  contentAnonymity: boolean;
  medium: boolean | "partial";
  substack: boolean | "partial";
  ghost: boolean | "partial";
  description: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Anonymous Signup",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "Create account without revealing real identity"
  },
  {
    feature: "No Real Name Required",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "Use pseudonym as primary identifier"
  },
  {
    feature: "IP Address Masking",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "We don't log your IP address"
  },
  {
    feature: "Crypto Payments",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "Accept anonymous cryptocurrency payments"
  },
  {
    feature: "VPN/Tor Friendly",
    contentAnonymity: true,
    medium: "partial",
    substack: "partial",
    ghost: "partial",
    description: "Optimized for privacy-focused networks"
  },
  {
    feature: "Pseudonymous Analytics",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "Analytics without personal data tracking"
  },
  {
    feature: "Email Privacy",
    contentAnonymity: true,
    medium: false,
    substack: false,
    ghost: false,
    description: "Email not shown publicly, masking available"
  },
  {
    feature: "Content Monetization",
    contentAnonymity: true,
    medium: true,
    substack: true,
    ghost: true,
    description: "Multiple monetization options"
  },
  {
    feature: "Custom Domain",
    contentAnonymity: true,
    medium: false,
    substack: true,
    ghost: true,
    description: "Use your own domain name"
  },
  {
    feature: "Email Newsletter",
    contentAnonymity: true,
    medium: false,
    substack: true,
    ghost: true,
    description: "Built-in email distribution"
  }
];

const platforms = [
  { name: "ContentAnonymity", slug: "contentAnonymity", color: "primary", badge: "Best for Anonymity" },
  { name: "Medium", slug: "medium", color: "secondary", badge: "Large Audience" },
  { name: "Substack", slug: "substack", color: "secondary", badge: "Newsletter Focus" },
  { name: "Ghost", slug: "ghost", color: "secondary", badge: "Open Source" }
];

export default function CompetitorComparison() {
  const getIcon = (value: boolean | "partial") => {
    if (value === true) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (value === "partial") {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <X className="h-5 w-5 text-red-500" />;
  };

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              ContentAnonymity vs. <span className="gradient-text">The Competition</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              See why ContentAnonymity is the only platform built for truly anonymous content creation
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-background border-b">
              <div className="grid grid-cols-5 gap-4 items-center">
                <CardTitle className="font-bold">Feature</CardTitle>
                {platforms.map((platform) => (
                  <div key={platform.slug} className="text-center">
                    <div className="font-bold text-lg mb-1">{platform.name}</div>
                    <Badge variant={platform.slug === "contentAnonymity" ? "default" : "secondary"} className="text-xs">
                      {platform.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {comparisonData.map((row, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-5 gap-4 p-4 items-center hover:bg-muted/50 transition-colors ${
                      row.contentAnonymity ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="font-medium">
                      <div className="mb-1">{row.feature}</div>
                      <div className={`text-xs ${row.contentAnonymity ? "text-foreground/80" : "text-muted-foreground"}`}>{row.description}</div>
                    </div>
                    <div className="flex justify-center">{getIcon(row.contentAnonymity)}</div>
                    <div className="flex justify-center">{getIcon(row.medium)}</div>
                    <div className="flex justify-center">{getIcon(row.substack)}</div>
                    <div className="flex justify-center">{getIcon(row.ghost)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              <strong className="text-foreground">ContentAnonymity is the only platform</strong> where every feature is designed with anonymity and privacy as the foundation, not an afterthought.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-base">
                ✅ 10/10 Anonymity Features
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base">
                ❌ Competitors: 0-2/10 Anonymity Features
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

