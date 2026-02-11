import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Download,
  BookOpen,
  Clock,
  Loader2,
  ArrowLeft,
  Maximize2,
  Volume2,
  VolumeX
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCourse, useCourseProgress } from "@/hooks/useCourses";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const courseIdTyped = courseId as Id<"courses"> | null;
  const { course, loading: courseLoading } = useCourse(courseIdTyped);
  const { progress, loading: progressLoading, completeLesson } = useCourseProgress(courseIdTyped);

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const selectedModule = course?.modules?.[selectedModuleIndex];
  const selectedLesson = selectedModule?.lessons?.[selectedLessonIndex];

  // Find next incomplete lesson
  const nextLesson = useMemo(() => {
    if (!course?.modules) return null;
    
    for (let mIdx = selectedModuleIndex; mIdx < course.modules.length; mIdx++) {
      const module = course.modules[mIdx];
      const startIdx = mIdx === selectedModuleIndex ? selectedLessonIndex + 1 : 0;
      
      for (let lIdx = startIdx; lIdx < module.lessons.length; lIdx++) {
        const lesson = module.lessons[lIdx];
        const isCompleted = progress?.modules
          .find((m: any) => m.moduleId === module._id)
          ?.lessons.find((l: any) => l.lessonId === lesson._id)?.completed;
        
        if (!isCompleted) {
          return { moduleIndex: mIdx, lessonIndex: lIdx };
        }
      }
    }
    return null;
  }, [course, selectedModuleIndex, selectedLessonIndex, progress]);

  // Auto-continue to next lesson when current completes
  useEffect(() => {
    if (nextLesson && selectedLesson) {
      const isCompleted = progress?.modules
        .find((m: any) => m.moduleId === selectedModule?._id)
        ?.lessons.find((l: any) => l.lessonId === selectedLesson._id)?.completed;
      
      if (isCompleted && nextLesson) {
        // Auto-advance after a short delay
        setTimeout(() => {
          setSelectedModuleIndex(nextLesson.moduleIndex);
          setSelectedLessonIndex(nextLesson.lessonIndex);
        }, 2000);
      }
    }
  }, [progress, selectedLesson, selectedModule, nextLesson]);

  const handleMarkComplete = async () => {
    if (!selectedLesson) return;

    try {
      await completeLesson(selectedLesson._id, true, 100);
      toast.success("Lesson marked as complete!");
    } catch (error) {
      toast.error("Failed to mark lesson as complete");
    }
  };

  const handlePrevious = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
    } else if (selectedModuleIndex > 0) {
      setSelectedModuleIndex(selectedModuleIndex - 1);
      const prevModule = course?.modules?.[selectedModuleIndex - 1];
      setSelectedLessonIndex((prevModule?.lessons?.length ?? 1) - 1);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      setSelectedModuleIndex(nextLesson.moduleIndex);
      setSelectedLessonIndex(nextLesson.lessonIndex);
    }
  };

  if (courseLoading || progressLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <p className="text-muted-foreground mb-4">
              The course you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link to="/dashboard/courses">Back to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const overallProgress = progress?.overallProgress ?? 0;
  const isLessonCompleted = selectedLesson
    ? progress?.modules
        .find((m: any) => m.moduleId === selectedModule?._id)
        ?.lessons.find((l: any) => l.lessonId === selectedLesson._id)?.completed ?? false
    : false;

  return (
    <>
      <SEO
        title={`${course.product?.name || "Course"} - Learning Platform`}
        description={`Learn ${course.product?.name || "this course"} with step-by-step lessons and resources.`}
        noindex
        canonical={`https://contentanonymity.com/courses/${courseId}/learn`}
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/courses")} className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <h1 className="text-3xl font-bold">{course.product?.name || "Course"}</h1>
              <p className="text-muted-foreground mt-1">
                {course.instructor?.name && `Instructor: ${course.instructor.name}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="w-32 mt-2" />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Module Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {course.modules?.map((module: any, mIdx: number) => {
                      const moduleProgress = progress?.modules.find(
                        (m: any) => m.moduleId === module._id
                      );
                      const isModuleActive = mIdx === selectedModuleIndex;

                      return (
                        <div key={module._id} className="border-b last:border-b-0">
                          <button
                            onClick={() => {
                              setSelectedModuleIndex(mIdx);
                              setSelectedLessonIndex(0);
                            }}
                            className={cn(
                              "w-full text-left p-4 hover:bg-muted transition-colors",
                              isModuleActive && "bg-muted"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{module.title}</span>
                              {moduleProgress && (
                                <span className="text-xs text-muted-foreground">
                                  {moduleProgress.completedLessons}/{moduleProgress.totalLessons}
                                </span>
                              )}
                            </div>
                            {moduleProgress && (
                              <Progress
                                value={moduleProgress.progressPercentage}
                                className="h-1"
                              />
                            )}
                          </button>

                          {isModuleActive && module.lessons && (
                            <div className="bg-muted/50">
                              {module.lessons.map((lesson: any, lIdx: number) => {
                                const lessonProgress = moduleProgress?.lessons.find(
                                  (l: any) => l.lessonId === lesson._id
                                );
                                const isLessonActive =
                                  mIdx === selectedModuleIndex && lIdx === selectedLessonIndex;
                                const isCompleted = lessonProgress?.completed ?? false;

                                return (
                                  <button
                                    key={lesson._id}
                                    onClick={() => {
                                      setSelectedModuleIndex(mIdx);
                                      setSelectedLessonIndex(lIdx);
                                    }}
                                    className={cn(
                                      "w-full text-left p-3 pl-8 hover:bg-muted transition-colors flex items-center gap-2",
                                      isLessonActive && "bg-muted border-l-2 border-primary"
                                    )}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className="text-sm flex-1 text-left">
                                      {lesson.title}
                                    </span>
                                    {lesson.duration && (
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round(lesson.duration)}m
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Lesson Player */}
            <div className="lg:col-span-3">
              {selectedLesson ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {selectedModule?.title}
                        </Badge>
                        <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                        {selectedLesson.lessonType && (
                          <Badge className="mt-2">
                            {selectedLesson.lessonType}
                          </Badge>
                        )}
                      </div>
                      {isLessonCompleted && (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Video Player */}
                    {selectedLesson.videoUrl && selectedLesson.lessonType === "video" && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        <video
                          src={selectedLesson.videoUrl}
                          controls
                          className="w-full h-full"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onTimeUpdate={(e) => {
                            const video = e.currentTarget;
                            setCurrentTime(video.currentTime);
                            setDuration(video.duration);
                          }}
                        />
                      </div>
                    )}

                    {/* Text Content */}
                    {selectedLesson.content && (
                      <div className="prose prose-lg max-w-none">
                        {typeof selectedLesson.content === "string" ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                        ) : (
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(selectedLesson.content, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Downloadable Resources */}
                    {selectedLesson.downloadableResources &&
                      selectedLesson.downloadableResources.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Resources</h3>
                          <div className="space-y-2">
                            {selectedLesson.downloadableResources.map((resource: string, idx: number) => (
                              <a
                                key={idx}
                                href={resource}
                                download
                                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                              >
                                <Download className="h-4 w-4" />
                                <span className="text-sm">Resource {idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Course Digital Assets */}
                    {course.digitalAssets && course.digitalAssets.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Course Resources</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.digitalAssets.map((asset: any) => (
                            <a
                              key={asset._id}
                              href={asset.fileUrl}
                              download={asset.fileName}
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                            >
                              <Download className="h-4 w-4 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {asset.fileName}
                                </div>
                                {asset.fileSize && (
                                  <div className="text-xs text-muted-foreground">
                                    {(asset.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={selectedModuleIndex === 0 && selectedLessonIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      {!isLessonCompleted && (
                        <Button onClick={handleMarkComplete}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      )}

                      <Button
                        onClick={handleNext}
                        disabled={!nextLesson}
                        variant={nextLesson ? "default" : "outline"}
                      >
                        {nextLesson ? (
                          <>
                            Next Lesson
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Course Complete!
                            <CheckCircle2 className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No lesson selected</h3>
                    <p className="text-muted-foreground">
                      Select a lesson from the sidebar to begin learning.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
