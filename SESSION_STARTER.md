# TrackFit AI - Session Starter

## 🚀 Quick Start (Copy & Paste)

```bash
# Navigate to project
cd trackfit-ai

# Start development server
npm run dev

# Access web app
# http://localhost:8080/
```

## 🗄️ SUPABASE SQL SETUP (Copy & Paste)

### Connect to Your Supabase Project
- **Project URL**: `https://yiscgtqmwjcdrgypdjvz.supabase.co`
- **Dashboard**: [https://supabase.com/dashboard/project/yiscgtqmwjcdrgypdjvz](https://supabase.com/dashboard/project/yiscgtqmwjcdrgypdjvz)

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

### Step 6: Enable Row Level Security (RLS)
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
```

### Step 7: Create RLS Policies

#### User Profiles Policies
```sql
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);
```

#### Food Entries Policies
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

#### Exercise Entries Policies
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

#### Daily Summaries Policies
```sql
CREATE POLICY "Users can view own daily summaries" ON daily_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily summaries" ON daily_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily summaries" ON daily_summaries
    FOR UPDATE USING (auth.uid() = user_id);
```

### Step 8: Create Indexes for Performance
```sql
CREATE INDEX idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX idx_food_entries_created_at ON food_entries(created_at);
CREATE INDEX idx_exercise_entries_user_id ON exercise_entries(user_id);
CREATE INDEX idx_exercise_entries_created_at ON exercise_entries(created_at);
CREATE INDEX idx_daily_summaries_user_id ON daily_summaries(user_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);
```

### Step 9: Create Updated At Trigger
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

### Step 10: Verify Setup
After running all SQL commands, check your Supabase dashboard → **Table Editor** to see:
- ✅ `user_profiles` table
- ✅ `food_entries` table  
- ✅ `exercise_entries` table
- ✅ `daily_summaries` table

## 📋 Session Checklist

### Before Starting
- [ ] Check if in `trackfit-ai/` directory
- [ ] Verify project type: Vite React (not Expo)
- [ ] Check if port 8080 is available
- [ ] Review `PROJECT_PREFERENCES.md` for approach

### If Issues Occur
- [ ] Check `QUICK_REFERENCE.md` for solutions
- [ ] Review `DEVELOPMENT_GUIDE.md` for setup
- [ ] Use clean install if dependencies broken

## 🎯 Project Reminders

### Key Facts
- **Type**: Vite React web app (NOT Expo)
- **Command**: `npm run dev` (NOT `npx expo start`)
- **Port**: 8080
- **Approach**: Web-first, mobile later

### Common Mistakes to Avoid
- ❌ Using `npx expo start` (wrong project type)
- ❌ Running from wrong directory
- ❌ Not using `--legacy-peer-deps` for installs
- ❌ Forgetting to kill Node processes when files locked

## 📁 Reference Files

### Documentation
- `DEVELOPMENT_GUIDE.md` - Complete setup & workflow
- `QUICK_REFERENCE.md` - Essential commands & fixes
- `PROJECT_PREFERENCES.md` - Your approach & preferences
- `MOBILE_CONVERSION_GUIDELINES.md` - Mobile-ready development rules
- `SESSION_STARTER.md` - This file

### Project Files
- `package.json` - Dependencies & scripts
- `src/` - React components & pages
- `vite.config.ts` - Web bundler config

## 🔧 Troubleshooting Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Port 8080 busy | Kill process or change port |
| Dependencies broken | `npm install --legacy-peer-deps` |
| Files locked | `taskkill /f /im node.exe` |
| Wrong project type | Use `npm run dev`, not `npx expo start` |

## 📝 Session Notes Template

```markdown
## Session Date: [Date]

### What We Did
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Issues Encountered
- Issue 1: [Description] → [Solution]
- Issue 2: [Description] → [Solution]

### Next Steps
- [ ] Next task 1
- [ ] Next task 2

### Files Updated
- [ ] File 1
- [ ] File 2
```

## 🎯 Current Status

### ✅ Completed
- Web app setup
- Dependencies installed
- Documentation created
- Development server running

### 🔄 In Progress
- Feature development
- Component creation
- UI/UX implementation

### 📋 Planned
- Mobile conversion
- App store deployment

---
*Use this file to quickly get up to speed in new sessions*
*Last Updated: [Current Date]* 