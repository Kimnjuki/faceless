import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Template } from '@/lib/supabase';
import { toast } from 'sonner';

interface TemplateFilters {
  platform?: string;
  niche?: string;
  type?: string;
  searchQuery?: string;
}

export function useTemplates(filters: TemplateFilters = {}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('download_count', { ascending: false });

      // Apply filters
      if (filters.platform && filters.platform !== 'all') {
        query = query.eq('platform', filters.platform);
      }
      if (filters.niche && filters.niche !== 'all') {
        query = query.eq('niche', filters.niche);
      }
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let filteredData = (data as Template[]) || [];

      // Client-side search filtering
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (template) =>
            template.title.toLowerCase().includes(searchLower) ||
            template.description?.toLowerCase().includes(searchLower) ||
            template.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      setTemplates(filteredData);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError(err.message || 'Failed to fetch templates');
      // Don't show toast for missing table - it's expected during initial setup
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load templates');
      }
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [filters.platform, filters.niche, filters.type, filters.searchQuery]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const incrementDownload = useCallback(async (templateId: string) => {
    try {
      const { error: updateError } = await supabase.rpc('increment_template_download', {
        template_id: templateId
      });

      if (updateError) {
        // Fallback: manual update if RPC doesn't exist
        const template = templates.find((t) => t.id === templateId);
        if (template) {
          const { error: updateErr } = await supabase
            .from('templates')
            .update({ download_count: template.download_count + 1 })
            .eq('id', templateId);

          if (updateErr) throw updateErr;
        }
      }

      // Update local state
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId ? { ...t, download_count: t.download_count + 1 } : t
        )
      );
    } catch (err: any) {
      console.error('Error incrementing download:', err);
    }
  }, [templates]);

  return { templates, loading, error, refetch: fetchTemplates, incrementDownload };
}

