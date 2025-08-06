# YOLO Inference Service Setup Guide

## Overview
This guide explains how to set up the YOLO inference service that will process images with your `best.pt` model and provide real detection results to the Edge Function.

## Prerequisites
- Python 3.8+ installed
- Your `best.pt` model file in `public/models/`
- pip package manager

## Step 1: Install Dependencies

```bash
# Install required Python packages
pip install -r requirements.txt
```

## Step 2: Verify Model File

Make sure your `best.pt` model is in the correct location:
```
trackfit-ai/
├── public/
│   └── models/
│       └── best.pt  ← Your trained YOLO model
├── yolo_inference_service.py
└── requirements.txt
```

## Step 3: Start the YOLO Service

```bash
# Start the YOLO inference service
python yolo_inference_service.py
```

You should see output like:
```
🚀 Starting YOLO Inference Service...
📁 Model path: public/models/best.pt
🔗 API endpoint: http://localhost:5000/predict
💚 Health check: http://localhost:5000/health
✅ YOLO model loaded successfully
 * Running on http://0.0.0.0:5000
```

## Step 4: Test the Service

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "public/models/best.pt"
}
```

### Test with an Image
```bash
# Convert image to base64 and test
python -c "
import base64
import requests
import json

# Read and encode image
with open('test_image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# Send request
response = requests.post('http://localhost:5000/predict', 
    json={'image': image_data, 'confidence_threshold': 0.5})

print(json.dumps(response.json(), indent=2))
"
```

## Step 5: Update Edge Function Environment

Set the YOLO service URL in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to Settings → Edge Functions
3. Add environment variable:
   - Key: `YOLO_API_URL`
   - Value: `http://localhost:5000/predict`

## Step 6: Test the Complete Flow

1. **Start the YOLO service**: `python yolo_inference_service.py`
2. **Open test dashboard**: `public/test-dashboard.html`
3. **Upload an image** and test the Edge Function
4. **Check results** - you should now see real detections from your `best.pt` model!

## Troubleshooting

### Model Loading Issues
- Ensure `best.pt` exists in `public/models/`
- Check that the model file is not corrupted
- Verify PyTorch and ultralytics are installed correctly

### Service Connection Issues
- Make sure the service is running on port 5000
- Check firewall settings
- Verify the URL in Edge Function environment variables

### Detection Issues
- Adjust confidence threshold (default: 0.5)
- Check model class names match your training data
- Verify image format (JPEG/PNG supported)

## Production Deployment

For production, you can:

1. **Deploy to a cloud service** (Heroku, Railway, etc.)
2. **Use a cloud ML service** (Google Cloud ML, AWS SageMaker)
3. **Set up a dedicated server** with the YOLO service

Update the `YOLO_API_URL` environment variable in Supabase to point to your production service.

## API Endpoints

### POST /predict
Process an image and return detections.

**Request:**
```json
{
  "image": "base64_encoded_image_data",
  "confidence_threshold": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "name": "apple",
      "confidence": 0.92,
      "bbox": [100, 150, 50, 60]
    }
  ],
  "model_used": "best.pt",
  "confidence_threshold": 0.5
}
```

### GET /health
Check service status and model loading.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "public/models/best.pt"
}
```

## Next Steps

1. ✅ **Test locally** with the YOLO service
2. ✅ **Verify detections** match your model's training
3. ✅ **Deploy to production** when ready
4. ✅ **Monitor performance** and adjust as needed

Your Edge Function will now use real YOLO detections instead of dummy data! 🎉 