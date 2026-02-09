import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Lock,
  Loader2,
  BookOpen,
  RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const contentTypeIcons: Record<string, any> = {
  video: PlayCircle,
  article: FileText,
  interactive: BookOpen,
  quiz: FileText,
};

export default function LearningPathDetail() {
  const { pathId } = useParams();
  const { user } = useAuth();
  // Removed unused expandedModule state

  const { paths, loading, error, refetch, updateProgress } = useLearningPaths({});

  const path = paths.find((p) => p.id === pathId);
  const modules = path?.modules || [];
  
  // Debug logging
  useEffect(() => {
    if (pathId) {
      console.log('🔍 LearningPathDetail Debug:');
      console.log('  - pathId:', pathId);
      console.log('  - Total paths:', paths.length);
      console.log('  - Found path:', path ? path.name : 'NOT FOUND');
      console.log('  - Path ID:', path?.id);
      console.log('  - Modules count:', modules.length);
      if (path && path.modules) {
        console.log('  - Module details:');
        path.modules.forEach((m: any, idx: number) => {
          console.log(`    ${idx + 1}. ${m.title} (ID: ${m.id}, order: ${m.order_index})`);
        });
      }
    }
  }, [pathId, paths, path, modules]);

  // Refetch when pathId changes or component mounts
  useEffect(() => {
    if (pathId) {
      refetch();
    }
  }, [pathId, refetch]);

  const handleModuleClick = async (module: any) => {
    if (!user) {
      toast.info('Please sign in to access learning modules');
      return;
    }

    if (!module.is_free && !user) {
      toast.info('This module requires a premium subscription');
      return;
    }

    // Mark as accessed
    try {
      await updateProgress(module.id, {
        last_accessed: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating progress:', err);
    }

    // Open content URL - handle both external URLs and internal article slugs
    if (module.content_url) {
      // If content_url starts with /blog/ or /article/, it's an internal article
      if (module.content_url.startsWith('/blog/') || module.content_url.startsWith('/article/')) {
        window.location.href = module.content_url;
      } else if (module.content_url.startsWith('http://') || module.content_url.startsWith('https://')) {
        // External URL
        window.open(module.content_url, '_blank', 'noopener,noreferrer');
      } else {
        // Relative path - navigate internally
        window.location.href = module.content_url;
      }
    } else {
      toast.info('Content URL not available yet');
    }
  };

  const handleModuleComplete = async (module: any) => {
    if (!user) {
      toast.info('Please sign in to track progress');
      return;
    }

    try {
      await updateProgress(module.id, {
        completed: true,
        progress_percentage: 100,
      });
      toast.success('Module marked as complete!');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const calculateOverallProgress = () => {
    if (!modules.length) return 0;
    const completed = modules.filter((m: any) => m.progress?.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  if (loading) {
    return (
      <>
        <SEO
          title={pathId ? `Loading: ${pathId} - Learning Path | ContentAnonymity` : "Loading Learning Path | ContentAnonymity"}
          description="Loading learning path content..."
          url={`https://contentanonymity.com/learning-paths/${pathId || ''}`}
          canonical={`https://contentanonymity.com/learning-paths/${pathId || ''}`}
          noindex={true}
        />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !path) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || 'Learning path not found'}</p>
            <Button asChild>
              <Link to="/learning-paths">Back to Learning Paths</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const overallProgress = calculateOverallProgress();

  const pageTitle = path ? `${path.name} - Learning Path | ContentAnonymity` : `Learning Path ${pathId || ''} | ContentAnonymity`;
  const pageDescription = path 
    ? `Master ${path.name.toLowerCase()} with this structured learning path. ${path.description || 'Step-by-step modules to build your faceless content skills.'}`
    : 'Structured learning path to master faceless content creation.';
  const canonicalUrl = `https://contentanonymity.com/learning-paths/${pathId}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${path?.name?.toLowerCase() || 'learning path'}, faceless content course, structured learning, content creation training`}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="course"
        breadcrumbItems={[
          { name: 'Learning Paths', url: 'https://contentanonymity.com/learning-paths' },
          { name: path?.name || 'Path', url: canonicalUrl }
        ]}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/learning-paths">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Learning Paths
              </Link>
            </Button>

            {/* Path Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge>{path.track_type}</Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          await refetch();
                          if (!loading && path) {
                            toast.success('Learning path refreshed successfully!');
                          }
                        }}
                        disabled={loading}
                        title="Refresh learning path"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <CardTitle className="text-3xl mb-2">{path.name}</CardTitle>
                    <CardDescription className="text-base">
                      {path.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {path.estimated_duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.estimated_duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {modules.length} modules
                  </span>
                  {path.difficulty_level && (
                    <Badge variant="outline" className="capitalize">
                      {path.difficulty_level}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              {user && modules.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Modules List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Modules</h2>
              {modules.length > 0 ? (
                (() => {
                  // Group modules by level if level information exists
                  const modulesWithLevels = modules.filter((m: any) => m.level_order);
                  const modulesWithoutLevels = modules.filter((m: any) => !m.level_order);
                  
                  const renderModule = (module: any, index: number) => {
                    const IconComponent = contentTypeIcons[module.content_type || 'article'] || FileText;
                    const isCompleted = module.progress?.completed;
                    const isLocked = !module.is_free && !user;

                    return (
                      <Card 
                        key={module.id} 
                        className={`transition-all ${
                          isCompleted ? 'border-green-500' : ''
                        } ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-lg font-bold text-primary">{module.order_index || index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline" className="capitalize text-xs">
                                    {module.content_type || 'article'}
                                  </Badge>
                                  {isLocked && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Premium
                                    </Badge>
                                  )}
                                  {isCompleted && (
                                    <Badge className="bg-green-500 text-xs">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                {module.description && (
                                  <CardDescription className="mt-1">
                                    {module.description}
                                  </CardDescription>
                                )}
                                {module.key_concepts && module.key_concepts.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {module.key_concepts.map((concept: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {concept}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {module.duration_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {module.duration_minutes} min
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!isLocked && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleClick(module);
                                  }}
                                >
                                  {module.content_url ? 'Open Content' : 'View Module'}
                                </Button>
                              )}
                              {user && !isCompleted && !isLocked && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleComplete(module);
                                  }}
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  };
                  
                  if (modulesWithLevels.length > 0) {
                    // Group by level
                    const levels = Array.from(new Set(modulesWithLevels.map((m: any) => m.level_order))).sort();
                    return levels.map((levelOrder: number) => {
                      const levelModules = modulesWithLevels.filter((m: any) => m.level_order === levelOrder);
                      const firstModule = levelModules[0];
                      
                      return (
                        <div key={levelOrder} className="space-y-4">
                          <div className="border-l-4 border-l-primary pl-4 py-2 bg-primary/5 rounded-r">
                            <h3 className="text-xl font-semibold">{firstModule.level_title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {levelModules.length} module{levelModules.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="space-y-3 pl-4">
                            {levelModules.map((module: any) => {
                              const globalIndex = modules.indexOf(module);
                              return renderModule(module, globalIndex);
                            })}
                          </div>
                        </div>
                      );
                    }).concat(
                      modulesWithoutLevels.map((module: any) => {
                        const globalIndex = modules.indexOf(module);
                        return renderModule(module, globalIndex);
                      })
                    );
                  } else {
                    // No level grouping, render all modules
                    return modules.map((module: any, index: number) => renderModule(module, index));
                  }
                })()
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No modules available yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

