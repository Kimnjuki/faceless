#!/bin/bash

# ContentAnonymity v2.0 - Emergency Restoration Script
# Run this script to diagnose and fix deployment issues

echo "=================================="
echo "ContentAnonymity Restoration Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
echo -e "${YELLOW}Step 1: Verifying project directory...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}ERROR: package.json not found. Please run this script from your project root.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project directory verified${NC}"
echo ""

# Step 2: Check Node version
echo -e "${YELLOW}Step 2: Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo "Current Node version: $NODE_VERSION"
echo -e "${GREEN}✓ Node.js detected${NC}"
echo ""

# Step 3: Clean install dependencies
echo -e "${YELLOW}Step 3: Cleaning and reinstalling dependencies...${NC}"
echo "Removing old node_modules and lock file..."
rm -rf node_modules package-lock.json
echo "Installing fresh dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Dependency installation failed${NC}"
    exit 1
fi
echo ""

# Step 4: Check for vercel.json
echo -e "${YELLOW}Step 4: Checking for vercel.json...${NC}"
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}✗ vercel.json not found${NC}"
    echo "Creating vercel.json..."
    cat > vercel.json << 'EOF'
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
EOF
    echo -e "${GREEN}✓ vercel.json created${NC}"
else
    echo -e "${GREEN}✓ vercel.json exists${NC}"
fi
echo ""

# Step 5: Test build locally
echo -e "${YELLOW}Step 5: Testing build locally...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓ dist directory created${NC}"
        echo "Build output:"
        ls -lh dist/
    else
        echo -e "${RED}✗ dist directory not found after build${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Build failed${NC}"
    echo "Please fix the build errors shown above before deploying."
    exit 1
fi
echo ""

# Step 6: Check index.html
echo -e "${YELLOW}Step 6: Verifying index.html...${NC}"
if [ -f "index.html" ]; then
    echo -e "${GREEN}✓ index.html found in root${NC}"
else
    echo -e "${RED}✗ index.html not found in root${NC}"
    echo "This may cause deployment issues."
fi

if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ index.html found in dist${NC}"
else
    echo -e "${RED}✗ index.html not found in dist after build${NC}"
fi
echo ""

# Step 7: Test preview server
echo -e "${YELLOW}Step 7: Starting preview server...${NC}"
echo "Testing if the built site works locally..."
echo "Preview server will start at http://localhost:4173"
echo "Press Ctrl+C to stop the preview server when you're done testing."
echo ""
npm run preview &
PREVIEW_PID=$!
sleep 3

# Test if preview is working
curl -s http://localhost:4173 > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Preview server is running successfully${NC}"
    echo "Visit http://localhost:4173 in your browser to test."
    echo "Press Enter when you're ready to continue..."
    read
    kill $PREVIEW_PID
else
    echo -e "${RED}✗ Preview server failed to start${NC}"
    kill $PREVIEW_PID 2>/dev/null
fi
echo ""

# Step 8: Git status
echo -e "${YELLOW}Step 8: Checking git status...${NC}"
git status --short
echo ""

# Step 9: Recommendations
echo -e "${YELLOW}Step 9: Deployment Recommendations${NC}"
echo ""
echo "If the local build and preview worked:"
echo "1. Add vercel.json to git:"
echo "   ${GREEN}git add vercel.json${NC}"
echo ""
echo "2. Commit the changes:"
echo "   ${GREEN}git commit -m 'fix: Add Vercel configuration for deployment'${NC}"
echo ""
echo "3. Push to GitHub:"
echo "   ${GREEN}git push origin main${NC}"
echo ""
echo "4. Check Vercel dashboard:"
echo "   ${GREEN}https://vercel.com/dashboard${NC}"
echo ""
echo "5. If auto-deploy doesn't trigger, manually redeploy from Vercel dashboard"
echo ""
echo "If the build failed:"
echo "- Fix the TypeScript/build errors shown above"
echo "- Run this script again"
echo ""
echo "=================================="
echo "Restoration Script Complete"
echo "=================================="
