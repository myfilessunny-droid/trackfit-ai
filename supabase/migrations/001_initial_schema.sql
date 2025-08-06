-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Create food_entries table
CREATE TABLE IF NOT EXISTS food_entries (
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

-- Create exercise_entries table
CREATE TABLE IF NOT EXISTS exercise_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    calories_burned INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'sports')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_summaries table
CREATE TABLE IF NOT EXISTS daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories_consumed INTEGER DEFAULT 0,
    total_calories_burned INTEGER DEFAULT 0,
    net_calories INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Food entries policies
CREATE POLICY "Users can view own food entries" ON food_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries" ON food_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries" ON food_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries" ON food_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Exercise entries policies
CREATE POLICY "Users can view own exercise entries" ON exercise_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise entries" ON exercise_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise entries" ON exercise_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise entries" ON exercise_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Daily summaries policies
CREATE POLICY "Users can view own daily summaries" ON daily_summaries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily summaries" ON daily_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily summaries" ON daily_summaries
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_created_at ON food_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_entries_user_id ON exercise_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_entries_created_at ON exercise_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_id ON daily_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_date ON daily_summaries(date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 