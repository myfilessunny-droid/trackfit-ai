import React from 'react';
import SuggestionsBar from '../components/SuggestionsBar';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { 
    todayCaloriesConsumed, 
    todayCaloriesBurned, 
    todayNetCalories, 
    userProfile, 
    loading 
  } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  const userName = userProfile ? 'Alex' : 'User';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate percentages for progress bars
  const dailyGoal = 2000; // This would come from user profile
  const consumedPercentage = Math.min((todayCaloriesConsumed / dailyGoal) * 100, 100);
  const burnedPercentage = Math.min((todayCaloriesBurned / 1000) * 100, 100); // Assuming 1000 is max burn goal
  const netPercentage = Math.min((Math.abs(todayNetCalories) / dailyGoal) * 100, 100);

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Today</div>
          <div className="text-lg font-semibold text-gray-800">{currentDate}</div>
        </div>
      </div>

      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Good morning, {userName}! ☀️</h2>
        <p className="text-green-100">You're crushing your goals today!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors">
          <span className="text-xl">📷</span>
          <span className="font-semibold">Log Meal</span>
        </button>
        <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors">
          <span className="text-xl">💓</span>
          <span className="font-semibold">Start Workout</span>
        </button>
      </div>

      {/* Summary Cards - Main Focus */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">📊 Daily Calorie Balance</h2>
          <p className="text-gray-600 text-lg">Track your energy intake and expenditure</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calories Consumed */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍎</span>
              </div>
              <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                {consumedPercentage.toFixed(0)}% of daily goal
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">{todayCaloriesConsumed.toLocaleString()}</div>
            <div className="text-gray-600 font-medium">Calories Consumed</div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${consumedPercentage}%`}}
              ></div>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-sm text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full">
                Great progress!
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">{todayCaloriesBurned.toLocaleString()}</div>
            <div className="text-gray-600 font-medium">Calories Burned</div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                style={{width: `${burnedPercentage}%`}}
              ></div>
            </div>
          </div>

          {/* Net Calories */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚖️</span>
              </div>
              <span className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                {todayNetCalories >= 0 ? 'Perfect balance' : 'Need more calories'}
              </span>
            </div>
            <div className={`text-4xl font-bold mb-2 ${todayNetCalories >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {todayNetCalories >= 0 ? '+' : ''}{todayNetCalories.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Net Calories</div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${todayNetCalories >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}
                style={{width: `${netPercentage}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
            <span>📷</span>
            <span>Log Food</span>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
            <span>💓</span>
            <span>Log Exercise</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
            <span>📊</span>
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Today's Macros */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Today's Macros</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">Daily</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium">Weekly</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">🍞</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">45%</div>
            <div className="text-gray-600">Carbs</div>
            <div className="text-sm text-gray-500">Energy source</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">💪</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">30%</div>
            <div className="text-gray-600">Protein</div>
            <div className="text-sm text-gray-500">Muscle building</div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">🥑</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">25%</div>
            <div className="text-gray-600">Fat</div>
            <div className="text-sm text-gray-500">Essential nutrients</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            <a href="#" className="text-green-600 hover:text-green-700 font-medium">View All</a>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🍎</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Breakfast logged</div>
                  <div className="text-sm text-gray-500">2 hours ago • 450 kcal</div>
                </div>
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💓</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Morning run completed</div>
                  <div className="text-sm text-gray-500">3 hours ago • 350 kcal burned</div>
                </div>
              </div>
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-xl">🏆</span>
            <h3 className="text-xl font-semibold text-gray-800">Recent Achievements</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔔</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">7-Day Streak</div>
                  <div className="text-sm text-gray-600">Logged meals for 7 days straight!</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Calorie Goal</div>
                  <div className="text-sm text-gray-600">Hit your daily calorie target</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Workout Warrior</div>
                  <div className="text-sm text-gray-600">Completed 10 workouts this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Bar */}
      <SuggestionsBar />
    </div>
  );
};

export default Dashboard;