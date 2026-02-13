import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, BookOpen, Video, FileText, Wrench, Layout } from 'lucide-react';
import { 
  getPersonalizedRecommendations, 
  RecommendationType,
  trackContentViewForRecommendations,
  trackContentInteraction
} from '@/utils/contentRecommendations';
import { trackEvent } from '@/utils/analytics';

// Content item interface (matching the one in contentRecommendations.ts)
interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'learning_path' | 'tool' | 'template';
  category: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  featured: boolean;
  popularity: number;
  relatedContent?: string[];
  url?: string;
  description?: string;
}

interface PersonalizedRecommendationsProps {
  type?: RecommendationType;
  limit?: number;
  title?: string;
  showViewAll?: boolean;
  className?: string;
}

// Mock content data - in real app, this would come from your API
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Complete Guide to Faceless YouTube Automation',
    type: 'article',
    category: 'Content Creation',
    tags: ['youtube', 'automation', 'faceless'],
    difficulty: 'beginner',
    duration: 15,
    featured: true,
    popularity: 95,
    url: '/blog/youtube-automation-guide',
    description: 'Learn how to create automated faceless YouTube channels that generate passive income.'
  },
  {
    id: '2',
    title: 'AI Video Generation Masterclass',
    type: 'video',
    category: 'AI Tools',
    tags: ['ai', 'video', 'automation'],
    difficulty: 'intermediate',
    duration: 45,
    featured: true,
    popularity: 88,
    url: '/learning/ai-video-generation',
    description: 'Master AI-powered video creation tools for faceless content.'
  },
  {
    id: '3',
    title: 'Beginner Learning Path: Faceless Content Fundamentals',
    type: 'learning_path',
    category: 'Learning',
    tags: ['beginner', 'fundamentals', 'learning'],
    difficulty: 'beginner',
    duration: 120,
    featured: false,
    popularity: 92,
    url: '/learning-paths/beginner-fundamentals',
    description: 'Start your faceless content journey with this comprehensive beginner path.'
  },
  {
    id: '4',
    title: 'Profitability Calculator Tool',
    type: 'tool',
    category: 'Tools',
    tags: ['calculator', 'profitability', 'analytics'],
    difficulty: 'beginner',
    duration: 5,
    featured: true,
    popularity: 85,
    url: '/tools/profitability-calculator',
    description: 'Calculate potential earnings from your faceless content channels.'
  },
  {
    id: '5',
    title: 'Content Template Library',
    type: 'template',
    category: 'Resources',
    tags: ['templates', 'content', 'resources'],
    difficulty: 'beginner',
    duration: 10,
    featured: false,
    popularity: 78,
    url: '/resources/templates',
    description: 'Access proven templates for faceless content across multiple platforms.'
  },
  {
    id: '6',
    title: 'Advanced Monetization Strategies',
    type: 'article',
    category: 'Monetization',
    tags: ['monetization', 'advanced', 'income'],
    difficulty: 'advanced',
    duration: 20,
    featured: true,
    popularity: 90,
    url: '/blog/advanced-monetization',
    description: 'Discover advanced strategies to maximize revenue from faceless content.'
  }
];

export default function PersonalizedRecommendations({
  type = 'personalized',
  limit = 3,
  title,
  showViewAll = true,
  className = ''
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = () => {
      try {
        setLoading(true);
        const recommended = getPersonalizedRecommendations(mockContent, type, limit);
        setRecommendations(recommended);
        
        // Track recommendation display
        trackEvent('recommendations_displayed', 'recommendations', type, recommended.length, {
          recommendation_type: type,
          content_ids: recommended.map(item => item.id)
        });
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        // Fallback to trending content
        setRecommendations(mockContent.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [type, limit]);

  const handleContentClick = (content: ContentItem) => {
    // Track content view for recommendations
    trackContentViewForRecommendations(
      content.id,
      content.type,
      content.category,
      content.duration
    );

    // Track recommendation click
    trackEvent('recommendation_clicked', 'recommendations', content.type, content.popularity, {
      content_id: content.id,
      content_type: content.type,
      recommendation_type: type,
      content_category: content.category
    });
  };

  const handleInteraction = (content: ContentItem, interactionType: 'like' | 'share' | 'bookmark') => {
    trackContentInteraction(content.id, interactionType);
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'learning_path':
        return <BookOpen className="h-4 w-4" />;
      case 'tool':
        return <Wrench className="h-4 w-4" />;
      case 'template':
        return <Layout className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRecommendationTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'trending':
        return 'Trending Content';
      case 'similar_to_viewed':
        return 'Similar to What You\'ve Viewed';
      case 'based_on_search':
        return 'Based on Your Searches';
      case 'learning_path_progression':
        return 'Continue Your Learning Journey';
      case 'popular_in_category':
        return 'Popular in Your Interests';
      default:
        return 'Recommended for You';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {getRecommendationTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {getRecommendationTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((content) => (
            <div
              key={content.id}
              className="group cursor-pointer rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              onClick={() => handleContentClick(content)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getContentIcon(content.type)}
                  <Badge variant="outline" className="text-xs">
                    {content.type.replace('_', ' ')}
                  </Badge>
                  {content.featured && (
                    <Badge variant="default" className="text-xs">
                      Featured
                    </Badge>
                  )}
                  {content.difficulty && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs text-white ${getDifficultyColor(content.difficulty)}`}
                    >
                      {content.difficulty}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {content.duration && (
                    <span>{content.duration} min</span>
                  )}
                  <span>•</span>
                  <span>{content.popularity}% popular</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {content.title}
              </h3>
              
              {content.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {content.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {content.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInteraction(content, 'bookmark');
                    }}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showViewAll && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                trackEvent('view_all_recommendations', 'recommendations', type, recommendations.length);
              }}
            >
              View All Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
