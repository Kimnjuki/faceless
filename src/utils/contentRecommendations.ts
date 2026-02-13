/**
 * Personalized Content Recommendation System
 * Uses user behavior data to suggest relevant content
 * Integrates with GA4 data for intelligent recommendations
 */

import { trackEvent, trackContentView, setUserProperty } from './analytics';

// User behavior tracking for recommendations
interface UserBehavior {
  viewedContent: Array<{
    id: string;
    type: string;
    category: string;
    timestamp: number;
    duration?: number;
  }>;
  searchQueries: Array<{
    query: string;
    timestamp: number;
    resultsCount: number;
  }>;
  interactions: Array<{
    type: 'like' | 'share' | 'bookmark' | 'comment';
    contentId: string;
    timestamp: number;
  }>;
  learningProgress: Array<{
    pathId: string;
    progress: number;
    lastAccessed: number;
  }>;
}

// Content item interface
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
}

// Recommendation types
export type RecommendationType = 
  | 'trending' 
  | 'similar_to_viewed' 
  | 'based_on_search' 
  | 'learning_path_progression' 
  | 'personalized'
  | 'popular_in_category';

// Get user behavior from localStorage
function getUserBehavior(): UserBehavior {
  try {
    const stored = localStorage.getItem('user_behavior');
    return stored ? JSON.parse(stored) : {
      viewedContent: [],
      searchQueries: [],
      interactions: [],
      learningProgress: []
    };
  } catch {
    return {
      viewedContent: [],
      searchQueries: [],
      interactions: [],
      learningProgress: []
    };
  }
}

// Save user behavior to localStorage
function saveUserBehavior(behavior: UserBehavior) {
  try {
    localStorage.setItem('user_behavior', JSON.stringify(behavior));
  } catch (error) {
    console.warn('Failed to save user behavior:', error);
  }
}

// Track content view for recommendations
export function trackContentViewForRecommendations(
  contentId: string,
  contentType: string,
  category: string,
  duration?: number
) {
  const behavior = getUserBehavior();
  
  // Add to viewed content
  behavior.viewedContent.push({
    id: contentId,
    type: contentType,
    category,
    timestamp: Date.now(),
    duration
  });
  
  // Keep only last 50 viewed items
  behavior.viewedContent = behavior.viewedContent.slice(-50);
  
  saveUserBehavior(behavior);
  
  // Track in analytics
  trackContentView(contentType, contentId);
  
  // Update user preferences
  updateUserPreferences(category, contentType);
}

// Track search for recommendations
export function trackSearchForRecommendations(
  query: string,
  category: string,
  resultsCount: number
) {
  const behavior = getUserBehavior();
  
  behavior.searchQueries.push({
    query,
    timestamp: Date.now(),
    resultsCount
  });
  
  // Keep only last 20 searches
  behavior.searchQueries = behavior.searchQueries.slice(-20);
  
  saveUserBehavior(behavior);
  
  // Track in analytics
  trackEvent('search', 'content', category, resultsCount, {
    search_query: query,
    recommendation_context: 'user_behavior'
  });
}

// Track content interaction for recommendations
export function trackContentInteraction(
  contentId: string,
  interactionType: 'like' | 'share' | 'bookmark' | 'comment'
) {
  const behavior = getUserBehavior();
  
  behavior.interactions.push({
    type: interactionType,
    contentId,
    timestamp: Date.now()
  });
  
  // Keep only last 30 interactions
  behavior.interactions = behavior.interactions.slice(-30);
  
  saveUserBehavior(behavior);
  
  // Track in analytics
  trackEvent(`content_${interactionType}`, 'engagement', contentId);
}

// Track learning path progress for recommendations
export function trackLearningPathProgress(
  pathId: string,
  progress: number
) {
  const behavior = getUserBehavior();
  
  const existingIndex = behavior.learningProgress.findIndex(p => p.pathId === pathId);
  if (existingIndex >= 0) {
    behavior.learningProgress[existingIndex] = {
      pathId,
      progress,
      lastAccessed: Date.now()
    };
  } else {
    behavior.learningProgress.push({
      pathId,
      progress,
      lastAccessed: Date.now()
    });
  }
  
  saveUserBehavior(behavior);
  
  // Track in analytics
  trackEvent('learning_progress', 'engagement', pathId, Math.floor(progress));
}

// Update user preferences based on behavior
function updateUserPreferences(category: string, contentType: string) {
  const behavior = getUserBehavior();
  
  // Calculate category preferences
  const categoryCounts = behavior.viewedContent.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get top categories
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);
  
  // Set user property
  if (topCategories.length > 0) {
    setUserProperty('preferred_categories', topCategories.join(','));
  }
  
  // Calculate content type preferences
  const typeCounts = behavior.viewedContent.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTypes = Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([type]) => type);
  
  if (topTypes.length > 0) {
    setUserProperty('preferred_content_types', topTypes.join(','));
  }
}

