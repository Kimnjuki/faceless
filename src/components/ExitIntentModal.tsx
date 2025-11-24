import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLeads } from "@/hooks/useLeads";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const { createLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createLead(email, 'exit-intent');
      toast.success("Success! Check your email for your 40% discount code.");
      setEmail("");
      setOpen(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold mb-2">Wait! Don't Miss Out</h2>
          <p className="text-muted-foreground mb-6">
            Get 40% off your first purchase + our free Niche Finder Checklist
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="w-full">
              Claim My 40% Discount
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            Limited time offer • No spam, unsubscribe anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
