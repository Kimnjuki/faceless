/**
 * Quiz Logic and Result Calculation
 * Determines creator archetype based on user answers
 */

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface CreatorArchetype {
  type: string;
  description: string;
  recommendedNiches: string[];
  learningPath: string;
  toolsNeeded: string[];
  strengths: string[];
  nextSteps: string[];
}

const ARCHETYPES: CreatorArchetype[] = [
  {
    type: "The Strategic Educator",
    description: "You excel at breaking down complex topics into digestible, valuable content. Your strength lies in teaching and helping others understand difficult concepts.",
    recommendedNiches: ["Personal Finance", "Business", "Technology", "Education"],
    learningPath: "educational_content_mastery",
    toolsNeeded: ["CapCut", "ChatGPT Plus", "Canva Pro", "Notion"],
    strengths: [
      "Clear communication",
      "Systematic thinking",
      "Content organization",
      "Educational value creation"
    ],
    nextSteps: [
      "Start with educational YouTube channel",
      "Create comprehensive how-to guides",
      "Build email newsletter for deeper content",
      "Focus on SEO-optimized content"
    ]
  },
  {
    type: "The Visual Storyteller",
    description: "You create compelling narratives through visuals. Your content captivates audiences with storytelling, mystery, and visual appeal.",
    recommendedNiches: ["True Crime", "Mystery", "Documentaries", "History", "Entertainment"],
    learningPath: "visual_storytelling_excellence",
    toolsNeeded: ["InVideo", "ElevenLabs", "Midjourney", "DaVinci Resolve"],
    strengths: [
      "Storytelling ability",
      "Visual creativity",
      "Emotional engagement",
      "Narrative structure"
    ],
    nextSteps: [
      "Focus on YouTube long-form content",
      "Master video editing and effects",
      "Build suspenseful narratives",
      "Create series-based content"
    ]
  },
  {
    type: "The Productivity Automator",
    description: "You thrive on systems and scalability. Your goal is to build efficient, automated content systems that generate consistent results.",
    recommendedNiches: ["Productivity", "AI Tools", "Entrepreneurship", "Business Systems"],
    learningPath: "automation_and_scale",
    toolsNeeded: ["Clippie AI", "Make.com", "ManyChat", "Zapier"],
    strengths: [
      "System thinking",
      "Automation expertise",
      "Efficiency focus",
      "Scalability mindset"
    ],
    nextSteps: [
      "Build automated content workflows",
      "Create tool comparison content",
      "Focus on affiliate marketing",
      "Scale to multiple channels"
    ]
  },
  {
    type: "The Community Builder",
    description: "You create content that sparks conversation and builds engaged communities. Your strength is in fostering connections and discussions.",
    recommendedNiches: ["Wellness", "Lifestyle", "Motivation", "Personal Development"],
    learningPath: "engagement_driven_growth",
    toolsNeeded: ["Beehive", "ConvertKit", "Circle", "Discord"],
    strengths: [
      "Community engagement",
      "Conversation starting",
      "Empathy and connection",
      "Long-term relationship building"
    ],
    nextSteps: [
      "Build engaged social media presence",
      "Create community-driven content",
      "Launch newsletter or membership",
      "Focus on engagement over views"
    ]
  }
];

/**
 * Calculate quiz results based on answers
 */
