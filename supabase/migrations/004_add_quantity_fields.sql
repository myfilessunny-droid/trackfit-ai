-- Add quantity fields to food_entries table
ALTER TABLE food_entries 
ADD COLUMN IF NOT EXISTS quantity TEXT,
ADD COLUMN IF NOT EXISTS pieces_count INTEGER,
ADD COLUMN IF NOT EXISTS weight_grams DECIMAL(8,2);

-- Update the meal_type constraint to include 'other'
ALTER TABLE food_entries 
DROP CONSTRAINT IF EXISTS food_entries_meal_type_check;

ALTER TABLE food_entries 
ADD CONSTRAINT food_entries_meal_type_check 
CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'other')); 