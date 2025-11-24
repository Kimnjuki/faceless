# Supabase Setup Guide

## 🗄️ Complete Database Configuration

### Step 1: Create Supabase Project (If Not Done)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** faceless-hub
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup

---

### Step 2: Get Your Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Step 3: Create Database Tables

Go to **SQL Editor** in Supabase Dashboard and run these commands:

#### 📧 Leads Table (Email Captures)
```sql
-- Create leads table for email captures
create table leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for faster queries
create index leads_email_idx on leads(email);
create index leads_created_at_idx on leads(created_at desc);

-- Enable Row Level Security
alter table leads enable row level security;

-- Policy: Anyone can insert leads (for public forms)
create policy "Anyone can insert leads"
  on leads for insert
  with check (true);

-- Policy: Only authenticated users can view leads (for admin)
create policy "Authenticated users can view leads"
  on leads for select
  using (auth.role() = 'authenticated');
```

#### 👤 Users Table (User Accounts)
```sql
-- Create users table for member accounts
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  niche text,
  goal text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index users_email_idx on users(email);

-- Enable Row Level Security
alter table users enable row level security;

-- Policy: Users can read their own data
create policy "Users can read own data"
  on users for select
  using (auth.uid() = id);

-- Policy: Anyone can insert users (for signup)
create policy "Anyone can insert users"
  on users for insert
  with check (true);

-- Policy: Users can update their own data
create policy "Users can update own data"
  on users for update
  using (auth.uid() = id);
```

#### 📚 Courses Table (Optional - For Future)
```sql
-- Create courses table
create table courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price integer not null,
  category text,
  slug text unique not null,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table courses enable row level security;

-- Policy: Anyone can view active courses
create policy "Anyone can view active courses"
  on courses for select
  using (is_active = true);
```

#### 📖 Student Progress Table (Optional - For Future)
```sql
-- Create student progress tracking
create table student_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  progress integer default 0,
  completed boolean default false,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Enable RLS
alter table student_progress enable row level security;

-- Policy: Users can view their own progress
create policy "Users can view own progress"
  on student_progress for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own progress
create policy "Users can update own progress"
  on student_progress for update
  using (auth.uid() = user_id);
```

#### 💬 Forum Posts Table (Optional - For Community)
```sql
-- Create forum posts
create table forum_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null,
  likes integer default 0,
  replies integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index forum_posts_user_id_idx on forum_posts(user_id);
create index forum_posts_category_idx on forum_posts(category);
create index forum_posts_created_at_idx on forum_posts(created_at desc);

-- Enable RLS
alter table forum_posts enable row level security;

-- Policy: Anyone can view posts
create policy "Anyone can view posts"
  on forum_posts for select
  using (true);

-- Policy: Authenticated users can create posts
create policy "Authenticated users can create posts"
  on forum_posts for insert
  with check (auth.role() = 'authenticated');

-- Policy: Users can update their own posts
create policy "Users can update own posts"
  on forum_posts for update
  using (auth.uid() = user_id);
```

---

### Step 4: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see: `leads`, `users`, and optional tables
3. Click on each table to verify structure

---

### Step 5: Test Insert (Optional)

Test that your tables work:

```sql
-- Test leads table
insert into leads (email, source) 
values ('test@example.com', 'homepage');

-- Verify
select * from leads;

-- Clean up test data
delete from leads where email = 'test@example.com';
```

---

## 🔐 Security Best Practices

### Row Level Security (RLS) Explained

- ✅ **Enabled on all tables** - Prevents unauthorized access
- ✅ **Public insert on leads** - Allows anonymous form submissions
- ✅ **User-specific policies** - Users only see their own data
- ✅ **Admin access** - Use service_role key for admin operations

### API Keys

- **anon/public key:** Safe to use in frontend (limited permissions)
- **service_role key:** NEVER expose in frontend (full database access)

---

## 🧪 Testing Your Setup

### Test from Frontend

Your app is already configured to use these tables:

1. **Test Lead Capture:**
   - Go to homepage
   - Enter email in header form
   - Check Supabase Table Editor → leads

2. **Test Exit Intent:**
   - Move mouse to leave page
   - Enter email in modal
   - Verify in leads table

3. **Test Signup:**
   - Go to `/auth/signup`
   - Create account
   - Check users table

---

## 📊 View Your Data

### In Supabase Dashboard:

1. **Table Editor:** Visual view of all data
2. **SQL Editor:** Run custom queries
3. **Logs:** See all database activity

### Example Queries:

```sql
-- Count total leads
select count(*) from leads;

-- Recent leads (last 7 days)
select * from leads 
where created_at > now() - interval '7 days'
order by created_at desc;

-- Users by niche
select niche, count(*) as user_count 
from users 
group by niche;
```

---

## 🔄 Backup & Maintenance

### Automatic Backups
- Supabase automatically backs up your database
- Go to **Settings** → **Database** to configure

### Manual Backup
```sql
-- Export all leads
copy leads to stdout with csv header;
```

---

## 🆘 Troubleshooting

### Error: "new row violates row-level security policy"
**Solution:** Check your RLS policies match your use case

### Error: "permission denied for table"
**Solution:** Ensure RLS is enabled and policies are created

### Error: "duplicate key value violates unique constraint"
**Solution:** Email already exists in leads table (this is expected behavior)

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Credentials copied
- [ ] leads table created
- [ ] users table created
- [ ] RLS policies enabled
- [ ] Test insert successful
- [ ] Environment variables configured

---

**Next Step:** Configure your environment variables (see ENV_SETUP.md)
