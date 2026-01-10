import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Tool } from '@/lib/supabase';
import { toast } from 'sonner';

interface ToolFilters {
  category?: string;
  searchQuery?: string;
  sortBy?: 'rating' | 'name' | 'created_at';
}

export function useTools(filters: ToolFilters = {}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First, fetch all categories to create a lookup map
      let categoriesMap: Record<string, any> = {};
      try {
        const { data: categoriesData } = await supabase
          .from('tool_categories')
          .select('*');
        
        if (categoriesData) {
          categoriesData.forEach((cat: any) => {
            categoriesMap[cat.id] = cat;
          });
        }
      } catch (catError) {
        console.warn('Could not fetch categories:', catError);
      }

      // Build the tools query
      let query = supabase
        .from('tools')
        .select('*');

      // Apply category filter by category name (if category filter is provided)
      if (filters.category && filters.category !== 'all') {
        // Find category ID from the categories map
        const categoryEntry = Object.values(categoriesMap).find(
          (cat: any) => cat.name === filters.category
        );
        
        if (categoryEntry) {
          query = query.eq('category_id', categoryEntry.id);
        }
      }

      // Apply sorting
      if (filters.sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (filters.sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('❌ Supabase query error:', queryError);
        throw queryError;
      }

      let rawData = (data as any[]) || [];
      
      // Debug logging
      if (rawData.length === 0) {
        console.warn('⚠️ No tools found in database.');
        console.warn('Make sure:');
        console.warn('1. Tools table exists and has data');
        console.warn('2. RLS policies allow public SELECT access');
        console.warn('3. Foreign key relationship to tool_categories is correct');
      } else {
        console.log(`✅ Fetched ${rawData.length} tools from Supabase`);
        if (rawData.length > 0) {
          console.log('Sample tool:', rawData[0]);
        }
      }

      // Fetch affiliate links separately and match by tool name/slug
      let affiliateLinksMap: Record<string, any> = {};
      
      try {
        const { data: affiliateData } = await supabase
          .from('affiliate_links')
          .select('*');
        
        if (affiliateData && rawData.length > 0) {
          // Match affiliate links to tools by slug pattern
          // Slugs like 'elevenlabs-voice-ai' should match tool name 'ElevenLabs'
          rawData.forEach((tool: any) => {
            const toolNameLower = tool.name.toLowerCase();
            const matchingLink = affiliateData.find((link: any) => {
              const slugLower = link.slug?.toLowerCase() || '';
              // Match if slug contains tool name or tool name matches slug pattern
              return slugLower.includes(toolNameLower) || 
                     toolNameLower.includes(slugLower.split('-')[0]) ||
                     link.tool_id === tool.id; // If tool_id field exists
            });
            if (matchingLink) {
              affiliateLinksMap[tool.id] = matchingLink;
            }
          });
        }
      } catch (affiliateError) {
        // Affiliate links might not be accessible - that's okay
        console.warn('Could not fetch affiliate links:', affiliateError);
      }

      // Transform data to match Tool interface
      let transformedData: Tool[] = rawData.map((tool: any) => {
        const affiliateLink = affiliateLinksMap[tool.id] || null;
        const category = tool.category_id ? categoriesMap[tool.category_id] : null;
        
        return {
          ...tool,
          category: category || null,
          affiliate_link: affiliateLink,
          affiliate_url: affiliateLink?.destination_url || null,
        };
      });

      // Client-side search filtering
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        transformedData = transformedData.filter(
          (tool) =>
            tool.name.toLowerCase().includes(searchLower) ||
            tool.description?.toLowerCase().includes(searchLower) ||
            tool.category?.name?.toLowerCase().includes(searchLower) ||
            tool.best_for?.toLowerCase().includes(searchLower)
        );
      }

      setTools(transformedData);
    } catch (err: any) {
      console.error('Error fetching tools:', err);
      const errorMessage = err.message || 'Failed to fetch tools';
      setError(errorMessage);
      
      // Show helpful error messages
      if (err.code === 'PGRST116') {
        // Table doesn't exist
        console.warn('Tools table not found. Make sure you\'ve run the database setup SQL.');
      } else if (err.code === '42501') {
        // Permission denied - RLS issue
        console.error('Permission denied. Check RLS policies for tools table.');
        toast.error('Access denied. Please check database permissions.');
      } else {
        toast.error(`Failed to load tools: ${errorMessage}`);
      }
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.searchQuery, filters.sortBy]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const trackClick = useCallback(async (toolId: string) => {
    try {
      // Track affiliate link click (if you have a clicks table)
      // This is optional - you can implement click tracking later
      console.log('Tool clicked:', toolId);
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  }, []);

  return { tools, loading, error, refetch: fetchTools, trackClick };
}

