import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function CollabHub() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const propose = useMutation(api.creatorContent.proposeCollab);
  const [collabType, setCollabType] = useState<
    "co_channel" | "script_swap" | "affiliate_split" | "series"
  >("script_swap");
  const [description, setDescription] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConvex || !description.trim()) return;
    await propose({ collabType, description: description.trim() });
    toast.success("Collab request recorded (demo). Matching ships in a later release.");
    setDescription("");
  };

  return (
    <>
      <SEO
        title="Collab Hub | ContentAnonymity"
        description="Anonymous creator collaboration requests — stealth handles & matching."
        canonical="https://contentanonymity.com/collab-hub"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-xl">
        <h1 className="text-3xl font-bold mb-2">Collab hub</h1>
        <p className="text-muted-foreground mb-6">
          Propose a collaboration. Full stealth matching & DMs are rolling out next —{" "}
          <Link className="text-primary underline" to="/auth/signup">
            sign in
          </Link>{" "}
          to save your profile.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>New request</CardTitle>
            <CardDescription>We record your intent; partner matching is coming soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={collabType} onValueChange={(v) => setCollabType(v as typeof collabType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="script_swap">Script swap</SelectItem>
                    <SelectItem value="co_channel">Co-channel</SelectItem>
                    <SelectItem value="affiliate_split">Affiliate split</SelectItem>
                    <SelectItem value="series">Series</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="desc">What are you looking for?</Label>
                <Input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10k finance Shorts creator for cross-promo"
                />
              </div>
              <Button type="submit" disabled={!hasConvex}>
                Submit request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
