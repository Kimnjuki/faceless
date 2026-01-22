-- ============================================================================
-- FIX GENERIC INTRO ARTICLES
-- ============================================================================
-- This script fixes articles that all start with the same generic intro text
-- Problem: All articles have "In the rapidly evolving landscape of digital content creation..."
-- Solution: Generate unique, topic-specific intros for each article

-- ============================================================================
-- STEP 1: Identify articles with generic intro
-- ============================================================================
SELECT 
    id,
    title,
    slug,
    category_id,
    LEFT(content::text, 200) as content_preview
FROM articles
WHERE status = 'published'
  AND content::text LIKE '%In the rapidly evolving landscape of digital content creation%'
ORDER BY title;

-- ============================================================================
-- STEP 2: Preview what the new intros will look like
-- ============================================================================
-- This shows how each article's intro will be updated
SELECT 
    id,
    title,
    slug,
    CASE 
        WHEN title LIKE '%Monetize%' OR title LIKE '%Revenue%' OR title LIKE '%Earn%' THEN
            'Monetizing a faceless content channel requires strategic thinking beyond traditional ad revenue. ' ||
            'This comprehensive guide explores proven methods to generate income from your anonymous content business, ' ||
            'including affiliate marketing, digital products, sponsorships, and community memberships.'
        
        WHEN title LIKE '%TikTok%' OR title LIKE '%Shorts%' OR title LIKE '%Short-form%' THEN
            'Short-form video platforms like TikTok and YouTube Shorts have revolutionized faceless content creation. ' ||
            'This guide reveals the strategies, tools, and tactics successful creators use to build viral anonymous channels ' ||
            'and generate substantial revenue from short-form content.'
        
        WHEN title LIKE '%YouTube%' OR title LIKE '%Channel%' THEN
            'Building a successful faceless YouTube channel is one of the most profitable online business models in 2026. ' ||
            'This comprehensive guide walks you through proven strategies, AI tools, and automation techniques used by ' ||
            'successful faceless creators earning six-figure incomes without ever showing their face.'
        
        WHEN title LIKE '%AI%' OR title LIKE '%Automation%' OR title LIKE '%Artificial Intelligence%' THEN
            'Artificial intelligence has transformed faceless content creation, making it easier than ever to produce ' ||
            'high-quality content at scale. This guide explores the latest AI tools, automation strategies, and techniques ' ||
            'that successful faceless creators use to build profitable anonymous content businesses.'
        
        WHEN title LIKE '%Privacy%' OR title LIKE '%Security%' OR title LIKE '%Anonymous%' THEN
            'Maintaining complete anonymity while building a profitable content business requires careful planning and the right tools. ' ||
            'This guide covers essential privacy strategies, security practices, and techniques for staying hidden while ' ||
            'creating successful faceless content channels.'
        
        WHEN title LIKE '%Strategy%' OR title LIKE '%Guide%' OR title LIKE '%Blueprint%' THEN
            'Building a profitable faceless content business requires a strategic approach and proven frameworks. ' ||
            'This comprehensive guide provides step-by-step strategies, real case studies, and actionable tactics used by ' ||
            'successful anonymous creators to build and scale their content empires.'
        
        WHEN title LIKE '%Niche%' OR title LIKE '%Philosophy%' OR title LIKE '%Stoic%' OR title LIKE '%Horror%' THEN
            'Choosing the right niche is crucial for faceless content success. This guide explores profitable niches, ' ||
            'audience demand, monetization potential, and proven strategies for building successful anonymous channels ' ||
            'in specific content categories.'
        
        WHEN title LIKE '%Legal%' OR title LIKE '%Copyright%' OR title LIKE '%Fair Use%' THEN
            'Understanding legal requirements is essential for faceless content creators. This guide covers copyright laws, ' ||
            'fair use guidelines, AI content regulations, and best practices for staying compliant while building your ' ||
            'anonymous content business.'
        
        WHEN title LIKE '%Tools%' OR title LIKE '%Review%' OR title LIKE '%Top 10%' THEN
            'The right tools can make or break your faceless content business. This comprehensive review covers the best AI tools, ' ||
            'software, and platforms that successful anonymous creators use to automate content creation, streamline workflows, ' ||
            'and maximize profitability.'
        
        WHEN title LIKE '%Growth%' OR title LIKE '%Followers%' OR title LIKE '%Challenge%' THEN
            'Growing a faceless content channel requires consistent strategy and proven growth tactics. This guide reveals the ' ||
            'exact methods successful creators use to rapidly grow their audience, increase engagement, and build a loyal ' ||
            'following without ever showing their face.'
        
        ELSE
            'Building a successful faceless content business requires proven strategies and the right approach. ' ||
            'This comprehensive guide provides actionable insights, real-world examples, and step-by-step tactics used by ' ||
            'successful anonymous creators to build profitable content channels.'
    END as new_intro_preview
