import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Challenge } from "@/types";

interface ChallengeFilters {
  challengeType?: string;
  status?: string;
  difficulty?: string;
  searchQuery?: string;
}

export function useChallenges(_filters: ChallengeFilters = {}) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const raw = useQuery(
    api.challenges.list,
    hasConvex ? {} : "skip"
  );

  const challenges: Challenge[] = raw ?? [];
  const loading = raw === undefined;
  const error: string | null = null;

  const joinChallenge = async (_challengeId: string) => {
    // No challenges table yet
    return null;
  };

  const getLeaderboard = async (_challengeId: string) => {
    return [];
  };

  return { challenges, loading, error, refetch: () => {}, joinChallenge, getLeaderboard };
}