export function calculateQuizResults(answers: QuizAnswers): CreatorArchetype {
  const scores: { [key: string]: number } = {
    "The Strategic Educator": 0,
    "The Visual Storyteller": 0,
    "The Productivity Automator": 0,
    "The Community Builder": 0
  };

  // Q1: Primary Goal
  const q1 = answers.q1 as string;
  if (q1 === "Educate and help others") scores["The Strategic Educator"] += 3;
  if (q1 === "Build a scalable business") scores["The Productivity Automator"] += 3;
  if (q1 === "Express creativity anonymously") scores["The Visual Storyteller"] += 3;
  if (q1 === "Generate passive income") scores["The Community Builder"] += 2;

  // Q2: Time Commitment
  const q2 = answers.q2 as string;
  if (q2 === "20+ hours (full-time)") scores["The Productivity Automator"] += 2;
  if (q2 === "11-20 hours (serious commitment)") scores["The Strategic Educator"] += 2;
  if (q2 === "4-10 hours (part-time)") scores["The Visual Storyteller"] += 2;
  if (q2 === "1-3 hours (side hustle)") scores["The Community Builder"] += 2;

  // Q3: Skill Level
  const q3 = answers.q3 as string;
  if (q3 === "Advanced marketer") scores["The Productivity Automator"] += 2;
  if (q3 === "Experienced content creator") scores["The Visual Storyteller"] += 2;
  if (q3 === "Some social media experience") scores["The Strategic Educator"] += 2;
  if (q3 === "Complete beginner") scores["The Community Builder"] += 2;

  // Q4: Content Format (multi-choice)
  const q4 = answers.q4 as string[];
  if (q4?.includes("Long-form YouTube videos")) scores["The Visual Storyteller"] += 2;
  if (q4?.includes("Written content (blogs, newsletters)")) scores["The Strategic Educator"] += 2;
  if (q4?.includes("Short-form video (TikTok, Reels)")) scores["The Community Builder"] += 2;
  if (q4?.includes("Visual design (infographics, carousels)")) scores["The Productivity Automator"] += 1;

  // Q5: Preferred Niche
  const q5 = answers.q5 as string;
  if (q5 === "Education & How-To" || q5 === "Finance & Business") scores["The Strategic Educator"] += 3;
  if (q5 === "Entertainment & Storytelling") scores["The Visual Storyteller"] += 3;
  if (q5 === "Technology & AI") scores["The Productivity Automator"] += 3;
  if (q5 === "Health & Wellness") scores["The Community Builder"] += 3;

  // Q6: Biggest Challenge
  const q6 = answers.q6 as string;
  if (q6 === "Understanding algorithms") scores["The Productivity Automator"] += 2;
  if (q6 === "Video editing skills") scores["The Visual Storyteller"] += 2;
  if (q6 === "Coming up with content ideas") scores["The Strategic Educator"] += 2;
  if (q6 === "Consistency and motivation") scores["The Community Builder"] += 2;

  // Q7: Budget
  const q7 = answers.q7 as string;
  if (q7 === "$300+/month (scale)") scores["The Productivity Automator"] += 2;
  if (q7 === "$151-300/month (growth)") scores["The Visual Storyteller"] += 2;
  if (q7 === "$51-150/month (starter)") scores["The Strategic Educator"] += 2;
  if (q7 === "$0-50/month (bootstrap)") scores["The Community Builder"] += 2;

  // Q8: Learning Preference (multi-choice)
  const q8 = answers.q8 as string[];
  if (q8?.includes("Step-by-step guides")) scores["The Strategic Educator"] += 2;
  if (q8?.includes("Case studies")) scores["The Visual Storyteller"] += 2;
  if (q8?.includes("Interactive exercises")) scores["The Productivity Automator"] += 2;
  if (q8?.includes("Community discussions")) scores["The Community Builder"] += 2;

  // Find highest scoring archetype
  const maxScore = Math.max(...Object.values(scores));
  const winner = Object.keys(scores).find(key => scores[key] === maxScore) || ARCHETYPES[0].type;
  
  return ARCHETYPES.find(a => a.type === winner) || ARCHETYPES[0];
}

/**
 * Generate personalized 90-day roadmap
 */
export function generatePersonalizedRoadmap(archetype: CreatorArchetype) {
  return {
    timeline: "90 days",
    milestones: [
      {
        day: "1-14",
        title: "Foundation & Setup",
        tasks: [
          "Complete niche validation",
          "Set up accounts on chosen platforms",
          "Learn tool basics",
          "Create brand identity"
        ]
      },
      {
        day: "15-30",
        title: "First Content Creation",
        tasks: [
          "Create 10 test videos/posts",
          "Analyze performance metrics",
          "Refine content strategy",
          "Build initial audience"
        ]
      },
      {
        day: "31-60",
        title: "Growth & Optimization",
        tasks: [
          "Scale to 3-5 pieces/week",
          "Build engaged audience",
          "Test monetization methods",
          "Optimize based on data"
        ]
      },
      {
        day: "61-90",
        title: "Monetization & Automation",
        tasks: [
          "Launch revenue streams",
          "Automate workflows",
          "Plan scaling strategy",
          "Build sustainable system"
        ]
      }
    ]
  };
}
