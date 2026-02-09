/**
 * SEO Checklist Tracker Component
 * 
 * Tracks implementation progress of SEO audit recommendations
 * Displays progress and allows checking off completed items
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'completed' | 'in_progress' | 'pending';
  notes?: string;
}

interface ChecklistCategory {
  name: string;
  items: ChecklistItem[];
}

const initialChecklist: ChecklistCategory[] = [
  {
    name: 'Phase 1: Foundation (Week 1-2)',
    items: [
      { id: 'p1-1', category: 'Technical SEO', task: 'Deploy robots.txt file', priority: 'CRITICAL', status: 'completed' },
      { id: 'p1-2', category: 'Technical SEO', task: 'Generate dynamic XML sitemap', priority: 'CRITICAL', status: 'in_progress' },
      { id: 'p1-3', category: 'On-Page SEO', task: 'Add meta descriptions to all pages (100% coverage)', priority: 'CRITICAL', status: 'in_progress' },
      { id: 'p1-4', category: 'On-Page SEO', task: 'Implement Open Graph and Twitter Card tags', priority: 'HIGH', status: 'in_progress' },
      { id: 'p1-5', category: 'Technical SEO', task: 'Set up canonical tags on all pages', priority: 'HIGH', status: 'completed' },
      { id: 'p1-6', category: 'Analytics', task: 'Configure Google Analytics 4 with custom events', priority: 'HIGH', status: 'in_progress' },
      { id: 'p1-7', category: 'Analytics', task: 'Verify and configure Google Search Console', priority: 'HIGH', status: 'pending' },
    ],
  },
  {
    name: 'Phase 2: Enhancement (Week 3-6)',
    items: [
      { id: 'p2-1', category: 'Structured Data', task: 'Implement JSON-LD schema markup (Organization, WebSite, BlogPosting, FAQPage)', priority: 'HIGH', status: 'in_progress' },
      { id: 'p2-2', category: 'Content', task: 'Expand homepage content to 1000+ words', priority: 'HIGH', status: 'pending' },
      { id: 'p2-3', category: 'Performance', task: 'Optimize Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)', priority: 'HIGH', status: 'pending' },
      { id: 'p2-4', category: 'Internal Linking', task: 'Build comprehensive internal linking strategy (5+ links per page)', priority: 'MEDIUM', status: 'pending' },
      { id: 'p2-5', category: 'Navigation', task: 'Add breadcrumb navigation', priority: 'MEDIUM', status: 'pending' },
      { id: 'p2-6', category: 'Performance', task: 'Optimize images (WebP, lazy loading, alt text)', priority: 'HIGH', status: 'pending' },
    ],
  },
  {
    name: 'Phase 3: Content (Week 7-12)',
    items: [
      { id: 'p3-1', category: 'Content', task: 'Launch blog with 25+ articles', priority: 'HIGH', status: 'pending' },
      { id: 'p3-2', category: 'Content', task: 'Create 3 pillar pages', priority: 'HIGH', status: 'pending' },
      { id: 'p3-3', category: 'Link Building', task: 'Acquire 10+ quality backlinks (DR 40+)', priority: 'MEDIUM', status: 'pending' },
      { id: 'p3-4', category: 'Link Building', task: 'Guest posting (5+ articles)', priority: 'MEDIUM', status: 'pending' },
    ],
  },
  {
    name: 'Phase 4: Tools (Month 4-6)',
    items: [
      { id: 'p4-1', category: 'SEO Tools', task: 'Build keyword research tool', priority: 'CRITICAL', status: 'pending' },
      { id: 'p4-2', category: 'SEO Tools', task: 'Build rank tracker', priority: 'CRITICAL', status: 'pending' },
      { id: 'p4-3', category: 'SEO Tools', task: 'Build site auditor', priority: 'HIGH', status: 'pending' },
    ],
  },
];

export default function SEOChecklistTracker() {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('seo_checklist');
    return saved ? JSON.parse(saved) : initialChecklist;
  });

  useEffect(() => {
    // Save to localStorage whenever checklist changes
    localStorage.setItem('seo_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleItemStatus = (categoryIndex: number, itemIndex: number) => {
    const newChecklist = [...checklist];
    const item = newChecklist[categoryIndex].items[itemIndex];
    
    // Cycle through: pending -> in_progress -> completed -> pending
    if (item.status === 'pending') {
      item.status = 'in_progress';
    } else if (item.status === 'in_progress') {
      item.status = 'completed';
    } else {
      item.status = 'pending';
    }
    
    setChecklist(newChecklist);
  };

  const getTotalStats = () => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    checklist.forEach(category => {
      category.items.forEach(item => {
        total++;
        if (item.status === 'completed') completed++;
        else if (item.status === 'in_progress') inProgress++;
        else pending++;
      });
    });

    return { total, completed, inProgress, pending };
  };

  const getPriorityColor = (priority: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (priority) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const stats = getTotalStats();
  const completionPercentage = (stats.completed / stats.total) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Implementation Progress
          </CardTitle>
          <CardDescription>
            Track your progress implementing SEO audit recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-semibold">{completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist by Phase */}
      {checklist.map((category, categoryIndex) => {
        const categoryStats = {
          total: category.items.length,
          completed: category.items.filter(i => i.status === 'completed').length,
        };
        const categoryProgress = (categoryStats.completed / categoryStats.total) * 100;

        return (
          <Card key={categoryIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <Badge variant="outline">
                  {categoryStats.completed}/{categoryStats.total} completed
                </Badge>
              </div>
              <Progress value={categoryProgress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleItemStatus(categoryIndex, itemIndex)}
                  >
                    <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.task}</span>
                        <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


