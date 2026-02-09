/**
 * Shows Convex backend connection status (dev only).
 * Green = live, yellow = loading/reconnecting.
 */

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { APP_CONFIG } from "@/config/app";

export default function ConvexConnectionStatus() {
  const ping = useQuery(api.health.ping);

  if (!APP_CONFIG.showConnectionStatus) return null;

  const status = ping === undefined ? "connecting" : "live";
  const label = status === "live" ? "Backend: Live" : "Backend: Connecting…";
  const color = status === "live" ? "bg-green-500" : "bg-amber-500";

  return (
    <div
      className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs shadow-sm"
      title={label}
      aria-live="polite"
    >
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
