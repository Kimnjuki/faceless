import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Lock, Eye, Mic, Database } from "lucide-react";
import { toast } from "sonner";

interface ScoreDimension {
  key: string;
  label: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "warning" | "critical";
  riskFlags: string[];
  recommendations: string[];
}

interface AnonymityAudit {
  voiceScore: number;
  metadataScore: number;
  ipExposureScore: number;
  traceabilityScore: number;
  compositeAnonymityScore: number;
  riskFlags: string[];
  recommendations: string[];
  auditedAt: number;
}

const SCORE_COLOR = (score: number) => {
  if (score >= 85) return "text-green-600";
  if (score >= 65) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const STATUS_BADGE = (status: ScoreDimension["status"]) => {
  const map = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
  };
  return map[status];
};

const getStatus = (score: number): ScoreDimension["status"] => {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 40) return "warning";
  return "critical";
};

// Mock audit generator — replace with real Convex query data
const runMockAudit = (): AnonymityAudit => ({
  voiceScore: 78,
  metadataScore: 91,
  ipExposureScore: 62,
  traceabilityScore: 85,
  compositeAnonymityScore: 79,
  riskFlags: [
    "Voice print not fully anonymized — anti-matching not enabled",
    "Publishing IP may be linked to personal accounts",
  ],
  recommendations: [
    "Enable anti-matching jitter in your voice profile settings",
    "Use a VPN or residential proxy when publishing to platforms",
    "Strip EXIF data before uploading thumbnail images",
    "Enable zero-metadata export mode for all audio/video files",
  ],
  auditedAt: Date.now(),
});

export default function AnonymityScoreDashboard() {
  const [audit, setAudit] = useState<AnonymityAudit | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = async () => {
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 1800));
    setAudit(runMockAudit());
    setIsRunning(false);
    toast.success("Anonymity audit complete!");
  };

  const dimensions: ScoreDimension[] = audit
    ? [
        {
          key: "voice",
          label: "Voice Anonymization",
          icon: <Mic className="h-4 w-4" />,
          score: audit.voiceScore,
          maxScore: 100,
          status: getStatus(audit.voiceScore),
          riskFlags: audit.riskFlags.filter((f) => f.toLowerCase().includes("voice")),
          recommendations: audit.recommendations.filter((r) => r.toLowerCase().includes("voice")),
        },
        {
          key: "metadata",
          label: "Metadata Stripping",
          icon: <Database className="h-4 w-4" />,
          score: audit.metadataScore,
          maxScore: 100,
          status: getStatus(audit.metadataScore),
          riskFlags: audit.riskFlags.filter((f) => f.toLowerCase().includes("exif") || f.toLowerCase().includes("metadata")),
          recommendations: audit.recommendations.filter((r) => r.toLowerCase().includes("exif") || r.toLowerCase().includes("metadata")),
        },
        {
          key: "ip",
          label: "IP Exposure",
          icon: <Eye className="h-4 w-4" />,
          score: audit.ipExposureScore,
          maxScore: 100,
          status: getStatus(audit.ipExposureScore),
          riskFlags: audit.riskFlags.filter((f) => f.toLowerCase().includes("ip") || f.toLowerCase().includes("vpn")),
          recommendations: audit.recommendations.filter((r) => r.toLowerCase().includes("vpn") || r.toLowerCase().includes("ip")),
        },
        {
          key: "traceability",
          label: "Publishing Traceability",
          icon: <Lock className="h-4 w-4" />,
          score: audit.traceabilityScore,
          maxScore: 100,
          status: getStatus(audit.traceabilityScore),
          riskFlags: [],
          recommendations: audit.recommendations.filter((r) => r.toLowerCase().includes("publish")),
        },
      ]
    : [];

  const composite = audit?.compositeAnonymityScore ?? 0;

  return (
    <div className="space-y-6">
      {/* Composite Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Anonymity Score Dashboard</CardTitle>
            <Badge variant="secondary">Privacy Audit</Badge>
          </div>
          <CardDescription>
            A composite privacy score across voice, metadata, IP, and publishing traceability.
            Run an audit before every export.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit ? (
            <div className="flex items-center gap-8 mb-6">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${SCORE_COLOR(composite)}`}>{composite}</div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  {composite >= 85 ? "Excellent Anonymity" : composite >= 65 ? "Good Protection" : composite >= 40 ? "Moderate Risk" : "High Risk — Action Required"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {composite >= 85
                    ? "Your content pipeline has strong anonymization across all layers."
                    : composite >= 65
                    ? "A few improvements will significantly raise your protection level."
                    : "Multiple risk factors detected. Review recommendations below."}
                </p>
                {audit.riskFlags.length > 0 && (
                  <div className="space-y-1">
                    {audit.riskFlags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-orange-700">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={runAudit}
                disabled={isRunning}
                className="flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
                Re-run
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground mb-4">
                Run an audit to see your anonymity score across all privacy dimensions.
              </p>
              <Button onClick={runAudit} disabled={isRunning}>
                {isRunning ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Auditing...</>
                ) : (
                  <><Shield className="mr-2 h-4 w-4" />Run Anonymity Audit</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dimension Breakdowns */}
      {audit && (
        <div className="grid md:grid-cols-2 gap-4">
          {dimensions.map((dim) => (
            <Card key={dim.key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {dim.icon}
                    <CardTitle className="text-base">{dim.label}</CardTitle>
                  </div>
                  <span className={`text-2xl font-bold ${SCORE_COLOR(dim.score)}`}>
                    {dim.score}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={dim.score} className="h-2" />
                <Badge className={STATUS_BADGE(dim.status)}>
                  {dim.status.charAt(0).toUpperCase() + dim.status.slice(1)}
                </Badge>
                {dim.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 text-primary flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
                {dim.riskFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                    <XCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* All Recommendations */}
      {audit && audit.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Action Items to Improve Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
