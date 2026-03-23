import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type EmailOptInProps = {
  source?: string;
  leadMagnetId?: string;
  placeholder?: string;
  className?: string;
};

export default function EmailOptIn({
  source = "inline_cta",
  leadMagnetId,
  placeholder = "you@example.com",
  className = "",
}: EmailOptInProps) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const subscribe = useMutation(api.email_subscribers.create);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasConvex) {
      toast.error("Newsletter signup requires Convex (VITE_CONVEX_URL).");
      return;
    }
    if (!email.trim()) return;
    setPending(true);
    try {
      await subscribe({
        email: email.trim(),
        source,
        ...(leadMagnetId ? { leadMagnetId: leadMagnetId as any } : {}),
      });
      toast.success("You are subscribed.");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Could not subscribe. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        autoComplete="email"
      />
      <Button type="submit" disabled={pending || !hasConvex}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </Button>
    </form>
  );
}
