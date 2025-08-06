import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Model configuration
const MODEL_CONFIG = {
  modelPath: '/models/best.pt',
  confidenceThreshold: 0.5,
  maxDetections: 10
}

serve(async (req) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🔍 [${requestId}] Request started:`, {
    method: req.method,
    url: req.url,
    contentType: req.headers.get('content-type'),
    contentLength: req.headers.get('content-length'),
    userAgent: req.headers.get('user-agent')
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`🔍 [${requestId}] CORS preflight request`);
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(`🔍 [${requestId}] Starting request processing...`);

    let imageFile: File | null = null
    const contentType = req.headers.get('content-type') || ''

    console.log(`🔍 [${requestId}] Content-Type: ${contentType}`);

    // Handle different content types
    if (contentType.includes('multipart/form-data')) {
      console.log(`🔍 [${requestId}] Processing multipart/form-data...`);
      
      // Handle form data (file upload)
      const formData = await req.formData()
      console.log(`🔍 [${requestId}] FormData received, entries:`, Array.from(formData.entries()).map(([key, value]) => [key, typeof value]));
      
      imageFile = formData.get('image') as File
      console.log(`🔍 [${requestId}] Image file extracted:`, imageFile ? {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      } : 'null');
      
    } else if (contentType.includes('application/json')) {
      console.log(`🔍 [${requestId}] Processing application/json...`);
      
      // Handle JSON data (for testing)
      const jsonData = await req.json()
      console.log(`🔍 [${requestId}] JSON data received, keys:`, Object.keys(jsonData));
      
      // For JSON, we expect base64 image data
      if (jsonData.image) {
        console.log(`🔍 [${requestId}] Base64 image found, length:`, jsonData.image.length);
        
        // Create a File object from base64 data
        const base64Data = jsonData.image
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
        imageFile = new File([binaryData], 'image.jpg', { type: 'image/jpeg' })
        console.log(`🔍 [${requestId}] Base64 image converted to File:`, {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });
      } else {
        console.log(`🔍 [${requestId}] No image found in JSON data`);
      }
    } else {
      console.log(`🔍 [${requestId}] Unsupported content type: ${contentType}`);
      return new Response(
        JSON.stringify({ 
          error: 'Unsupported content type',
          details: `Expected multipart/form-data or application/json, got: ${contentType}`,
          supportedTypes: ['multipart/form-data', 'application/json'],
          requestId: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!imageFile) {
      console.log(`🔍 [${requestId}] No image file provided`);
      return new Response(
        JSON.stringify({ 
          error: 'No image file provided',
          details: 'Please upload an image file or provide base64 image data',
          contentType: contentType,
          requestId: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`🔍 [${requestId}] Image file validation starting...`);

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      console.log(`🔍 [${requestId}] Invalid file type: ${imageFile.type}`);
      return new Response(
        JSON.stringify({ 
          error: 'File must be an image',
          details: `Received file type: ${imageFile.type}`,
          requestId: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      console.log(`🔍 [${requestId}] File too large: ${imageFile.size} bytes`);
      return new Response(
        JSON.stringify({ 
          error: 'Image file too large. Maximum size is 10MB',
          details: `File size: ${imageFile.size} bytes`,
          requestId: requestId
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`🔍 [${requestId}] Image validation passed:`, {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    // Convert image to base64 for processing
    console.log(`🔍 [${requestId}] Converting image to base64...`);
    let base64Image: string;
    try {
      const imageBuffer = await imageFile.arrayBuffer()
      console.log(`🔍 [${requestId}] Image buffer created, size:`, imageBuffer.byteLength);
      
      base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
      console.log(`🔍 [${requestId}] Image converted to base64, length:`, base64Image.length);
    } catch (error) {
      console.error(`🔍 [${requestId}] Error converting image to base64:`, error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process image',
          details: error.message,
          requestId: requestId
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Process image with actual YOLO model
    console.log(`🔍 [${requestId}] Starting YOLO processing...`);
    const detectionResults = await processImageWithYOLO(base64Image, imageFile, requestId)

    // Return results directly (no authentication required for testing)
    console.log(`🔍 [${requestId}] Processing completed, returning results:`, detectionResults);

    return new Response(
      JSON.stringify({
        success: true,
        results: detectionResults,
        message: 'Food detection completed successfully',
        database_id: null,
        user_authenticated: false,
        model_info: {
          model_used: 'best.pt',
          confidence_threshold: MODEL_CONFIG.confidenceThreshold,
          processing_time: detectionResults.processingTime
        },
        requestId: requestId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error(`🔍 [${requestId}] Detection error:`, error);
    return new Response(
      JSON.stringify({ 
        error: 'Food detection failed',
        details: error.message,
        stack: error.stack,
        requestId: requestId
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Process image with actual YOLO model
async function processImageWithYOLO(base64Image: string, imageFile: File, requestId: string) {
  const startTime = Date.now()
  
  try {
    console.log(`🔍 [${requestId}] YOLO processing started...`);
    
    // Get YOLO API URL from environment or use Render endpoint
    const yoloApiUrl = Deno.env.get('YOLO_API_URL') || 'https://trackfit-ai.onrender.com/predict'
    const yoloApiKey = Deno.env.get('YOLO_API_KEY') || ''
    
    console.log(`🔍 [${requestId}] YOLO service URL:`, yoloApiUrl);
    console.log(`🔍 [${requestId}] API Key provided:`, !!yoloApiKey);

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (yoloApiKey) {
      headers['Authorization'] = `Bearer ${yoloApiKey}`
    }

    console.log(`🔍 [${requestId}] Making request to YOLO service...`);
    console.log(`🔍 [${requestId}] Request headers:`, headers);
    console.log(`🔍 [${requestId}] Request payload size:`, JSON.stringify({
      image: base64Image.substring(0, 100) + '...',
      confidence_threshold: MODEL_CONFIG.confidenceThreshold,
      model: 'best.pt'
    }).length);

    const response = await fetch(yoloApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image: base64Image,
        confidence_threshold: MODEL_CONFIG.confidenceThreshold,
        model: 'best.pt'
      })
    })

    console.log(`🔍 [${requestId}] YOLO response received:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`🔍 [${requestId}] YOLO API request failed:`, response.status, errorText);
      throw new Error(`YOLO API request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const yoloResult = await response.json()
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log(`🔍 [${requestId}] YOLO result received:`, {
      detections: yoloResult.detections?.length || 0,
      success: yoloResult.success,
      model_used: yoloResult.model_used,
      processingTime: processingTime
    });

    // Return raw YOLO detections without nutrition mapping
    const rawDetections = yoloResult.detections?.map((detection: any) => ({
      name: detection.name,
      confidence: detection.confidence,
      bbox: detection.bbox,
      class_id: detection.class_id
    })) || []

    console.log(`🔍 [${requestId}] Raw detections processed:`, rawDetections.length);

    return {
      detectedFoods: rawDetections,
      totalDetections: rawDetections.length,
      modelUsed: 'best.pt',
      processingTime: `${processingTime}s`,
      imageSize: imageFile.size,
      imageType: imageFile.type,
      confidenceThreshold: MODEL_CONFIG.confidenceThreshold,
      rawYoloResults: yoloResult.detections || [], // Include complete raw results
      yoloServiceUrl: yoloApiUrl,
      yoloResponse: yoloResult,
      requestId: requestId
    }

  } catch (error) {
    console.error(`🔍 [${requestId}] YOLO processing error:`, error);
    
    // Fallback to basic detection if YOLO fails
    const fallbackTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`🔍 [${requestId}] Using fallback response, time: ${fallbackTime}s`);
    
    return {
      detectedFoods: [],
      totalDetections: 0,
      modelUsed: 'best.pt (fallback)',
      processingTime: `${fallbackTime}s`,
      imageSize: imageFile.size,
      imageType: imageFile.type,
      confidenceThreshold: MODEL_CONFIG.confidenceThreshold,
      error: error.message,
      errorStack: error.stack,
      requestId: requestId
    }
  }
}