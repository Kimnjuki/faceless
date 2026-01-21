/**
 * Diagnostic utility for learning paths
 * Use this to debug why modules aren't displaying
 */

import { supabase } from '@/lib/supabase';

export async function diagnoseLearningPaths() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: [],
    errors: [],
    warnings: [],
    data: {},
  };

  try {
    // Check 1: Verify learning_paths table exists and has data
    console.log('🔍 Check 1: Checking learning_paths table...');
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*')
      .order('order_index', { ascending: true });

    if (pathsError) {
      diagnostics.errors.push({
        check: 'learning_paths table access',
        error: pathsError,
        message: `Cannot access learning_paths table: ${pathsError.message}`,
      });
    } else {
      diagnostics.checks.push({
        name: 'learning_paths table',
        status: 'success',
        count: paths?.length || 0,
      });
      diagnostics.data.paths = paths;
      console.log(`✅ Found ${paths?.length || 0} learning paths`);
    }

    // Check 2: Verify learning_modules table exists and has data
    console.log('🔍 Check 2: Checking learning_modules table...');
    const { data: modules, error: modulesError } = await supabase
      .from('learning_modules')
      .select('*')
      .order('order_index', { ascending: true });

    if (modulesError) {
      diagnostics.errors.push({
        check: 'learning_modules table access',
        error: modulesError,
        message: `Cannot access learning_modules table: ${modulesError.message}`,
      });
    } else {
      diagnostics.checks.push({
        name: 'learning_modules table',
        status: 'success',
        count: modules?.length || 0,
      });
      diagnostics.data.modules = modules;
      console.log(`✅ Found ${modules?.length || 0} learning modules`);
    }

    // Check 3: Verify joined query works
    console.log('🔍 Check 3: Testing joined query...');
    const { data: joinedData, error: joinedError } = await supabase
      .from('learning_paths')
      .select(`
        *,
        modules:learning_modules(*)
      `)
      .order('order_index', { ascending: true });

    if (joinedError) {
      diagnostics.errors.push({
        check: 'joined query',
        error: joinedError,
        message: `Cannot perform joined query: ${joinedError.message}`,
      });
    } else {
      diagnostics.checks.push({
        name: 'joined query',
        status: 'success',
        pathsWithModules: joinedData?.map((p: any) => ({
          pathId: p.id,
          pathName: p.name,
          moduleCount: p.modules?.length || 0,
        })),
      });
      diagnostics.data.joinedData = joinedData;
      console.log(`✅ Joined query successful. Found ${joinedData?.length || 0} paths with modules`);
      
      if (joinedData && joinedData.length > 0) {
        joinedData.forEach((path: any) => {
          console.log(`   - Path "${path.name}" has ${path.modules?.length || 0} modules`);
          if (path.modules && path.modules.length > 0) {
            path.modules.forEach((module: any, idx: number) => {
              console.log(`     ${idx + 1}. ${module.title} (order: ${module.order_index})`);
            });
          }
        });
      }
    }

    // Check 4: Verify foreign key relationship
    if (paths && modules) {
      console.log('🔍 Check 4: Verifying foreign key relationships...');
      const pathIds = new Set(paths.map((p: any) => p.id));
      const modulesWithValidPath = modules.filter((m: any) => pathIds.has(m.learning_path_id));
      
      diagnostics.checks.push({
        name: 'foreign key relationships',
        status: modulesWithValidPath.length === modules.length ? 'success' : 'warning',
        validModules: modulesWithValidPath.length,
        totalModules: modules.length,
        orphanedModules: modules.length - modulesWithValidPath.length,
      });

      if (modulesWithValidPath.length < modules.length) {
        diagnostics.warnings.push({
          message: `Found ${modules.length - modulesWithValidPath.length} modules without valid learning_path_id`,
        });
      }
    }

    // Check 5: Verify RLS policies
    console.log('🔍 Check 5: Testing RLS policies...');
    // This is implicit in the queries above, but we can check specific permissions

    // Check 6: Check for specific path ID
    if (paths && paths.length > 0) {
      const firstPath = paths[0];
      console.log(`🔍 Check 6: Testing query for path ID: ${firstPath.id}`);
      
      const { data: specificPath, error: specificError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          modules:learning_modules(*)
        `)
        .eq('id', firstPath.id)
        .single();

      if (specificError) {
        diagnostics.errors.push({
          check: 'specific path query',
          error: specificError,
          message: `Cannot query specific path: ${specificError.message}`,
        });
      } else {
        diagnostics.checks.push({
          name: 'specific path query',
          status: 'success',
          pathId: firstPath.id,
          moduleCount: specificPath?.modules?.length || 0,
        });
        console.log(`✅ Path "${specificPath?.name}" has ${specificPath?.modules?.length || 0} modules`);
      }
    }

  } catch (err: any) {
    diagnostics.errors.push({
      check: 'diagnostic execution',
      error: err,
      message: `Diagnostic failed: ${err.message}`,
    });
  }

  return diagnostics;
}














