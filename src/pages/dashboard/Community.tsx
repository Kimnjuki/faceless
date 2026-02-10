import { useState, useMemo, useEffect } from "react";
import { MessageSquare, ThumbsUp, Plus, Search, Loader2, Pin, Users, Send, Crown } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import SEO from "@/components/SEO";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const categoriesRaw = useQuery(
    api.community.listCategories,
    hasConvex ? {} : "skip"
  );
  const categories = useMemo(
    () => (categoriesRaw ?? []).map((c: any) => ({ id: c._id ?? c.id, name: c.name })),
    [categoriesRaw]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categoryFilter = useMemo(() => {
    if (selectedCategory === 'all') return undefined;
    return selectedCategory;
  }, [selectedCategory]);

  const { posts, loading, createPost, refetch } = useCommunityPosts(categoryFilter);

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery) return posts;
    const searchLower = debouncedSearchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
    );
  }, [posts, debouncedSearchQuery]);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createPost(newPost.title, newPost.content, newPost.category);
      setNewPost({ title: "", category: "", content: "" });
      setDialogOpen(false);
      refetch();
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <>
      <SEO
        title="Community Hub - Private Member Space"
        description="Participate in the private ContentAnonymity creator community. This dashboard space is only for members and is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/dashboard/community"
      />
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">Connect with fellow creators</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create a Post</DialogTitle>
                <DialogDescription>
                  Share your question, story, or insight with the community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's your question or story?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">Post to Community</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="masterminds">Mastermind Groups</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="qna">Expert Q&A</TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-4 mt-6">
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.name}>
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="space-y-4 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.pinned && <Pin className="h-4 w-4 text-primary" />}
                          <Badge variant="outline" className="capitalize">{post.post_type}</Badge>
                          {post.category && (
                            <Badge variant="secondary">{post.category.name}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content.substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.reply_count} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {post.view_count} views
                        </span>
                        {post.last_reply_at && (
                          <span className="text-xs">
                            {formatDistanceToNow(new Date(post.last_reply_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found.</p>
              </div>
            )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Mastermind Groups Tab */}
          <TabsContent value="masterminds" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Mastermind Groups</h2>
                <p className="text-sm text-muted-foreground">Join small accountability groups by niche/level</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "YouTube Automation", members: 8, maxMembers: 10, niche: "YouTube", level: "Intermediate" },
                { name: "Finance Content Creators", members: 6, maxMembers: 10, niche: "Finance", level: "Advanced" },
                { name: "TikTok Growth", members: 9, maxMembers: 10, niche: "TikTok", level: "Beginner" },
              ].map((group, index) => (
                <Card key={index} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {group.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{group.niche}</Badge>
                          <Badge variant="secondary">{group.level}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {group.members}/{group.maxMembers} members
                      </span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button className="w-full" variant={group.members < group.maxMembers ? "default" : "outline"}>
                      {group.members < group.maxMembers ? "Join Group" : "Group Full"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Direct Messages Tab */}
          <TabsContent value="messages" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Direct Messages</h2>
                <p className="text-sm text-muted-foreground">Private conversations with community members</p>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "Sarah K.", preview: "Thanks for the tip!", unread: 2, time: "2h ago" },
                    { name: "John M.", preview: "Can you share that template?", unread: 0, time: "1d ago" },
                    { name: "Alex P.", preview: "Great work on your latest video!", unread: 0, time: "3d ago" },
                  ].map((conversation, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-sm">{conversation.name}</span>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{conversation.preview}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Select a conversation to start messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Select a conversation from the list</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expert Q&A Tab */}
          <TabsContent value="qna" className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Expert Q&A</h2>
                <p className="text-sm text-muted-foreground">Get answers from experienced solopreneurs</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How do I scale from $1K to $10K/month?",
                  author: "Expert: Jane Doe",
                  answers: 5,
                  verified: true,
                  category: "Monetization",
                },
                {
                  question: "Best AI tools for faceless YouTube channels?",
                  author: "Expert: Mike Smith",
                  answers: 12,
                  verified: true,
                  category: "Tools",
                },
                {
                  question: "How to find profitable niches in 2025?",
                  author: "Expert: Sarah Johnson",
                  answers: 8,
                  verified: true,
                  category: "Niche Research",
                },
              ].map((qa, index) => (
                <Card key={index} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{qa.category}</Badge>
                          {qa.verified && (
                            <Badge variant="default" className="bg-green-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Verified Expert
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-2">{qa.question}</CardTitle>
                        <p className="text-sm text-muted-foreground">Answered by {qa.author}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {qa.answers} answers
                        </span>
                      </div>
                      <Button variant="outline" size="sm">View Answers</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    </>
  );
}
