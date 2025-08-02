import React from 'react';

const Profile = () => {
  const currentGoals = [
    {
      icon: '🎯',
      title: 'Daily Calorie Goal',
      description: '2000 kcal per day',
      progress: 72,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      icon: '💓',
      title: 'Weekly Workouts',
      description: '5 workouts per week',
      progress: 60,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: '📈',
      title: 'Weight Loss Goal',
      description: 'Lose 10kg in 6 months',
      progress: 52,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  const settings = [
    { icon: '🔔', title: 'Notifications' },
    { icon: '🎯', title: 'Goals & Preferences' },
    { icon: '👤', title: 'Privacy' },
    { icon: '⚙️', title: 'App Settings' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Alex Johnson</h2>
        <p className="text-purple-100 mb-6">Fitness Enthusiast</p>
        
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-xl font-bold">28</div>
            <div className="text-sm text-purple-100">Days Active</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">15</div>
            <div className="text-sm text-purple-100">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">5.2kg</div>
            <div className="text-sm text-purple-100">Lost</div>
          </div>
        </div>
      </div>

      {/* Current Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Current Goals</h3>
        
        <div className="space-y-6">
          {currentGoals.map((goal, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${goal.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className="text-lg">{goal.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{goal.title}</div>
                    <div className="text-sm text-gray-600">{goal.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{goal.progress}%</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${goal.color}`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Settings</h3>
        
        <div className="space-y-4">
          {settings.map((setting, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">{setting.icon}</span>
              </div>
              <span className="font-medium text-gray-800">{setting.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌱</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">FitTrack AI</h4>
        </div>
        <p className="text-gray-600">Your AI-powered wellness companion</p>
        <p className="text-sm text-gray-500">Version 2.1.0</p>
      </div>
    </div>
  );
};

export default Profile;