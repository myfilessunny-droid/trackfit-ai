# TrackFit AI - best.pt Model Integration Guide

## 🎯 Overview

This guide explains how to integrate your `best.pt` YOLO model with the TrackFit AI food detection system.

## 📁 File Structure

```
trackfit-ai/
├── public/models/best.pt          # Model file (upload here)
├── backend/
│   ├── models/best.pt             # Backend model file
│   ├── uploads/                   # Temporary image storage
│   ├── server.js                  # Backend server
│   └── package.json               # Backend dependencies
└── src/pages/FoodDetection.tsx    # Frontend component
```

## 🚀 Setup Instructions

### Step 1: Upload Your best.pt File

**Option A: Frontend (Recommended for testing)**
```bash
# Copy your best.pt file to the public models directory
copy "path\to\your\best.pt" "public\models\best.pt"
```

**Option B: Backend (Recommended for production)**
```bash
# Copy your best.pt file to the backend models directory
copy "path\to\your\best.pt" "backend\models\best.pt"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:3001`

### Step 4: Start the Frontend

```bash
# In a new terminal
npm run dev
```

The frontend will run on `http://localhost:8080`

## 🔧 How It Works

### Frontend (FoodDetection.tsx)
1. **Upload Image**: User selects or takes a photo
2. **Send to Backend**: Image is sent to `http://localhost:3001/api/detect-food`
3. **Display Results**: AI detection results are shown with nutrition info

### Backend (server.js)
1. **Receive Image**: Multer handles file upload
2. **Load Model**: best.pt model is loaded (currently mocked)
3. **Process Image**: YOLO inference on the uploaded image
4. **Return Results**: JSON response with detected foods and nutrition

## 🎯 Model Integration

### Current Implementation (Mock)
The current implementation uses mock results. To integrate your actual best.pt model:

### Python Integration (Recommended)
```python
# backend/detect_food.py
import torch
from PIL import Image
import numpy as np

def load_model():
    model = torch.hub.load('ultralytics/yolov5', 'custom', path='models/best.pt')
    return model

def detect_food(image_path):
    model = load_model()
    results = model(image_path)
    
    # Process results
    detections = []
    for detection in results.xyxy[0]:
        x1, y1, x2, y2, conf, cls = detection
        if conf > 0.5:  # Confidence threshold
            food_name = model.names[int(cls)]
            detections.append({
                'name': food_name,
                'confidence': float(conf),
                'bbox': [float(x1), float(y1), float(x2), float(y2)]
            })
    
    return detections
```

### Node.js Integration
```javascript
// In server.js, replace the mock detection with:
const { spawn } = require('child_process');

app.post('/api/detect-food', upload.single('image'), async (req, res) => {
  try {
    const pythonProcess = spawn('python', ['detect_food.py', req.file.path]);
    
    pythonProcess.stdout.on('data', (data) => {
      const results = JSON.parse(data.toString());
      res.json({ success: true, results });
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });
  } catch (error) {
    res.status(500).json({ error: 'Detection failed' });
  }
});
```

## 🧪 Testing

### Test the Upload Function
1. Go to Food Detection page
2. Click "Choose File" or "Take Photo"
3. Select an image
4. Click "Analyze with AI"
5. View the detection results

### Test the Backend API
```bash
curl -X POST -F "image=@test_image.jpg" http://localhost:3001/api/detect-food
```

## 🔍 Troubleshooting

### Common Issues

**1. Model not found**
```
Error: Cannot find model at backend/models/best.pt
```
**Solution**: Ensure your best.pt file is in the correct directory

**2. Backend connection failed**
```
Error: Failed to fetch from http://localhost:3001
```
**Solution**: 
- Check if backend server is running
- Verify port 3001 is available
- Check CORS settings

**3. File upload issues**
```
Error: No image file provided
```
**Solution**: 
- Check file format (JPG, PNG supported)
- Verify file size (max 10MB)
- Check multer configuration

### Debug Commands

```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Check model file exists
ls -la backend/models/best.pt

# Check uploads directory
ls -la backend/uploads/
```

## 📊 Expected Results

When working correctly, you should see:

1. **Upload Interface**: Clean drag-and-drop area
2. **Analysis Status**: Loading spinner with "Analyzing with AI Model..."
3. **Detection Results**: 
   - Detected food items with confidence scores
   - Total calories
   - Nutrition breakdown (carbs, protein, fat)
   - Model information (best.pt)

## 🚀 Production Deployment

For production, consider:

1. **Model Optimization**: Convert to ONNX or TensorRT
2. **GPU Acceleration**: Use CUDA for faster inference
3. **Caching**: Cache model results
4. **Security**: Add authentication and rate limiting
5. **Monitoring**: Add logging and performance metrics

## 📝 Notes

- The current implementation includes fallback mock results
- Backend server runs on port 3001
- Frontend connects to backend via CORS
- Model file should be in `backend/models/best.pt`
- Uploaded images are stored in `backend/uploads/`

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the backend server logs
3. Verify file paths and permissions
4. Test with a simple image first 