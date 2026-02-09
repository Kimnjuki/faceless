/**
 * Diagnostic script: Check Convex setup and environment variables.
 * Run: node scripts/check-convex-setup.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: join(root, ".env") });
  dotenv.config({ path: join(root, ".env.local") });
} catch (_) {}

const CONVEX_URL = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
const CONVEX_DEPLOYMENT = process.env.CONVEX_DEPLOYMENT;

console.log("🔍 Convex Setup Diagnostic\n");
console.log("=" .repeat(60));

// 1. Check environment variables
console.log("\n1️⃣ Environment Variables:");
if (CONVEX_URL) {
  console.log(`   ✓ VITE_CONVEX_URL: ${CONVEX_URL}`);
  if (CONVEX_URL.includes("fabulous-roadrunner-783")) {
    console.log("   ✓ Matches production deployment");
  } else {
    console.log("   ⚠️  URL doesn't match expected production deployment");
  }
} else {
  console.log("   ❌ VITE_CONVEX_URL: NOT SET");
  console.log("   → Set in Coolify Environment Variables");
}

if (CONVEX_DEPLOYMENT) {
  console.log(`   ✓ CONVEX_DEPLOYMENT: ${CONVEX_DEPLOYMENT}`);
} else {
  console.log("   ⊘ CONVEX_DEPLOYMENT: Not set (optional for frontend)");
}

// 2. Check Convex files
console.log("\n2️⃣ Convex Files:");
const convexFiles = {
  "convex/schema.ts": join(root, "convex/schema.ts"),
  "convex/articles.ts": join(root, "convex/articles.ts"),
  "convex/import.ts": join(root, "convex/import.ts"),
  "convex/contentCategories.ts": join(root, "convex/contentCategories.ts"),
  "convex/_generated/api.d.ts": join(root, "convex/_generated/api.d.ts"),
};

for (const [name, path] of Object.entries(convexFiles)) {
  if (existsSync(path)) {
    console.log(`   ✓ ${name}`);
  } else {
    console.log(`   ❌ ${name}: MISSING`);
  }
}

// 3. Check main.tsx for ConvexProvider
console.log("\n3️⃣ Code Integration:");
const mainTsx = join(root, "src/main.tsx");
if (existsSync(mainTsx)) {
  const content = readFileSync(mainTsx, "utf8");
  if (content.includes("ConvexProvider")) {
    console.log("   ✓ ConvexProvider found in src/main.tsx");
  } else {
    console.log("   ❌ ConvexProvider NOT found in src/main.tsx");
    console.log("   → Need to add ConvexProvider wrapper");
  }
  
  if (content.includes("ConvexReactClient")) {
    console.log("   ✓ ConvexReactClient imported");
  } else {
    console.log("   ❌ ConvexReactClient NOT imported");
  }
  
  if (content.includes("VITE_CONVEX_URL")) {
    console.log("   ✓ VITE_CONVEX_URL referenced in code");
  } else {
    console.log("   ⚠️  VITE_CONVEX_URL not referenced (may be using fallback)");
  }
} else {
  console.log("   ❌ src/main.tsx not found");
}

// 4. Check if hooks use Convex
console.log("\n4️⃣ Data Hooks:");
const hooksDir = join(root, "src/hooks");
const hooks = ["useArticles.ts", "useLearningPaths.ts", "useTools.ts"];
for (const hook of hooks) {
  const path = join(hooksDir, hook);
  if (existsSync(path)) {
    const content = readFileSync(path, "utf8");
    if (content.includes("useQuery") || content.includes("api.")) {
      console.log(`   ✓ ${hook}: Uses Convex`);
    } else if (content.includes("supabase")) {
      console.log(`   ⚠️  ${hook}: Still uses Supabase (needs migration)`);
    } else {
      console.log(`   ⊘ ${hook}: Unknown data source`);
    }
  }
}

// 5. Check package.json
console.log("\n5️⃣ Dependencies:");
const pkgJson = join(root, "package.json");
if (existsSync(pkgJson)) {
  const pkg = JSON.parse(readFileSync(pkgJson, "utf8"));
  if (pkg.dependencies?.convex) {
    console.log(`   ✓ convex: ${pkg.dependencies.convex}`);
  } else {
    console.log("   ❌ convex: NOT in dependencies");
  }
  
  if (pkg.dependencies?.["@supabase/supabase-js"]) {
    console.log(`   ⚠️  @supabase/supabase-js: Still installed (can remove after migration)`);
  }
}

// 6. Summary
console.log("\n" + "=".repeat(60));
console.log("\n📊 Summary:");

const issues = [];
if (!CONVEX_URL) issues.push("VITE_CONVEX_URL not set");
if (!existsSync(join(root, "convex/schema.ts"))) issues.push("Convex schema missing");
if (!existsSync(join(root, "src/main.tsx"))) {
  issues.push("src/main.tsx missing");
} else {
  const mainContent = readFileSync(join(root, "src/main.tsx"), "utf8");
  if (!mainContent.includes("ConvexProvider")) {
    issues.push("ConvexProvider not added to main.tsx");
  }
}

if (issues.length === 0) {
  console.log("   ✅ Convex setup looks good!");
  console.log("\n   Next steps:");
  console.log("   1. Ensure VITE_CONVEX_URL is set in Coolify");
  console.log("   2. Rebuild application in Coolify");
  console.log("   3. Migrate hooks to use Convex queries (Phase 5)");
} else {
  console.log("   ⚠️  Issues found:");
  issues.forEach((issue) => console.log(`      - ${issue}`));
}

console.log("\n");
