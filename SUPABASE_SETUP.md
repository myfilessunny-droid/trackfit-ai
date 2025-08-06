# Supabase Setup Guide

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Install Supabase CLI

```bash
npm install -g supabase
```

## 3. Start Supabase Local Development

```bash
supabase start
```

This will start the local Supabase instance and provide you with the necessary credentials.

## 4. Apply Database Schema

```bash
supabase db reset
```

This will apply the migration in `supabase/migrations/001_initial_schema.sql`.

## 5. Database Tables Created

- **user_profiles**: Store user health profile data
- **food_entries**: Track food intake and nutrition
- **exercise_entries**: Track exercise and calories burned
- **daily_summaries**: Daily calorie summaries

## 6. Row Level Security (RLS)

All tables have RLS enabled with policies that ensure users can only access their own data.

## 7. API Endpoints

The following tables are automatically exposed as REST API endpoints:
- `/rest/v1/user_profiles`
- `/rest/v1/food_entries`
- `/rest/v1/exercise_entries`
- `/rest/v1/daily_summaries`

## 8. Authentication

Supabase Auth is configured and ready for user authentication. The app will handle authentication in a future update. 