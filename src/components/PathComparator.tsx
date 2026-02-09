import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle2, Clock, BookOpen, Users, Star, DollarSign } from "lucide-react";
import type { LearningPath } from "@/types";

interface PathComparatorProps {
  paths: LearningPath[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function PathComparator({ paths, selectedIds, onRemove, onClear }: PathComparatorProps) {
  const selectedPaths = paths.filter(p => p.id && selectedIds.includes(p.id));

  if (selectedPaths.length === 0) return null;

  const comparisonCriteria = [
    { label: "Duration", key: "estimated_duration", icon: Clock },
    { label: "Difficulty", key: "difficulty_level", icon: BookOpen },
    { label: "Modules", key: "modules", icon: BookOpen },
    { label: "Track Type", key: "track_type", icon: Users },
  ];

  const getModuleCount = (path: LearningPath) => path.modules?.length || 0;

  return (
    <Card className="mt-8 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Compare Learning Paths</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Side-by-side comparison of selected paths</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Criteria</th>
                {selectedPaths.map((path) => (
                  <th key={path.id || path._id || ''} className="text-left p-2 border-b min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{path.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => path.id && onRemove(path.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonCriteria.map((criterion) => {
                const CriterionIcon = criterion.icon;
                return (
                  <tr key={criterion.key} className="border-b">
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <CriterionIcon className="h-4 w-4 text-muted-foreground" />
                        {criterion.label}
                      </div>
                    </td>
                    {selectedPaths.map((path) => {
                      const pathId = path.id || path._id || '';
                      const value = path[criterion.key as keyof LearningPath];
                      const displayValue = typeof value === 'string' || typeof value === 'number' 
                        ? String(value) 
                        : criterion.key === 'modules' 
                          ? String(getModuleCount(path))
                          : "N/A";
                      
                      return (
                        <td key={pathId} className="p-3">
                          {criterion.key === "modules" ? (
                            <Badge variant="secondary">{getModuleCount(path)} modules</Badge>
                          ) : criterion.key === "difficulty_level" ? (
                            <Badge variant="outline" className="capitalize">
                              {displayValue}
                            </Badge>
                          ) : (
                            <span className="text-sm">
                              {displayValue}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td className="p-3 font-medium">Description</td>
                {selectedPaths.map((path) => (
                  <td key={path.id || path._id || ''} className="p-3 text-sm text-muted-foreground">
                    {path.description?.substring(0, 100)}...
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
