import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Plus, Trash2, Shield, Globe, Mic, Settings } from "lucide-react";
import { toast } from "sonner";

interface Persona {
  id: string;
  personaName: string;
  personaSlug: string;
  targetPlatforms: string[];
  primaryNiche: string;
  anonymityLevel: "standard" | "enhanced" | "maximum";
  isActive: boolean;
  createdAt: number;
}

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "Pinterest", "Podcast", "Newsletter"];
const NICHES = ["Personal Finance", "Tech & AI", "Health & Wellness", "Crypto", "Gaming", "Education", "Business", "Travel", "Cooking", "Self-Improvement"];

const ANONYMITY_LEVEL_CONFIG = {
  standard: { label: "Standard", description: "Basic persona separation", color: "bg-blue-100 text-blue-800" },
  enhanced: { label: "Enhanced", description: "Separate voice profile + metadata stripping", color: "bg-purple-100 text-purple-800" },
  maximum: { label: "Maximum", description: "Full anti-matching + blind-indexed storage", color: "bg-green-100 text-green-800" },
};

// Demo personas — replace with Convex query
const DEMO_PERSONAS: Persona[] = [
  {
    id: "1",
    personaName: "TechVaultAI",
    personaSlug: "techvaultai",
    targetPlatforms: ["YouTube", "TikTok"],
    primaryNiche: "Tech & AI",
    anonymityLevel: "enhanced",
    isActive: true,
    createdAt: Date.now() - 7 * 86400000,
  },
  {
    id: "2",
    personaName: "FinanceFromZero",
    personaSlug: "financefromzero",
    targetPlatforms: ["YouTube", "Newsletter"],
    primaryNiche: "Personal Finance",
    anonymityLevel: "maximum",
    isActive: true,
    createdAt: Date.now() - 14 * 86400000,
  },
];

export default function CreatorPersonaManager() {
  const [personas, setPersonas] = useState<Persona[]>(DEMO_PERSONAS);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPlatforms, setNewPlatforms] = useState<string[]>([]);
  const [newNiche, setNewNiche] = useState("");
  const [newAnonymityLevel, setNewAnonymityLevel] = useState<"standard" | "enhanced" | "maximum">("enhanced");
  const [activePersonaId, setActivePersonaId] = useState<string>("1");

  const togglePlatform = (platform: string) => {
    setNewPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("Enter a persona name"); return; }
    if (newPlatforms.length === 0) { toast.error("Select at least one platform"); return; }

    const slug = newName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const newPersona: Persona = {
      id: Date.now().toString(),
      personaName: newName,
      personaSlug: slug,
      targetPlatforms: newPlatforms,
      primaryNiche: newNiche,
      anonymityLevel: newAnonymityLevel,
      isActive: true,
      createdAt: Date.now(),
    };
    setPersonas((prev) => [...prev, newPersona]);
    setIsCreating(false);
    setNewName("");
    setNewPlatforms([]);
    setNewNiche("");
    toast.success(`Persona "${newName}" created!`);
  };

  const handleDelete = (id: string) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    toast.success("Persona removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Creator Persona Manager</CardTitle>
                <CardDescription className="mt-1">
                  One account. Multiple fully-separated anonymous channel identities. Zero cross-linking.
                </CardDescription>
              </div>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Persona
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Persona</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label>Persona Name (pseudonym only)</Label>
                    <Input
                      placeholder="e.g., TechVaultAI, MoneyMindset Pro"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Never use your real name. This is your anonymous identity.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Niche</Label>
                    <Select value={newNiche} onValueChange={setNewNiche}>
                      <SelectTrigger><SelectValue placeholder="Select niche" /></SelectTrigger>
                      <SelectContent>
                        {NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            newPlatforms.includes(p)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Anonymity Level</Label>
                    <div className="space-y-2">
                      {(Object.entries(ANONYMITY_LEVEL_CONFIG) as [string, typeof ANONYMITY_LEVEL_CONFIG.standard][]).map(([level, config]) => (
                        <button
                          key={level}
                          onClick={() => setNewAnonymityLevel(level as "standard" | "enhanced" | "maximum")}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                            newAnonymityLevel === level ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          }`}
                        >
                          <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{config.label}</p>
                            <p className="text-xs text-muted-foreground">{config.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleCreate}>
                    Create Persona
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Persona Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {personas.map((persona) => {
          const levelConfig = ANONYMITY_LEVEL_CONFIG[persona.anonymityLevel];
          const isActive = activePersonaId === persona.id;
          return (
            <Card
              key={persona.id}
              className={`cursor-pointer transition-colors ${isActive ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"}`}
              onClick={() => setActivePersonaId(persona.id)}
            >
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold">{persona.personaName}</span>
                      {isActive && <Badge className="text-xs bg-primary text-primary-foreground">Active</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">@{persona.personaSlug}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDelete(persona.id); }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={levelConfig.color}>
                    <Shield className="h-3 w-3 mr-1" />
                    {levelConfig.label}
                  </Badge>
                  {persona.primaryNiche && (
                    <Badge variant="outline" className="text-xs">{persona.primaryNiche}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {persona.targetPlatforms.join(", ")}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); toast.info("Voice studio linked to this persona"); }}
                  >
                    <Mic className="h-3 w-3 mr-1" />
                    Voice Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); toast.info("Persona settings"); }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Privacy notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Zero Cross-Linking Guarantee</p>
              <p className="text-green-700">Each persona is stored in isolated data partitions. Platform connections, voice profiles, and analytics for each persona never reference each other. Maximum anonymity personas use blind-indexed search.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
