# Google OAuth Setup Guide

## Overview
The platform now supports Google OAuth authentication. Users can sign in or sign up using their Google account.

---

## ✅ What's Been Implemented

### 1. Google OAuth Integration
- ✅ `signInWithGoogle()` method in AuthContext
- ✅ Google OAuth button on Login page
- ✅ Google OAuth button on Signup page
- ✅ OAuth callback handler (`/auth/callback`)
- ✅ Automatic user record creation for OAuth users
- ✅ Proper error handling and loading states

### 2. Fixed Issues
- ✅ Fixed return types in AuthContext (signIn and signUp now return proper types)
- ✅ Improved error handling in authentication flows
- ✅ Added loading states for Google OAuth
- ✅ Added Google logo SVG icon

---

## 🔧 Supabase Configuration Required

### Step 1: Enable Google Provider in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. Click **Enable**
5. You'll need to provide:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### Step 2: Set Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project reference (found in your Supabase URL)

7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase Authentication → Providers → Google

### Step 3: Configure Redirect URL

The redirect URL is automatically set to:
```
https://yourdomain.com/auth/callback
```

Make sure this matches your domain when deployed. For local development, it will be:
```
http://localhost:5173/auth/callback
```

---

## 📝 How It Works

### Sign In Flow

1. User clicks "Continue with Google" button
2. Redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/auth/callback`
5. OAuthCallback component:
   - Extracts session from URL
   - Creates user record in `users` table if needed
   - Redirects to dashboard

### User Record Creation

When a user signs in with Google for the first time:
- A record is automatically created in the `users` table
- Uses Google profile information:
  - Email from Google account
  - Name from Google profile (full_name, name, or email prefix)
  - User ID from Supabase auth

---

## 🎨 UI Features

### Google Button
- Google logo SVG icon
- Loading spinner during OAuth flow
- Disabled state while processing
- Consistent styling with other buttons

### Error Handling
- Toast notifications for errors
- Graceful fallback if OAuth fails
- Redirects to login page with error message

---

## 🔒 Security Notes

1. **Redirect URLs**: Only authorized redirect URLs from Google Cloud Console will work
2. **HTTPS Required**: In production, OAuth requires HTTPS
3. **User Data**: Google profile data is stored securely in Supabase
4. **Session Management**: Supabase handles session tokens automatically

---

## 🧪 Testing

### Local Development

1. Make sure Google OAuth is enabled in Supabase
2. Add redirect URL: `http://localhost:5173/auth/callback`
3. Test the flow:
   - Click "Continue with Google" on login/signup
   - Should redirect to Google
   - After authorization, should redirect back
   - Should create user record automatically
   - Should redirect to dashboard

### Production

1. Update redirect URL in Google Cloud Console to your production domain
2. Update redirect URL in Supabase if needed
3. Test the complete flow

---

## 🐛 Troubleshooting

### "OAuth provider not enabled"
- Go to Supabase Dashboard → Authentication → Providers
- Enable Google provider
- Add Client ID and Client Secret

### "Redirect URI mismatch"
- Check Google Cloud Console → Credentials
- Ensure redirect URI matches exactly:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- For local dev: `http://localhost:5173/auth/callback`

### "User record not created"
- Check Supabase logs for errors
- Verify `users` table exists
- Check RLS policies allow inserts
- User record creation is automatic but non-blocking

### "Session not found after OAuth"
- Check browser console for errors
- Verify redirect URL is correct
- Check Supabase authentication logs

---

## 📊 Database Requirements

Make sure your `users` table has these columns:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  niche TEXT,
  goal TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ✅ Checklist

- [ ] Google OAuth enabled in Supabase
- [ ] Google Cloud Console project created
- [ ] OAuth client ID and secret added to Supabase
- [ ] Redirect URI configured in Google Cloud Console
- [ ] `users` table exists in Supabase
- [ ] RLS policies allow user creation
- [ ] Tested login with Google
- [ ] Tested signup with Google
- [ ] Verified user records are created
- [ ] Tested redirect flow

---

## 🚀 Next Steps

1. **Enable Google OAuth in Supabase** (see Step 1 above)
2. **Set up Google Cloud Console** (see Step 2 above)
3. **Test the integration** locally
4. **Deploy and update production redirect URLs**

---

*Last Updated: January 2025*
















