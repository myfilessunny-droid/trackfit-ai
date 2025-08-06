import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/DataContext";
import { Button } from "@/components/ui/button";

// List of valid food classes (filtered, no metadata or non-food entries)
const FOOD_CLASSES = [
  "aloo_methi",
  "aloo_tikki",
  "bandar_laddu",
  "besan_cheela",
  "biryani",
  "butter_chicken",
  "butter_naan",
  "chaat",
  "chapati",
  "chole",
  "dal",
  "dal_makhani",
  "dosa",
  "dum_aloo",
  "gajar_ka_halwa",
  "gulab_jamun",
  "idli",
  "indian_bread",
  "kulfi",
  "palak_paneer",
  "paneer",
  "pani_puri",
  "plain_rice",
  "poha",
  "poori",
  "rajma",
  "rasgulla",
  "sambar",
  "samosa",
  "sheer_korma",
  "upma",
  "uttapam",
  "vada",
  "idly",
  "bisibele_bath",
  "chapathi",
  "chicken_biriyani",
  "kesari_bath",
  "khara_pongal",
  "lemon_rice",
  "non_veg_meals",
  "puliyogare",
  "rave_idli",
  "shavige_payasa",
  "vangi_bath",
  "veg_meals",
  "veg_palav",
  "aapam",
  "banana",
  "banana_chips",
  "biriyani",
  "bonda",
  "chicken_curry",
  "chicken_fry",
  "curd",
  "curd_rice",
  "curry",
  "egg",
  "fish_curry",
  "fish_fry",
  "green_chutney",
  "idiyappam",
  "kurma",
  "papadam",
  "parotta",
  "pickle",
  "podi",
  "pongal",
  "porridge",
  "puttu",
  "rasam",
  "red_chutney",
  "rice",
  "sambar_rice",
  "sauce",
  "sundal",
  "sweet",
  "veggies",
  "white_chutney",
  "appam",
  "beetroot_poriyal",
  "boiled_egg",
  "carrot_poriyal",
  "chicken_65",
  "chicken_briyani",
  "kaara_chutney",
  "kali",
  "koozh",
  "lemon_satham",
  "medu_vadai",
  "mushroom_briyani",
  "mutton_briyani",
  "nandu_masala",
  "nei_satham",
  "paal_kolukattai",
  "paneer_briyani",
  "paneer_masala",
  "parupu_vadai",
  "pidi_kolukattai",
  "poorna_kolukattai",
  "prawn_thokku",
  "puthina_chutney",
  "sambar_satham",
  "satham",
  "thengai_chutney",
  "veg_briyani",
  "ven_pongal",
];

const FoodDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [manualFood, setManualFood] = useState("");
  const [manualQuantity, setManualQuantity] = useState("");
  const [manualPiecesCount, setManualPiecesCount] = useState("");
  const [manualWeightGrams, setManualWeightGrams] = useState("");
  const [manualMealType, setManualMealType] = useState("breakfast");
  const [modelAwake, setModelAwake] = useState(false);
  const [checkingModel, setCheckingModel] = useState(false);
  const [showAwakening, setShowAwakening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  // Ping backend to check if model is awake
  const checkModelAwake = async () => {
    setCheckingModel(true);
    try {
      const res = await fetch("https://trackfit-ai.onrender.com/ping");
      const data = await res.json();
      setModelAwake(data.status === "awake" || data.success);
    } catch {
      setModelAwake(false);
    } finally {
      setCheckingModel(false);
    }
  };

  // Fetch today's meals
  const fetchTodayMeals = async () => {
    if (!user) return;

    setIsLoadingMeals(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today + "T00:00:00")
        .lte("created_at", today + "T23:59:59")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching meals:", error);
      } else {
        setTodayMeals(data || []);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setIsLoadingMeals(false);
    }
  };

  useEffect(() => {
    checkModelAwake();
    fetchTodayMeals();
  }, [user]);

  const uploadToSupabase = async (file: File) => {
    if (!user) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    // Convert file to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("user1pics")
      .upload(fileName, new Uint8Array(arrayBuffer), {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      console.error("Error uploading to Supabase:", error);
      alert("Error uploading image: " + error.message);
      return null;
    }
    return data?.path || null;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDetectionResults(null);
      setAnalysisComplete(false);
      // Upload to Supabase bucket
      await uploadToSupabase(file);
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (previewUrl && detectionResults && detectionResults.detections) {
      const img = document.getElementById(
        "food-preview-img"
      ) as HTMLImageElement;
      const canvas = canvasRef.current;
      if (!img || !canvas) return;
      const draw = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.style.width = img.width + "px";
        canvas.style.height = img.height + "px";
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detectionResults.detections.forEach((det: any) => {
          const [x1, y1, x2, y2] = det.bbox;
          const scaleX = img.width / img.naturalWidth;
          const scaleY = img.height / img.naturalHeight;
          ctx.strokeStyle = "#ff416c";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            x1 * scaleX,
            y1 * scaleY,
            (x2 - x1) * scaleX,
            (y2 - y1) * scaleY
          );
          ctx.font = "16px Segoe UI";
          ctx.fillStyle = "#ff416c";
          const label = `${det.name} ${(det.confidence * 100).toFixed(1)}%`;
          ctx.fillText(label, x1 * scaleX + 2, y1 * scaleY + 18);
        });
      };
      if (img.complete) draw();
      else img.onload = draw;
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [previewUrl, detectionResults]);

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      const base64 = await toBase64(selectedFile);
      // Call Render API
      const response = await fetch("https://trackfit-ai.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, confidence_threshold: 0.5 }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDetectionResults(data);
        setAnalysisComplete(true);
      } else {
        throw new Error(data.error || "Detection failed");
      }
    } catch (error) {
      setDetectionResults(null);
      setAnalysisComplete(false);
      alert("Detection failed: " + (error as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDetectionResults(null);
    setAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Show model awakening message for 5 seconds
  useEffect(() => {
    if (checkingModel) {
      setShowAwakening(true);
      const timer = setTimeout(() => setShowAwakening(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [checkingModel]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Food Detection</h1>
        <p className="text-gray-600">
          Let AI identify your meals and track calories
        </p>
      </div>

      {/* AI Meal Detection Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚖️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Let AI guess your meal
            </h2>
          </div>
          {/* Model status message only, no toggle */}
          {showAwakening && (
            <span className="text-gray-500">
              Awakening model, this may take time. Please wait...
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          Upload a photo and let our AI identify foods and calories
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Upload Area */}
        <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-green-50 mb-6">
          {/* Removed PaperclipButton from top right */}
          {!previewUrl ? (
            <>
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload a photo of your meal
              </h3>
              <p className="text-gray-600 mb-6">
                Take a photo or choose from your gallery
              </p>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleTakePhoto}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span className="text-lg">📷</span>
                  <span className="font-medium">Take Photo</span>
                </button>
                <button
                  onClick={handleChooseFile}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span className="text-lg">📁</span>
                  <span className="font-medium">Choose File</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {previewUrl && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    id="food-preview-img"
                    src={previewUrl}
                    alt="Food preview"
                    className="max-w-md mx-auto rounded-lg shadow-lg"
                    style={{ display: "block" }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              )}
              <div className="flex space-x-4 justify-center">
                {!analysisComplete && !isAnalyzing && (
                  <button
                    onClick={analyzeImage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <span className="text-lg">🤖</span>
                    <span className="font-medium">Analyze with AI</span>
                  </button>
                )}
                <button
                  onClick={resetAnalysis}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <span className="text-lg">🔄</span>
                  <span className="font-medium">Try Another</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analyzing with AI Model...
            </h3>
            <p className="text-gray-600">
              Using best.pt model to detect food items
            </p>
          </div>
        )}
      </div>

      {/* AI Detection Preview */}
      <div className="bg-gray-100 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          AI Detection Preview
        </h3>
        <div className="bg-white rounded-lg p-6">
          {detectionResults && detectionResults.detections ? (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Detected Foods:</h4>
              <ul className="space-y-2">
                {detectionResults.detections.map((det: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="font-mono">{det.name}</span>
                    <span className="text-gray-500">
                      ({(det.confidence * 100).toFixed(1)}%)
                    </span>
                    <button
                      onClick={() => {
                        // Insert into manual entry
                        setManualFood(det.name);
                        setManualQuantity("");
                        setManualPiecesCount("");
                        setManualWeightGrams("");
                        // Focus on quantity input after a short delay
                        setTimeout(() => {
                          const quantityInput = document.querySelector(
                            'input[placeholder="e.g. 2 pieces, 100g"]'
                          ) as HTMLInputElement;
                          if (quantityInput) quantityInput.focus();
                        }, 100);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Add to Entry
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">🤖</div>
              <p>No AI detection results yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Manual Food Entry
        </h3>
        <ManualEntryForm
          onInsert={fetchTodayMeals}
          food={manualFood}
          setFood={setManualFood}
          quantity={manualQuantity}
          setQuantity={setManualQuantity}
          piecesCount={manualPiecesCount}
          setPiecesCount={setManualPiecesCount}
          weightGrams={manualWeightGrams}
          setWeightGrams={setManualWeightGrams}
          mealType={manualMealType}
          setMealType={setManualMealType}
        />
      </div>

      {/* Today's Logged Meals */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Today's Logged Meals
          </h3>
          {todayMeals.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {todayMeals.reduce(
                    (sum, meal) => sum + (meal.calories || 0),
                    0
                  )}
                </div>
                <div className="text-xs text-gray-500">Total kcal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {todayMeals.length}
                </div>
                <div className="text-xs text-gray-500">Meals</div>
              </div>
            </div>
          )}
        </div>
        {isLoadingMeals ? (
          <div className="text-center p-4">
            <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading meals...</p>
          </div>
        ) : todayMeals.length > 0 ? (
          <div className="space-y-4">
            {todayMeals.map((meal, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {meal.food_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 capitalize">
                        {meal.food_name.replace(/_/g, " ")}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {meal.meal_type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(meal.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {meal.calories}
                    </div>
                    <div className="text-xs text-gray-500">kcal</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {meal.quantity && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        General
                      </div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">
                        {meal.quantity}
                      </div>
                    </div>
                  )}
                  {meal.pieces_count && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Pieces
                      </div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">
                        {meal.pieces_count} pcs
                      </div>
                    </div>
                  )}
                  {meal.weight_grams && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Weight
                      </div>
                      <div className="text-sm font-semibold text-gray-800 mt-1">
                        {meal.weight_grams}g
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Logged at {new Date(meal.created_at).toLocaleTimeString()}
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 p-4">
            <div className="text-4xl mb-2">🍽️</div>
            <p>No meals logged today yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetection;

const ManualEntryForm = ({
  onInsert,
  food,
  setFood,
  quantity,
  setQuantity,
  piecesCount,
  setPiecesCount,
  weightGrams,
  setWeightGrams,
  mealType,
  setMealType,
}: {
  onInsert: () => void;
  food: string;
  setFood: (food: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  piecesCount: string;
  setPiecesCount: (piecesCount: string) => void;
  weightGrams: string;
  setWeightGrams: (weightGrams: string) => void;
  mealType: string;
  setMealType: (mealType: string) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleInsert = async () => {
    if (!food.trim() || !user) {
      alert("Please fill in food name");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("food_entries").insert({
        food_name: food,
        quantity: quantity,
        pieces_count: piecesCount ? parseInt(piecesCount) : null,
        weight_grams: weightGrams ? parseFloat(weightGrams) : null,
        meal_type: mealType,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        user_id: user.id,
      });

      if (error) {
        console.error("Error inserting food:", error);
        alert("Error inserting food: " + error.message);
      } else {
        alert(`Successfully logged: ${food} - Meal: ${mealType}`);
        setFood("");
        setQuantity("");
        setPiecesCount("");
        setWeightGrams("");
        setMealType("breakfast");
        onInsert(); // Refresh today's meals
      }
    } catch (error) {
      console.error("Error inserting food:", error);
      alert("Error inserting food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="manual-entry-form" className="space-y-4">
      {/* Food Name and Meal Type */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <select
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select food name</option>
          {FOOD_CLASSES.map((name) => (
            <option key={name} value={name}>
              {name.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="snack">Snack</option>
          <option value="dinner">Dinner</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Quantity Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Removed General Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Pieces
          </label>
          <input
            type="number"
            placeholder="e.g. 3 rotis"
            value={piecesCount}
            onChange={(e) => setPiecesCount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approx Weight (grams)
          </label>
          <input
            type="number"
            placeholder="e.g. 150g"
            value={weightGrams}
            onChange={(e) => setWeightGrams(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Insert Button */}
      <div className="flex justify-end">
        <button
          onClick={handleInsert}
          disabled={isSubmitting}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? "Inserting..." : "Insert Food Entry"}
        </button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p>
          <strong>Note:</strong> Calories, protein, carbs, and fat are set to 0
          by default. You can update these values later.
        </p>
      </div>
    </div>
  );
};
