import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const products = [
  {
    tier: "Entry",
    name: "Niche Research Template Pack",
    price: 27,
    description: "Perfect for getting started with validated niche research",
    features: ["10+ Research Templates", "Competitor Analysis Tools", "Trend Tracking Sheets", "Lifetime Updates"],
    popular: false
  },
  {
    tier: "Flagship",
    name: "Faceless Automation Blueprint",
    price: 197,
    description: "Complete course to build and automate your faceless business",
    features: ["50+ Video Lessons", "Automation Workflows", "Content Templates", "Private Community Access", "Monthly Q&A Calls", "1-on-1 Strategy Session"],
    popular: true
  },
  {
    tier: "High-Ticket",
    name: "Done-For-You Channel Setup",
    price: 2497,
    description: "We build your entire faceless content system for you",
    features: ["Complete Channel Setup", "30 Days of Content", "Monetization Strategy", "Custom Automation", "3 Months Support", "Priority Access"],
    popular: false
  }
];

export default function ProductLadder() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Path to Success
          </h2>
          <p className="text-lg text-muted-foreground">
            From templates to done-for-you services, we have the perfect solution for your journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <Card key={index} className={`relative ${product.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="text-sm text-muted-foreground mb-2">{product.tier}</div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${product.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={product.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
