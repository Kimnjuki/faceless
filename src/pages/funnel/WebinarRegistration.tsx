import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, Users } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WebinarRegistration() {
  const { slug } = useParams();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });
  const webinarTitle = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Faceless Business";
  const canonicalUrl = slug ? `https://contentanonymity.com/webinar/${slug}` : "https://contentanonymity.com/webinar";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <SEO
        title={slug ? `Free Webinar: ${webinarTitle} | ContentAnonymity` : "Free Webinar: Build $10K/Month Faceless Business | ContentAnonymity"}
        description="Join our free live webinar and learn the exact system used by 1,000+ creators to generate $10K/month passive income without showing their face. Limited spots available."
        keywords="free webinar, faceless business webinar, passive income webinar, faceless content training"
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="event"
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4">FREE LIVE WEBINAR</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Build a $10K/Month Faceless Business in 90 Days
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Learn the exact system used by 1,000+ creators to generate passive income without showing their face
              </p>
              
              <div className="flex justify-center gap-4 text-center mb-8">
                <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-4 min-w-[80px]">
                  <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            </div>

            <Card className="mb-12">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Reserve Your Spot Now</h2>
                <form className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <Button size="lg" className="w-full">Save My Seat (FREE)</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Date</h3>
                  <p className="text-sm text-muted-foreground">January 25, 2025</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-sm text-muted-foreground">90 minutes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Attendees</h3>
                  <p className="text-sm text-muted-foreground">2,847 registered</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">What You'll Learn:</h2>
              <ul className="space-y-3">
                {[
                  "How to find profitable niches with low competition",
                  "The 3-step content automation system",
                  "Monetization strategies that work in 2025",
                  "Tools and software we use daily",
                  "Live Q&A with successful creators"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}