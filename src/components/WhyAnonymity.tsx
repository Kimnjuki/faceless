import { Shield, EyeOff, Lock, Globe, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Complete Identity Protection",
    description: "Your real name is never required. Use a pseudonym and maintain complete anonymity while building your audience and revenue."
  },
  {
    icon: EyeOff,
    title: "Zero Tracking & Surveillance",
    description: "Unlike other platforms, we don't log IP addresses or track your location. VPN and Tor friendly — your privacy is truly protected."
  },
  {
    icon: Lock,
    title: "Anonymous Monetization",
    description: "Accept payments via cryptocurrency to maintain anonymity. Your financial identity stays separate from your creator persona."
  },
  {
    icon: Globe,
    title: "Global Reach, Local Privacy",
    description: "Create content that reaches millions while keeping your personal identity completely private — perfect for sensitive topics or whistleblowing."
  },
  {
    icon: TrendingUp,
    title: "Freedom to Experiment",
    description: "Try different niches, controversial topics, or pivot your content strategy without personal reputation risk. Build multiple anonymous brands."
  },
  {
    icon: Users,
    title: "Community Without Exposure",
    description: "Join thousands of anonymous creators building successful businesses without revealing who they really are. Connect, learn, grow — anonymously."
  }
];

export default function WhyAnonymity() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Anonymous</span> Content Creation?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            While platforms like Medium, Substack, and Ghost require your real identity, ContentAnonymity is built from the ground up to protect your privacy and enable truly anonymous content creation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="hover-lift transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl gradient-text">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-background rounded-2xl p-8 md:p-12 border border-primary/20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Privacy is Not a Feature — It's Our Foundation
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Every aspect of ContentAnonymity is designed to protect your identity. From anonymous signup and payment processing to IP masking and pseudonymous analytics — we've built the platform creators need when they can't (or don't want to) reveal who they are.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Lock className="h-4 w-4 text-primary" />
                <span className="font-semibold">No Real Name Required</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <EyeOff className="h-4 w-4 text-primary" />
                <span className="font-semibold">IP Address Masking</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-semibold">VPN & Tor Friendly</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-semibold">Crypto Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




