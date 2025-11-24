import { useState } from "react";
import { MessageSquare, ThumbsUp, User, Plus, Search } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const posts = [
  {
    author: "Alex M.",
    title: "Just hit $5K/month with my faceless channel!",
    category: "Success Stories",
    replies: 24,
    likes: 156,
    time: "2 hours ago",
    preview: "Started 6 months ago following the FSH blueprint..."
  },
  {
    author: "Sarah K.",
    title: "Best AI tools for content creation in 2025?",
    category: "Tool Recommendations",
    replies: 18,
    likes: 42,
    time: "5 hours ago",
    preview: "Looking for recommendations on AI video editors..."
  },
  {
    author: "Jordan P.",
    title: "Struggling with niche selection - need advice",
    category: "Troubleshooting",
    replies: 31,
    likes: 28,
    time: "1 day ago",
    preview: "I've narrowed it down to 3 niches but can't decide..."
  }
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({ title: "", category: "", content: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreatePost = () => {
    toast.success("Post created successfully!");
    setNewPost({ title: "", category: "", content: "" });
    setDialogOpen(false);
  };

  return (
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
                      <SelectItem value="success">Success Stories</SelectItem>
                      <SelectItem value="tools">Tool Recommendations</SelectItem>
                      <SelectItem value="help">Troubleshooting</SelectItem>
                      <SelectItem value="general">General Discussion</SelectItem>
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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {posts.map((post, index) => (
              <Card key={index} className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{post.author}</div>
                          <div className="text-xs text-muted-foreground">{post.time}</div>
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{post.preview}</p>
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      {post.replies} replies
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes} likes
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
