import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Contact() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const createTicket = useMutation(api.supportTickets.create);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasConvex) {
      toast.error("Backend not configured. Set VITE_CONVEX_URL to submit tickets.");
      return;
    }
    if (!email.trim() || !subject.trim() || !description.trim()) {
      toast.error("Please fill in email, subject, and message.");
      return;
    }
    setPending(true);
    try {
      await createTicket({
        contactName: name.trim() || undefined,
        contactEmail: email.trim(),
        subject: subject.trim(),
        description: description.trim(),
        priority,
      });
      toast.success("Message sent. We will reply by email.");
      setSubject("");
      setDescription("");
    } catch (err) {
      console.error(err);
      toast.error("Could not send message. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SEO
        title="Contact Us — ContentAnonymity Support"
        description="Contact ContentAnonymity for support, privacy questions, partnerships, and press. We route requests through our ticketing system."
        url="https://contentanonymity.com/contact"
        canonical="https://contentanonymity.com/contact"
        breadcrumbItems={[{ name: "Contact", url: "https://contentanonymity.com/contact" }]}
      />
      <Header />
      <div className="min-h-screen py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-xl">
          <Badge className="mb-4">Contact</Badge>
          <h1 className="text-4xl font-bold mb-4">Contact us</h1>
          <p className="text-muted-foreground mb-8">
            For privacy-related requests, mention “Privacy” in the subject. We respond by email.
          </p>

          {!hasConvex && (
            <p className="text-destructive text-sm mb-6">
              Convex is not configured (missing VITE_CONVEX_URL). The form will not submit until the backend is connected.
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Message *</Label>
              <Textarea
                id="description"
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail."
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={pending || !hasConvex} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
