-- ============================================================================
-- LEARNING PATH MODULES TABLE (New Structure)
-- ============================================================================
-- This table stores the hierarchical structure of learning path modules
-- organized by levels (Foundation, Systemization, Scaling)

-- ============================================================================
-- 1. DDL: CREATE LEARNING PATH MODULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_path_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Level Information
    level_order INTEGER NOT NULL,        -- 1, 2, or 3
    level_title VARCHAR(100) NOT NULL,   -- Foundation, Systemization, Scaling
    -- Module Information
    module_order INTEGER NOT NULL,       -- Sequential number within the path (1 to 12)
    module_title VARCHAR(255) NOT NULL,
    core_goal TEXT,
    key_concepts TEXT[]                  -- Array storing specific deliverables/concepts
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS learning_path_modules_level_order_idx ON learning_path_modules(level_order);
CREATE INDEX IF NOT EXISTS learning_path_modules_module_order_idx ON learning_path_modules(module_order);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE learning_path_modules ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read learning path modules
DROP POLICY IF EXISTS "Anyone can view learning path modules" ON learning_path_modules;
CREATE POLICY "Anyone can view learning path modules" ON learning_path_modules 
  FOR SELECT 
  USING (true);

-- ============================================================================
-- 4. DML: INSERT ALL 12 LEARNING MODULES
-- ============================================================================
-- Populates the table with the 'Path to Faceless Content Mastery' content.

DO $$
BEGIN

    -- ------------------------------------------------------------------------
    -- LEVEL 1: FOUNDATION & NICHE VALIDATION (BEGINNER)
    -- ------------------------------------------------------------------------

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (1, 'Foundation & Niche Validation (Beginner)', 1, 'Niche & Market Research', 
     'Find a profitable niche with high demand, low saturation, and high Revenue Per Mille (RPM).', 
     ARRAY['Sweet Spot Analysis: Balance passion/knowledge with market demand/monetization potential.', 'RPM Targeting: Prioritize niches with high advertiser demand (Finance, Tech).'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (1, 'Foundation & Niche Validation (Beginner)', 2, 'Brand Identity & Voice', 
     'Develop a strong unique visual and verbal brand that stands out without a face.', 
     ARRAY['Visual Pillars: Define consistent color schemes, fonts, and animation/footage styles.', 'Verbal Brand: Define the consistent tone, pace, and personality of the voiceover.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (1, 'Foundation & Niche Validation (Beginner)', 3, 'Content Pillars & Strategy', 
     'Brainstorm and structure your first 50 video ideas around 3-5 core themes.', 
     ARRAY['Content Pillars: Organize topics (e.g., "Finance" -> "Budgeting", "Investing", "Credit").', '50-Idea Inventory: Deliverable of 50 structured, optimized titles/concepts.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (1, 'Foundation & Niche Validation (Beginner)', 4, 'Basic Tool & Channel Setup', 
     'Set up the channel, necessary accounts, and basic quality control tools.', 
     ARRAY['Channel Setup: Name, logo, banner, optimized profile picture.', 'Basic QC: Define minimum standards for audio/visual quality and pacing.'])
    ON CONFLICT DO NOTHING;

    -- ------------------------------------------------------------------------
    -- LEVEL 2: SYSTEMIZATION & PRODUCTION FLOW (INTERMEDIATE)
    -- ------------------------------------------------------------------------

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (2, 'Systemization & Production Flow (Intermediate)', 5, 'Scripting for Retention', 
     'Master the structure of a high-retention video script.', 
     ARRAY['The HOOK Formula: Crafting the first 15 seconds (Question, Shocking Fact, Clear Promise).', 'Script Formatting: Structuring the text for visual sync and pacing cues.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (2, 'Systemization & Production Flow (Intermediate)', 6, 'Voiceover & Audio Mastery', 
     'Achieve professional-grade, consistent audio quality using AI or outsourcing.', 
     ARRAY['AI Voices: Select TTS or Voice Cloning tools (Fliki, ElevenLabs) and set the correct tone.', 'Audio QC: Implementing noise reduction and consistency checks using tools like Descript Studio Sound.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (2, 'Systemization & Production Flow (Intermediate)', 7, 'Visual Creation & Editing', 
     'Build the first videos and sync visuals perfectly to the audio track.', 
     ARRAY['Visual Flow: Syncing B-roll/stock footage/animations to the script.', 'Tools: Master an AI tool (Pictory, Runway) and a dedicated editor (CapCut, DaVinci Resolve).'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (2, 'Systemization & Production Flow (Intermediate)', 8, 'YouTube SEO & CTR Strategy', 
     'Optimize videos for discoverability and clicks to beat the competition.', 
     ARRAY['Title/Thumbnail Strategy: Promise a clear benefit and test designs fast.', 'Keyword Research: Use tools to find low-competition, high-search-volume terms.', 'Tagging and Description Optimization.'])
    ON CONFLICT DO NOTHING;

    -- ------------------------------------------------------------------------
    -- LEVEL 3: SCALING & MONETIZATION (EXPERT)
    -- ------------------------------------------------------------------------

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (3, 'Scaling & Monetization (Expert)', 9, 'Diversified Monetization', 
     'Move beyond AdSense and create multiple revenue streams for financial stability.', 
     ARRAY['Monetization Stack: Implement Affiliate Marketing, Digital Products (eBooks/Templates), and Brand Sponsorships.', 'Revenue Diversification Plan (3-5 streams).'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (3, 'Scaling & Monetization (Expert)', 10, 'Team Building & Outsourcing', 
     'Hire and manage Virtual Assistants (VAs) or specialized freelancers to handle the production pipeline.', 
     ARRAY['Workflow Automation: Delegate scripting, voiceovers, and editing (Module 5-7).', 'Standard Operating Procedures (SOPs): Create clear guides for quality control and output.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (3, 'Scaling & Monetization (Expert)', 11, 'Algorithm & Growth Tactics', 
     'Leverage advanced analytics to trigger the algorithm and maximize Watch Time and Click-Through Rate (CTR).', 
     ARRAY['Data Analysis: Double down on topics that yield high retention/CTR.', 'Audience Funnels: Using YouTube Shorts for rapid subscriber growth and lead generation.'])
    ON CONFLICT DO NOTHING;

    INSERT INTO learning_path_modules (level_order, level_title, module_order, module_title, core_goal, key_concepts) VALUES
    (3, 'Scaling & Monetization (Expert)', 12, 'Multi-Channel Scaling', 
     'Clone the proven system to launch and run multiple profitable channels in different niches.', 
     ARRAY['System Replication: Apply the validated Niche/Pillar/Automation flow to new markets.', 'Legal & Compliance: Understand YouTube''s copyright system and monetization rules for scaling.'])
    ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Successfully created the learning_path_modules table and inserted all 12 modules for Faceless Content Mastery' as status;

-- Verify the data
SELECT 
  level_order,
  level_title,
  COUNT(*) as module_count
FROM learning_path_modules
GROUP BY level_order, level_title
ORDER BY level_order;










