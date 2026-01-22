// Topic Cluster Strategy for SEO
// Based on Ahrefs/Semrush best practices

export interface TopicCluster {
  pillar: string;
  pillarUrl: string;
  clusterTopics: ClusterTopic[];
  targetKeywords: string[];
}

export interface ClusterTopic {
  title: string;
  slug: string;
  keywords: string[];
  internalLinks: string[]; // URLs to link to within the cluster
}

// Privacy in the Age of AI - Topic Cluster
export const privacyAICluster: TopicCluster = {
  pillar: "Privacy in the Age of AI",
  pillarUrl: "/blog/privacy-in-the-age-of-ai",
  targetKeywords: [
    "privacy AI",
    "AI privacy tools",
    "anonymous content creation",
    "faceless content privacy",
    "AI content detection bypass"
  ],
  clusterTopics: [
    {
      title: "How AI Detects Human-Written Content: A Complete Guide",
      slug: "/blog/how-ai-detects-human-content",
      keywords: ["AI content detection", "GPT detection", "AI writing detection"],
      internalLinks: ["/blog/privacy-in-the-age-of-ai", "/blog/anonymize-ai-content"]
    },
    {
      title: "5 Ways to Anonymize Your AI-Generated Content",
      slug: "/blog/anonymize-ai-content",
      keywords: ["anonymize AI content", "AI content privacy", "hide AI writing"],
      internalLinks: ["/blog/privacy-in-the-age-of-ai", "/blog/ai-content-tools"]
    },
    {
      title: "Best Tools for Creating Anonymous Content in 2025",
      slug: "/blog/ai-content-tools",
      keywords: ["anonymous content tools", "faceless content tools", "AI privacy tools"],
      internalLinks: ["/blog/privacy-in-the-age-of-ai", "/blog/anonymize-ai-content"]
    },
    {
      title: "Why Faceless Creators Need Privacy Protection",
      slug: "/blog/faceless-creators-privacy",
      keywords: ["faceless creator privacy", "anonymous content creator", "privacy protection"],
      internalLinks: ["/blog/privacy-in-the-age-of-ai", "/blog/anonymize-ai-content"]
    }
  ]
};

// Faceless Content Creation - Topic Cluster
export const facelessContentCluster: TopicCluster = {
  pillar: "Faceless Content Creation Guide",
  pillarUrl: "/blog/faceless-content-creation-guide",
  targetKeywords: [
    "faceless content creation",
    "how to create faceless content",
    "anonymous content strategy",
    "faceless YouTube channel",
    "faceless TikTok content"
  ],
  clusterTopics: [
    {
      title: "How to Start a Faceless YouTube Channel in 2025",
      slug: "/blog/start-faceless-youtube-channel",
      keywords: ["faceless YouTube", "anonymous YouTube channel", "faceless content YouTube"],
      internalLinks: ["/blog/faceless-content-creation-guide", "/blog/faceless-content-niches"]
    },
    {
      title: "Top 10 Faceless Content Niches for 2025",
      slug: "/blog/faceless-content-niches",
      keywords: ["faceless niches", "profitable faceless content", "best faceless niches"],
      internalLinks: ["/blog/faceless-content-creation-guide", "/blog/faceless-content-monetization"]
    },
    {
      title: "Complete Guide to Faceless Content Monetization",
      slug: "/blog/faceless-content-monetization",
      keywords: ["faceless monetization", "anonymous content revenue", "faceless business income"],
      internalLinks: ["/blog/faceless-content-creation-guide", "/blog/faceless-content-niches"]
    },
    {
      title: "AI Tools Every Faceless Creator Needs in 2025",
      slug: "/blog/ai-tools-faceless-creators",
      keywords: ["AI tools faceless", "faceless content AI", "automation tools"],
      internalLinks: ["/blog/faceless-content-creation-guide", "/blog/faceless-content-monetization"]
    }
  ]
};

// All Topic Clusters
export const allTopicClusters: TopicCluster[] = [
  privacyAICluster,
  facelessContentCluster
];

/**
 * Get internal links for a given article slug
 * Returns links to pillar page and related cluster topics
 */
export function getInternalLinksForArticle(slug: string): string[] {
  for (const cluster of allTopicClusters) {
    // Check if this is the pillar page
    if (cluster.pillarUrl === slug) {
      return cluster.clusterTopics.map(topic => topic.slug);
    }
    
    // Check if this is a cluster topic
    const topic = cluster.clusterTopics.find(t => t.slug === slug);
    if (topic) {
      return [cluster.pillarUrl, ...topic.internalLinks.filter(link => link !== slug)];
    }
  }
  
  return [];
}

/**
 * Get recommended articles for internal linking
 */
export function getRecommendedArticles(currentSlug: string, limit: number = 3): ClusterTopic[] {
  const recommendations: ClusterTopic[] = [];
  
  for (const cluster of allTopicClusters) {
    for (const topic of cluster.clusterTopics) {
      if (topic.slug !== currentSlug && !recommendations.find(r => r.slug === topic.slug)) {
        recommendations.push(topic);
        if (recommendations.length >= limit) break;
      }
    }
    if (recommendations.length >= limit) break;
  }
  
  return recommendations;
}



