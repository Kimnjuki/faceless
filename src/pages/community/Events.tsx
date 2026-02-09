import { useState, useEffect } from "react";
import { Search, Calendar, Clock, Users, Loader2, ExternalLink, Video, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { events, loading, error, refetch, registerForEvent } = useEvents({
    eventType: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    searchQuery: debouncedSearchQuery || undefined,
  });

  const handleRegister = async (eventId: string, registrationUrl?: string) => {
    if (registrationUrl) {
      window.open(registrationUrl, '_blank');
      return;
    }

    try {
      await registerForEvent(eventId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar':
      case 'live_qna':
        return <Video className="h-4 w-4" />;
      case 'workshop':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <>
      <SEO
        title="Events & Webinars - Live Sessions for Faceless Creators | ContentAnonymity"
        description="Join live webinars, workshops, and networking events with the faceless creator community. Learn from experts and connect with peers."
        keywords="faceless creator events, webinars, workshops, live sessions, creator networking, faceless content events"
        url="https://contentanonymity.com/community/events"
        canonical="https://contentanonymity.com/community/events"
        type="website"
        noindex={true}
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Events & Webinars</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh events"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground">
                Join live sessions, workshops, and networking events with the community
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="webinar">Webinars</SelectItem>
                    <SelectItem value="workshop">Workshops</SelectItem>
                    <SelectItem value="live_qna">Live Q&A</SelectItem>
                    <SelectItem value="meetup">Meetups</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live Now</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              </div>
            )}

            {/* Events Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? (
                  events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow flex flex-col">
                      {event.featured_image && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img
                            src={event.featured_image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize flex items-center gap-1">
                            {getEventTypeIcon(event.event_type ?? '')}
                            {(event.event_type ?? '').replace('_', ' ')}
                          </Badge>
                          {event.status === 'live' && (
                            <Badge className="bg-red-500">Live Now</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="space-y-4">
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(event.start_date ?? event.scheduledAt ?? 0), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(event.start_date ?? event.scheduledAt ?? 0), 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {event.current_participants}
                                {event.max_participants && ` / ${event.max_participants}`} registered
                              </span>
                            </div>
                            {(event.price ?? 0) > 0 && (
                              <div className="font-semibold text-foreground">
                                ${event.price ?? 0} {event.currency || 'USD'}
                              </div>
                            )}
                          </div>
                          {event.registration_open ? (
                            <Button
                              className="w-full"
                              onClick={() => handleRegister(event.id ?? '', event.registration_url ?? '')}
                            >
                              {event.registration_url ? (
                                <>
                                  Register <ExternalLink className="ml-2 h-4 w-4" />
                                </>
                              ) : (
                                'Register Now'
                              )}
                            </Button>
                          ) : (
                            <Button className="w-full" disabled>
                              Registration Closed
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No events found matching your filters.</p>
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

