# Supabase Edge Function Setup Guide

## Overview
This guide explains how to properly deploy the food detection Edge Function and the best.pt model to Supabase.

## Prerequisites
- Supabase CLI installed
- Supabase project created
- best.pt model file (already in public/models/)

## Step 1: Deploy the Database Migration

First, apply the new migration that creates the `food_detections` table:

```bash
# Make sure you're in the project root
cd trackfit-ai

# Link to your Supabase project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the new migration
supabase db push
```

## Step 2: Upload the Model File to Supabase Storage

The best.pt model needs to be accessible to the Edge Function. Upload it to Supabase Storage:

```bash
# Create a models bucket in Supabase Storage
supabase storage create models

# Upload the best.pt file
supabase storage upload models/best.pt public/models/best.pt
```

## Step 3: Deploy the Edge Function

Deploy the detect-food Edge Function:

```bash
# Deploy the function
supabase functions deploy detect-food

# Set the function to be publicly accessible (optional)
supabase functions update detect-food --import-map ./supabase/functions/detect-food/import_map.json
```

## Step 4: Configure Environment Variables

Set up the necessary environment variables for the Edge Function:

```bash
# Set Supabase URL and anon key
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Test the Function

You can test the function using curl or your frontend application:

```bash
# Test with curl
curl -X POST https://your-project-ref.supabase.co/functions/v1/detect-food \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -F "image=@path/to/test-image.jpg"
```

## Step 6: Production Model Integration

For production use with the actual YOLO model, you'll need to:

1. **Install Python dependencies** in the Edge Function:
   ```bash
   # Create requirements.txt in the function directory
   echo "torch
   torchvision
   ultralytics
   pillow
   numpy" > supabase/functions/detect-food/requirements.txt
   ```

2. **Update the Edge Function** to use the actual model:
   ```typescript
   // Replace the simulateFoodDetection function with real YOLO inference
   import { YOLO } from 'ultralytics'
   
   async function detectFoodWithYOLO(imageBuffer: ArrayBuffer) {
     const model = await YOLO.load('/models/best.pt')
     const results = await model.predict(imageBuffer)
     return results
   }
   ```

## Database Schema Summary

After running the migration, you'll have these tables:

### New Table: `food_detections`
- `id` (UUID, Primary Key)
- `user_id` (UUID, references auth.users)
- `image_name` (TEXT)
- `image_size` (INTEGER)
- `detection_results` (JSONB) - Stores the AI detection results
- `created_at` (TIMESTAMP)

### Security Features
- Row Level Security (RLS) enabled
- Users can only access their own detection results
- Proper indexing for performance

## Function Features

The updated Edge Function includes:

1. **File Validation**: Checks file type and size (max 10MB)
2. **Authentication**: Extracts user ID from Bearer token
3. **Error Handling**: Comprehensive error responses
4. **Realistic Mock Data**: Simulates actual food detection
5. **Database Storage**: Saves detection results to `food_detections` table
6. **CORS Support**: Handles cross-origin requests

## Testing the Setup

1. **Database Test**: Check if the table was created:
   ```sql
   SELECT * FROM food_detections LIMIT 1;
   ```

2. **Function Test**: Upload an image through your frontend
3. **Storage Test**: Verify the model file is accessible:
   ```bash
   supabase storage list models
   ```

## Troubleshooting

### Common Issues:

1. **Function not found**: Make sure you deployed the function correctly
2. **Model file not found**: Verify the model is uploaded to Storage
3. **Database errors**: Check if the migration was applied successfully
4. **CORS errors**: Ensure the function headers are set correctly

### Debug Commands:

```bash
# Check function logs
supabase functions logs detect-food

# Check database status
supabase db status

# List all functions
supabase functions list
```

## Next Steps

1. Integrate the function with your frontend FoodDetection component
2. Replace the mock detection with actual YOLO model inference
3. Add image preprocessing and post-processing
4. Implement caching for better performance
5. Add rate limiting for production use

## Security Considerations

- The function validates file types and sizes
- User authentication is properly handled
- RLS policies ensure data isolation
- Consider adding rate limiting for production
- Monitor function usage and costs 