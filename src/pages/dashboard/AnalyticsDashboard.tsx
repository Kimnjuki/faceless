import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  DollarSign,
  Download,
  BarChart3,
  PieChart,
  RefreshCw,
  Youtube,
  Instagram,
  Twitter
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");

  const platforms = [
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500", connected: true },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500", connected: true },
    { id: "tiktok", name: "TikTok", icon: Youtube, color: "text-black dark:text-white", connected: false },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-500", connected: false },
  ];

  const metrics = [
    { label: "Total Revenue", value: "$12,450", change: "+18.2%", trend: "up", icon: DollarSign },
    { label: "Total Followers", value: "45.2K", change: "+2.1K", trend: "up", icon: Users },
    { label: "Total Views", value: "1.2M", change: "+125K", trend: "up", icon: Eye },
    { label: "Engagement Rate", value: "8.4%", change: "-0.3%", trend: "down", icon: Heart },
  ];

  const topContent = [
    { title: "10 Money Saving Tips", platform: "YouTube", views: 125000, engagement: 12.5, revenue: 450 },
    { title: "Productivity Hacks", platform: "Instagram", views: 89000, engagement: 15.2, revenue: 320 },
    { title: "Morning Routine", platform: "TikTok", views: 234000, engagement: 18.7, revenue: 680 },
    { title: "Investment Guide", platform: "YouTube", views: 156000, engagement: 10.3, revenue: 520 },
  ];

  const competitorData = [
    { name: "Competitor A", followers: "120K", growth: "+5.2%", engagement: 9.2 },
    { name: "Competitor B", followers: "85K", growth: "+3.1%", engagement: 7.8 },
    { name: "You", followers: "45.2K", growth: "+2.1%", engagement: 8.4 },
  ];

  return (
    <>
      <SEO
        title="Analytics Dashboard - Private Creator Insights"
        description="View your private performance analytics across platforms. This dashboard is only for logged-in users and is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/dashboard/analytics"
      />
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your performance across all platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Platform Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Connections</CardTitle>
            <CardDescription>Connect your social media accounts to track analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.id}
                    className={`p-4 border rounded-lg ${
                      platform.connected ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 ${platform.color}`} />
                      {platform.connected ? (
                        <Badge variant="default" className="bg-green-500">Connected</Badge>
                      ) : (
                        <Badge variant="secondary">Not Connected</Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    {!platform.connected && (
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Views and engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Chart visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>Views by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Chart visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Best Posting Times</CardTitle>
                <CardDescription>Optimal times to post for maximum engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { platform: "YouTube", time: "2:00 PM - 4:00 PM EST", engagement: 95 },
                    { platform: "Instagram", time: "11:00 AM - 1:00 PM EST", engagement: 87 },
                    { platform: "TikTok", time: "6:00 PM - 8:00 PM EST", engagement: 92 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.platform}</span>
                        <span className="text-sm text-muted-foreground">{item.time}</span>
                      </div>
                      <Progress value={item.engagement} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Performance Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Your best performing posts sorted by views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{content.platform}</Badge>
                          <span className="font-medium">{content.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{content.views.toLocaleString()} views</span>
                          <span>{content.engagement}% engagement</span>
                          <span>${content.revenue} revenue</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tracking Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ad Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$8,450</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Affiliate Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$2,890</div>
                  <p className="text-xs text-muted-foreground">+22% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Product Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$1,110</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue sources over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Revenue chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitor Analysis Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Benchmarks</CardTitle>
                <CardDescription>Compare your performance with competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorData.map((competitor, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      competitor.name === "You" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">{competitor.name}</span>
                        {competitor.name === "You" && <Badge>You</Badge>}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Followers</p>
                          <p className="font-medium">{competitor.followers}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Growth</p>
                          <p className="font-medium text-green-600">{competitor.growth}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Engagement</p>
                          <p className="font-medium">{competitor.engagement}%</p>
                        </div>
                      </div>
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

