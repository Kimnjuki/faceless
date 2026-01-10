import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LearningPath, UserLearningProgress } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LearningPathFilters {
  trackType?: string;
  difficulty?: string;
  featured?: boolean;
}

export function useLearningPaths(filters: LearningPathFilters = {}) {
  const { user } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaths = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First, try to fetch from learning_path_modules (new structure)
      let modulesData: any[] = [];
      try {
        const { data: modules, error: modulesError } = await supabase
          .from('learning_path_modules')
          .select('*')
          .order('module_order', { ascending: true });

        if (modulesError) {
          // Only log if it's not a "table doesn't exist" error
          if (modulesError.code !== 'PGRST116' && modulesError.code !== '42P01') {
            console.warn('Error fetching from learning_path_modules:', modulesError);
          }
        } else if (modules && modules.length > 0) {
          modulesData = modules;
          console.log(`✅ Fetched ${modulesData.length} modules from learning_path_modules table`);
          console.log('Sample module:', modulesData[0]);
        } else {
          console.log('ℹ️ learning_path_modules table exists but is empty');
        }
      } catch (modulesErr: any) {
        // Only log if it's not a "table doesn't exist" error
        if (modulesErr.code !== 'PGRST116' && modulesErr.code !== '42P01') {
          console.warn('Could not fetch from learning_path_modules:', modulesErr);
        }
      }

      // Also try to fetch from learning_paths table (legacy structure)
      let query = supabase
        .from('learning_paths')
        .select(`
          *,
          modules:learning_modules(
            id,
            title,
            description,
            content_type,
            content_url,
            duration_minutes,
            order_index,
            learning_path_id
          )
        `)
        .order('order_index', { ascending: true });

      if (filters.trackType && filters.trackType !== 'all') {
        query = query.eq('track_type', filters.trackType);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty_level', filters.difficulty);
      }
      if (filters.featured) {
        query = query.eq('featured', true);
      }

      const { data, error: queryError } = await query;

      let pathsData: any[] = [];

      // Priority 1: Use legacy structure (learning_paths + learning_modules) if it exists and has data
      if (!queryError && data && data.length > 0) {
        // Use legacy structure if available
        pathsData = (data as any[]) || [];
        
        // Sort modules by order_index and filter out null/undefined
        pathsData = pathsData.map((path: any) => {
          const modules = (path.modules || [])
            .filter((m: any) => m !== null && m !== undefined) // Filter out null modules
            .sort((a: any, b: any) => 
              (a.order_index || 0) - (b.order_index || 0)
            );
          
          return {
            ...path,
            modules,
          };
        });
        
        console.log(`✅ Fetched ${pathsData.length} learning path(s) from learning_paths table`);
        pathsData.forEach((path: any, idx: number) => {
          console.log(`   Path ${idx + 1}: "${path.name}" (ID: ${path.id})`);
          console.log(`   - Modules: ${path.modules?.length || 0}`);
          if (path.modules && path.modules.length > 0) {
            path.modules.forEach((m: any, mIdx: number) => {
              console.log(`     ${mIdx + 1}. ${m.title} (order: ${m.order_index}, type: ${m.content_type})`);
            });
          } else {
            console.warn(`   ⚠️ No modules found for path "${path.name}"`);
          }
        });
      } 
      // Priority 2: If no legacy data, use learning_path_modules (new structure)
      else if (modulesData.length > 0) {
        // Group modules by level
        const levels = Array.from(new Set(modulesData.map((m: any) => m.level_order))).sort();
        const modulesByLevel = levels.map((levelOrder: any) => {
          const levelModules = modulesData.filter((m: any) => m.level_order === levelOrder);
          const firstModule = levelModules[0];
          return {
            level_order: levelOrder,
            level_title: firstModule.level_title,
            modules: levelModules.map((m: any) => ({
              id: m.id,
              title: m.module_title,
              description: m.core_goal,
              content_type: 'article' as const,
              content_url: undefined, // Will be set based on module
              duration_minutes: undefined,
              order_index: m.module_order,
              key_concepts: m.key_concepts || [],
              level_order: m.level_order,
              level_title: m.level_title,
            })),
          };
        });

        // Create a virtual learning path for "Faceless Content Mastery"
        pathsData = [{
          id: 'faceless-content-mastery',
          name: 'Path to Faceless Content Mastery',
          track_type: 'beginner',
          description: 'A comprehensive 12-module learning path covering Foundation, Systemization, and Scaling for faceless content creation.',
          estimated_duration: '12 weeks',
          difficulty_level: 'beginner',
          order_index: 1,
          featured: true,
          icon_name: 'PlayCircle',
          modules: modulesData.map((m: any) => ({
            id: m.id,
            title: m.module_title,
            description: m.core_goal,
            content_type: 'article' as const,
            content_url: undefined,
            duration_minutes: undefined,
            order_index: m.module_order,
            key_concepts: m.key_concepts || [],
            level_order: m.level_order,
            level_title: m.level_title,
          })),
          levels: modulesByLevel, // Store grouped levels
        }];
      }

      if (queryError) {
        console.error('Supabase query error:', queryError);
        // Only throw if we don't have modules from learning_path_modules
        if (modulesData.length === 0) {
          if (queryError.code === 'PGRST116') {
            throw new Error('Learning paths table not found. Please run the LEARNING_PATHS_SCHEMA.sql script in Supabase.');
          } else if (queryError.code === '42501') {
            throw new Error('Permission denied. Please check RLS policies for learning_paths table.');
          } else if (queryError.code === '42P01') {
            throw new Error('Table does not exist. Please run the LEARNING_PATHS_SCHEMA.sql script in Supabase.');
          }
          throw queryError;
        }
      }
      
      // Log for debugging
      if (pathsData.length === 0 && modulesData.length === 0) {
        console.warn('⚠️ No learning paths found in database. Make sure:');
        console.warn('1. LEARNING_PATHS_SCHEMA.sql or learning_path_modules table script has been run in Supabase');
        console.warn('2. Learning paths or modules have been inserted');
        console.warn('3. RLS policies allow public SELECT access');
      } else if (pathsData.length > 0) {
        // Logging already done above for legacy structure
        if (modulesData.length > 0 && (!data || data.length === 0)) {
          console.log(`✅ Fetched ${pathsData.length} learning path(s) from Supabase`);
          if (pathsData[0].modules) {
            console.log(`   - Total modules: ${pathsData[0].modules.length}`);
            if (pathsData[0].levels) {
              console.log(`   - Organized into ${pathsData[0].levels.length} levels`);
            }
          }
        }
      }

      // Fetch user progress for all paths (works for both structures)
      if (user && pathsData.length > 0) {
        try {
          const { data: progressData } = await supabase
            .from('user_learning_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressData) {
            // Map progress to paths and modules
            pathsData = pathsData.map((path: any) => {
              const pathProgress = progressData.find((p: any) => p.learning_path_id === path.id);
              const modulesWithProgress = (path.modules || []).map((module: any) => {
                const moduleProgress = progressData.find((p: any) => p.module_id === module.id);
                return {
                  ...module,
                  progress: moduleProgress || null,
                };
              });

              return {
                ...path,
                modules: modulesWithProgress,
                progress: pathProgress || null,
              };
            });
          }
        } catch (progressError) {
          console.warn('Could not fetch user progress:', progressError);
        }
      }

      setPaths(pathsData as LearningPath[]);
      
      // Show success message if paths were found (only on manual refresh, not initial load)
      if (pathsData.length > 0 && !loading) {
        // Don't show toast on initial load, only on manual refresh
        // This will be handled by the component if needed
      }
    } catch (err: any) {
      console.error('Error fetching learning paths:', err);
      const errorMessage = err.message || 'Failed to fetch learning paths';
      setError(errorMessage);
      
      // Show toast for all errors except table not found (which is expected during setup)
      if (err.code !== 'PGRST116' && !errorMessage.includes('not found')) {
        toast.error(errorMessage);
      }
      setPaths([]);
    } finally {
      setLoading(false);
    }
  }, [filters.trackType, filters.difficulty, filters.featured, user]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const updateProgress = useCallback(async (
    moduleId: string,
    progress: Partial<UserLearningProgress>
  ) => {
    if (!user) {
      toast.error('Please sign in to track your progress');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          ...progress,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh paths to update progress
      fetchPaths();
      return data;
    } catch (err: any) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
      throw err;
    }
  }, [user, fetchPaths]);

  return { paths, loading, error, refetch: fetchPaths, updateProgress };
}

