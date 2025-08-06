-- Drop existing policies and recreate them to ensure they work correctly
DROP POLICY IF EXISTS "Users can view own food detections" ON food_detections;
DROP POLICY IF EXISTS "Users can insert own food detections" ON food_detections;
DROP POLICY IF EXISTS "Users can delete own food detections" ON food_detections;

-- Recreate the policies with explicit naming
CREATE POLICY "Users can view own food detections" ON food_detections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food detections" ON food_detections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food detections" ON food_detections
    FOR DELETE USING (auth.uid() = user_id);

-- Add a policy for anonymous users (optional - for testing)
-- CREATE POLICY "Allow anonymous food detections" ON food_detections
--     FOR INSERT WITH CHECK (user_id IS NULL); 