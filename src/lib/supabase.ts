import { createClient } from '@supabase/supabase-js'

// Cloud Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  height: number
  weight: number
  age: number
  gender: string
  activity_level: string
  goal: string
  daily_calorie_goal: number
  created_at: string
  updated_at: string
}

export interface FoodEntry {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  image_url?: string
  created_at: string
}

export interface ExerciseEntry {
  id: string
  user_id: string
  exercise_name: string
  calories_burned: number
  duration_minutes: number
  exercise_type: string
  created_at: string
}

export interface DailySummary {
  id: string
  user_id: string
  date: string
  total_calories_consumed: number
  total_calories_burned: number
  net_calories: number
  created_at: string
} 