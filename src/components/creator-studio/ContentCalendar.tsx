import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContentCalendar() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const generate30 = useMutation(api.creatorContent.generate30DayPlan);
  const [platform, setPlatform] = useState("YouTube");
  const [hoursPerWeek, setHoursPerWeek] = useState(12);
  const [busy, setBusy] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConvex) {
      toast.error("Connect Convex (VITE_CONVEX_URL) to save a 30-day plan.");
      return;
    }
    setBusy(true);
    try {
      const id = await generate30({
        platform,
        hoursPerWeek,
      });
      setLastId(String(id));
      toast.success("30-day batch plan saved to your account.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate plan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>30-day content machine</CardTitle>
            <CardDescription>
              Generates a saved schedule row (titles + hooks) — upgrade path to full calendar UI.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={run} className="space-y-6 max-w-md">
          <div>
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Hours per week ({hoursPerWeek}h)</Label>
            <Input
              type="number"
              min={3}
              max={60}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value) || 6)}
            />
          </div>
          <Button type="submit" disabled={busy || !hasConvex}>
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building plan…
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generate 30-day plan
              </>
            )}
          </Button>
          {lastId && (
            <p className="text-xs text-muted-foreground">Schedule id: {lastId}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
