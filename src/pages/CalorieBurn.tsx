import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Save, 
  RotateCcw, 
  Activity,
  Footprints,
  Bike,
  Waves,
  Dumbbell,
  Music,
  Target,
  Zap,
  Trophy,
  Timer,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  name: string;
  icon: React.ReactNode;
  met: number;
  intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
}

const gymActivities: Activity[] = [
  { name: "Bench Press", icon: <Dumbbell className="w-5 h-5" />, met: 6.0, intensity: 'Moderate', description: 'Chest, shoulders, triceps compound exercise' },
  { name: "Deadlifts", icon: <Dumbbell className="w-5 h-5" />, met: 6.5, intensity: 'High', description: 'Full-body compound movement, posterior chain focus' },
  { name: "Squats", icon: <Dumbbell className="w-5 h-5" />, met: 6.0, intensity: 'Moderate', description: 'Lower body compound exercise, quadriceps focus' },
  { name: "Pull-ups", icon: <Dumbbell className="w-5 h-5" />, met: 7.0, intensity: 'High', description: 'Upper body bodyweight exercise, back and biceps' },
  { name: "Dumbbell Training", icon: <Dumbbell className="w-5 h-5" />, met: 5.5, intensity: 'Moderate', description: 'Isolated muscle training with dumbbells' },
  { name: "Barbell Rows", icon: <Dumbbell className="w-5 h-5" />, met: 6.0, intensity: 'Moderate', description: 'Back compound exercise, rhomboids and lats' },
  { name: "Overhead Press", icon: <Dumbbell className="w-5 h-5" />, met: 5.8, intensity: 'Moderate', description: 'Shoulder compound exercise, core stability' },
  { name: "Lat Pulldowns", icon: <Dumbbell className="w-5 h-5" />, met: 5.5, intensity: 'Moderate', description: 'Vertical pulling movement, latissimus dorsi' },
  { name: "CrossFit WOD", icon: <Target className="w-5 h-5" />, met: 8.5, intensity: 'Extreme', description: 'High-intensity varied functional movements' },
  { name: "HIIT Training", icon: <Zap className="w-5 h-5" />, met: 9.0, intensity: 'Extreme', description: 'High-intensity interval training protocol' },
  { name: "Circuit Training", icon: <Activity className="w-5 h-5" />, met: 7.5, intensity: 'High', description: 'Multiple exercises with minimal rest periods' },
  { name: "Functional Training", icon: <Activity className="w-5 h-5" />, met: 7.0, intensity: 'High', description: 'Real-world movement patterns and stability' },
  { name: "Cable Exercises", icon: <Dumbbell className="w-5 h-5" />, met: 5.5, intensity: 'Moderate', description: 'Constant tension resistance training' },
  { name: "Machine Weights", icon: <Dumbbell className="w-5 h-5" />, met: 5.0, intensity: 'Low', description: 'Guided resistance training with machines' },
  { name: "Kettlebell Training", icon: <Dumbbell className="w-5 h-5" />, met: 8.0, intensity: 'High', description: 'Dynamic ballistic and grinding movements' },
  { name: "Battle Ropes", icon: <Waves className="w-5 h-5" />, met: 8.5, intensity: 'High', description: 'High-intensity rope training, core and cardio' },
];

const cardioActivities: Activity[] = [
  { name: "Treadmill Running", icon: <Activity className="w-5 h-5" />, met: 8.0, intensity: 'High', description: 'Steady-state or interval running cardio' },
  { name: "Elliptical", icon: <Activity className="w-5 h-5" />, met: 7.0, intensity: 'Moderate', description: 'Low-impact full-body cardio machine' },
  { name: "Stationary Bike", icon: <Bike className="w-5 h-5" />, met: 6.5, intensity: 'Moderate', description: 'Cycling cardio with adjustable resistance' },
  { name: "Rowing Machine", icon: <Waves className="w-5 h-5" />, met: 8.5, intensity: 'High', description: 'Full-body cardio with pulling motion' },
  { name: "Stair Climber", icon: <Activity className="w-5 h-5" />, met: 9.0, intensity: 'High', description: 'Vertical climbing cardio machine' },
  { name: "Swimming", icon: <Waves className="w-5 h-5" />, met: 7.0, intensity: 'Moderate', description: 'Full-body low-impact aquatic exercise' },
];

