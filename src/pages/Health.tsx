/**
 * Health check page for monitoring and load balancers.
 * Shows app and Convex backend status.
 * When Convex is not configured, shows static status (no useQuery) so it works without ConvexProvider.
 */

import SEO from "@/components/SEO";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { APP_CONFIG } from "@/config/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function HealthStatic() {
  return (
    <>
      <SEO
        title="Health Check | ContentAnonymity"
        description="System status and backend health."
        url="https://contentanonymity.com/health"
        canonical="https://contentanonymity.com/health"
        noindex
      />
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">App</span>
              <Badge variant="default">up</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Convex backend</span>
              <Badge variant="secondary">not configured</Badge>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          {APP_CONFIG.siteName} · {APP_CONFIG.siteUrl}
        </p>
      </div>
    </div>
    </>
  );
}

function HealthWithConvex() {
  return (
    <>
      <SEO
        title="Health Check | ContentAnonymity"
        description="System status and backend health."
        url="https://contentanonymity.com/health"
        canonical="https://contentanonymity.com/health"
        noindex
      />
      <HealthWithConvexContent />
    </>
  );
}

function HealthWithConvexContent() {
  const ping = useQuery(api.health.ping);
  const backendStatus = ping === undefined ? "checking" : ping?.ok ? "up" : "error";

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">App</span>
              <Badge variant="default">up</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Convex backend</span>
              <Badge
                variant={
                  backendStatus === "up"
                    ? "default"
                    : backendStatus === "checking"
                      ? "secondary"
                      : "destructive"
                }
              >
                {backendStatus}
              </Badge>
            </div>
            {ping?.ts && (
              <p className="text-xs text-muted-foreground">
                Last ping: {new Date(ping.ts).toISOString()}
              </p>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          {APP_CONFIG.siteName} · {APP_CONFIG.siteUrl}
        </p>
      </div>
    </div>
  );
}

export default function Health() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  return hasConvex ? <HealthWithConvex /> : <HealthStatic />;
}
