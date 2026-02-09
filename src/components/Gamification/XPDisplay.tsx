import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, Flame } from "lucide-react";
import { calculateLevel, getXPForNextLevel } from "@/utils/gamification";

interface XPDisplayProps {
  totalXP: number;
  currentStreak: number;
  level?: number;
}

export default function XPDisplay({ totalXP, currentStreak, level }: XPDisplayProps) {
  const userLevel = level || calculateLevel(totalXP);
  const xpForNextLevel = getXPForNextLevel(totalXP);
  const currentLevelXP = totalXP - (userLevel > 1 ? 100 * Math.pow(2, userLevel - 2) : 0);
  const nextLevelXP = xpForNextLevel + currentLevelXP;
  const progress = nextLevelXP > 0 ? (currentLevelXP / nextLevelXP) * 100 : 100;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Level Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">Level {userLevel}</span>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <Zap className="h-4 w-4 mr-1" />
              {totalXP.toLocaleString()} XP
            </Badge>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-muted-foreground">
                {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Streak */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                <span className="font-semibold">{currentStreak}</span> day streak
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
