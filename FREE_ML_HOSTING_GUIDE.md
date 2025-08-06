# 🆓 FREE ML Model Hosting Guide for YOLO

## 🎯 Best FREE Alternatives to Railway

Since Railway's free tier is limited, here are the **BEST FREE** options for hosting your YOLO ML model:

---

## 🥇 **Render.com** (RECOMMENDED)

### ✅ **Why Render is Best:**
- **100% FREE** for web services
- **512MB RAM** + **0.1 CPU** (enough for YOLO)
- **750 hours/month** free tier
- **Auto-sleep** after 15 minutes of inactivity
- **Easy deployment** from GitHub
- **Custom domains** supported

### 🚀 **Deploy to Render:**

#### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Create new account

#### Step 2: Deploy Web Service
1. Click **"New Web Service"**
2. Connect your GitHub repository
3. Configure settings:
   ```
   Name: yolo-food-detection
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python yolo_inference_service.py
   ```

#### Step 3: Environment Variables
Add these in Render dashboard:
```
PORT=10000
HOST=0.0.0.0
```

#### Step 4: Get Your URL
Render provides: `https://your-app-name.onrender.com`

---

## 🥈 **Vercel** (Alternative)

### ✅ **Vercel Benefits:**
- **100% FREE** serverless functions
- **10GB bandwidth** per month
- **100GB-hours** compute time
- **Auto-scaling**
- **Global CDN**

### 🚀 **Deploy to Vercel:**

#### Step 1: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub

#### Step 2: Create `vercel.json`
```json
{
  "functions": {
    "api/yolo.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    {
      "src": "/api/yolo",
      "dest": "/api/yolo.py"
    }
  ]
}
```

#### Step 3: Create API Route
Create `api/yolo.py`:
```python
from http.server import BaseHTTPRequestHandler
import json
import base64
from PIL import Image
import io
import torch
from ultralytics import YOLO

# Load model (will be cached)
model = YOLO('public/models/best.pt')

def predict_food(image_data, confidence=0.5):
    # Convert base64 to image
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))
    
    # Predict
    results = model.predict(image, conf=confidence, verbose=False)
    
    detections = []
    for result in results:
        boxes = result.boxes
        if boxes is not None:
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = box.conf[0].cpu().numpy()
                class_id = int(box.cls[0].cpu().numpy())
                class_name = result.names[class_id]
                
                detections.append({
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": float(confidence),
                    "name": class_name,
                    "class_id": class_id
                })
    
    return detections

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Handle CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Get request data
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Process image
        base64_image = data.get('image')
        confidence = data.get('confidence_threshold', 0.5)
        
        if base64_image:
            detections = predict_food(base64_image, confidence)
            response = {
                "success": True,
                "detections": detections,
                "total_detections": len(detections)
            }
        else:
            response = {
                "success": False,
                "error": "No image provided"
            }
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
```

#### Step 4: Deploy
```bash
npm install -g vercel
vercel --prod
```

---

## 🥉 **Heroku** (Legacy Free)

### ⚠️ **Note:** Heroku removed free tier, but here's how it would work:

#### Step 1: Create Heroku Account
1. Go to [Heroku.com](https://heroku.com)
2. Sign up (requires credit card for verification)

#### Step 2: Create `Procfile`
```
web: python yolo_inference_service.py
```

#### Step 3: Deploy
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
```

---

## 🆓 **Other FREE Options:**

### **1. Google Cloud Run (Free Tier)**
- **2 million requests/month** free
- **360,000 vCPU-seconds** free
- **180,000 GiB-seconds** memory free

### **2. AWS Lambda (Free Tier)**
- **1 million requests/month** free
- **400,000 GB-seconds** compute time
- **15GB** storage

### **3. Azure Functions (Free Tier)**
- **1 million requests/month** free
- **400,000 GB-seconds** compute time

---

## 🎯 **RECOMMENDED APPROACH:**

### **Option 1: Render (Easiest)**
```bash
# 1. Deploy to Render
# 2. Get URL: https://your-app.onrender.com
# 3. Update Edge Function:
const yoloApiUrl = 'https://your-app.onrender.com/predict'
```

### **Option 2: Vercel (Most Scalable)**
```bash
# 1. Deploy to Vercel
# 2. Get URL: https://your-app.vercel.app/api/yolo
# 3. Update Edge Function:
const yoloApiUrl = 'https://your-app.vercel.app/api/yolo'
```

---

## 🔧 **Updated Edge Function Configuration**

After deploying to any free platform, update your Edge Function:

```typescript
// In supabase/functions/detect-food/index.ts
const yoloApiUrl = Deno.env.get('YOLO_API_URL') || 'https://your-app.onrender.com/predict'
```

Set environment variable in Supabase:
- **Key:** `YOLO_API_URL`
- **Value:** `https://your-app.onrender.com/predict`

---

## 🧪 **Testing Your Free Deployment**

### **Health Check:**
```bash
curl https://your-app.onrender.com/health
```

### **Prediction Test:**
```bash
curl -X POST https://your-app.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image_here",
    "confidence_threshold": 0.5
  }'
```

---

## 💡 **Pro Tips for Free Hosting:**

### **1. Optimize Model Size**
- Use quantized models
- Compress model files
- Use smaller model variants

### **2. Handle Cold Starts**
- Add health check endpoints
- Implement request queuing
- Use keep-alive strategies

### **3. Monitor Usage**
- Track request counts
- Monitor response times
- Set up alerts for limits

### **4. Backup Strategy**
- Deploy to multiple platforms
- Use different free tiers
- Have fallback services

---

## 🎉 **Success Checklist:**

✅ **Choose Render or Vercel** (both 100% free)
✅ **Deploy your YOLO service**
✅ **Update Edge Function URL**
✅ **Test with your `roti.jpg`**
✅ **Monitor performance**
✅ **Set up alerts for usage limits**

**Your YOLO model will run completely FREE!** 🆓✨ 