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

  // Normalize article from DB (supports common column name variants)
  const normalizeArticle = useCallback((row: any, fromJoin: boolean): any => {
    const tags = (() => {
      const t = row.tags;
      if (Array.isArray(t)) return t.map((x: any) => typeof x === 'string' ? x : (x?.tag ?? x?.name ?? String(x ?? ''))).filter(Boolean);
      if (typeof t === 'string') return t.split(',').map((s: string) => s.trim()).filter(Boolean);
      return [];
    })();
    return {
      ...row,
      slug: (row.slug && String(row.slug).trim()) || '',
      title: (row.title && String(row.title)) || 'Untitled',
      content: row.content ?? row.body ?? row.full_content ?? row.body_html ?? row.article_text ?? '',
      excerpt: row.excerpt ?? row.description ?? row.meta_description ?? '',
      featured_image: row.featured_image ?? row.image ?? row.image_url ?? undefined,
      published_at: row.published_at ?? row.created_at ?? row.updated_at,
      category: fromJoin ? row.category : (row.category ? { name: String(row.category) } : null),
      author: fromJoin ? row.author : (typeof row.author === 'string' ? { full_name: row.author } : (row.author || null)),
      tags,
    };
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build articles query with joins (articles + content_categories + profiles + article_tags)
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

      if (filters.category && filters.category !== 'all') {
        const { data: catData } = await supabase
          .from('content_categories')
          .select('id')
          .or(`slug.eq.${filters.category},name.eq.${filters.category}`)
          .maybeSingle();
        if (catData) query = query.eq('category_id', catData.id);
      }
      if (filters.limit) query = query.limit(filters.limit);

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let articlesData = ((data as any[]) || []).map((a) => normalizeArticle(a, true)).filter((a: any) => a.slug && a.slug.trim() !== '');

      // Client-side search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        articlesData = articlesData.filter(
          (a: any) =>
            (a.title || '').toLowerCase().includes(q) ||
            (a.excerpt || '').toLowerCase().includes(q) ||
            (typeof a.content === 'string' && a.content.toLowerCase().includes(q)) ||
            (a.tags || []).some((t: string) => t.toLowerCase().includes(q))
        );
      }

      setArticles(articlesData as Article[]);
    } catch (err: any) {
      console.warn('Articles query with joins failed, trying simple select:', err);
      try {
        // Fallback: simple select (no content_categories, profiles, article_tags)
        // Resolve category_id when content_categories exists (for category filter)
        let catId: string | undefined;
        if (filters.category && filters.category !== 'all') {
          try {
            const { data: catData } = await supabase
              .from('content_categories')
              .select('id')
              .or(`slug.eq.${filters.category},name.eq.${filters.category}`)
              .maybeSingle();
            if (catData) catId = catData.id;
          } catch (_) { /* content_categories may not exist */ }
        }

        let q = supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
        if (catId) q = q.eq('category_id', catId);
        if (filters.limit) q = q.limit(filters.limit);

        const { data, error: e2 } = await q;
        if (e2) throw e2;

        let articlesData = ((data as any[]) || []).map((a) => normalizeArticle(a, false)).filter((a: any) => a.slug && a.slug.trim() !== '');
        // Filter to published only when status column may not exist
        articlesData = articlesData.filter((a: any) => !(a.status === 'draft' || a.status === 'archived' || a.published === false));

        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          articlesData = articlesData.filter(
            (a: any) =>
              (a.title || '').toLowerCase().includes(q) ||
              (a.excerpt || '').toLowerCase().includes(q) ||
              (typeof a.content === 'string' && a.content.toLowerCase().includes(q)) ||
              (a.tags || []).some((t: string) => t.toLowerCase().includes(q))
          );
        }

        setArticles(articlesData as Article[]);
        setError(null);
      } catch (fallbackErr: any) {
        console.error('Error fetching articles:', fallbackErr);
        setError(fallbackErr.message || 'Failed to fetch articles');
        if (fallbackErr.code !== 'PGRST116') toast.error('Failed to load articles');
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.searchQuery, filters.status, filters.limit, normalizeArticle]);

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

