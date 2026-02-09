/**
 * Diagnostic utility for learning paths (Convex).
 * Use the Convex dashboard to inspect learning_paths and learning_modules.
 * This stub is kept for API compatibility; run queries in Convex dashboard for diagnostics.
 */

export async function diagnoseLearningPaths() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: [],
    errors: [],
    warnings: [],
    data: {},
  };

  console.log('ℹ️  Learning paths data is now in Convex.');
  console.log('   Use Convex Dashboard → Data to inspect learning_paths and learning_modules.');
  diagnostics.checks.push({
    name: 'convex_migration',
    status: 'info',
    message: 'Use Convex dashboard for learning paths diagnostics',
  });

  return diagnostics;
}
