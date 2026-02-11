import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Clock, 
  Eye, 
  BookOpen, 
  Loader2,
  Youtube,
  Video,
  Instagram,
  RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { usePlatformGuides } from "@/hooks/usePlatformGuides";
import DataStateMessage from "@/components/DataStateMessage";

const platformIcons: Record<string, any> = {
  youtube: Youtube,
  tiktok: Video,
  instagram: Instagram,
  general: BookOpen,
};

export default function PlatformGuides() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const { guides, loading, error, refetch, incrementViewCount } = usePlatformGuides({
    platform: platformFilter !== 'all' ? platformFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
    searchQuery: searchQuery,
  });

  const handleGuideClick = async (guide: any) => {
    await incrementViewCount(guide.id ?? guide._id ?? '');
    navigate(`/platform-guides/${guide.slug}`);
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const uniquePlatforms = Array.from(new Set(guides.map(g => g.platform)));
  const uniqueCategories = Array.from(new Set(guides.map(g => g.category).filter(Boolean)));

  return (
    <>
      <SEO
        title="Master YouTube, TikTok & Instagram Faceless in 2026"
        description="Master YouTube, TikTok & Instagram without revealing your identity. Platform-specific guides with proven strategies and AI tools. Dive in today."
        keywords="YouTube automation guide, TikTok growth guide, Instagram Reels guide, platform-specific content strategies, faceless platform guides"
        url="https://contentanonymity.com/platform-guides"
        canonical="https://contentanonymity.com/platform-guides"
        type="article"
        breadcrumbItems={[{ name: 'Platform Guides', url: 'https://contentanonymity.com/platform-guides' }]}
        faqData={[
          { question: "Which platform is best for faceless content creators?", answer: "It depends on your content style. YouTube Shorts and TikTok are best for video-first creators, while Instagram Reels works well for visual storytelling. Our guides cover strategies for all three platforms." },
          { question: "Can I really build an audience without showing my face?", answer: "Yes. Thousands of creators earn full-time income using screen recordings, animations, voiceovers, and AI-generated content. Our platform guides walk you through proven methods for each platform." },
          { question: "Do the platform guides include monetization tips?", answer: "Absolutely. Each guide covers platform-specific monetization — from YouTube's Partner Program to TikTok's Creator Fund and Instagram's subscription features." }
        ]}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4">Platform Guides</Badge>
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Platform-Specific Guides
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh guides"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Step-by-step guides for YouTube, TikTok, Instagram, and more. Learn platform-specific strategies and best practices.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="guide-search"
                    name="search"
                    placeholder="Search guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {uniquePlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform || ''}>
                        {platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.filter(Boolean).map((category) => (
                      <SelectItem key={category} value={category || ''}>
                        {category || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data State Messages */}
            {(loading || error || guides.length === 0) && (
              <DataStateMessage
                loading={loading}
                error={error}
                empty={!loading && !error && guides.length === 0}
                emptyMessage="No platform guides found. Guides will appear here once they are added to the database."
                onRetry={refetch}
                type="guides"
              />
            )}

            {/* Guides Grid */}
            {!loading && !error && guides.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => {
                    const PlatformIcon = platformIcons[guide.platform] || BookOpen;

                    return (
                      <Card 
                        key={guide.id} 
                        className="hover:shadow-lg transition-shadow flex flex-col cursor-pointer"
                        onClick={() => handleGuideClick(guide)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <PlatformIcon className="h-5 w-5 text-primary" />
                            </div>
                            {guide.difficulty_level && (
                              <Badge 
                                variant="outline" 
                                className={`${getDifficultyColor(guide.difficulty_level)} text-white border-0`}
                              >
                                {guide.difficulty_level}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{guide.title}</CardTitle>
                          {guide.excerpt && (
                            <CardDescription className="mt-2 line-clamp-2">
                              {guide.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {guide.read_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {guide.read_time} min read
                                </span>
                              )}
                              {guide.view_count !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {guide.view_count} views
                                </span>
                              )}
                            </div>
                            {guide.category && (
                              <Badge variant="secondary" className="capitalize">
                                {guide.category}
                              </Badge>
                            )}
                            {guide.tool_tags && guide.tool_tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {guide.tool_tags.slice(0, 3).map((tool, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                                {guide.tool_tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{guide.tool_tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <Button className="w-full" variant="outline">
                              Read Guide
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

