-- ============================================================================
-- LEARNING PATHS VERIFICATION SCRIPT
-- Run this to verify your learning paths and modules are set up correctly
-- ============================================================================

-- 1. Check if learning_paths table exists and has data
SELECT 
  'Learning Paths Table' as check_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS'
    ELSE '❌ FAIL - No learning paths found'
  END as status
FROM learning_paths;

-- 2. Check if learning_modules table exists and has data
SELECT 
  'Learning Modules Table' as check_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) >= 12 THEN '✅ PASS'
    WHEN COUNT(*) > 0 THEN '⚠️ WARNING - Expected 12 modules'
    ELSE '❌ FAIL - No modules found'
  END as status
FROM learning_modules;

-- 3. Verify all 12 modules exist
SELECT 
  'Module Count Check' as check_name,
  COUNT(*) as module_count,
  CASE 
    WHEN COUNT(*) = 12 THEN '✅ PASS - All 12 modules found'
    ELSE CONCAT('❌ FAIL - Expected 12, found ', COUNT(*))
  END as status
FROM learning_modules;

-- 4. Check module order_index (should be 1-12)
SELECT 
  'Module Order Check' as check_name,
  COUNT(DISTINCT order_index) as unique_orders,
  CASE 
    WHEN COUNT(DISTINCT order_index) = 12 THEN '✅ PASS - All orders unique'
    ELSE CONCAT('⚠️ WARNING - Found ', COUNT(DISTINCT order_index), ' unique orders')
  END as status
FROM learning_modules;

-- 5. Verify modules are linked to learning paths
SELECT 
  'Module-Path Linkage' as check_name,
  COUNT(*) as linked_modules,
  COUNT(DISTINCT learning_path_id) as linked_paths,
  CASE 
    WHEN COUNT(*) = COUNT(*) AND COUNT(DISTINCT learning_path_id) > 0 THEN '✅ PASS'
    ELSE '❌ FAIL - Some modules not linked'
  END as status
FROM learning_modules
WHERE learning_path_id IS NOT NULL;

-- 6. Show all learning paths with their module counts
SELECT 
  lp.id,
  lp.name,
  lp.track_type,
  lp.difficulty_level,
  lp.order_index,
  COUNT(lm.id) as module_count,
  CASE 
    WHEN COUNT(lm.id) = 12 THEN '✅ Complete'
    WHEN COUNT(lm.id) > 0 THEN '⚠️ Incomplete'
    ELSE '❌ No modules'
  END as status
FROM learning_paths lp
LEFT JOIN learning_modules lm ON lm.learning_path_id = lp.id
GROUP BY lp.id, lp.name, lp.track_type, lp.difficulty_level, lp.order_index
ORDER BY lp.order_index;

-- 7. List all modules with their details
SELECT 
  lm.order_index,
  lm.id,
  lm.title,
  lm.content_type,
  lm.duration_minutes,
  lp.name as path_name,
  lp.id as path_id
FROM learning_modules lm
LEFT JOIN learning_paths lp ON lp.id = lm.learning_path_id
ORDER BY lm.learning_path_id, lm.order_index;

-- 8. Test the exact query the app uses
SELECT 
  lp.id,
  lp.name,
  lp.track_type,
  lp.description,
  lp.estimated_duration,
  lp.difficulty_level,
  lp.order_index,
  json_agg(
    json_build_object(
      'id', lm.id,
      'title', lm.title,
      'description', lm.description,
      'content_type', lm.content_type,
      'duration_minutes', lm.duration_minutes,
      'order_index', lm.order_index
    ) ORDER BY lm.order_index
  ) as modules
FROM learning_paths lp
LEFT JOIN learning_modules lm ON lm.learning_path_id = lp.id
GROUP BY lp.id, lp.name, lp.track_type, lp.description, lp.estimated_duration, lp.difficulty_level, lp.order_index
ORDER BY lp.order_index;

-- 9. Check RLS Policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('learning_paths', 'learning_modules')
ORDER BY tablename, policyname;

-- 10. Verify foreign key constraint exists
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('learning_modules')
  AND ccu.table_name = 'learning_paths';

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT 
  '=== VERIFICATION SUMMARY ===' as summary;

SELECT 
  (SELECT COUNT(*) FROM learning_paths) as total_paths,
  (SELECT COUNT(*) FROM learning_modules) as total_modules,
  (SELECT COUNT(*) FROM learning_modules WHERE learning_path_id IS NOT NULL) as linked_modules,
  CASE 
    WHEN (SELECT COUNT(*) FROM learning_paths) > 0 
     AND (SELECT COUNT(*) FROM learning_modules) = 12
     AND (SELECT COUNT(*) FROM learning_modules WHERE learning_path_id IS NOT NULL) = 12
    THEN '✅ All checks passed!'
    ELSE '❌ Some checks failed - review above'
  END as overall_status;


















