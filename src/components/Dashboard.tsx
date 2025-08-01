import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Activity, 
  Flame, 
  Apple, 
  TrendingUp, 
  Calendar,
  Plus,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

const StatsCard = ({ title, value, subtitle, icon, color, progress }: StatsCardProps) => (
  <Card className="fitness-card p-6 hover:shadow-glow transition-slow group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-bounce`}>
        {icon}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-base" />
    </div>
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </div>
      {progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <span className="text-xs text-muted-foreground">{progress}% of daily goal</span>
        </div>
      )}
    </div>
  </Card>
);

export const Dashboard = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const navigate = useNavigate();

  // Mock data - replace with real data
  const dailyStats = {
    caloriesConsumed: 1450,
    caloriesBurned: 650,
    caloriesGoal: 2000,
    macros: { carbs: 45, protein: 30, fat: 25 }
  };

  const caloriesProgress = (dailyStats.caloriesConsumed / dailyStats.caloriesGoal) * 100;
  const netCalories = dailyStats.caloriesConsumed - dailyStats.caloriesBurned;

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Good job today! 💪
          </h1>
          <p className="text-lg text-muted-foreground">
            You've burned more than you ate. Keep up the great work!
          </p>
          <Badge variant="secondary" className="mt-2">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Button 
            onClick={() => navigate('/food-detection')}
            className="flex-1 hero-button h-14 text-lg group"
          >
            <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-bounce" />
            Log Meal
          </Button>
          <Button 
            onClick={() => navigate('/calorie-burn')}
            variant="outline"
            className="flex-1 h-14 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-bounce group"
          >
            <Activity className="w-5 h-5 mr-2 group-hover:scale-110 transition-bounce" />
            Log Activity
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          <StatsCard
            title="Calories Consumed"
            value={dailyStats.caloriesConsumed.toLocaleString()}
            subtitle="kcal today"
            icon={<Apple className="w-6 h-6" />}
            color="from-green-500 to-green-600"
            progress={caloriesProgress}
          />
          <StatsCard
            title="Calories Burned"
            value={dailyStats.caloriesBurned.toLocaleString()}
            subtitle="kcal today"
            icon={<Flame className="w-6 h-6" />}
            color="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Net Calories"
            value={netCalories > 0 ? `+${netCalories}` : netCalories.toString()}
            subtitle="kcal balance"
            icon={<TrendingUp className="w-6 h-6" />}
            color={netCalories > 0 ? "from-blue-500 to-blue-600" : "from-green-500 to-green-600"}
          />
        </div>

        {/* Macronutrient Breakdown */}
        <Card className="fitness-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Today's Macros</h3>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('daily')}
                className="transition-base"
              >
                Daily
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('weekly')}
                className="transition-base"
              >
                Weekly
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {dailyStats.macros.carbs}%
              </div>
              <div>
                <p className="font-semibold text-blue-600">Carbs</p>
                <p className="text-sm text-muted-foreground">Energy source</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {dailyStats.macros.protein}%
              </div>
              <div>
                <p className="font-semibold text-green-600">Protein</p>
                <p className="text-sm text-muted-foreground">Muscle building</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {dailyStats.macros.fat}%
              </div>
              <div>
                <p className="font-semibold text-orange-600">Fat</p>
                <p className="text-sm text-muted-foreground">Essential nutrients</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="fitness-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/journal')}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg transition-base hover:bg-muted">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Apple className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Breakfast logged</p>
                <p className="text-sm text-muted-foreground">2 hours ago • 450 kcal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg transition-base hover:bg-muted">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Morning run</p>
                <p className="text-sm text-muted-foreground">3 hours ago • 350 kcal burned</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};