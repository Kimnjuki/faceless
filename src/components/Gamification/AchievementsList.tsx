import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { ACHIEVEMENTS, Achievement } from "@/utils/gamification";

interface AchievementsListProps {
  unlockedAchievements: Achievement[];
}

export default function AchievementsList({ unlockedAchievements }: AchievementsListProps) {
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
        <CardDescription>
          {unlockedAchievements.length} of {ACHIEVEMENTS.length} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const unlockedAchievement = unlockedAchievements.find(a => a.id === achievement.id);

            return (
              <div
                key={achievement.id}
                className={`p-4 border rounded-lg ${
                  isUnlocked ? "bg-primary/5 border-primary/20" : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className="font-semibold">{achievement.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                      {unlockedAchievement?.unlockedAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Unlocked {new Date(unlockedAchievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {isUnlocked ? (
                    <Badge variant="default">Unlocked</Badge>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Reward: {achievement.xpReward} XP
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