FROM articles
WHERE status = 'published'
  AND content::text LIKE '%In the rapidly evolving landscape of digital content creation%'
ORDER BY title;

-- ============================================================================
-- STEP 3: Update articles with unique intros
-- ============================================================================
-- This updates the intro section in the JSON content for each article
UPDATE articles
SET 
    content = jsonb_set(
        content::jsonb,
        '{intro}',
        to_jsonb(
            CASE 
                WHEN title LIKE '%Monetize%' OR title LIKE '%Revenue%' OR title LIKE '%Earn%' THEN
                    'Monetizing a faceless content channel requires strategic thinking beyond traditional ad revenue. ' ||
                    'This comprehensive guide explores proven methods to generate income from your anonymous content business, ' ||
                    'including affiliate marketing, digital products, sponsorships, and community memberships.'
                
                WHEN title LIKE '%TikTok%' OR title LIKE '%Shorts%' OR title LIKE '%Short-form%' THEN
                    'Short-form video platforms like TikTok and YouTube Shorts have revolutionized faceless content creation. ' ||
                    'This guide reveals the strategies, tools, and tactics successful creators use to build viral anonymous channels ' ||
                    'and generate substantial revenue from short-form content.'
                
                WHEN title LIKE '%YouTube%' OR title LIKE '%Channel%' THEN
                    'Building a successful faceless YouTube channel is one of the most profitable online business models in 2026. ' ||
                    'This comprehensive guide walks you through proven strategies, AI tools, and automation techniques used by ' ||
                    'successful faceless creators earning six-figure incomes without ever showing their face.'
                
                WHEN title LIKE '%AI%' OR title LIKE '%Automation%' OR title LIKE '%Artificial Intelligence%' THEN
                    'Artificial intelligence has transformed faceless content creation, making it easier than ever to produce ' ||
                    'high-quality content at scale. This guide explores the latest AI tools, automation strategies, and techniques ' ||
                    'that successful faceless creators use to build profitable anonymous content businesses.'
                
                WHEN title LIKE '%Privacy%' OR title LIKE '%Security%' OR title LIKE '%Anonymous%' THEN
                    'Maintaining complete anonymity while building a profitable content business requires careful planning and the right tools. ' ||
                    'This guide covers essential privacy strategies, security practices, and techniques for staying hidden while ' ||
                    'creating successful faceless content channels.'
                
                WHEN title LIKE '%Strategy%' OR title LIKE '%Guide%' OR title LIKE '%Blueprint%' OR title LIKE '%Playbook%' THEN
                    'Building a profitable faceless content business requires a strategic approach and proven frameworks. ' ||
                    'This comprehensive guide provides step-by-step strategies, real case studies, and actionable tactics used by ' ||
                    'successful anonymous creators to build and scale their content empires.'
                
                WHEN title LIKE '%Niche%' OR title LIKE '%Philosophy%' OR title LIKE '%Stoic%' OR title LIKE '%Horror%' OR title LIKE '%Story%' THEN
                    'Choosing the right niche is crucial for faceless content success. This guide explores profitable niches, ' ||
                    'audience demand, monetization potential, and proven strategies for building successful anonymous channels ' ||
                    'in specific content categories.'
                
                WHEN title LIKE '%Legal%' OR title LIKE '%Copyright%' OR title LIKE '%Fair Use%' THEN
                    'Understanding legal requirements is essential for faceless content creators. This guide covers copyright laws, ' ||
                    'fair use guidelines, AI content regulations, and best practices for staying compliant while building your ' ||
                    'anonymous content business.'
                
                WHEN title LIKE '%Tools%' OR title LIKE '%Review%' OR title LIKE '%Top 10%' OR title LIKE '%Toolkit%' THEN
                    'The right tools can make or break your faceless content business. This comprehensive review covers the best AI tools, ' ||
                    'software, and platforms that successful anonymous creators use to automate content creation, streamline workflows, ' ||
                    'and maximize profitability.'
                
                WHEN title LIKE '%Growth%' OR title LIKE '%Followers%' OR title LIKE '%Challenge%' THEN
                    'Growing a faceless content channel requires consistent strategy and proven growth tactics. This guide reveals the ' ||
                    'exact methods successful creators use to rapidly grow their audience, increase engagement, and build a loyal ' ||
                    'following without ever showing their face.'
                
                WHEN title LIKE '%VTubing%' OR title LIKE '%VTuber%' OR title LIKE '%Motion Capture%' THEN
                    'VTubing and AI motion capture represent the cutting edge of faceless content creation. This guide explores how to ' ||
                    'build engaging virtual avatar channels using AI technology, motion capture systems, and innovative content strategies ' ||
                    'that captivate audiences without revealing your identity.'
                
                WHEN title LIKE '%Pinterest%' OR title LIKE '%Blog%' OR title LIKE '%Traffic%' THEN
                    'Driving traffic to your faceless content business requires strategic marketing across multiple platforms. ' ||
                    'This guide reveals proven methods for generating organic traffic, building email lists, and converting visitors ' ||
                    'into engaged followers and customers.'
                
                WHEN title LIKE '%Ethical%' OR title LIKE '%Disclosure%' THEN
                    'Ethical content creation is essential for long-term success in the faceless content space. This guide covers ' ||
                    'best practices for AI disclosure, transparency, and building trust with your audience while maintaining anonymity.'
                
                WHEN title LIKE '%Psychology%' OR title LIKE '%Brand%' OR title LIKE '%Trust%' THEN
                    'Understanding audience psychology is key to building successful faceless brands. This guide explores why viewers ' ||
                    'trust anonymous creators, how to build brand authority without showing your face, and psychological principles ' ||
                    'that drive engagement and conversions.'
                
                WHEN title LIKE '%Newsletter%' OR title LIKE '%Email%' OR title LIKE '%Traffic%' THEN
                    'Converting faceless content traffic into a sustainable business requires strategic email marketing. This guide ' ||
                    'covers proven methods for building email lists, creating valuable newsletters, and monetizing your audience ' ||
                    'through direct communication channels.'
                
                WHEN title LIKE '%Luxury%' OR title LIKE '%High-End%' OR title LIKE '%Aesthetic%' THEN
                    'High-end faceless channels command premium CPM rates and attract luxury brand sponsorships. This guide reveals ' ||
                    'how to create sophisticated, luxury-focused content that appeals to affluent audiences and generates significantly ' ||
                    'higher revenue than standard faceless channels.'
                
                WHEN title LIKE '%Documentary%' OR title LIKE '%Edit%' OR title LIKE '%MagnatesMedia%' THEN
                    'Professional documentary-style editing elevates faceless content to premium quality. This guide covers advanced ' ||
                    'editing techniques, AI tools, and production workflows used by top-tier faceless creators to create cinematic ' ||
                    'content that stands out from the competition.'
                
                WHEN title LIKE '%Tech Tutorial%' OR title LIKE '%Screen Recording%' THEN
                    'Tech tutorial channels offer exceptional monetization potential through affiliate commissions. This guide explores ' ||
                    'how to create high-value tutorial content, optimize for affiliate sales, and build a profitable tech-focused ' ||
                    'faceless channel.'
                
                WHEN title LIKE '%News%' OR title LIKE '%Update%' OR title LIKE '%Daily%' THEN
                    'Automated news and update channels provide consistent revenue with minimal ongoing effort. This guide covers ' ||
                    'workflow automation, content curation strategies, and systems for building profitable daily-update faceless channels.'
                
                WHEN title LIKE '%Travel%' OR title LIKE '%POV%' OR title LIKE '%Drone%' THEN
                    'Travel and exploration content works exceptionally well for faceless creators. This guide reveals how to create ' ||
                    'engaging travel vlogs, POV content, and drone footage that captivates global audiences without ever showing your face.'
                
                WHEN title LIKE '%Reddit%' OR title LIKE '%Story%' OR title LIKE '%Automation%' THEN
                    'Automating Reddit story content for YouTube Shorts and TikTok is a proven viral strategy. This guide covers ' ||
                    'content sourcing, automation tools, and production workflows for building high-volume story-based faceless channels.'
                
                WHEN title LIKE '%ASMR%' OR title LIKE '%Silent%' OR title LIKE '%Vlog%' THEN
                    'Silent vlogs and ASMR content represent a unique and profitable faceless content niche. This guide explores how ' ||
                    'to create relaxing, visually appealing content that builds global audiences through pure aesthetic and sound design.'
                
                WHEN title LIKE '%Policy%' OR title LIKE '%Monetization%' OR title LIKE '%YouTube%' THEN
                    'Understanding platform monetization policies is crucial for faceless creators. This guide covers current policies, ' ||
                    'compliance requirements, and strategies for maintaining monetization eligibility across major platforms.'
                
                WHEN title LIKE '%Influencer%' OR title LIKE '%Instagram%' THEN
                    'Creating AI-generated influencers for Instagram opens new possibilities for faceless content. This guide reveals ' ||
                    'how to build realistic virtual influencers, automate content creation, and monetize Instagram without showing your face.'
                
                WHEN title LIKE '%Case Study%' OR title LIKE '%$15K%' OR title LIKE '%Success%' THEN
                    'Real case studies provide invaluable insights into successful faceless content strategies. This guide breaks down ' ||
                    'proven business models, revenue streams, and tactics used by creators earning substantial incomes from anonymous content.'
                
                WHEN title LIKE '%Quiz%' OR title LIKE '%Generator%' THEN
                    'Interactive tools and quizzes engage audiences and drive traffic to your faceless content business. This guide covers ' ||
                    'how to create valuable interactive content, optimize for conversions, and use tools to build your audience.'
                
                WHEN title LIKE '%Future%' OR title LIKE '%Prediction%' OR title LIKE '%2027%' THEN
                    'Understanding future trends helps faceless creators stay ahead of the curve. This guide explores emerging technologies, ' ||
                    'platform changes, and predicted shifts in the faceless content landscape that will shape the industry in coming years.'
                
                ELSE
                    'Building a successful faceless content business requires proven strategies and the right approach. ' ||
                    'This comprehensive guide provides actionable insights, real-world examples, and step-by-step tactics used by ' ||
                    'successful anonymous creators to build profitable content channels.'
            END
        ),
        true
    ),
    updated_at = NOW()
WHERE status = 'published'
  AND content::text LIKE '%In the rapidly evolving landscape of digital content creation%';

-- ============================================================================
-- STEP 4: Verify the fix
-- ============================================================================
-- Check that articles no longer have the generic intro
SELECT 
    id,
    title,
    slug,
    LEFT(content::jsonb->>'intro', 150) as new_intro_preview
FROM articles
WHERE status = 'published'
  AND content::jsonb->>'intro' IS NOT NULL
ORDER BY title
LIMIT 10;

-- Count how many still have the generic intro (should be 0)
SELECT COUNT(*) as remaining_generic_intros
FROM articles
WHERE status = 'published'
  AND content::text LIKE '%In the rapidly evolving landscape of digital content creation%';



