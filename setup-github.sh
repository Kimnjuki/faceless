#!/bin/bash

# FSH Platform - GitHub Push Script
# This script will initialize git and push your project to GitHub

echo "🚀 FSH Platform - GitHub Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    echo "Visit: https://git-scm.com/downloads"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Step 1: Initialize Git (if not already initialized)
if [ ! -d .git ]; then
    echo -e "${BLUE}📦 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already initialized${NC}"
fi
echo ""

# Step 2: Configure Git (if not configured)
if [ -z "$(git config user.name)" ]; then
    echo -e "${BLUE}👤 Setting up Git user...${NC}"
    read -p "Enter your name: " git_name
    read -p "Enter your email: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
    echo -e "${GREEN}✅ Git user configured${NC}"
else
    echo -e "${GREEN}✅ Git user already configured${NC}"
    echo "   Name: $(git config user.name)"
    echo "   Email: $(git config user.email)"
fi
echo ""

# Step 3: Check for .env file
if [ -f .env ]; then
    echo -e "${BLUE}🔐 Found .env file - ensuring it's in .gitignore${NC}"
    if ! grep -q "^.env$" .gitignore 2>/dev/null; then
        echo ".env" >> .gitignore
        echo -e "${GREEN}✅ Added .env to .gitignore${NC}"
    else
        echo -e "${GREEN}✅ .env already in .gitignore${NC}"
    fi
else
    echo -e "${BLUE}ℹ️  No .env file found (you can add it later)${NC}"
fi
echo ""

# Step 4: Stage all files
echo -e "${BLUE}📁 Staging all files...${NC}"
git add .
echo -e "${GREEN}✅ Files staged${NC}"
echo ""

# Step 5: Create initial commit
echo -e "${BLUE}💾 Creating initial commit...${NC}"
git commit -m "Initial commit: FSH Platform v3.0

Features:
- Phase 1: Lead generation system with exit intent modal
- Phase 2: User authentication and personalized onboarding
- Phase 3: Interactive tools (calculator and quiz)
- Enhanced community features with post creation
- E-commerce product pages with checkout flow
- Marketing funnels (webinar and challenge)
- Complete dashboard with progress tracking
- Responsive design with mobile support
- Supabase integration for data persistence

Tech Stack:
- React 18 + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- React Router DOM
- Framer Motion
- Supabase"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Initial commit created${NC}"
else
    echo -e "${RED}❌ Commit failed. Please check for errors.${NC}"
    exit 1
fi
echo ""

# Step 6: Add remote repository
echo -e "${BLUE}🔗 Adding GitHub remote...${NC}"
REPO_URL="https://github.com/Sugow-dot/faceless.git"

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo -e "${BLUE}ℹ️  Remote 'origin' already exists. Updating URL...${NC}"
    git remote set-url origin $REPO_URL
else
    git remote add origin $REPO_URL
fi
echo -e "${GREEN}✅ Remote repository configured${NC}"
echo "   URL: $REPO_URL"
echo ""

# Step 7: Check current branch and rename if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${BLUE}🔄 Renaming branch to 'main'...${NC}"
    git branch -M main
    echo -e "${GREEN}✅ Branch renamed to 'main'${NC}"
else
    echo -e "${GREEN}✅ Already on 'main' branch${NC}"
fi
echo ""

# Step 8: Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
echo ""
echo -e "${BLUE}⚠️  You may be prompted for GitHub credentials:${NC}"
echo "   Username: Your GitHub username"
echo "   Password: Use a Personal Access Token (NOT your GitHub password)"
echo ""
echo -e "${BLUE}📝 Don't have a token? Create one at:${NC}"
echo "   https://github.com/settings/tokens"
echo "   Required scope: 'repo' (full control of private repositories)"
echo ""
read -p "Press Enter to continue with push..."

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅✅✅ SUCCESS! ✅✅✅${NC}"
    echo ""
    echo "🎉 Your project has been pushed to GitHub!"
    echo ""
    echo "📍 View your repository at:"
    echo "   https://github.com/Sugow-dot/faceless"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Set up Supabase tables (see SUPABASE_SETUP.md)"
    echo "   2. Configure environment variables (see ENV_SETUP.md)"
    echo "   3. Deploy to Vercel or Netlify (see DEPLOYMENT.md)"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Push failed${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Authentication failed - Use a Personal Access Token as password"
    echo "2. Repository not found - Verify the repository exists"
    echo "3. Permission denied - Check repository access rights"
    echo ""
    echo "For help, see GITHUB_SETUP.md"
    exit 1
fi