const CalorieBurn = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [weight, setWeight] = useState<number>(70);
  const [duration, setDuration] = useState<number[]>([30]);
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'gym' | 'cardio'>('gym');
  const { toast } = useToast();

  const currentActivities = activeCategory === 'gym' ? gymActivities : cardioActivities;

  const calculateCalories = () => {
    if (!selectedActivity || !weight || duration[0] < 5) {
      toast({
        title: "Invalid input",
        description: "Please select an activity, enter your weight, and ensure duration is at least 5 minutes.",
        variant: "destructive",
      });
      return;
    }

    // Formula: Calories = MET × weight (kg) × time (hours)
    const hours = duration[0] / 60;
    const calories = Math.round(selectedActivity.met * weight * hours);
    setCalculatedCalories(calories);
  };

  const handleSave = () => {
    if (calculatedCalories && selectedActivity) {
      toast({
        title: "Activity saved! 🔥",
        description: `${selectedActivity.name} for ${duration[0]} minutes (${calculatedCalories} kcal) added to your journal.`,
      });
    }
  };

  const handleReset = () => {
    setSelectedActivity(null);
    setWeight(70);
    setDuration([30]);
    setCalculatedCalories(null);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <ProfileHeader />
      <div className="lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Gym Calorie Calculator 💪
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your gym performance with scientific precision
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted p-1 rounded-lg">
              <Button
                variant={activeCategory === 'gym' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveCategory('gym');
                  setSelectedActivity(null);
                  setCalculatedCalories(null);
                }}
                className="px-6"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Gym Workouts
              </Button>
              <Button
                variant={activeCategory === 'cardio' ? 'default' : 'ghost'}
                onClick={() => {
                  setActiveCategory('cardio');
                  setSelectedActivity(null);
                  setCalculatedCalories(null);
                }}
                className="px-6"
              >
                <Activity className="w-4 h-4 mr-2" />
                Cardio
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="fitness-card p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary" />
                {activeCategory === 'gym' ? 'Gym Exercise' : 'Cardio Activity'} Calculator
              </h3>

              <div className="space-y-6">
                {/* Activity Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Select {activeCategory === 'gym' ? 'Exercise' : 'Activity'}
                  </Label>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {currentActivities.map((activity) => (
                      <Button
                        key={activity.name}
                        variant={selectedActivity?.name === activity.name ? "default" : "outline"}
                        className={`h-16 flex-col space-y-2 transition-bounce hover:scale-105 ${
                          selectedActivity?.name === activity.name 
                            ? "bg-primary text-primary-foreground shadow-glow" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedActivity(activity)}
                      >
                        {activity.icon}
                        <span className="text-sm">{activity.name}</span>
                      </Button>
                    ))}
                  </div>
                  {selectedActivity && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          MET: {selectedActivity.met}
                        </Badge>
                        <Badge 
                          variant={
                            selectedActivity.intensity === 'Extreme' ? 'destructive' :
                            selectedActivity.intensity === 'High' ? 'default' :
                            selectedActivity.intensity === 'Moderate' ? 'secondary' : 'outline'
                          }
                        >
                          {selectedActivity.intensity} Intensity
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedActivity.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Weight Input */}
                <div className="space-y-3">
                  <Label htmlFor="weight" className="text-base font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min={30}
                    max={200}
                    className="transition-base focus:ring-primary"
                  />
                </div>

                {/* Duration Slider */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Duration: {duration[0]} minutes
                  </Label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={120}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 min</span>
                    <span>120 min</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={calculateCalories}
                    className="flex-1 hero-button"
                    disabled={!selectedActivity || !weight || duration[0] < 5}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    size="icon"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results */}
            <Card className="fitness-card p-6 animate-scale-in">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Estimated Burn
              </h3>

              {calculatedCalories ? (
                <div className="text-center space-y-6 animate-bounce-in">
                  <div className="w-32 h-32 mx-auto bg-gradient-accent rounded-full flex items-center justify-center shadow-glow">
                    <div className="text-center text-white">
                      <div className="text-3xl font-bold">{calculatedCalories}</div>
                      <div className="text-sm">kcal</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-primary">
                      Estimated Burn: {calculatedCalories} kcal 🔥
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedActivity?.name} for {duration[0]} minutes
                    </p>
                  </div>

                  <Button 
                    onClick={handleSave}
                    className="hero-button w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to Journal
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-60">
                  <div className="w-32 h-32 mx-auto border-4 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                    <Activity className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Select an activity and calculate to see your estimated calorie burn
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Gym Stats & Motivation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="fitness-card p-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h4 className="font-bold text-lg mb-2">Today's Goal</h4>
              <p className="text-2xl font-bold text-primary">500 kcal</p>
              <p className="text-sm text-muted-foreground">Burn target</p>
            </Card>
            
            <Card className="fitness-card p-6 text-center">
              <Timer className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h4 className="font-bold text-lg mb-2">Active Time</h4>
              <p className="text-2xl font-bold text-primary">45 min</p>
              <p className="text-sm text-muted-foreground">Workout duration</p>
            </Card>
            
            <Card className="fitness-card p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h4 className="font-bold text-lg mb-2">Weekly Progress</h4>
              <p className="text-2xl font-bold text-primary">85%</p>
              <p className="text-sm text-muted-foreground">Goal completion</p>
            </Card>
          </div>

          {/* MET Information */}
          <Card className="fitness-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">💪 Gym Science</h3>
            <p className="text-muted-foreground mb-4">
              Our calculator uses MET (Metabolic Equivalent) values to estimate calories burned. 
              MET represents the energy cost of physical activities as a multiple of resting metabolic rate.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold text-center">
                🔥 Formula: <span className="text-primary">Calories = MET × Weight (kg) × Time (hours)</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalorieBurn;