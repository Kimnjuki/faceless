import { CheckCircle2, Circle, Lock, Clock, PlayCircle, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Module {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  contentType?: string;
  durationMinutes?: number;
  orderIndex?: number;
  progress?: {
    completed: boolean;
    progressPercentage: number;
    lastAccessed?: number;
  };
  isFree?: boolean;
}

interface LearningPathRoadmapProps {
  modules: Module[];
  progress?: {
    overallProgress: number;
    modules: Array<{
      moduleId: string;
      completed: boolean;
      progressPercentage: number;
    }>;
  };
  isLocked?: (module: Module) => boolean;
}

export default function LearningPathRoadmap({
  modules,
  progress,
  isLocked,
}: LearningPathRoadmapProps) {
  const sortedModules = [...modules].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );

  const getModuleProgress = (moduleId: string) => {
    return progress?.modules.find((m) => m.moduleId === moduleId);
  };

  const getContentIcon = (contentType?: string) => {
    switch (contentType) {
      case "video":
        return PlayCircle;
      case "article":
        return FileText;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Vertical Timeline */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        {sortedModules.map((module, index) => {
          const moduleProgress = getModuleProgress(module._id || module.id || "");
          const isCompleted = moduleProgress?.completed ?? false;
          const isModuleLocked = isLocked ? isLocked(module) : false;
          const isLast = index === sortedModules.length - 1;
          const ContentIcon = getContentIcon(module.contentType);

          return (
            <div key={module._id || module.id || index} className="relative pl-16 pb-8">
              {/* Timeline Node */}
              <div
                className={cn(
                  "absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-background transition-colors",
                  isCompleted
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : isModuleLocked
                    ? "border-muted bg-muted"
                    : "border-primary bg-primary/10"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : isModuleLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Circle className="h-6 w-6 text-primary" />
                )}
              </div>

              {/* Module Card */}
              <div
                className={cn(
                  "rounded-lg border p-4 transition-all",
                  isCompleted
                    ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                    : isModuleLocked
                    ? "border-muted bg-muted/30 opacity-60"
                    : "border-border bg-card hover:shadow-md"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ContentIcon className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        Module {index + 1}
                      </Badge>
                      {isModuleLocked && (
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
                    <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                    {module.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {module.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {module.durationMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.durationMinutes} min
                        </span>
                      )}
                      {module.contentType && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {module.contentType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {moduleProgress && !isCompleted && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.round(moduleProgress.progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={moduleProgress.progressPercentage} className="h-1.5" />
                  </div>
                )}
              </div>

              {/* Connector Line (except for last item) */}
              {!isLast && (
                <div className="absolute left-6 top-12 h-8 w-0.5 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      {progress && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-lg font-bold">{progress.overallProgress}%</span>
          </div>
          <Progress value={progress.overallProgress} className="h-2" />
          <div className="mt-2 text-xs text-muted-foreground">
            {progress.modules.filter((m) => m.completed).length} of{" "}
            {modules.length} modules completed
          </div>
        </div>
      )}
    </div>
  );
}
