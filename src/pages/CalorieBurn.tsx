import { useState } from "react";
import { Navigation } from "@/components/Navigation";
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
  Music
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  name: string;
  icon: React.ReactNode;
  met: number;
}

const activities: Activity[] = [
  { name: "Walking", icon: <Footprints className="w-5 h-5" />, met: 3.5 },
  { name: "Running", icon: <Activity className="w-5 h-5" />, met: 8.0 },
  { name: "Cycling", icon: <Bike className="w-5 h-5" />, met: 6.0 },
  { name: "Swimming", icon: <Waves className="w-5 h-5" />, met: 7.0 },
  { name: "Weight Training", icon: <Dumbbell className="w-5 h-5" />, met: 6.0 },
  { name: "Dancing", icon: <Music className="w-5 h-5" />, met: 5.0 },
];

const CalorieBurn = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [weight, setWeight] = useState<number>(70);
  const [duration, setDuration] = useState<number[]>([30]);
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);
  const { toast } = useToast();

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
      <div className="lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Let's see how much you burned 🔥
            </h1>
            <p className="text-lg text-muted-foreground">
              Weight + Time + Movement = Burn!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="fitness-card p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary" />
                Activity Calculator
              </h3>

              <div className="space-y-6">
                {/* Activity Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Select Activity</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {activities.map((activity) => (
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
                    <Badge variant="secondary" className="mt-2">
                      MET Value: {selectedActivity.met}
                    </Badge>
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

          {/* MET Information */}
          <Card className="fitness-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">📚 How it works</h3>
            <p className="text-muted-foreground">
              Our calculator uses MET (Metabolic Equivalent) values to estimate calories burned. 
              MET represents the energy cost of physical activities as a multiple of resting metabolic rate. 
              The formula is: <strong>Calories = MET × Weight (kg) × Time (hours)</strong>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalorieBurn;