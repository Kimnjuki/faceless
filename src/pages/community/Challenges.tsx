import { useState, useEffect } from "react";
import { Search, Calendar, Trophy, Users, Target, Loader2, TrendingUp, Clock, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChallenges } from "@/hooks/useChallenges";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Challenges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [challengeTypeFilter, setChallengeTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { challenges, loading, error, refetch, joinChallenge } = useChallenges({
    challengeType: challengeTypeFilter === 'all' ? undefined : challengeTypeFilter,
    difficulty: difficultyFilter === 'all' ? undefined : difficultyFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    searchQuery: debouncedSearchQuery || undefined,
  });

  const handleJoin = async (challengeId: string) => {
    try {
      await joinChallenge(challengeId);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <>
      <SEO
        title="Community Challenges - Grow Your Faceless Skills | ContentAnonymity"
        description="Join community challenges to grow your skills and compete with fellow faceless creators. Content, growth, and monetization challenges."
        keywords="faceless creator challenges, content challenges, growth challenges, creator competitions, skill building challenges"
        url="https://contentanonymity.com/community/challenges"
        canonical="https://contentanonymity.com/community/challenges"
        type="website"
        noindex={true}
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Community Challenges</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh challenges"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground">
                Join challenges to grow your skills and compete with fellow creators
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={challengeTypeFilter} onValueChange={setChallengeTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Challenge Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="monetization">Monetization</SelectItem>
                    <SelectItem value="skill">Skill</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
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

            {/* Challenges Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow flex flex-col">
                      {challenge.featured_image && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img
                            src={challenge.featured_image}
                            alt={challenge.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {challenge.challenge_type}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            <Target className="h-3 w-3 mr-1" />
                            {challenge.difficulty_level}
                          </Badge>
                          {challenge.status === 'active' && (
                            <Badge className="bg-green-500">Active</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{challenge.name}</CardTitle>
                        {challenge.description && (
                          <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="space-y-4">
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(challenge.start_date ?? 0), 'MMM d')} -{' '}
                                {format(new Date(challenge.end_date ?? 0), 'MMM d, yyyy')}
                              </span>
                            </div>
                            {challenge.duration_days && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{challenge.duration_days} days</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {challenge.current_participants}
                                {challenge.max_participants && ` / ${challenge.max_participants}`} participants
                              </span>
                            </div>
                            {challenge.prizes && challenge.prizes.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold text-foreground">
                                  {challenge.prizes.length} Prize{challenge.prizes.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                          {challenge.registration_open ? (
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={() => handleJoin(challenge.id ?? challenge._id ?? '')}
                              >
                                Join Challenge
                              </Button>
                              {challenge.leaderboard_enabled && (
                                <Button variant="outline" asChild>
                                  <Link to={`/challenges/${challenge.slug}`}>
                                    <TrendingUp className="h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
                            </div>
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
                    <p className="text-muted-foreground">No challenges found matching your filters.</p>
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

