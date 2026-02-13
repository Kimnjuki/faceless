// Free Content Creation Images from Unsplash
// All images are free for commercial use, no attribution required
// This file is deprecated - use @/config/images instead

import { IMAGES, getLearningPathImages as getConfigLearningPathImages } from '@/config/images';

// Re-export functions for backward compatibility
export const CONTENT_CREATION_IMAGES = IMAGES.learningPaths;

export const getRandomImage = (category: string) => {
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
  const categoryImages = IMAGES[mappedCategory];
  if (!categoryImages) return IMAGES.fallbacks.default;
  
  const keys = Object.keys(categoryImages);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return (categoryImages as any)[randomKey];
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
