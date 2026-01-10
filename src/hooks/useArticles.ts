import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Article, ContentCategory } from '@/lib/supabase';
import { toast } from 'sonner';

interface ArticleFilters {
  category?: string;
  searchQuery?: string;
  status?: 'published' | 'draft' | 'archived';
  limit?: number;
}

export function useArticles(filters: ArticleFilters = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoriesFetched = useRef(false);

  // Fetch categories only once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (categoriesFetched.current) return;
      
      try {
        const { data, error: catError } = await supabase
          .from('content_categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (catError) throw catError;
        setCategories((data as ContentCategory[]) || []);
        categoriesFetched.current = true;
      } catch (err) {
        console.warn('Could not fetch categories:', err);
        categoriesFetched.current = true; // Mark as fetched even on error to prevent retries
      }
    };

    fetchCategories();
  }, []); // Only run once on mount

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build articles query
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:content_categories(id, name, slug, description),
          author:profiles(user_id, full_name, avatar_url),
          tags:article_tags(tag)
        `)
        .eq('status', filters.status || 'published')
        .order('published_at', { ascending: false });

      // Apply category filter - fetch category ID directly from database
      if (filters.category && filters.category !== 'all') {
        // Always fetch category ID directly to avoid dependency on categories state
        const { data: catData } = await supabase
          .from('content_categories')
          .select('id')
          .or(`slug.eq.${filters.category},name.eq.${filters.category}`)
          .maybeSingle();
        
        if (catData) {
          query = query.eq('category_id', catData.id);
        }
      }

      // Apply limit
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let articlesData = (data as any[]) || [];

      // Transform tags array and validate article data
      articlesData = articlesData.map((article: any) => {
        // Ensure slug exists and is valid
        if (!article.slug || typeof article.slug !== 'string') {
          console.warn('Article missing or invalid slug:', article);
        }
        
        return {
          ...article,
          slug: article.slug ? String(article.slug).trim() : '',
          title: article.title ? String(article.title) : 'Untitled',
          tags: (article.tags || []).map((t: any) => {
            if (typeof t === 'string') return t;
            if (t && typeof t === 'object') return t.tag || t.name || String(t);
            return String(t || '');
          }).filter((tag: string) => tag && tag.trim() !== ''),
        };
      }).filter((article: any) => {
        // Filter out articles without valid slugs
        return article.slug && article.slug.trim() !== '';
      });

      // Client-side search filtering
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        articlesData = articlesData.filter(
          (article) => {
            const contentStr = typeof article.content === 'string' 
              ? article.content 
              : JSON.stringify(article.content || {});
            return (
              article.title.toLowerCase().includes(searchLower) ||
              article.excerpt?.toLowerCase().includes(searchLower) ||
              contentStr.toLowerCase().includes(searchLower) ||
              article.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
            );
          }
        );
      }

      setArticles(articlesData as Article[]);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'Failed to fetch articles');
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load articles');
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.searchQuery, filters.status, filters.limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const incrementViewCount = useCallback(async (articleId: string) => {
    try {
      // Try RPC first
      const { error: rpcError } = await supabase.rpc('increment_article_views', {
        article_id: articleId,
      });

      if (rpcError) {
        // Fallback: manual update
        const { data: current } = await supabase
          .from('articles')
          .select('view_count')
          .eq('id', articleId)
          .single();

        if (current) {
          await supabase
            .from('articles')
            .update({ view_count: (current.view_count || 0) + 1 })
            .eq('id', articleId);
        }
      }
    } catch (err) {
      console.warn('Could not increment view count:', err);
    }
  }, []);

  return { articles, categories, loading, error, refetch: fetchArticles, incrementViewCount };
}

