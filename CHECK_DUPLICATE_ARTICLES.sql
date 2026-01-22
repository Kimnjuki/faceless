-- ============================================================================
-- DUPLICATE ARTICLES CHECKLIST & FIX SCRIPT
-- ============================================================================
-- This script identifies and fixes articles appearing in multiple topics/categories
-- Run each section separately to diagnose and fix issues

-- ============================================================================
-- STEP 1: Check for duplicate articles by title
-- ============================================================================
SELECT 
    title,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as article_ids,
    STRING_AGG(slug, ', ') as slugs,
    STRING_AGG(category_id::text, ', ') as category_ids
FROM articles
WHERE status = 'published'
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ============================================================================
-- STEP 2: Check for duplicate articles by slug
-- ============================================================================
SELECT 
    slug,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as article_ids,
    STRING_AGG(title, ' | ') as titles,
    STRING_AGG(category_id::text, ', ') as category_ids
FROM articles
WHERE slug IS NOT NULL AND slug != ''
GROUP BY slug
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ============================================================================
-- STEP 3: Check for articles with same content appearing in multiple categories
-- ============================================================================
-- This finds articles with identical content but different category_ids
SELECT 
    LEFT(content, 100) as content_preview,
    COUNT(DISTINCT category_id) as category_count,
    COUNT(*) as article_count,
    STRING_AGG(id::text, ', ') as article_ids,
    STRING_AGG(category_id::text, ', ') as category_ids,
    STRING_AGG(title, ' | ') as titles
FROM articles
WHERE status = 'published'
  AND content IS NOT NULL
  AND content != ''
GROUP BY LEFT(content, 100)
HAVING COUNT(DISTINCT category_id) > 1
ORDER BY category_count DESC, article_count DESC;

-- ============================================================================
-- STEP 4: Check for articles with similar content (first 500 chars)
-- ============================================================================
-- This finds articles with very similar content that might be duplicates
WITH content_hashes AS (
    SELECT 
        id,
        title,
        slug,
        category_id,
        LEFT(content, 500) as content_start,
        MD5(LEFT(content, 500)) as content_hash
    FROM articles
    WHERE status = 'published'
      AND content IS NOT NULL
      AND content != ''
)
SELECT 
    content_hash,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as article_ids,
    STRING_AGG(title, ' | ') as titles,
    STRING_AGG(category_id::text, ', ') as category_ids
FROM content_hashes
GROUP BY content_hash
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ============================================================================
-- STEP 5: List all articles with their categories (for manual review)
-- ============================================================================
SELECT 
    a.id,
    a.title,
    a.slug,
    a.category_id,
    c.name as category_name,
    c.slug as category_slug,
    a.status,
    a.published_at,
    a.created_at
FROM articles a
LEFT JOIN content_categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.title, a.category_id;

-- ============================================================================
-- STEP 6: Find the generic "faceless content business" article mentioned
-- ============================================================================
-- This finds articles with the specific intro text mentioned by the user
SELECT 
    id,
    title,
    slug,
    category_id,
    LEFT(content, 200) as content_preview
FROM articles
WHERE status = 'published'
  AND (
    content LIKE '%In the rapidly evolving landscape of digital content creation%'
    OR content LIKE '%faceless content strategies have emerged%'
    OR title LIKE '%Faceless Content Business%'
    OR title LIKE '%Build a Profitable Faceless%'
  )
ORDER BY created_at DESC;

-- ============================================================================
-- FIX OPTIONS (Run only after reviewing the results above)
-- ============================================================================

-- OPTION 1: Archive duplicate articles (keep the oldest one)
-- WARNING: Review the results from STEP 1-4 before running this
/*
WITH duplicates AS (
    SELECT 
        id,
        title,
        ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) as rn
    FROM articles
    WHERE status = 'published'
)
UPDATE articles
SET status = 'archived',
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);
*/

-- OPTION 2: Archive duplicates by slug (keep the oldest one)
/*
WITH duplicates AS (
    SELECT 
        id,
        slug,
        ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at ASC) as rn
    FROM articles
    WHERE slug IS NOT NULL AND slug != ''
)
UPDATE articles
SET status = 'archived',
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);
*/

-- OPTION 3: Archive articles with identical content (keep one per category)
/*
WITH duplicates AS (
    SELECT 
        id,
        category_id,
        MD5(LEFT(content, 500)) as content_hash,
        ROW_NUMBER() OVER (
            PARTITION BY MD5(LEFT(content, 500)), category_id 
            ORDER BY created_at ASC
        ) as rn
    FROM articles
    WHERE status = 'published'
      AND content IS NOT NULL
)
UPDATE articles
SET status = 'archived',
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);
*/

-- OPTION 4: Update category_id for the generic article to a single category
-- First, identify which category it should belong to
-- Then update all instances to that category
/*
-- Example: Set all "faceless content business" articles to "Content Strategies" category
UPDATE articles
SET category_id = (
    SELECT id FROM content_categories 
    WHERE slug = 'content-strategies' OR name = 'Content Strategies' 
    LIMIT 1
),
updated_at = NOW()
WHERE status = 'published'
  AND (
    content LIKE '%In the rapidly evolving landscape of digital content creation%'
    OR title LIKE '%Faceless Content Business%'
  )
  AND category_id IS NOT NULL;
*/

-- ============================================================================
-- PREVENTION: Add unique constraints to prevent future duplicates
-- ============================================================================

-- Add unique constraint on slug (if not already exists)
-- ALTER TABLE articles ADD CONSTRAINT articles_slug_unique UNIQUE (slug);

-- Add unique constraint on title + category_id (prevent same title in same category)
-- ALTER TABLE articles ADD CONSTRAINT articles_title_category_unique UNIQUE (title, category_id);

-- ============================================================================
-- VERIFICATION: Check results after fixes
-- ============================================================================
-- Run STEP 1-4 again to verify duplicates are resolved



