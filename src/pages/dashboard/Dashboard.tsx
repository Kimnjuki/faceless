import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Award, Play, Calendar, DollarSign, Eye, Heart, ArrowUpRight, ArrowDownRight, FileText, Target, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import OnboardingModal from "../../components/OnboardingModal";
import QuickStartWizard from "../../components/QuickStartWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { useDashboard } from "@/hooks/useDashboard";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(() => {
    // Show quick start if user hasn't completed it yet
    const completed = localStorage.getItem('quickstart_completed');
    return !completed;
  });

  const { stats, courses, progress, communityActivity, loading } = useDashboard();

  const upcomingEvents = [
    { title: "Live Q&A Session", date: "Jan 25, 2025", time: "2:00 PM EST" },
    { title: "Niche Research Workshop", date: "Jan 28, 2025", time: "3:00 PM EST" }
  ];

  // Get active courses (in progress)
  const activeCourses = courses.filter((c: any) => c.progressPercentage > 0 && c.progressPercentage < 100);
  const completedCourses = courses.filter((c: any) => c.progressPercentage >= 100);

  return (
    <>
      <SEO
        title="Creator Dashboard - Private Workspace"
        description="Your private ContentAnonymity creator dashboard. This page is for logged-in users only and is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/dashboard"
      />
    <DashboardLayout>
      <OnboardingModal open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
      <QuickStartWizard 
        open={showQuickStart} 
        onComplete={() => {
          setShowQuickStart(false);
          localStorage.setItem('quickstart_completed', 'true');
        }} 
      />
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Creator!</h1>
            <p className="text-muted-foreground">Here's your progress overview</p>
          </div>
          <Button variant="outline" onClick={() => setShowOnboarding(true)}>
            Restart Onboarding
          </Button>
        </div>

        {/* Analytics Overview */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">$4,250</div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+18.2% from last month</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Followers</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">12.5K</div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+1.2K this month</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <Eye className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">245K</div>
                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+32K this month</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold">8.4%</div>
                <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-0.3% from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                  <p className="text-xs text-muted-foreground">
                    {progress.inProgressCourses} in progress
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {progress.completedCourses} completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.communityPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    {communityActivity.length} recent activities
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.achievements}</div>
                  <p className="text-xs text-muted-foreground">Keep learning to unlock more</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : activeCourses.length > 0 ? (
                activeCourses.slice(0, 3).map((course: any) => (
                  <div key={course._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {course.product?.name || `Course ${course._id}`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(course.progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={course.progressPercentage} />
                    <Button variant="link" size="sm" className="mt-2 p-0" asChild>
                      <Link to={`/dashboard/courses`}>
                        <Play className="h-3 w-3 mr-1" />
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active courses</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link to="/dashboard/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                  </div>
                  <Badge variant="secondary">Live</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/content">Create Content</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/courses">Continue Learning</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/community">Join Discussion</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/resources/templates">
                  <FileText className="mr-2 h-4 w-4" />
                  Templates
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/resources/niches">
                  <Target className="mr-2 h-4 w-4" />
                  Niche Database
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/learning-paths">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learning Paths
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/platform-guides">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Platform Guides
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : communityActivity.length > 0 ? (
              <div className="space-y-3 text-sm">
                {communityActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      {activity.type === "post" ? "Posted: " : "Replied: "}
                      {activity.title}
                      {" • "}
                      {formatDistanceToNow(new Date(activity.createdAt || Date.now()), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/dashboard/community">Join Community</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </>
  );
}
