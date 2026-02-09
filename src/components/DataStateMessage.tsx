/**
 * Shared loading, empty, and error states for list/detail views.
 * Use with hooks that return { loading, error, data }.
 */

import LoadingSpinner from "./LoadingSpinner";
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataStateMessageProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export default function DataStateMessage({
  loading,
  error,
  empty,
  emptyMessage = "No items yet.",
  onRetry,
  onAction,
  actionLabel,
  className = "",
  children,
}: DataStateMessageProps) {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-center text-muted-foreground">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
        <Inbox className="h-12 w-12 text-muted-foreground" />
        <p className="text-center text-muted-foreground">{emptyMessage}</p>
        {onAction && actionLabel && (
          <Button variant="default" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
