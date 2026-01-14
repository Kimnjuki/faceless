# Database Schema Migration Guide

## Overview
This guide explains the changes from the old schema to the new full database schema and how to migrate your codebase.

---

## 🔄 Major Schema Changes

### 1. **Users → Profiles Table**
**Old:** `users` table with `id` as primary key
**New:** `profiles` table with `user_id` referencing `auth.users(id)`

**Changes:**
- Table name: `users` → `profiles`
- Primary key: `id` → `id` (but `user_id` is the foreign key to auth.users)
- Field mapping:
  - `name` → `full_name`
  - `niche` → `primary_niche`
  - `goal` → removed (not in schema)
  - `onboarding_completed` → removed (not in schema)

**Code Updates:**
- All `.from('users')` → `.from('profiles')`
- All `.eq('id', userId)` → `.eq('user_id', userId)`
- Field mappings in TypeScript interfaces

---

### 2. **Forum Posts → Category ID**
**Old:** `community_posts` with `category` as string
**New:** `forum_posts` with `category_id` referencing `community_categories`

**Changes:**
- Table name: `community_posts` → `forum_posts`
- Category: `category: string` → `category_id: uuid`
- New table: `community_categories` for category definitions
- Removed: `author_name`, `likes` (now calculated from `post_upvotes`)

**Code Updates:**
- Join with `community_categories` table
- Lookup category ID before inserting posts
- Update queries to use `category_id`

---

### 3. **Niches → Category ID**
**Old:** `niches` with `category` as string
**New:** `niches` with `category_id` referencing `niche_categories`

**Changes:**
- Category: `category: string` → `category_id: uuid`
- New table: `niche_categories` for category definitions
- Removed: `content_ideas_count`, `example_accounts`, `monetization_methods`
- Added: `avg_rpm`, `time_to_monetization`, `evergreen_score`, `best_ai_tools`, `risks`

**Code Updates:**
- Join with `niche_categories` table
- Lookup category ID for filtering
- Update TypeScript interface

---

### 4. **New Tables Added**
- `email_subscribers` - Enhanced email list management
- `lead_magnets` - Lead magnet tracking
- `affiliate_programs` - Affiliate program management
- `affiliate_links` - Affiliate link tracking
- `products` - Product catalog
- `orders` - Order management
- `subscriptions` - Subscription management
- `courses` - Course management
- `articles` - Blog/article management
- `webinars` - Webinar management
- And many more...

---

## 📝 Migration Steps

### Step 1: Run the Full Schema SQL
```sql
-- Run: FULL_DATABASE_SCHEMA.sql
-- This creates all tables, indexes, RLS policies, and triggers
```

### Step 2: Update TypeScript Types
✅ Already done in `src/lib/supabase.ts`
- Updated `User` → `Profile` interface
- Updated `CommunityPost` interface
- Updated `Niche` interface
- Added new interfaces for all tables

### Step 3: Update Code References

#### AuthContext.tsx
✅ Updated:
- `from('users')` → `from('profiles')`
- `eq('id', ...)` → `eq('user_id', ...)`
- Field mappings: `name` → `full_name`

#### useUser.ts
✅ Updated:
- Query uses `profiles` table
- Maps `user_id` → `id` for backward compatibility
- Maps `full_name` → `name` for backward compatibility

#### useCommunityPosts.ts
✅ Updated:
- `from('community_posts')` → `from('forum_posts')`
- Joins with `community_categories`
- Uses `category_id` instead of `category` string

#### useNiches.ts
✅ Updated:
- Joins with `niche_categories`
- Uses `category_id` for filtering
- Maps category object to string for display

#### OAuthCallback.tsx
✅ Updated:
- Uses `profiles` table
- Uses `user_id` and `full_name` fields

---

## 🔧 Backward Compatibility

The codebase maintains backward compatibility where possible:

1. **User Interface:** The `User` interface extends `Profile` and maps fields:
   ```typescript
   export interface User extends Profile {
     id: string; // Maps from user_id
     name?: string; // Maps from full_name
     niche?: string; // Maps from primary_niche
   }
   ```

2. **Field Mapping:** Hooks automatically map between old and new field names

3. **Table Aliases:** Can create views if needed for backward compatibility

---

## ⚠️ Breaking Changes

### Must Update:
1. **Database Queries:** All queries using `users` table must use `profiles`
2. **Field Names:** `name` → `full_name`, `niche` → `primary_niche`
3. **Category Fields:** String categories → category_id UUIDs

### Optional:
1. **Email Subscribers:** Can migrate from `leads` to `email_subscribers`
2. **Forum Posts:** Can migrate from old `community_posts` to new `forum_posts`

---

## 📋 Checklist

- [x] Create full database schema SQL
- [x] Update TypeScript interfaces
- [x] Update AuthContext to use profiles
- [x] Update useUser hook
- [x] Update useCommunityPosts hook
- [x] Update useNiches hook
- [x] Update OAuthCallback
- [ ] Update all components using User/Profile
- [ ] Update all components using CommunityPost
- [ ] Update all components using Niche
- [ ] Test authentication flow
- [ ] Test community posts
- [ ] Test niche database
- [ ] Run database migration script

---

## 🚀 Next Steps

1. **Run the SQL Schema:**
   ```sql
   -- In Supabase SQL Editor, run:
   -- FULL_DATABASE_SCHEMA.sql
   ```

2. **Test the Application:**
   - Test sign up/sign in
   - Test profile updates
   - Test community posts
   - Test niche database
   - Test tools display

3. **Migrate Existing Data (if any):**
   ```sql
   -- If you have existing data in 'users' table:
   INSERT INTO profiles (user_id, email, full_name, primary_niche)
   SELECT id, email, name, niche FROM users;
   ```

---

*Last Updated: January 2025*












