// Gamification System - XP, Achievements, Streaks

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

export const XP_REWARDS = {
  LESSON_COMPLETE_BEGINNER: 10,
  LESSON_COMPLETE_INTERMEDIATE: 25,
  LESSON_COMPLETE_ADVANCED: 50,
  PROJECT_COMPLETE_BEGINNER: 100,
  PROJECT_COMPLETE_INTERMEDIATE: 250,
  PROJECT_COMPLETE_ADVANCED: 500,
  STREAK_BONUS: 5,
  COMMUNITY_CONTRIBUTION: 25,
  MODULE_COMPLETE: 50,
  PATH_COMPLETE: 500,
} as const;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_module",
    name: "First Steps",
    description: "Complete your first module",
    icon: "🎯",
    xpReward: 50,
  },
  {
    id: "niche_validated",
    name: "Niche Validated",
    description: "Complete niche validation",
    icon: "✅",
    xpReward: 100,
  },
  {
    id: "first_100_followers",
    name: "First 100 Followers",
    description: "Reach 100 followers on any platform",
    icon: "👥",
    xpReward: 250,
  },
  {
    id: "first_dollar",
    name: "First $1 Earned",
    description: "Make your first dollar online",
    icon: "💰",
    xpReward: 500,
  },
  {
    id: "tool_master",
    name: "Tool Master",
    description: "Master 5+ content creation tools",
    icon: "🛠️",
    xpReward: 300,
  },
  {
    id: "content_marathon",
    name: "Content Marathon",
    description: "Create 30 videos",
    icon: "🎬",
    xpReward: 1000,
  },
  {
    id: "revenue_diversifier",
    name: "Revenue Diversifier",
    description: "Activate 3+ revenue streams",
    icon: "💎",
    xpReward: 750,
  },
];

export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  500,    // Level 3
  1000,   // Level 4
  2500,   // Level 5
  5000,   // Level 6
  10000,  // Level 7
  25000,  // Level 8
  50000,  // Level 9
  100000, // Level 10
];

export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return 0; // Max level
  }
  return LEVEL_THRESHOLDS[currentLevel] - xp;
}

export function checkAchievements(
  userProgress: UserProgress,
  action: string,
  metadata?: Record<string, any>
): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  // Check each achievement
  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (userProgress.achievements.some(a => a.id === achievement.id)) {
      continue;
    }

    let unlocked = false;

    switch (achievement.id) {
      case "first_module":
        unlocked = action === "module_complete" && metadata?.moduleCount === 1;
        break;
      case "niche_validated":
        unlocked = action === "niche_validated";
        break;
      case "first_100_followers":
        unlocked = action === "follower_milestone" && metadata?.followers >= 100;
        break;
      case "first_dollar":
        unlocked = action === "revenue_milestone" && metadata?.revenue >= 1;
        break;
      case "tool_master":
        unlocked = action === "tool_mastered" && metadata?.toolCount >= 5;
        break;
      case "content_marathon":
        unlocked = action === "content_created" && metadata?.contentCount >= 30;
        break;
      case "revenue_diversifier":
        unlocked = action === "revenue_stream_added" && metadata?.streamCount >= 3;
        break;
    }

    if (unlocked) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date(),
      });
    }
  }

  return newAchievements;
}

export function updateStreak(
  lastActivityDate: Date | null,
  currentStreak: number
): { streak: number; isNewDay: boolean } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!lastActivityDate) {
    return { streak: 1, isNewDay: true };
  }

  const lastDate = new Date(lastActivityDate);
  const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  
  const daysDiff = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no streak update
    return { streak: currentStreak, isNewDay: false };
  } else if (daysDiff === 1) {
    // Consecutive day
    return { streak: currentStreak + 1, isNewDay: true };
  } else {
    // Streak broken
    return { streak: 1, isNewDay: true };
  }
}

export function calculateStreakBonus(streak: number): number {
  // 5 XP per day of streak
  return streak * XP_REWARDS.STREAK_BONUS;
}
