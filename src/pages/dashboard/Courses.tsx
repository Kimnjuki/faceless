import { Play, CheckCircle2, Clock } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    title: "Faceless Automation Blueprint",
    progress: 75,
    lessons: 24,
    completed: 18,
    duration: "6 hours",
    status: "in-progress"
  },
  {
    title: "Content Calendar System",
    progress: 45,
    lessons: 16,
    completed: 7,
    duration: "4 hours",
    status: "in-progress"
  },
  {
    title: "Niche Research Mastery",
    progress: 100,
    lessons: 12,
    completed: 12,
    duration: "3 hours",
    status: "completed"
  }
];

export default function Courses() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        <div className="grid gap-6">
          {courses.map((course, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration}
                      </span>
                    </CardDescription>
                  </div>
                  {course.status === "completed" ? (
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
                        {course.completed} of {course.lessons} lessons completed
                      </span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                  <Button className="w-full">
                    {course.status === "completed" ? "Review Course" : "Continue Learning"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">Explore More Courses</h3>
            <p className="mb-4 opacity-90">Expand your skills with our complete course library</p>
            <Button variant="secondary">Browse Courses</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
