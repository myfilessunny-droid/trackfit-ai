import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, Save, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DetectedFood {
  name: string;
  calories: number;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

const FoodDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDetectedFoods([]);
      setAnalysisComplete(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI detection - replace with actual YOLO model
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock detection results
      const mockResults: DetectedFood[] = [
        { name: "Apple", calories: 95, confidence: 0.92, bbox: { x: 100, y: 50, width: 80, height: 80 } },
        { name: "Banana", calories: 105, confidence: 0.87, bbox: { x: 200, y: 100, width: 120, height: 60 } },
        { name: "Sandwich", calories: 320, confidence: 0.78, bbox: { x: 50, y: 150, width: 150, height: 100 } },
      ];
      
      setDetectedFoods(mockResults);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete! 🎉",
        description: `Found ${mockResults.length} food items with ${mockResults.reduce((sum, food) => sum + food.calories, 0)} total calories`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToJournal = () => {
    toast({
      title: "Saved to Journal! ✅",
      description: "Your meal has been added to your nutrition journal.",
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDetectedFoods([]);
    setAnalysisComplete(false);
  };

  const totalCalories = detectedFoods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Let AI guess your meal 🍱
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a photo of your meal and let our AI identify the foods and calories
            </p>
          </div>

          {/* Upload Area */}
          <Card className="fitness-card p-8 animate-slide-up">
            {!previewUrl ? (
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload a photo of your meal</h3>
                  <p className="text-muted-foreground mb-6">Take a photo or choose from your gallery</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <label className="cursor-pointer">
                      <Button className="hero-button">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    
                    <label className="cursor-pointer">
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Food preview" 
                    className="w-full max-h-96 object-contain rounded-xl shadow-lg"
                  />
                  {/* Bounding boxes for detected foods */}
                  {analysisComplete && detectedFoods.map((food, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-primary bg-primary/20 rounded"
                      style={{
                        left: `${food.bbox.x}px`,
                        top: `${food.bbox.y}px`,
                        width: `${food.bbox.width}px`,
                        height: `${food.bbox.height}px`,
                      }}
                    >
                      <Badge className="absolute -top-6 left-0 bg-primary text-primary-foreground">
                        {food.name}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Analysis Status */}
                {isAnalyzing && (
                  <div className="text-center space-y-4 animate-bounce-in">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Detecting deliciousness... 🍱</h3>
                      <p className="text-muted-foreground">Our AI is analyzing your meal</p>
                    </div>
                    <Progress value={66} className="w-full max-w-sm mx-auto" />
                  </div>
                )}

                {/* Detection Results */}
                {analysisComplete && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Here's what we found:</h3>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        Total: {totalCalories} calories
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {detectedFoods.map((food, index) => (
                        <Card key={index} className="p-4 border-l-4 border-l-primary">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{food.name}</h4>
                            <Badge variant="outline">{Math.round(food.confidence * 100)}%</Badge>
                          </div>
                          <p className="text-2xl font-bold text-primary">{food.calories} kcal</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Another
                  </Button>
                  
                  {!analysisComplete && !isAnalyzing && (
                    <Button
                      onClick={handleAnalyze}
                      className="hero-button flex-1 sm:flex-none"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Analyze Photo
                    </Button>
                  )}
                  
                  {analysisComplete && (
                    <Button
                      onClick={handleSaveToJournal}
                      className="hero-button flex-1 sm:flex-none"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save to Journal
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FoodDetection;