// Get personalized recommendations
export function getPersonalizedRecommendations(
  allContent: ContentItem[],
  type: RecommendationType = 'personalized',
  limit: number = 5
): ContentItem[] {
  const behavior = getUserBehavior();
  
  switch (type) {
    case 'trending':
      return getTrendingRecommendations(allContent, behavior, limit);
    case 'similar_to_viewed':
      return getSimilarContentRecommendations(allContent, behavior, limit);
    case 'based_on_search':
      return getSearchBasedRecommendations(allContent, behavior, limit);
    case 'learning_path_progression':
      return getLearningPathRecommendations(allContent, behavior, limit);
    case 'popular_in_category':
      return getPopularInCategoryRecommendations(allContent, behavior, limit);
    case 'personalized':
    default:
      return getPersonalizedContentRecommendations(allContent, behavior, limit);
  }
}

// Get trending content recommendations
function getTrendingRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  // Filter out already viewed content
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Sort by popularity and featured status
  return allContent
    .filter(item => !viewedIds.has(item.id))
    .sort((a, b) => {
      // Prioritize featured content
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by popularity
      return b.popularity - a.popularity;
    })
    .slice(0, limit);
}

// Get similar content recommendations
function getSimilarContentRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Get categories and tags from recently viewed content
  const recentContent = behavior.viewedContent.slice(-10);
  const preferredCategories = [...new Set(recentContent.map(item => item.category))];
  const preferredTags = [...new Set(recentContent.flatMap(item => {
    // This would need to be implemented based on your content structure
    return [];
  }))];
  
  return allContent
    .filter(item => !viewedIds.has(item.id))
    .filter(item => preferredCategories.includes(item.category))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// Get search-based recommendations
function getSearchBasedRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Extract keywords from recent searches
  const recentSearches = behavior.searchQueries.slice(-5);
  const searchKeywords = recentSearches.flatMap(search => 
    search.query.toLowerCase().split(' ').filter(word => word.length > 2)
  );
  
  return allContent
    .filter(item => !viewedIds.has(item.id))
    .filter(item => {
      const searchText = `${item.title} ${item.category} ${item.tags.join(' ')}`.toLowerCase();
      return searchKeywords.some(keyword => searchText.includes(keyword));
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// Get learning path progression recommendations
function getLearningPathRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Get completed or in-progress learning paths
  const inProgressPaths = behavior.learningProgress.filter(p => p.progress > 0);
  
  if (inProgressPaths.length === 0) {
    // If no learning paths in progress, recommend beginner content
    return allContent
      .filter(item => !viewedIds.has(item.id))
      .filter(item => item.type === 'learning_path' && item.difficulty === 'beginner')
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }
  
  // Recommend content based on learning path progress
  const completedPaths = inProgressPaths.filter(p => p.progress >= 80);
  
  if (completedPaths.length > 0) {
    // Recommend advanced content
    return allContent
      .filter(item => !viewedIds.has(item.id))
      .filter(item => item.difficulty === 'advanced')
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  } else {
    // Recommend intermediate content
    return allContent
      .filter(item => !viewedIds.has(item.id))
      .filter(item => item.difficulty === 'intermediate')
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }
}

// Get popular in category recommendations
function getPopularInCategoryRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Get most viewed category
  const categoryCounts = behavior.viewedContent.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];
  
  if (!topCategory) {
    return getTrendingRecommendations(allContent, behavior, limit);
  }
  
  return allContent
    .filter(item => !viewedIds.has(item.id))
    .filter(item => item.category === topCategory)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// Get personalized content recommendations (combination of all types)
function getPersonalizedContentRecommendations(
  allContent: ContentItem[],
  behavior: UserBehavior,
  limit: number
): ContentItem[] {
  const recommendations: ContentItem[] = [];
  const viewedIds = new Set(behavior.viewedContent.map(item => item.id));
  
  // Mix different recommendation types
  const trending = getTrendingRecommendations(allContent, behavior, Math.ceil(limit * 0.3));
  const similar = getSimilarContentRecommendations(allContent, behavior, Math.ceil(limit * 0.3));
  const searchBased = getSearchBasedRecommendations(allContent, behavior, Math.ceil(limit * 0.2));
  const learningBased = getLearningPathRecommendations(allContent, behavior, Math.ceil(limit * 0.2));
  
  // Combine and deduplicate
  const allRecommendations = [...trending, ...similar, ...searchBased, ...learningBased];
  const seen = new Set<string>();
  
  for (const item of allRecommendations) {
    if (!seen.has(item.id) && recommendations.length < limit) {
      seen.add(item.id);
      recommendations.push(item);
    }
  }
  
  return recommendations;
}

// Clear user behavior data
export function clearUserBehavior() {
  localStorage.removeItem('user_behavior');
  setUserProperty('preferred_categories', '');
  setUserProperty('preferred_content_types', '');
}

// Export user behavior for analytics
export function exportUserBehavior() {
  return getUserBehavior();
}
