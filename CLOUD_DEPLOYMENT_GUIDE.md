# 🚀 Cloud Deployment Guide for YOLO Service

## 📋 Overview
This guide will help you deploy the YOLO food detection service to Railway cloud platform so the Edge Function can reach it.

## 🎯 Why Cloud Deployment?
- **Edge Function (Cloud)** ❌ Cannot reach → **YOLO Service (Local)**
- **Edge Function (Cloud)** ✅ Can reach → **YOLO Service (Cloud)**

## 🚀 Railway Deployment (Recommended)

### Step 1: Prepare Your Repository
1. Make sure you have these files in your project:
   - `yolo_inference_service.py` ✅
   - `requirements.txt` ✅
   - `Procfile` ✅
   - `runtime.txt` ✅
   - `railway.json` ✅
   - `public/models/best.pt` ✅

### Step 2: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 3: Deploy to Railway
1. **Connect Repository:**
   - Click "Deploy from GitHub repo"
   - Select your `trackfit-ai` repository
   - Railway will automatically detect it's a Python project

2. **Configure Environment:**
   - Railway will automatically install dependencies from `requirements.txt`
   - The service will start using the `Procfile`

3. **Get Your URL:**
   - Railway will provide a URL like: `https://your-app-name.railway.app`
   - This is your **YOLO API URL**

### Step 4: Update Edge Function
Once deployed, update the Edge Function with the new URL:

```typescript
// In supabase/functions/detect-food/index.ts
const yoloApiUrl = Deno.env.get('YOLO_API_URL') || 'https://your-app-name.railway.app/predict'
```

### Step 5: Set Environment Variable
1. Go to your Supabase dashboard
2. Navigate to Settings → Edge Functions
3. Add environment variable:
   - **Key:** `YOLO_API_URL`
   - **Value:** `https://your-app-name.railway.app/predict`

### Step 6: Redeploy Edge Function
```bash
supabase functions deploy detect-food --no-verify-jwt
```

## 🔧 Alternative: Render Deployment

If Railway doesn't work, try Render:

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy to Render
1. Click "New Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `yolo-food-detection`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python yolo_inference_service.py`

### Step 3: Get Your URL
- Render will provide: `https://your-app-name.onrender.com`
- Use this as your YOLO API URL

## 🧪 Testing Deployment

### Test 1: Health Check
```bash
curl https://your-app-name.railway.app/health
```
Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_info": {
    "model_type": "YOLOv8",
    "model_path": "public/models/best.pt"
  }
}
```

### Test 2: Prediction Test
```bash
curl -X POST https://your-app-name.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image_here",
    "confidence_threshold": 0.5,
    "model": "best.pt"
  }'
```

## 🔍 Troubleshooting

### Issue 1: Model Not Loading
- Check if `best.pt` is in the correct path
- Verify the model file is committed to GitHub
- Check Railway logs for model loading errors

### Issue 2: Build Failures
- Ensure all dependencies are in `requirements.txt`
- Check Python version compatibility
- Verify file paths are correct

### Issue 3: Timeout Issues
- Railway has a 5-minute timeout for free tier
- Consider upgrading for longer processing times

## 📊 Monitoring

### Railway Dashboard
- Monitor CPU/Memory usage
- Check logs for errors
- View deployment status

### Health Checks
- The service has a `/health` endpoint
- Railway will automatically restart if health checks fail

## 🎉 Success Indicators

✅ **YOLO Service Deployed:**
- Health check returns `model_loaded: true`
- Prediction endpoint responds correctly

✅ **Edge Function Updated:**
- Environment variable set correctly
- Edge Function redeployed

✅ **End-to-End Test:**
- Upload image through your app
- Get real detections from cloud YOLO service

## 🚀 Next Steps

1. **Deploy YOLO service to Railway**
2. **Update Edge Function with new URL**
3. **Test with your `roti.jpg` image**
4. **Verify detections work end-to-end**

Your food detection system will then work completely in the cloud! 🎉 