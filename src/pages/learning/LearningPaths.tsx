import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BookOpen, 
  Clock, 
  PlayCircle, 
  ArrowRight, 
  Loader2,
  GraduationCap,
  TrendingUp,
  Zap,
  RefreshCw,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { getRandomImage, getLearningPathImages } from "@/utils/contentImages";
import { IMAGES } from "@/config/images";
import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useAuth } from "@/contexts/AuthContext";
import PathComparator from "@/components/PathComparator";
import DataStateMessage from "@/components/DataStateMessage";
import type { LearningPath } from "@/types/index";

const iconMap: Record<string, any> = {
  PlayCircle,
  Youtube: PlayCircle,
  Video: PlayCircle,
  DollarSign: TrendingUp,
  GraduationCap,
  Zap,
};

type SortOption = "recommended" | "newest" | "popular" | "duration";

export default function LearningPaths() {
  const { user } = useAuth();
  const [trackType, setTrackType] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const { paths, loading, error, refetch } = useLearningPaths({
    trackType: trackType !== 'all' ? trackType : undefined,
    difficulty: difficulty !== 'all' ? difficulty : undefined,
  });

  // Get diverse images for learning paths
  const learningPathImages = getLearningPathImages(paths.length);

  // Get quiz results for recommendations
  const quizResults = useMemo(() => {
    try {
      const stored = localStorage.getItem('personality_quiz_results');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Smart recommendations based on quiz results
  const recommendedPaths = useMemo(() => {
    if (!quizResults || !paths.length) return [];
    const learningPath = quizResults.learningPath;
    return paths.filter(p => 
      p.id?.includes(learningPath) || 
      p.name?.toLowerCase().includes(learningPath?.toLowerCase() || '')
    ).slice(0, 3);
  }, [quizResults, paths]);

  // Sort paths
  const sortedPaths = useMemo(() => {
    const filtered = [...paths];
    
    switch (sortBy) {
      case "newest":
        // Sort by order_index as proxy for newest (lower index = newer)
        return filtered.sort((a, b) => {
          const indexA = a.order_index ?? 0;
          const indexB = b.order_index ?? 0;
          return indexA - indexB;
        });
      case "duration":
        return filtered.sort((a, b) => {
          const durA = parseInt(a.estimated_duration?.match(/\d+/)?.[0] || "0");
          const durB = parseInt(b.estimated_duration?.match(/\d+/)?.[0] || "0");
          return durA - durB;
        });
      case "popular":
        // Sort by module count as proxy for popularity
        return filtered.sort((a, b) => {
          const modA = a.modules?.length || 0;
          const modB = b.modules?.length || 0;
          return modB - modA;
        });
      case "recommended":
      default:
        // Put recommended paths first, then by module count
        return filtered.sort((a, b) => {
          const isRecA = recommendedPaths.some(rp => rp.id === a.id);
          const isRecB = recommendedPaths.some(rp => rp.id === b.id);
          if (isRecA && !isRecB) return -1;
          if (!isRecA && isRecB) return 1;
          const modA = a.modules?.length || 0;
          const modB = b.modules?.length || 0;
          return modB - modA;
        });
    }
  }, [paths, sortBy, recommendedPaths]);

  const handleComparisonToggle = (pathId: string | undefined) => {
    if (!pathId) return;
    setSelectedForComparison(prev => {
      if (prev.includes(pathId)) {
        return prev.filter(id => id !== pathId);
      } else if (prev.length < 3) {
        return [...prev, pathId];
      } else {
        return prev; // Max 3 paths
      }
    });
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

  const calculatePathProgress = (path: any) => {
    if (!user || !path.modules || path.modules.length === 0) return 0;
    const completedModules = path.modules.filter((m: any) => m.progress?.completed).length;
    return Math.round((completedModules / path.modules.length) * 100);
  };

  return (
    <>
      <SEO
        title="11 Step-by-Step Learning Paths to Master Faceless Content in 2026"
        description="Choose from 11 curated learning paths designed to take you from beginner to pro in faceless content creation. Start your free journey today."
        keywords="faceless content courses, learning paths, content creation training, anonymous creator education, faceless business courses"
        url="https://contentanonymity.com/learning-paths"
        canonical="https://contentanonymity.com/learning-paths"
        type="course"
        breadcrumbItems={[{ name: 'Learning Paths', url: 'https://contentanonymity.com/learning-paths' }]}
        faqData={[
          { question: "What are faceless content learning paths?", answer: "Faceless learning paths are structured, step-by-step curricula that teach you how to create profitable content online without revealing your identity — covering everything from niche selection to monetization." },
          { question: "How long does it take to complete a learning path?", answer: "Most paths are designed to be completed in 2–4 weeks at a pace of 30–60 minutes per day, though you can move at your own speed." },
          { question: "Do I need any prior experience to start?", answer: "No. All learning paths begin at the beginner level and gradually build skills. No technical background or content creation experience is required." }
        ]}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4">Learning Paths</Badge>
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Your Path to Faceless Content Mastery
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh learning paths"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Structured learning paths designed to take you from beginner to expert. Follow step-by-step modules at your own pace.
              </p>
            </div>

            {/* Smart Recommendations */}
            {recommendedPaths.length > 0 && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Recommended for You</CardTitle>
                  </div>
                  <CardDescription>
                    Based on your personality quiz results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendedPaths.map((path) => (
                      <Badge key={path.id} variant="default" className="text-sm py-1 px-3">
                        {path.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters & Sort */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Select value={trackType} onValueChange={setTrackType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Track Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tracks</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="specialized">Specialized</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data State Messages */}
            {(loading || error || sortedPaths.length === 0) && (
              <DataStateMessage
                loading={loading}
                error={error}
                empty={!loading && !error && sortedPaths.length === 0}
                emptyMessage="No learning paths found. Paths will appear here once they are added to the database."
                onRetry={refetch}
                type="paths"
              />
            )}

            {/* Tool CTAs — internal links for SEO + high-intent users */}
            {!loading && !error && paths.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center mb-8 p-4 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground self-center">Not sure where to start?</span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/tools/niche-quiz">Take the free Niche Finder Quiz →</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/tools/calculator">Estimate earnings with our Calculator →</Link>
                </Button>
              </div>
            )}

            {/* Learning Paths Grid */}
            {!loading && !error && sortedPaths.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPaths.map((path: any, index: number) => {
                    const IconComponent = iconMap[path.icon_name || 'BookOpen'] || BookOpen;
                    const progress = calculatePathProgress(path);
                    const totalModules = path.modules?.length || 0;
                    const completedModules = path.modules?.filter((m: any) => m.progress?.completed).length || 0;
                    const pathId = path.id || path._id || '';
                    const isRecommended = recommendedPaths.some((rp: any) => (rp.id || rp._id) === pathId);
                    const isSelectedForComparison = pathId ? selectedForComparison.includes(pathId) : false;
                    const isExpanded = expandedPath === pathId;
                    // Use diverse image for this learning path
                    const pathImage = learningPathImages[index] || getRandomImage('learningPaths');

                    return (
                      <Card 
                        key={pathId} 
                        className={`hover:shadow-lg transition-shadow flex flex-col ${
                          isRecommended ? 'border-primary/50 border-2' : ''
                        } ${isSelectedForComparison ? 'ring-2 ring-primary' : ''}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                              <img 
                                src={pathImage}
                                alt={`${path.name} learning path visual`}
                                className="w-full h-full object-cover"
                                loading="eager"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isRecommended && (
                                <Badge variant="default" className="bg-primary">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Recommended
                                </Badge>
                              )}
                              {path.featured && !isRecommended && (
                                <Badge variant="default">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-xl">{path.name}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {path.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                          <div className="space-y-4">
                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {path.estimated_duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {path.estimated_duration}
                                </span>
                              )}
                              {totalModules > 0 && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {totalModules} modules
                                </span>
                              )}
                            </div>

                            {/* Difficulty & Track */}
                            {path.difficulty_level && (
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`${getDifficultyColor(path.difficulty_level)} text-white border-0`}
                                >
                                  {path.difficulty_level}
                                </Badge>
                                <Badge variant="secondary" className="capitalize">
                                  {path.track_type}
                                </Badge>
                              </div>
                            )}

                            {/* Syllabus Preview */}
                            {totalModules > 0 && (
                              <div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-between"
                                  onClick={() => setExpandedPath(isExpanded ? null : pathId)}
                                >
                                  <span className="text-xs">Preview Syllabus</span>
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                {isExpanded && path.modules && (
                                  <div className="mt-2 p-3 bg-muted/50 rounded-lg max-h-48 overflow-y-auto">
                                    <ul className="space-y-1 text-xs">
                                      {path.modules.slice(0, 5).map((module: any, idx: number) => (
                                        <li key={module.id || module._id || idx} className="flex items-center gap-2">
                                          <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                                          <span>{module.title || `Module ${idx + 1}`}</span>
                                        </li>
                                      ))}
                                      {path.modules.length > 5 && (
                                        <li className="text-muted-foreground italic">
                                          +{path.modules.length - 5} more modules
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Progress Bar */}
                            {user && totalModules > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-2 text-sm">
                                  <span className="text-muted-foreground">
                                    {completedModules} of {totalModules} modules completed
                                  </span>
                                  <span className="font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} />
                              </div>
                            )}

                            {/* Comparison Checkbox */}
                            {pathId && (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`compare-${pathId}`}
                                  checked={isSelectedForComparison}
                                  onCheckedChange={() => handleComparisonToggle(pathId)}
                                  disabled={selectedForComparison.length >= 3 && !isSelectedForComparison}
                                />
                                <label
                                  htmlFor={`compare-${pathId}`}
                                  className="text-xs text-muted-foreground cursor-pointer"
                                >
                                  {selectedForComparison.length >= 3 && !isSelectedForComparison
                                    ? "Max 3 paths"
                                    : "Compare"}
                                </label>
                              </div>
                            )}

                            <Button className="w-full" asChild>
                              <Link to={`/learning-paths/${pathId}`}>
                                {user && progress > 0 ? "Continue Learning" : "Start Path"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}

            {/* Path Comparator */}
            {selectedForComparison.length > 0 && (
              <PathComparator
                paths={paths}
                selectedIds={selectedForComparison}
                onRemove={(id) => handleComparisonToggle(id)}
                onClear={() => setSelectedForComparison([])}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

