# 🚀 Deploy YOLO Model to Render - Step by Step

## 📋 **Prerequisites**
- ✅ GitHub account
- ✅ Your `trackfit-ai` repository on GitHub
- ✅ All files committed to GitHub

## 🎯 **Step 1: Create Render Account**

1. **Go to [Render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with GitHub** (recommended)
4. **Complete account setup**

## 🚀 **Step 2: Deploy Your Service**

### **Option A: Using render.yaml (Recommended)**

1. **In Render Dashboard:**
   - Click **"New +"**
   - Select **"Blueprint"**
   - Connect your GitHub repository
   - Select `trackfit-ai` repository
   - Render will automatically detect `render.yaml`

2. **Deploy:**
   - Click **"Apply"**
   - Render will automatically configure everything
   - Wait for build to complete (5-10 minutes)

### **Option B: Manual Configuration**

1. **In Render Dashboard:**
   - Click **"New +"**
   - Select **"Web Service"**
   - Connect your GitHub repository

2. **Configure Settings:**
   ```
   Name: yolo-food-detection
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python yolo_inference_service.py
   ```

3. **Add Environment Variables:**
   - Click **"Environment"** tab
   - Add:
     - **Key:** `PORT` | **Value:** `10000`
     - **Key:** `HOST` | **Value:** `0.0.0.0`

4. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for build to complete

## 🔍 **Step 3: Monitor Deployment**

### **Check Build Logs:**
- Watch the build process in Render dashboard
- Look for these success messages:
  ```
  ✅ Installing dependencies...
  ✅ Model loading successfully...
  ✅ Service started on port 10000
  ```

### **Expected Timeline:**
- **Build:** 5-10 minutes
- **Model Loading:** 2-3 minutes
- **Service Ready:** 1-2 minutes

## 🧪 **Step 4: Test Your Deployment**

### **Get Your URL:**
Render will provide: `https://your-app-name.onrender.com`

### **Test Health Check:**
```bash
curl https://your-app-name.onrender.com/health
```

**Expected Response:**
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

### **Test Prediction:**
```bash
curl -X POST https://your-app-name.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image_here",
    "confidence_threshold": 0.5
  }'
```

## 🔧 **Step 5: Update Edge Function**

Once your Render service is working, update your Supabase Edge Function:

### **1. Get Your Render URL:**
```
https://your-app-name.onrender.com/predict
```

### **2. Update Edge Function:**
```typescript
// In supabase/functions/detect-food/index.ts
const yoloApiUrl = Deno.env.get('YOLO_API_URL') || 'https://your-app-name.onrender.com/predict'
```

### **3. Set Environment Variable in Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Settings → Edge Functions**
3. Add environment variable:
   - **Key:** `YOLO_API_URL`
   - **Value:** `https://your-app-name.onrender.com/predict`

### **4. Redeploy Edge Function:**
```bash
supabase functions deploy detect-food --no-verify-jwt
```

## 🎉 **Step 6: Test End-to-End**

1. **Upload an image** in your web app
2. **Check if detections work**
3. **Monitor Render logs** for any issues

## 🔍 **Troubleshooting**

### **Issue 1: Build Fails**
- Check if `requirements.txt` is correct
- Verify `best.pt` model file exists
- Check Python version compatibility

### **Issue 2: Model Not Loading**
- Check Render logs for model loading errors
- Verify model file path: `public/models/best.pt`
- Check model file size (should be committed to GitHub)

### **Issue 3: Service Timeout**
- Render free tier has 15-minute auto-sleep
- First request after sleep will be slower
- Consider upgrading for production

### **Issue 4: CORS Errors**
- Check if CORS headers are set correctly
- Verify Edge Function is calling correct URL
- Test with curl first

## 📊 **Monitoring Your Service**

### **Render Dashboard:**
- **Logs:** Real-time application logs
- **Metrics:** CPU, Memory usage
- **Deployments:** Build history
- **Health:** Service status

### **Health Check:**
```bash
# Check service health
curl https://your-app-name.onrender.com/health

# Check if model is loaded
curl https://your-app-name.onrender.com/
```

## 🎯 **Success Indicators**

✅ **Render service deployed successfully**
✅ **Health check returns `model_loaded: true`**
✅ **Prediction endpoint responds correctly**
✅ **Edge Function updated with new URL**
✅ **End-to-end test works with your app**

**Your YOLO model is now running FREE on Render!** 🆓✨ 