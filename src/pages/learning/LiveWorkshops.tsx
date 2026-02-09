import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { format } from "date-fns";

const workshops = [
  {
    id: "1",
    title: "Advanced YouTube Automation Strategies",
    instructor: "Expert Creator",
    date: new Date("2025-01-25T14:00:00"),
    duration: "90 minutes",
    attendees: 250,
    maxAttendees: 500,
    status: "upcoming",
    description: "Learn advanced strategies for automating your YouTube channel",
    topics: ["Content automation", "SEO optimization", "Monetization"],
  },
  {
    id: "2",
    title: "TikTok Growth Hacks for Faceless Creators",
    instructor: "Growth Expert",
    date: new Date("2025-01-28T15:00:00"),
    duration: "60 minutes",
    attendees: 180,
    maxAttendees: 300,
    status: "upcoming",
    description: "Discover proven tactics to grow your TikTok following",
    topics: ["Viral content", "Hashtag strategy", "Engagement tactics"],
  },
  {
    id: "3",
    title: "Monetization Masterclass",
    instructor: "Revenue Expert",
    date: new Date("2025-01-15T16:00:00"),
    duration: "120 minutes",
    attendees: 500,
    maxAttendees: 500,
    status: "completed",
    description: "How to monetize your faceless content business",
    topics: ["Affiliate marketing", "Digital products", "Coaching"],
  },
];

export default function LiveWorkshops() {
  const upcomingWorkshops = workshops.filter((w) => w.status === "upcoming");
  const pastWorkshops = workshops.filter((w) => w.status === "completed");

  return (
    <>
      <SEO
        title="Live Workshops - Interactive Learning Sessions | ContentAnonymity"
        description="Join live interactive workshops on YouTube automation, TikTok growth, monetization, and more. Recorded replays available."
        keywords="live workshops, faceless creator workshops, YouTube automation workshop, TikTok growth workshop, monetization masterclass"
        url="https://contentanonymity.com/workshops"
        canonical="https://contentanonymity.com/learning/workshops"
        type="event"
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Live Workshops</h1>
              <p className="text-lg text-muted-foreground">
                Interactive learning sessions on hot topics - recorded for replay
              </p>
            </div>

            {/* Upcoming Workshops */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Workshops</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="default" className="bg-green-500">
                          Live
                        </Badge>
                        <Badge variant="outline">
                          {workshop.attendees}/{workshop.maxAttendees} registered
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{workshop.title}</CardTitle>
                      <CardDescription>By {workshop.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(workshop.date, "MMMM d, yyyy 'at' h:mm a")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {workshop.duration}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {workshop.attendees} attendees
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{workshop.description}</p>

                      <div>
                        <p className="text-sm font-medium mb-2">Topics Covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {workshop.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        Register for Workshop
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Past Workshops */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Past Workshops (Recorded)</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {pastWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge variant="secondary">Completed</Badge>
                      <CardTitle className="text-lg">{workshop.title}</CardTitle>
                      <CardDescription>By {workshop.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(workshop.date, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {workshop.attendees} attended
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Watch Replay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

