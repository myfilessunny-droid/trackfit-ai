import React, { useState } from 'react';

const AskAgent = () => {
  const [healthProfile, setHealthProfile] = useState({
    height: 170,
    weight: 70,
    gender: '',
    age: 25
  });

  const quickQuestions = [
    'Analyze my calorie intake vs burn',
    'Suggest healthy meal options',
    'Create a workout plan for me',
    'Am I meeting my fitness goals?'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-600">ASK Your AI Health Agent</h1>
        <p className="text-gray-600">Your personal agentic doctor for intake & output analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Profile */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">💓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Your Health Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={healthProfile.height}
                onChange={(e) => setHealthProfile({...healthProfile, height: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="170"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={healthProfile.weight}
                onChange={(e) => setHealthProfile({...healthProfile, weight: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="70"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={healthProfile.gender}
                onChange={(e) => setHealthProfile({...healthProfile, gender: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={healthProfile.age}
                onChange={(e) => setHealthProfile({...healthProfile, age: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="25"
              />
            </div>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <span className="text-lg">🔄</span>
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {/* AI Health Consultation */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📹</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">AI Health Consultation</h2>
          </div>
          
          <div className="space-y-4">
            {/* AI Message */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-800 mb-2">
                Hello! I'm your personal AI health assistant. I can help analyze your intake and output data, provide personalized recommendations, and answer any health-related questions. To get started, please share your basic information, and feel free to ask me anything!
              </p>
              <div className="text-xs text-gray-500">6:46:36 PM</div>
            </div>
            
            {/* Input Area */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask about your nutrition, exercise routine, or health goals..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                <span className="text-lg">📤</span>
              </button>
              <button className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors">
                <span className="text-lg">📎</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Quick Questions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AskAgent;