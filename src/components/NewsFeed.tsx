/**
 * NewsFeed (LiveWire) – Real-time news agency feed.
 * Uses useQuery for live updates, source badges, recency timestamps, and automated content indicator.
 */

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, ExternalLink, Newspaper } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const REFRESH_TIME_MS = 60_000;

/** Re-renders every minute so "Xm ago" timestamps stay live. */
function useLiveRecency() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), REFRESH_TIME_MS);
    return () => clearInterval(id);
  }, []);
}

export default function NewsFeed() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const items = useQuery(
    api.content.list,
    hasConvex ? { limit: 100 } : "skip"
  );
  useLiveRecency();

  if (items === undefined) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading news feed…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
        <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No ingested items yet.</p>
        <p className="text-xs text-muted-foreground">The cron runs every 60 minutes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">LiveWire</h2>
      <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {items.map((item) => (
          <NewsFeedCard key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function NewsFeedCard({
  item,
}: {
  item: {
    _id: string;
    title: string;
    description?: string;
    source: string;
    isAutomated: boolean;
    originalUrl: string;
    publishedAt: number;
    niche?: string;
  };
}) {
  const recency = formatDistanceToNow(item.publishedAt, { addSuffix: true });

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            via {item.source}
          </Badge>
          {item.isAutomated && (
            <Badge variant="outline" className="gap-1 text-xs" title="Automated ingestion">
              <Bot className="h-3 w-3" />
              Auto
            </Badge>
          )}
          <span className="text-xs text-muted-foreground" title={new Date(item.publishedAt).toISOString()}>
            {recency}
          </span>
        </div>
        <CardTitle className="line-clamp-2 text-base">
          <a
            href={item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.title}
          </a>
        </CardTitle>
        {item.niche && (
          <Badge variant="outline" className="w-fit text-xs">
            {item.niche}
          </Badge>
        )}
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          <a
            href={item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Read article
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardContent>
      )}
    </Card>
  );
}
