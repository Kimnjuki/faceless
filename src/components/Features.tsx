import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, TrendingUp, Users, Workflow, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automated Content Creation",
    description: "AI-powered tools to generate, schedule, and publish content across platforms without manual effort."
  },
  {
    icon: Target,
    title: "Niche Selection Mastery",
    description: "Data-driven research tools to identify profitable niches with low competition and high demand."
  },
  {
    icon: TrendingUp,
    title: "Revenue Diversification",
    description: "Multiple monetization strategies including affiliates, digital products, and high-ticket services."
  },
  {
    icon: Users,
    title: "Community & Support",
    description: "Join thousands of faceless creators sharing strategies, wins, and accountability."
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Pre-built systems and templates to streamline every aspect of your content business."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Build your empire while maintaining complete anonymity and protecting your identity."
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools, training, and community to build a profitable faceless content business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground/75 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
