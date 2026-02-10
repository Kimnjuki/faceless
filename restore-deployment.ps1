# ContentAnonymity v2.0 - Emergency Restoration Script (PowerShell)
# Run this script to diagnose and fix deployment issues

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ContentAnonymity Restoration Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in the right directory
Write-Host "Step 1: Verifying project directory..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this script from your project root." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Project directory verified" -ForegroundColor Green
Write-Host ""

# Step 2: Check Node version
Write-Host "Step 2: Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "Current Node version: $nodeVersion" -ForegroundColor White
    Write-Host "✓ Node.js detected" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Clean install dependencies
Write-Host "Step 3: Cleaning and reinstalling dependencies..." -ForegroundColor Yellow
Write-Host "Removing old node_modules and lock file..." -ForegroundColor White
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}
Write-Host "Installing fresh dependencies..." -ForegroundColor White
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Check for vercel.json
Write-Host "Step 4: Checking for vercel.json..." -ForegroundColor Yellow
if (-not (Test-Path "vercel.json")) {
    Write-Host "✗ vercel.json not found" -ForegroundColor Red
    Write-Host "Creating vercel.json..." -ForegroundColor White
    @"
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
"@ | Out-File -FilePath "vercel.json" -Encoding UTF8
    Write-Host "✓ vercel.json created" -ForegroundColor Green
} else {
    Write-Host "✓ vercel.json exists" -ForegroundColor Green
}
Write-Host ""

# Step 5: Test build locally
Write-Host "Step 5: Testing build locally..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build completed successfully" -ForegroundColor Green
    
    # Check if dist directory was created
    if (Test-Path "dist") {
        Write-Host "✓ dist directory created" -ForegroundColor Green
        Write-Host "Build output:" -ForegroundColor White
        Get-ChildItem -Path "dist" | Format-Table Name, Length, LastWriteTime
    } else {
        Write-Host "✗ dist directory not found after build" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ Build failed" -ForegroundColor Red
    Write-Host "Please fix the build errors shown above before deploying." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 6: Check index.html
Write-Host "Step 6: Verifying index.html..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    Write-Host "✓ index.html found in root" -ForegroundColor Green
} else {
    Write-Host "✗ index.html not found in root" -ForegroundColor Red
    Write-Host "This may cause deployment issues." -ForegroundColor Yellow
}

if (Test-Path "dist/index.html") {
    Write-Host "✓ index.html found in dist" -ForegroundColor Green
} else {
    Write-Host "✗ index.html not found in dist after build" -ForegroundColor Red
}
Write-Host ""

# Step 7: Test preview server
Write-Host "Step 7: Starting preview server..." -ForegroundColor Yellow
Write-Host "Testing if the built site works locally..." -ForegroundColor White
Write-Host "Preview server will start at http://localhost:4173" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the preview server when you're done testing." -ForegroundColor White
Write-Host ""

# Start preview server in background
$previewJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run preview 2>&1
}

Start-Sleep -Seconds 5

# Test if preview is working
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4173" -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Preview server is running successfully" -ForegroundColor Green
        Write-Host "Visit http://localhost:4173 in your browser to test." -ForegroundColor White
        Write-Host "Press Enter when you're ready to continue..." -ForegroundColor Yellow
        Read-Host
    }
} catch {
    Write-Host "⚠ Preview server may not be ready yet. Check manually at http://localhost:4173" -ForegroundColor Yellow
}

# Stop preview job
Stop-Job $previewJob -ErrorAction SilentlyContinue
Remove-Job $previewJob -ErrorAction SilentlyContinue
Write-Host ""

# Step 8: Git status
Write-Host "Step 8: Checking git status..." -ForegroundColor Yellow
try {
    git status --short
} catch {
    Write-Host "Git not available or not a git repository" -ForegroundColor Yellow
}
Write-Host ""

# Step 9: Recommendations
Write-Host "Step 9: Deployment Recommendations" -ForegroundColor Yellow
Write-Host ""
Write-Host "If the local build and preview worked:" -ForegroundColor White
Write-Host "1. Add vercel.json to git:" -ForegroundColor White
Write-Host "   git add vercel.json" -ForegroundColor Green
Write-Host ""
Write-Host "2. Commit the changes:" -ForegroundColor White
Write-Host "   git commit -m 'fix: Add Vercel configuration for deployment'" -ForegroundColor Green
Write-Host ""
Write-Host "3. Push to GitHub:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Green
Write-Host ""
Write-Host "4. Check Vercel dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. If auto-deploy doesn't trigger, manually redeploy from Vercel dashboard" -ForegroundColor White
Write-Host ""
Write-Host "If the build failed:" -ForegroundColor White
Write-Host "- Fix the TypeScript/build errors shown above" -ForegroundColor Yellow
Write-Host "- Run this script again" -ForegroundColor Yellow
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Restoration Script Complete" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
