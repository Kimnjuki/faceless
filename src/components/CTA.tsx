import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLeads } from "@/hooks/useLeads";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { createLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createLead(email, 'cta');
      toast.success("Success! Check your email for next steps.");
      setEmail("");
    } catch (error) {
      // Error already handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Faceless Empire?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join 10,000+ creators who are building profitable businesses without showing their face. Start your free trial today.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              id="cta-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-foreground flex-1"
              autoComplete="email"
              required
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm opacity-75 mt-4">
            No credit card required • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
