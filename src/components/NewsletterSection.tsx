import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageCircle, Users, Loader2 } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { trackButtonClick } from "@/utils/analytics";

const COMMUNITY_LINKS = [
  {
    label: "Discord Community",
    href: "https://discord.gg/contentanonymity",
    icon: MessageCircle,
    description: "Join 10,000+ faceless creators",
  },
  {
    label: "Facebook Group",
    href: "https://facebook.com/groups/contentanonymity",
    icon: Users,
    description: "Share strategies & get feedback",
  },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { createLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLead(email, "newsletter-section");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 border-t border-primary/10 bg-muted/20" aria-labelledby="newsletter-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold text-center mb-10">
            Join Our Newsletter & Community
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="rounded-2xl p-6 glass border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">Weekly Faceless Creator Tips</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get exclusive strategies, tool reviews, and case studies delivered to your inbox. No spam.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={() => trackButtonClick("newsletter-signup", "newsletter-section")}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Join the Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with faceless creators, share wins, and get support in our private communities.
              </p>
              <div className="flex flex-col gap-3">
                {COMMUNITY_LINKS.map(({ label, href, icon: Icon, description }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl glass border border-primary/10 hover:border-primary/30 transition-colors group"
                    onClick={() => trackButtonClick(`community-${label.toLowerCase().replace(/\s/g, "-")}`, "newsletter-section")}
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold block">{label}</span>
                      <span className="text-sm text-muted-foreground">{description}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
