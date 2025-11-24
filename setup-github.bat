@echo off
REM FSH Platform - GitHub Push Script for Windows
REM This script will initialize git and push your project to GitHub

echo ========================================
echo FSH Platform - GitHub Setup Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    echo Visit: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Step 1: Initialize Git
if not exist .git (
    echo [STEP 1] Initializing Git repository...
    git init
    echo [OK] Git initialized
) else (
    echo [OK] Git repository already initialized
)
echo.

REM Step 2: Configure Git
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo [STEP 2] Setting up Git user...
    set /p git_name="Enter your name: "
    set /p git_email="Enter your email: "
    git config user.name "%git_name%"
    git config user.email "%git_email%"
    echo [OK] Git user configured
) else (
    echo [OK] Git user already configured
    git config user.name
    git config user.email
)
echo.

REM Step 3: Check for .env file
if exist .env (
    echo [STEP 3] Found .env file - ensuring it's in .gitignore
    findstr /C:".env" .gitignore >nul 2>&1
    if %errorlevel% neq 0 (
        echo .env >> .gitignore
        echo [OK] Added .env to .gitignore
    ) else (
        echo [OK] .env already in .gitignore
    )
) else (
    echo [INFO] No .env file found (you can add it later)
)
echo.

REM Step 4: Stage all files
echo [STEP 4] Staging all files...
git add .
echo [OK] Files staged
echo.

REM Step 5: Create initial commit
echo [STEP 5] Creating initial commit...
git commit -m "Initial commit: FSH Platform v3.0" -m "Features:" -m "- Phase 1: Lead generation system with exit intent modal" -m "- Phase 2: User authentication and personalized onboarding" -m "- Phase 3: Interactive tools (calculator and quiz)" -m "- Enhanced community features" -m "- E-commerce and marketing funnels" -m "- Complete dashboard with progress tracking" -m "" -m "Tech Stack: React 18 + TypeScript + Vite + Supabase"

if %errorlevel% equ 0 (
    echo [OK] Initial commit created
) else (
    echo [ERROR] Commit failed. Please check for errors.
    pause
    exit /b 1
)
echo.

REM Step 6: Add remote repository
echo [STEP 6] Adding GitHub remote...
set REPO_URL=https://github.com/Sugow-dot/faceless.git

git remote | findstr "origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Remote 'origin' already exists. Updating URL...
    git remote set-url origin %REPO_URL%
) else (
    git remote add origin %REPO_URL%
)
echo [OK] Remote repository configured
echo URL: %REPO_URL%
echo.

REM Step 7: Rename branch to main
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo [STEP 7] Renaming branch to 'main'...
    git branch -M main
    echo [OK] Branch renamed to 'main'
) else (
    echo [OK] Already on 'main' branch
)
echo.

REM Step 8: Push to GitHub
echo [STEP 8] Pushing to GitHub...
echo.
echo [IMPORTANT] You may be prompted for GitHub credentials:
echo    Username: Your GitHub username
echo    Password: Use a Personal Access Token (NOT your GitHub password)
echo.
echo Don't have a token? Create one at:
echo    https://github.com/settings/tokens
echo    Required scope: 'repo' (full control of private repositories)
echo.
pause

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Project pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository at:
    echo    https://github.com/Sugow-dot/faceless
    echo.
    echo Next steps:
    echo    1. Set up Supabase tables (see SUPABASE_SETUP.md)
    echo    2. Configure environment variables (see ENV_SETUP.md)
    echo    3. Deploy to Vercel or Netlify (see DEPLOYMENT.md)
    echo.
) else (
    echo.
    echo [ERROR] Push failed
    echo.
    echo Common issues:
    echo 1. Authentication failed - Use a Personal Access Token as password
    echo 2. Repository not found - Verify the repository exists
    echo 3. Permission denied - Check repository access rights
    echo.
    echo For help, see GITHUB_SETUP.md
)

pause
