const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/models', express.static(path.join(__dirname, 'models')));

// Food detection endpoint
app.post('/api/detect-food', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Processing image:', req.file.filename);
    console.log('Using model: best.pt');

    // Simulate AI processing with best.pt model
    // In a real implementation, you would:
    // 1. Load the best.pt model using PyTorch/YOLO
    // 2. Process the uploaded image
    // 3. Return detection results

    // Mock detection results (replace with actual model inference)
    const detectionResults = {
      detectedFoods: [
        { name: 'Apple', confidence: 0.92, calories: 95, bbox: [100, 50, 80, 80] },
        { name: 'Nuts', confidence: 0.87, calories: 180, bbox: [200, 100, 120, 60] },
        { name: 'Milk', confidence: 0.78, calories: 120, bbox: [50, 150, 150, 100] }
      ],
      totalCalories: 395,
      nutrition: {
        carbs: 45,
        protein: 12,
        fat: 18
      },
      modelUsed: 'best.pt',
      processingTime: '2.3s'
    };

    res.json({
      success: true,
      results: detectionResults,
      message: 'Food detection completed successfully'
    });

  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ 
      error: 'Food detection failed',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    model: 'best.pt',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📁 Model path: ${path.join(__dirname, 'models/best.pt')}`);
  console.log(`📸 Upload directory: ${path.join(__dirname, 'uploads')}`);
});

module.exports = app; 