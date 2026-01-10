import { useState, useMemo, useEffect } from "react";
import { Search, Award, TrendingUp, Loader2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMembers } from "@/hooks/useMembers";
import { Profile } from "@/lib/supabase";

export default function MemberDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [skillLevelFilter, setSkillLevelFilter] = useState("all");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { members, loading, error, refetch } = useMembers({
    skillLevel: skillLevelFilter === 'all' ? undefined : skillLevelFilter,
    niche: nicheFilter === 'all' ? undefined : nicheFilter,
    subscriptionTier: tierFilter === 'all' ? undefined : tierFilter,
    searchQuery: debouncedSearchQuery || undefined,
  });

  // Get unique niches and skill levels for filters
  const uniqueNiches = useMemo(() => {
    const niches = new Set<string>();
    members.forEach((member) => {
      if (member.primary_niche) niches.add(member.primary_niche);
    });
    return Array.from(niches).sort();
  }, [members]);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">Member Directory</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  disabled={loading}
                  title="Refresh members"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-lg text-muted-foreground">
                Connect with fellow faceless content creators in our community
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name, niche, or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={nicheFilter} onValueChange={setNicheFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    {uniqueNiches.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
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

            {/* Members Grid */}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.length > 0 ? (
                  members.map((member: Profile) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={member.avatar_url} alt={member.full_name} />
                            <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{member.full_name || "Anonymous"}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </CardDescription>
                          </div>
                        </div>
                        {member.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {member.skill_level && (
                            <Badge variant="outline" className="capitalize">
                              <Award className="h-3 w-3 mr-1" />
                              {member.skill_level}
                            </Badge>
                          )}
                          {member.primary_niche && (
                            <Badge variant="secondary">{member.primary_niche}</Badge>
                          )}
                          {member.subscription_tier && member.subscription_tier !== 'free' && (
                            <Badge className="bg-primary">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {member.subscription_tier.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        {member.lifetime_value > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Lifetime Value: ${member.lifetime_value.toFixed(2)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No members found matching your filters.</p>
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

