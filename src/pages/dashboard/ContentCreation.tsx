import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Mic, 
  Video, 
  Scissors, 
  Calendar,
  Search,
  Download,
  Play,
  Plus,
  Wand2
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";

export default function ContentCreation() {
  const [selectedTab, setSelectedTab] = useState("generator");

  const templates = [
    { id: 1, name: "YouTube Shorts Template", platform: "YouTube", category: "Video", downloads: 1234 },
    { id: 2, name: "Instagram Reels Template", platform: "Instagram", category: "Video", downloads: 987 },
    { id: 3, name: "TikTok Hook Template", platform: "TikTok", category: "Script", downloads: 2156 },
    { id: 4, name: "Thumbnail Design Pack", platform: "YouTube", category: "Graphics", downloads: 3456 },
    { id: 5, name: "Caption Template Set", platform: "Instagram", category: "Text", downloads: 1876 },
    { id: 6, name: "Video Intro Template", platform: "All", category: "Video", downloads: 2341 },
  ];

  const stockFootage = [
    { id: 1, title: "Abstract Backgrounds", category: "Backgrounds", duration: "2:30", views: 1234 },
    { id: 2, title: "Business Scenes", category: "Lifestyle", duration: "1:45", views: 987 },
    { id: 3, title: "Nature Landscapes", category: "Nature", duration: "3:20", views: 2156 },
    { id: 4, title: "Tech Animations", category: "Technology", duration: "1:15", views: 3456 },
  ];

  return (
    <>
      <SEO
        title="Content Creation Hub - Private Workspace"
        description="Use your private Content Creation Hub to plan and generate faceless content. This dashboard page is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/dashboard/content"
      />
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Content Creation Hub</h1>
            <p className="text-muted-foreground">Create, edit, and schedule your faceless content</p>
          </div>
          <Button asChild>
            <Link to="/dashboard/content/new">
              <Plus className="mr-2 h-4 w-4" />
              New Content
            </Link>
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generator">AI Generator</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="voiceover">Voice-over</TabsTrigger>
            <TabsTrigger value="footage">Stock Footage</TabsTrigger>
            <TabsTrigger value="editor">Video Editor</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          {/* AI Content Generator */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Content Generator
                </CardTitle>
                <CardDescription>
                  Generate video scripts, captions, hooks, and thumbnail ideas with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="script">Video Script</SelectItem>
                        <SelectItem value="caption">Social Media Caption</SelectItem>
                        <SelectItem value="hook">Video Hook</SelectItem>
                        <SelectItem value="thumbnail">Thumbnail Ideas</SelectItem>
                        <SelectItem value="title">Video Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic/Niche</label>
                  <Input placeholder="e.g., Personal finance tips, Productivity hacks" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Context</label>
                  <Textarea 
                    placeholder="Describe what you want to create, target audience, tone, etc."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Content
                </Button>
              </CardContent>
            </Card>

            {/* Recent Generations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">Script</Badge>
                            <span className="text-sm text-muted-foreground">YouTube • Finance</span>
                          </div>
                          <p className="text-sm font-medium">10 Ways to Save Money in 2025</p>
                          <p className="text-xs text-muted-foreground mt-1">Generated 2 hours ago</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Template Library */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{template.platform}</Badge>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.downloads.toLocaleString()} downloads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Voice-over Generator */}
          <TabsContent value="voiceover" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  AI Voice-over Generator
                </CardTitle>
                <CardDescription>
                  Generate professional voice-overs in multiple languages and voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Script</label>
                  <Textarea 
                    placeholder="Paste your script here..."
                    rows={6}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male1">Male Voice 1 (Professional)</SelectItem>
                        <SelectItem value="male2">Male Voice 2 (Casual)</SelectItem>
                        <SelectItem value="female1">Female Voice 1 (Warm)</SelectItem>
                        <SelectItem value="female2">Female Voice 2 (Energetic)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Speed</label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow (0.9x)</SelectItem>
                      <SelectItem value="normal">Normal (1.0x)</SelectItem>
                      <SelectItem value="fast">Fast (1.1x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Mic className="mr-2 h-4 w-4" />
                  Generate Voice-over
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Footage Library */}
          <TabsContent value="footage" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search stock footage..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="backgrounds">Backgrounds</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stockFootage.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>
                      {item.category} • {item.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{item.views} views</span>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Editor */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Simple Video Editor
                </CardTitle>
                <CardDescription>
                  Trim, add text overlays, music, and transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Upload a video to start editing</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                </div>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <span>Project 1</span>
                          <Button variant="ghost" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                          <span>Project 2</span>
                          <Button variant="ghost" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Content Calendar
                </CardTitle>
                <CardDescription>
                  Plan and schedule your content across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Drag-and-drop calendar view coming soon</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Content
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Upcoming Posts</h3>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Video Script: Finance Tips</p>
                        <p className="text-sm text-muted-foreground">Scheduled for Jan 25, 2025 • YouTube</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    </>
  );
}

