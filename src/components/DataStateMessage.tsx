import { AlertCircle, RefreshCw, WifiOff, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataStateMessageProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  type?: "guides" | "paths" | "articles" | "general";
}

export default function DataStateMessage({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
  type = "general",
}: DataStateMessageProps) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading {type}...</p>
      </div>
    );
  }

  // Connection error (Convex not configured)
  if (!hasConvex) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <Database className="h-4 w-4" />
        <AlertTitle>Backend Not Configured</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            The Convex backend is not configured. Please set the <code className="bg-muted px-1 rounded">VITE_CONVEX_URL</code> environment variable.
          </p>
          <p className="text-sm text-muted-foreground">
            This is required for {type} to load. Check your <code>.env.local</code> file or deployment environment variables.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // Network/connection error
  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          <p className="mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (empty) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            No {type} Found
          </CardTitle>
          <CardDescription>
            {emptyMessage || `No ${type} are available at this time.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
