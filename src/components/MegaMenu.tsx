import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  ShoppingBag, 
  Wrench, 
  GraduationCap, 
  Library,
  TrendingUp,
  FileText,
  Target,
  Calculator,
  Search,
  MessageSquare,
  Calendar,
  Award,
  Sparkles,
  BarChart3,
  FolderOpen,
  Video,
  Music,
  Image as ImageIcon,
  PenTool
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MegaMenuProps {
  trigger: React.ReactNode;
}

export function DashboardMegaMenu({ trigger }: MegaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[600px] p-4" align="start">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <DropdownMenuLabel className="mb-3">Overview</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard Home
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/progress">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Learning Progress
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/bookmarks">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Bookmarks
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Quick Actions</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/content">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Content
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/community">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Community
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/profile">
                  <Award className="mr-2 h-4 w-4" />
                  Profile & Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LearnMegaMenu({ trigger }: MegaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[700px] p-4" align="start">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <DropdownMenuLabel className="mb-3">Courses</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  All Courses
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/learning-paths">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Learning Paths
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/learning/case-studies">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Case Studies
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Resources</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/platform-guides">
                  <FileText className="mr-2 h-4 w-4" />
                  Platform Guides
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/templates">
                  <PenTool className="mr-2 h-4 w-4" />
                  Templates
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/learning/resources">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Downloads
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/learning/workshops">
                  <Calendar className="mr-2 h-4 w-4" />
                  Live Workshops
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Discovery</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/niche-quiz">
                  <Target className="mr-2 h-4 w-4" />
                  Niche Finder Quiz
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/niches">
                  <Library className="mr-2 h-4 w-4" />
                  Niche Database
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/getting-started">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Getting Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResourcesMegaMenu({ trigger }: MegaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[700px] p-4" align="start">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <DropdownMenuLabel className="mb-3">Content</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/blog">
                  <FileText className="mr-2 h-4 w-4" />
                  All Articles
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/pillar/youtube">
                  <Video className="mr-2 h-4 w-4" />
                  YouTube Strategies
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/pillar/tiktok">
                  <Video className="mr-2 h-4 w-4" />
                  TikTok Growth
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/pillar/instagram">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Instagram Reels
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Tools & Templates</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/templates">
                  <PenTool className="mr-2 h-4 w-4" />
                  Template Library
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/all">
                  <Wrench className="mr-2 h-4 w-4" />
                  Tool Comparison
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/calculator">
                  <Calculator className="mr-2 h-4 w-4" />
                  Profitability Calculator
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/niches">
                  <Target className="mr-2 h-4 w-4" />
                  Niche Database
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Community</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/dashboard/community">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Forums
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/community/members">
                  <Users className="mr-2 h-4 w-4" />
                  Member Directory
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/community/events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/news">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  LiveWire News
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ToolsMegaMenu({ trigger }: MegaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[600px] p-4" align="start">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <DropdownMenuLabel className="mb-3">Calculators</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/calculator">
                  <Calculator className="mr-2 h-4 w-4" />
                  Profitability Calculator
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/niche-quiz">
                  <Target className="mr-2 h-4 w-4" />
                  Niche Finder Quiz
                </Link>
              </Button>
            </div>
            <DropdownMenuLabel className="mb-3 mt-4">SEO Tools</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/seo-audit">
                  <Search className="mr-2 h-4 w-4" />
                  SEO Audit Tool
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/keyword-research">
                  <Search className="mr-2 h-4 w-4" />
                  Keyword Research
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/backlink-checker">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Backlink Checker
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="mb-3">Analysis</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/all">
                  <Wrench className="mr-2 h-4 w-4" />
                  Tool Comparison
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/tools/performance">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Performance Monitor
                </Link>
              </Button>
            </div>
            <DropdownMenuLabel className="mb-3 mt-4">Resources</DropdownMenuLabel>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/templates">
                  <PenTool className="mr-2 h-4 w-4" />
                  Templates
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/resources/niches">
                  <Library className="mr-2 h-4 w-4" />
                  Niche Database
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
