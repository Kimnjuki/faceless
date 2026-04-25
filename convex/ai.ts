import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const generateScript = action({
  args: {
    niche: v.optional(v.string()),
    platform: v.string(),
    topic: v.string(),
    videoLength: v.number(),
    tone: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Fallback demo mode when API key not configured
      return {
        hook: `Today I'm going to show you exactly ${args.topic} — without showing my face.`,
        intro: `Welcome back. In this video we're covering everything you need to know about ${args.topic}. By the end you'll know exactly how to implement this step by step.`,
        mainSections: [
          `First, let's break down what ${args.topic} actually means and why it matters.`,
          `Next, we'll walk through the 3 critical steps you need to follow.`,
          `Here are the most common mistakes people make and how to avoid them.`,
          `Now let's look at real examples that actually work.`
        ],
        cta: `If this was helpful, hit the like button and subscribe for more faceless content strategies. Drop a comment below with your biggest takeaway.`,
        titles: [
          `${args.topic} — Complete Guide`,
          `How To ${args.topic} In 2026`,
          `${args.topic} For Beginners (Step By Step)`,
          `The Truth About ${args.topic} Nobody Tells You`,
          `${args.topic} In 5 Simple Steps`
        ],
        thumbnail: `High contrast background with bold text headline. Use numbers and curiosity gap. Avoid faces.`,
        description: `Complete guide to ${args.topic}. Learn the exact strategy, tools and system for faceless content success. Timestamps in comments.\n\n#facelesscontent #ai #youtubeautomation`,
        tags: ["faceless content", "youtube automation", args.topic.toLowerCase(), "ai content", args.platform]
      };
    }

    // Real Anthropic API implementation
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4096,
          system: `You are an expert faceless content script writer. Generate viral, platform-optimized scripts that work perfectly without showing the creator's face. Always follow this structure:
1. 3 second hook that creates curiosity
2. Introduction that establishes value
3. 3-5 main content sections
4. Clear call to action
5. 5 optimized title variations
6. Thumbnail concept
7. Video description
8. Relevant tags

Return ONLY valid JSON with no extra text.`,
          messages: [
            {
              role: "user",
              content: `Generate a complete faceless content script:
Topic: ${args.topic}
Niche: ${args.niche || "General"}
Platform: ${args.platform}
Video Length: ${args.videoLength} minutes
Tone: ${args.tone}

Return JSON with exactly these fields: hook, intro, mainSections (array), cta, titles (array of 5), thumbnail, description, tags (array).`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      try {
        return JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
        return {
          hook: data.content[0].text.split('\n')[0],
          intro: data.content[0].text,
          mainSections: ["Watch the full video for complete details"],
          cta: "Like and subscribe for more content",
          titles: [args.topic, `${args.topic} Guide`, `How to ${args.topic}`],
          thumbnail: "Bold text on high contrast background",
          description: `${args.topic} guide for faceless creators.`,
          tags: [args.topic, args.platform]
        };
      }

    } catch (error) {
      console.error("Anthropic API error:", error);
      // Fallback response
      return {
        hook: `Let me show you exactly ${args.topic} — no face required.`,
        intro: `In this comprehensive guide, we're covering everything about ${args.topic}.`,
        mainSections: [
          `Understanding the fundamentals of ${args.topic}`,
          `Step by step implementation process`,
          `Common mistakes and how to avoid them`,
          `Pro tips for maximum results`
        ],
        cta: `If you found this valuable, please like and subscribe. Leave a comment with your thoughts.`,
        titles: [
          `${args.topic} - Complete Guide`,
          `How To ${args.topic}`,
          `${args.topic} For Beginners`,
          `${args.topic} Secrets`,
          `${args.topic} In 2026`
        ],
        thumbnail: `Bold text title with clean background. No faces.`,
        description: `Learn everything you need to know about ${args.topic}. Optimized for faceless content creators.`,
        tags: [args.topic, "faceless", "content creation", args.platform]
      };
    }
  },
});