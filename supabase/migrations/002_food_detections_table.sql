-- Create food_detections table for storing AI detection results
CREATE TABLE IF NOT EXISTS food_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_name TEXT,
    image_size INTEGER,
    detection_results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for food_detections table
ALTER TABLE food_detections ENABLE ROW LEVEL SECURITY;

-- Food detections policies
CREATE POLICY "Users can view own food detections" ON food_detections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food detections" ON food_detections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food detections" ON food_detections
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_food_detections_user_id ON food_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_food_detections_created_at ON food_detections(created_at); 