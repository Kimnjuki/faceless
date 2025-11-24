# GitHub Setup Guide

## 📝 Step-by-Step: Push to GitHub

### Step 1: Initialize Git Repository
```bash
# Navigate to your project directory
cd /path/to/your/faceless-project

# Initialize git (if not already done)
git init
```

### Step 2: Configure Git (First Time Only)
```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 3: Add All Files
```bash
# Stage all files for commit
git add .

# Check what will be committed
git status
```

### Step 4: Create Initial Commit
```bash
# Commit with a descriptive message
git commit -m "Initial commit: FSH platform with Phase 1-3 features

- Lead generation system with exit intent modal
- User authentication and onboarding
- Interactive tools (calculator and quiz)
- Enhanced community features
- E-commerce product pages
- Marketing funnels"
```

### Step 5: Add Remote Repository
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/Sugow-dot/faceless.git

# Verify remote was added
git remote -v
```

### Step 6: Push to GitHub
```bash
# Push to main branch (or master if that's your default)
git push -u origin main

# If you get an error about 'main' not existing, try:
git branch -M main
git push -u origin main
```

### Alternative: If Repository Already Has Content
```bash
# Pull existing content first
git pull origin main --allow-unrelated-histories

# Then push your changes
git push -u origin main
```

---

## 🔑 Authentication Options

### Option 1: HTTPS (Easier)
When you push, GitHub will prompt for credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your GitHub password)

**Create a Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token (you won't see it again!)
5. Use this token as your password when pushing

### Option 2: SSH (More Secure)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# Settings → SSH and GPG keys → New SSH key → Paste key

# Change remote to SSH
git remote set-url origin git@github.com:Sugow-dot/faceless.git
```

---

## 🔄 Future Updates Workflow

After initial push, use this workflow for updates:

```bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "Add new feature: X"

# 4. Push to GitHub
git push
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Permission denied"
**Solution:** Check your authentication (token or SSH key)

### Issue: "Repository not found"
**Solution:** Verify the repository URL:
```bash
git remote -v
```

### Issue: "Failed to push some refs"
**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push
```

### Issue: "Large files warning"
**Solution:** Files over 100MB need Git LFS. Usually not an issue for this project.

---

## ✅ Verification

After pushing, verify on GitHub:
1. Go to: https://github.com/Sugow-dot/faceless
2. You should see all your files
3. Check the commit history
4. Verify README.md displays correctly

---

## 🎯 Quick Reference

```bash
# Daily workflow
git add .
git commit -m "Your message"
git push

# Check status
git status

# View history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
```

---

**Need help?** If you encounter any errors, copy the error message and I can help troubleshoot!
