# Cloud Supabase Setup Guide

## 1. Get Your Supabase Project Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API** in your project dashboard
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key

## 2. Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Manual Table Creation

Go to your Supabase dashboard → **SQL Editor** and run these commands one by one:

### Step 1: Enable UUID Extension
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Create User Profiles Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    goal TEXT CHECK (goal IN ('lose', 'maintain', 'gain')),
    daily_calorie_goal INTEGER DEFAULT 2000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 3: Create Food Entries Table
```sql
CREATE TABLE food_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,2), -- in grams
    carbs DECIMAL(5,2), -- in grams
    fat DECIMAL(5,2), -- in grams
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 4: Create Exercise Entries Table
```sql
CREATE TABLE exercise_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    calories_burned INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'sports')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 5: Create Daily Summaries Table
```sql
CREATE TABLE daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories_consumed INTEGER DEFAULT 0,
    total_calories_burned INTEGER DEFAULT 0,
    net_calories INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

## 4. Enable Row Level Security (RLS)

Run these commands to enable RLS on all tables:

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
```

## 5. Create RLS Policies

### User Profiles Policies
```sql
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);
```

### Food Entries Policies
```sql
CREATE POLICY "Users can view own food entries" ON food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries" ON food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries" ON food_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries" ON food_entries
    FOR DELETE USING (auth.uid() = user_id);
```

### Exercise Entries Policies
```sql
CREATE POLICY "Users can view own exercise entries" ON exercise_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise entries" ON exercise_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise entries" ON exercise_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise entries" ON exercise_entries
    FOR DELETE USING (auth.uid() = user_id);
```

### Daily Summaries Policies
```sql
CREATE POLICY "Users can view own daily summaries" ON daily_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily summaries" ON daily_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily summaries" ON daily_summaries
    FOR UPDATE USING (auth.uid() = user_id);
```

## 6. Create Indexes for Performance

```sql
CREATE INDEX idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX idx_food_entries_created_at ON food_entries(created_at);
CREATE INDEX idx_exercise_entries_user_id ON exercise_entries(user_id);
CREATE INDEX idx_exercise_entries_created_at ON exercise_entries(created_at);
CREATE INDEX idx_daily_summaries_user_id ON daily_summaries(user_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);
```

## 7. Create Updated At Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 8. Test the Setup

After running all the SQL commands, you can test the connection by:

1. Going to **Table Editor** in your Supabase dashboard
2. You should see all 4 tables: `user_profiles`, `food_entries`, `exercise_entries`, `daily_summaries`
3. The app should now connect to your cloud database

## 9. API Endpoints Available

Once set up, these REST endpoints will be automatically available:
- `https://your-project.supabase.co/rest/v1/user_profiles`
- `https://your-project.supabase.co/rest/v1/food_entries`
- `https://your-project.supabase.co/rest/v1/exercise_entries`
- `https://your-project.supabase.co/rest/v1/daily_summaries`

## 10. Next Steps

1. Update your `.env.local` with your actual Supabase credentials
2. Restart your development server: `npm run dev`
3. The app will now connect to your cloud database
4. Authentication will be added in the next phase 