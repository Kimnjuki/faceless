import { CheckCircle2, Clock, BookOpen, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLearningPaths } from "@/hooks/useLearningPaths";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";

export default function Courses() {
  const { user } = useAuth();
  const { paths, loading, refetch } = useLearningPaths({});

  const calculatePathProgress = (path: any) => {
    if (!user || !path.modules || path.modules.length === 0) return 0;
    const completedModules = path.modules.filter((m: any) => m.progress?.completed).length;
    return Math.round((completedModules / path.modules.length) * 100);
  };

  const userPaths = paths.filter((path) => {
    if (!user) return false;
    return path.modules?.some((m: any) => m.progress);
  });

  return (
    <>
      <SEO
        title="My Courses - Private Learning Dashboard"
        description="View and continue your private faceless creator courses. This learning dashboard is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/dashboard/courses"
      />
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={loading}
            title="Refresh courses"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userPaths.length > 0 ? (
          <div className="grid gap-6">
            {userPaths.map((path) => {
              const progress = calculatePathProgress(path);
              const totalModules = path.modules?.length || 0;
              const completedModules = path.modules?.filter((m: any) => m.progress?.completed).length || 0;
              const isCompleted = progress === 100;

              return (
                <Card key={path.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{path.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {totalModules} modules
                          </span>
                          {path.estimated_duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {path.estimated_duration}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      {isCompleted ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {completedModules} of {totalModules} modules completed
                          </span>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/learning-paths/${path.id}`}>
                          {isCompleted ? "Review Course" : "Continue Learning"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No courses in progress</h3>
              <p className="text-muted-foreground mb-4">
                Start a learning path to track your progress here
              </p>
              <Button asChild>
                <Link to="/learning-paths">
                  Browse Learning Paths <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Explore More Courses</h3>
            <p className="mb-4 opacity-90">Expand your skills with our complete course library</p>
            <Button variant="secondary">Browse Courses</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </>
  );
}
