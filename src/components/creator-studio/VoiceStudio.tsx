import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Play, Download, Mic, Volume2, Zap } from "lucide-react";
import { toast } from "sonner";

const voicePresets = [
  { id: "1", name: "Professional Male", gender: "male", accent: "American" },
  { id: "2", name: "Professional Female", gender: "female", accent: "American" },
  { id: "3", name: "Casual Male", gender: "male", accent: "American" },
  { id: "4", name: "Casual Female", gender: "female", accent: "British" },
  { id: "5", name: "Energetic Male", gender: "male", accent: "American" },
  { id: "6", name: "Calm Female", gender: "female", accent: "American" },
];

export default function VoiceStudio() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(voicePresets[0].id);
  const [emotion, setEmotion] = useState("neutral");
  const [pace, setPace] = useState([50]);
  const [pitch, setPitch] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to synthesize");
      return;
    }

    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual ElevenLabs API call
      // const response = await fetch('/api/voice/synthesize', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     text,
      //     voiceId: selectedVoice,
      //     emotion,
      //     pace: pace[0],
      //     pitch: pitch[0]
      //   })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock audio URL (replace with actual audio blob)
      setAudioUrl("mock-audio-url");
      setIsGenerating(false);
      toast.success("Voice generated successfully!");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate voice. Please try again.");
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      // Play audio
      toast.info("Playing audio...");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <CardTitle>Voice Studio</CardTitle>
          </div>
          <CardDescription>
            Generate professional voiceovers using AI. 500+ premium voices available. Powered by ElevenLabs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text">Text to Synthesize *</Label>
            <Textarea
              id="text"
              placeholder="Enter your script here. The AI will convert this text into natural-sounding speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="text-xs text-muted-foreground">
              {text.length} characters
            </div>
          </div>

          {/* Voice Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voice">Voice Preset</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger id="voice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voicePresets.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.accent})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                500+ voices available. <Button variant="link" className="h-auto p-0 text-xs">Browse all</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotion">Emotion / Style</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger id="emotion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="confident">Confident</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-semibold text-sm">Advanced Controls</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Pace / Speed</Label>
                <span className="text-sm text-muted-foreground">{pace[0]}%</span>
              </div>
              <Slider
                value={pace}
                onValueChange={setPace}
                min={30}
                max={150}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Pitch</Label>
                <span className="text-sm text-muted-foreground">{pitch[0]}%</span>
              </div>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !text.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Voice...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Voice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audio Player */}
      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={handlePlay}>
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download MP3
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <Badge variant="secondary">High Quality</Badge>
              <Badge variant="secondary" className="ml-2">MP3 Format</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Cloning Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Voice Cloning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Want to use your own voice? Upload a sample and we'll create a custom voice clone.
          </p>
          <Button variant="outline">
            Upload Voice Sample
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
