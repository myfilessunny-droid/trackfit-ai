#!/usr/bin/env python3
"""
🍕 YOLO Food Detection Service
Cloud-ready YOLO inference service for food detection
"""

import os
import base64
import io
import json
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
model_loaded = False
model_info = {}

def load_model():
    """Load the YOLO model"""
    global model, model_loaded, model_info
    
    try:
        print("🔄 Loading YOLO model...")
        
        # Try YOLOv8 first
        try:
            from ultralytics import YOLO
            model = YOLO('public/models/best.pt')
            model_loaded = True
            model_info = {
                "model_type": "YOLOv8",
                "model_path": "public/models/best.pt",
                "loaded_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            print("✅ YOLOv8 model loaded successfully")
            return True
        except Exception as e:
            print(f"❌ YOLOv8 loading failed: {e}")
            
            # Try YOLOv5 as fallback
            try:
                model = torch.hub.load('ultralytics/yolov5', 'custom', path='public/models/best.pt', force_reload=True)
                model.eval()
                model_loaded = True
                model_info = {
                    "model_type": "YOLOv5",
                    "model_path": "public/models/best.pt",
                    "loaded_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                print("✅ YOLOv5 model loaded successfully")
                return True
            except Exception as e2:
                print(f"❌ YOLOv5 loading also failed: {e2}")
                model_loaded = False
                return False
                
    except Exception as e:
        print(f"❌ Model loading error: {e}")
        model_loaded = False
        return False

def base64_to_image(base64_string):
    """Convert base64 string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        return image
    except Exception as e:
        print(f"❌ Base64 to image conversion error: {e}")
        return None

def predict_food(image, confidence_threshold=0.5):
    """Predict food items in the image"""
    global model, model_loaded
    
    if not model_loaded or model is None:
        return {
            "success": False,
            "error": "Model not loaded",
            "detections": []
        }
    
    try:
        # Convert PIL image to format expected by model
        if hasattr(model, 'predict'):  # YOLOv8
            results = model.predict(image, conf=confidence_threshold, verbose=False)
            detections = []
            
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        confidence = box.conf[0].cpu().numpy()
                        class_id = int(box.cls[0].cpu().numpy())
                        
                        # Get class name
                        class_name = result.names[class_id] if hasattr(result, 'names') else f"class_{class_id}"
                        
                        detections.append({
                            "bbox": [float(x1), float(y1), float(x2), float(y2)],
                            "confidence": float(confidence),
                            "name": class_name,
                            "class_id": class_id
                        })
        else:  # YOLOv5
            results = model(image)
            detections = []
            
            for *xyxy, conf, cls in results.xyxy[0]:
                if conf >= confidence_threshold:
                    x1, y1, x2, y2 = xyxy
                    class_id = int(cls)
                    class_name = model.names[class_id] if hasattr(model, 'names') else f"class_{class_id}"
                    
                    detections.append({
                        "bbox": [float(x1), float(y1), float(x2), float(y2)],
                        "confidence": float(conf),
                        "name": class_name,
                        "class_id": class_id
                    })
        
        return {
            "success": True,
            "detections": detections,
            "model_used": model_info.get("model_type", "Unknown"),
            "confidence_threshold": confidence_threshold,
            "total_detections": len(detections)
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return {
            "success": False,
            "error": str(e),
            "detections": []
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_info": model_info,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict food items in uploaded image"""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        # Extract parameters
        base64_image = data.get('image')
        confidence_threshold = data.get('confidence_threshold', 0.5)
        model_name = data.get('model', 'best.pt')
        
        if not base64_image:
            return jsonify({
                "success": False,
                "error": "No image provided"
            }), 400
        
        # Convert base64 to image
        image = base64_to_image(base64_image)
        if image is None:
            return jsonify({
                "success": False,
                "error": "Invalid image data"
            }), 400
        
        # Perform prediction
        start_time = time.time()
        result = predict_food(image, confidence_threshold)
        processing_time = time.time() - start_time
        
        # Add processing time to result
        result["processing_time"] = round(processing_time, 3)
        result["image_size"] = len(base64_image)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Prediction endpoint error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "service": "YOLO Food Detection API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict"
        },
        "model_loaded": model_loaded
    })

if __name__ == '__main__':
    # Load model on startup
    load_model()
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f"🚀 Starting YOLO Food Detection Service")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🤖 Model loaded: {model_loaded}")
    
    app.run(host=host, port=port, debug=False) 