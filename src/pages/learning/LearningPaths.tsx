import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  PlayCircle, 
  ArrowRight, 
  Loader2,
  GraduationCap,
  TrendingUp,
  Zap,
  RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, any> = {
  PlayCircle,
  Youtube: PlayCircle,
  Video: PlayCircle,
  DollarSign: TrendingUp,
  GraduationCap,
  Zap,
};

export default function LearningPaths() {
  const { user } = useAuth();
  const [trackType, setTrackType] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const { paths, loading, error, refetch } = useLearningPaths({
    trackType: trackType !== 'all' ? trackType : undefined,
    difficulty: difficulty !== 'all' ? difficulty : undefined,
  });

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

            {/* Filters */}
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
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Make sure you've run the LEARNING_PATHS_SCHEMA.sql script in Supabase.
                </p>
              </div>
            )}

            {/* Learning Paths Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.length > 0 ? (
                  paths.map((path) => {
                    const IconComponent = iconMap[path.icon_name || 'BookOpen'] || BookOpen;
                    const progress = calculatePathProgress(path);
                    const totalModules = path.modules?.length || 0;
                    const completedModules = path.modules?.filter((m: any) => m.progress?.completed).length || 0;

                    return (
                      <Card key={path.id} className="hover:shadow-lg transition-shadow flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            {path.featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{path.name}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {path.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                          <div className="space-y-4">
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

                            <Button className="w-full" asChild>
                              <Link to={`/learning-paths/${path.id}`}>
                                {user && progress > 0 ? "Continue Learning" : "Start Path"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No learning paths found.</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {error 
                        ? error 
                        : "The learning paths table is empty. Add learning paths in Supabase or run the LEARNING_PATHS_SCHEMA.sql script to create sample data."
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Make sure the LEARNING_PATHS_SCHEMA.sql script has been run in Supabase
                      </p>
                    </div>
                    {/* Debug Information */}
                    <div className="mt-6 p-4 bg-muted rounded-lg text-left max-w-2xl mx-auto">
                      <p className="text-sm font-semibold mb-2">Debug Information:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Total paths fetched: {paths.length}</li>
                        <li>• Loading: {loading ? 'Yes' : 'No'}</li>
                        <li>• Error: {error || 'None'}</li>
                        {paths.length > 0 && (
                          <li>• First path: {paths[0]?.name} (ID: {paths[0]?.id})</li>
                        )}
                        {paths.length > 0 && paths[0]?.modules && (
                          <li>• Modules in first path: {paths[0].modules.length}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

