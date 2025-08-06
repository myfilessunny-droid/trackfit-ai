#!/bin/bash

echo "🚀 Render YOLO Deployment Helper"
echo "=================================="

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "yolo_inference_service.py"
    "requirements.txt"
    "runtime.txt"
    "render.yaml"
    "public/models/best.pt"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "✅ All required files present!"
echo ""

# Check if git is initialized and files are committed
echo "🔍 Checking Git status..."
if git status --porcelain | grep -q .; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Consider committing your changes before deploying:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for Render deployment'"
    echo "   git push origin main"
else
    echo "✅ All changes committed"
fi

echo ""
echo "🎯 Ready for Render deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Go to https://render.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New +' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Select 'trackfit-ai' repository"
echo "6. Click 'Apply' to deploy"
echo ""
echo "⏱️  Expected deployment time: 5-10 minutes"
echo ""
echo "🧪 After deployment, test with:"
echo "   python test-render-deployment.py"
echo ""
echo "📚 Full guide: deploy-to-render.md"
echo "📋 Checklist: RENDER_DEPLOYMENT_CHECKLIST.md" 