// Free Content Creation Images from Unsplash
// All images are free for commercial use, no attribution required
// This file is deprecated - use @/config/images instead

import { IMAGES } from '@/config/images';
import { getLearningPathImages as getConfigLearningPathImages } from '@/config/images';

// Re-export functions for backward compatibility
export const CONTENT_CREATION_IMAGES = IMAGES.learningPaths;

export const getRandomImage = (category: string) => {
  const categoryMap: Record<string, string> = {
    workspace: 'learningPaths',
    contentCreator: 'learningPaths', 
    technology: 'learningPaths',
    faceless: 'learningPaths',
    hero: 'hero',
    aiTools: 'aiTools',
    privacy: 'privacy',
    contentCreation: 'contentCreation',
    monetization: 'monetization',
    learning: 'learning',
    tools: 'tools',
    community: 'community',
    backgrounds: 'backgrounds'
  };
  
  const mappedCategory = categoryMap[category] || 'workspace';
  return getConfigLearningPathImages(4)[0] || IMAGES.fallbacks.default;
};

export const getImage = (category: string, key: string) => {
  // Map old category names to new ones
  const categoryMap: Record<string, keyof typeof IMAGES> = {
    'workspace': 'learningPaths',
    'contentCreator': 'learningPaths', 
    'technology': 'learningPaths',
    'faceless': 'learningPaths',
    'hero': 'hero',
    'aiTools': 'aiTools',
    'privacy': 'privacy',
    'contentCreation': 'contentCreation',
    'monetization': 'monetization',
    'learning': 'learning',
    'tools': 'tools',
    'community': 'community',
    'backgrounds': 'backgrounds',
    'fallbacks': 'fallbacks'
  };
  
  const mappedCategory = categoryMap[category] || 'fallbacks';
  return (IMAGES[mappedCategory] as any)?.[key] || IMAGES.fallbacks.default;
};

// Use the centralized function
export const getLearningPathImages = getConfigLearningPathImages;
