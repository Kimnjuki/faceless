-- ============================================================================
-- FINAL SCRIPT: POPULATE LEARNING PATH & MODULES (Legacy Structure)
-- ============================================================================
-- This script creates a learning path with 12 modules using the standard
-- learning_paths and learning_modules table structure.
-- ============================================================================

DO $$

DECLARE
    v_path_id UUID;

BEGIN

    -- 1. INSERT THE MAIN LEARNING PATH
    -- Only inserting core columns: name, track_type, description, duration, difficulty, order.

    INSERT INTO public.learning_paths (
        name, 
        track_type, 
        description, 
        estimated_duration, 
        difficulty_level, 
        order_index
    ) VALUES (
        'Your Path to Faceless Content Mastery',
        'specialized',
        'The complete roadmap from zero to expert. Learn to identify profitable niches, automate production, and scale revenue without ever showing your face.',
        '12 Weeks',
        'intermediate',
        1
    ) 
    RETURNING id INTO v_path_id;

    -- ========================================================================
    -- MODULES INSERTION
    -- Note: Removed 'module_group', 'is_free', and 'learning_objectives' columns.
    -- ========================================================================

    -- Module 1: Niche & Market Research (Foundation)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Niche & Market Research', 'Find a profitable niche with high demand, low saturation, and high Revenue Per Mille (RPM).', 'video', 45, 1
    );

    -- Module 2: Brand Identity & Voice (Foundation)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Brand Identity & Voice', 'Develop a strong unique visual and verbal brand that stands out without a face.', 'article', 30, 2
    );

    -- Module 3: Content Pillars & Strategy (Foundation)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Content Pillars & Strategy', 'Brainstorm and structure your first 50 video ideas around 3-5 core themes.', 'interactive', 60, 3
    );

    -- Module 4: Basic Tool & Channel Setup (Foundation)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Basic Tool & Channel Setup', 'Set up the channel, necessary accounts, and basic quality control tools.', 'article', 20, 4
    );

    -- Module 5: Scripting for Retention (Systemization)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Scripting for Retention', 'Master the structure of a high-retention video script to keep viewers watching.', 'video', 50, 5
    );

    -- Module 6: Voiceover & Audio Mastery (Systemization)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Voiceover & Audio Mastery', 'Achieve professional-grade, consistent audio quality using AI tools.', 'video', 40, 6
    );

    -- Module 7: Visual Creation & Editing (Systemization)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Visual Creation & Editing', 'Build the first videos and sync visuals perfectly to the audio track.', 'video', 90, 7
    );

    -- Module 8: YouTube SEO & CTR Strategy (Systemization)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'YouTube SEO & CTR Strategy', 'Optimize videos for discoverability and clicks to beat the competition.', 'article', 45, 8
    );

    -- Module 9: Diversified Monetization (Scaling)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Diversified Monetization', 'Move beyond AdSense and create multiple revenue streams for stability.', 'video', 55, 9
    );

    -- Module 10: Team Building & Outsourcing (Scaling)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Team Building & Outsourcing', 'Hire and manage Virtual Assistants to handle the production pipeline.', 'article', 35, 10
    );

    -- Module 11: Algorithm & Growth Tactics (Scaling)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Algorithm & Growth Tactics', 'Leverage advanced analytics to trigger the algorithm.', 'video', 60, 11
    );

    -- Module 12: Multi-Channel Scaling (Scaling)
    INSERT INTO public.learning_modules (
        learning_path_id, title, description, content_type, duration_minutes, order_index
    ) VALUES (
        v_path_id, 'Multi-Channel Scaling', 'Clone the proven system to launch multiple profitable channels.', 'article', 30, 12
    );

END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✅ Success! Learning Path and all 12 Modules inserted into the base schema.' as status;

-- Verify the data
SELECT 
  lp.name as path_name,
  COUNT(lm.id) as module_count
FROM public.learning_paths lp
LEFT JOIN public.learning_modules lm ON lm.learning_path_id = lp.id
WHERE lp.name = 'Your Path to Faceless Content Mastery'
GROUP BY lp.id, lp.name;

-- Show all modules
SELECT 
  lm.order_index,
  lm.title,
  lm.content_type,
  lm.duration_minutes
FROM public.learning_modules lm
INNER JOIN public.learning_paths lp ON lp.id = lm.learning_path_id
WHERE lp.name = 'Your Path to Faceless Content Mastery'
ORDER BY lm.order_index;















