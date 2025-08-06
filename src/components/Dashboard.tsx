import { useState, useEffect } from "react";
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
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/DataContext";

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
  const { user } = useAuth();
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [macros, setMacros] = useState({ carbs: 0, protein: 0, fat: 0 });
  const [goal, setGoal] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startISOString = startOfDay.toISOString();
    // Fetch food entries for today
    supabase
      .from('food_entries')
      .select('calories, carbs, protein, fat')
      .eq('user_id', user.id)
      .gte('created_at', startISOString)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCaloriesConsumed(data.reduce((sum, e) => sum + (e.calories || 0), 0));
          setMacros({
            carbs: Math.round(data.reduce((sum, e) => sum + (e.carbs || 0), 0)),
            protein: Math.round(data.reduce((sum, e) => sum + (e.protein || 0), 0)),
            fat: Math.round(data.reduce((sum, e) => sum + (e.fat || 0), 0)),
          });
        } else {
          setCaloriesConsumed(0);
          setMacros({ carbs: 0, protein: 0, fat: 0 });
        }
      });
    // Fetch exercise entries for today
    supabase
      .from('exercise_entries')
      .select('calories_burned')
      .eq('user_id', user.id)
      .gte('created_at', startISOString)
      .then(({ data }) => {
        setCaloriesBurned(data ? data.reduce((sum, e) => sum + (e.calories_burned || 0), 0) : 0);
        setLoading(false);
      });
         // Fetch user profile for goal
     supabase
       .from('user_profiles')
       .select('daily_calorie_goal')
       .eq('user_id', user.id)
       .limit(1)
       .then(({ data }) => {
         if (data && data.length > 0 && data[0].daily_calorie_goal) setGoal(data[0].daily_calorie_goal);
       });

     // Fetch recent activities (last 5 entries from both food and exercise)
     const fetchRecentActivities = async () => {
       try {
         // Get food entries from last 7 days
         const sevenDaysAgo = new Date();
         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
         
         const { data: foodData } = await supabase
           .from('food_entries')
           .select('food_name, calories, meal_type, created_at')
           .eq('user_id', user.id)
           .gte('created_at', sevenDaysAgo.toISOString())
           .order('created_at', { ascending: false })
           .limit(3);

         const { data: exerciseData } = await supabase
           .from('exercise_entries')
           .select('exercise_name, calories_burned, exercise_type, created_at')
           .eq('user_id', user.id)
           .gte('created_at', sevenDaysAgo.toISOString())
           .order('created_at', { ascending: false })
           .limit(3);

         // Combine and sort by date
         const activities = [];
         
         if (foodData) {
           foodData.forEach(food => {
             activities.push({
               type: 'food',
               name: food.food_name,
               calories: food.calories,
               category: food.meal_type,
               createdAt: food.created_at
             });
           });
         }

         if (exerciseData) {
           exerciseData.forEach(exercise => {
             activities.push({
               type: 'exercise',
               name: exercise.exercise_name,
               calories: exercise.calories_burned,
               category: exercise.exercise_type,
               createdAt: exercise.created_at
             });
           });
         }

         // Sort by date (most recent first) and take top 4
         activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
         setRecentActivities(activities.slice(0, 4));
       } catch (error) {
         console.error('Error fetching recent activities:', error);
       }
     };

     fetchRecentActivities();
  }, [user]);

  const caloriesProgress = Math.min(100, Math.round((caloriesConsumed / goal) * 100));
  const netCalories = caloriesConsumed - caloriesBurned;

  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {caloriesConsumed === 0 && caloriesBurned === 0 ? 'Welcome! 👋' : netCalories < 0 ? 'Great job! 💪' : 'Keep going!'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {caloriesConsumed === 0 && caloriesBurned === 0
              ? 'Start logging your meals and workouts to see your stats.'
              : netCalories < 0
              ? "You've burned more than you ate. Keep up the great work!"
              : "Try to burn more than you eat for best results!"}
          </p>
          <Badge variant="secondary" className="mt-2">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
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
            value={caloriesConsumed.toLocaleString()}
            subtitle="kcal today"
            icon={<Apple className="w-6 h-6" />}
            color="from-green-500 to-green-600"
            progress={caloriesProgress}
          />
          <StatsCard
            title="Calories Burned"
            value={caloriesBurned.toLocaleString()}
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
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {macros.carbs}
              </div>
              <div>
                <p className="font-semibold text-blue-600">Carbs</p>
                <p className="text-sm text-muted-foreground">grams</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {macros.protein}
              </div>
              <div>
                <p className="font-semibold text-green-600">Protein</p>
                <p className="text-sm text-muted-foreground">grams</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {macros.fat}
              </div>
              <div>
                <p className="font-semibold text-orange-600">Fat</p>
                <p className="text-sm text-muted-foreground">grams</p>
              </div>
            </div>
          </div>
        </Card>

                 {/* Daily Calorie Burn Recommendations */}
         <Card className="fitness-card p-6 animate-fade-in">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-semibold flex items-center">
               <Flame className="w-5 h-5 mr-2" />
               Daily Calorie Burn Guide
             </h3>
             <Badge variant="secondary" className="text-xs">
               Based on Activity Level
             </Badge>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Men's Recommendations */}
             <div className="space-y-4">
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                   <span className="text-blue-600 font-bold text-sm">♂</span>
                 </div>
                 <h4 className="font-semibold text-lg">Men's Daily Targets</h4>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <div>
                     <p className="font-medium text-blue-900">Sedentary</p>
                     <p className="text-sm text-blue-700">Office work, minimal movement</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-blue-600 text-lg">2,200</p>
                     <p className="text-xs text-blue-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <div>
                     <p className="font-medium text-blue-900">Light Activity</p>
                     <p className="text-sm text-blue-700">1-3 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-blue-600 text-lg">2,400</p>
                     <p className="text-xs text-blue-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <div>
                     <p className="font-medium text-blue-900">Moderate Activity</p>
                     <p className="text-sm text-blue-700">3-5 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-blue-600 text-lg">2,600</p>
                     <p className="text-xs text-blue-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <div>
                     <p className="font-medium text-blue-900">Active</p>
                     <p className="text-sm text-blue-700">6-7 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-blue-600 text-lg">3,000</p>
                     <p className="text-xs text-blue-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <div>
                     <p className="font-medium text-blue-900">Very Active</p>
                     <p className="text-sm text-blue-700">Physical job + daily exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-blue-600 text-lg">3,400</p>
                     <p className="text-xs text-blue-600">kcal/day</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Women's Recommendations */}
             <div className="space-y-4">
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                   <span className="text-pink-600 font-bold text-sm">♀</span>
                 </div>
                 <h4 className="font-semibold text-lg">Women's Daily Targets</h4>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                   <div>
                     <p className="font-medium text-pink-900">Sedentary</p>
                     <p className="text-sm text-pink-700">Office work, minimal movement</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-pink-600 text-lg">1,800</p>
                     <p className="text-xs text-pink-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                   <div>
                     <p className="font-medium text-pink-900">Light Activity</p>
                     <p className="text-sm text-pink-700">1-3 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-pink-600 text-lg">2,000</p>
                     <p className="text-xs text-pink-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                   <div>
                     <p className="font-medium text-pink-900">Moderate Activity</p>
                     <p className="text-sm text-pink-700">3-5 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-pink-600 text-lg">2,200</p>
                     <p className="text-xs text-pink-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                   <div>
                     <p className="font-medium text-pink-900">Active</p>
                     <p className="text-sm text-pink-700">6-7 days/week exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-pink-600 text-lg">2,400</p>
                     <p className="text-xs text-pink-600">kcal/day</p>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                   <div>
                     <p className="font-medium text-pink-900">Very Active</p>
                     <p className="text-sm text-pink-700">Physical job + daily exercise</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-pink-600 text-lg">2,800</p>
                     <p className="text-xs text-pink-600">kcal/day</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Tips Section */}
           <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
             <div className="flex items-start space-x-3">
               <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                 <span className="text-white text-xs">💡</span>
               </div>
               <div>
                 <h5 className="font-semibold text-green-900 mb-2">Pro Tips for Calorie Management</h5>
                 <ul className="text-sm text-green-800 space-y-1">
                   <li>• <strong>Weight Loss:</strong> Consume 500 kcal less than your daily target</li>
                   <li>• <strong>Weight Maintenance:</strong> Match your daily target</li>
                   <li>• <strong>Weight Gain:</strong> Consume 300 kcal more than your daily target</li>
                   <li>• <strong>Muscle Building:</strong> Focus on protein (1.6-2.2g per kg body weight)</li>
                 </ul>
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
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">No recent activities</p>
                  <p className="text-sm text-muted-foreground">Start logging your meals and exercises to see them here</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const timeAgo = getTimeAgo(new Date(activity.createdAt));
                  
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg transition-base hover:bg-muted">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'food' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {activity.type === 'food' ? (
                          <Apple className="w-5 h-5 text-green-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {timeAgo} • {activity.type === 'food' ? `${activity.calories} kcal` : `${activity.calories} kcal burned`}
                          {activity.category && ` • ${activity.category}`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
      </div>
    </div>
  );
};