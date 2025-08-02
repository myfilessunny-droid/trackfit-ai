import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const formData = await req.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert image to base64 for processing
    const imageBuffer = await imageFile.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))

    // Simulate AI processing with best.pt model
    // In production, you would:
    // 1. Load the best.pt model (stored in Supabase Storage)
    // 2. Process the image using PyTorch/YOLO
    // 3. Return detection results

    // Mock detection results (replace with actual model inference)
    const detectionResults = {
      detectedFoods: [
        { 
          name: 'Apple', 
          confidence: 0.92, 
          calories: 95, 
          bbox: [100, 50, 80, 80] 
        },
        { 
          name: 'Nuts', 
          confidence: 0.87, 
          calories: 180, 
          bbox: [200, 100, 120, 60] 
        },
        { 
          name: 'Milk', 
          confidence: 0.78, 
          calories: 120, 
          bbox: [50, 150, 150, 100] 
        }
      ],
      totalCalories: 395,
      nutrition: {
        carbs: 45,
        protein: 12,
        fat: 18
      },
      modelUsed: 'best.pt',
      processingTime: '2.3s',
      imageSize: imageFile.size,
      imageType: imageFile.type
    }

    // Store the detection result in Supabase database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: insertData, error: insertError } = await supabaseClient
      .from('food_detections')
      .insert({
        user_id: req.headers.get('user-id') || 'anonymous',
        image_name: imageFile.name,
        image_size: imageFile.size,
        detection_results: detectionResults,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: detectionResults,
        message: 'Food detection completed successfully',
        database_id: insertData?.[0]?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Detection error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Food detection failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 