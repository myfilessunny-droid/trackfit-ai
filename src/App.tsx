import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import FoodDetection from './pages/FoodDetection';
import CalorieBurn from './pages/CalorieBurn';
import Journal from './pages/Journal';
import AskAgent from './pages/AskAgent';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', path: '/' },
    { id: 'food-detection', name: 'Food Detection', icon: '📷', path: '/food-detection' },
    { id: 'calorie-burn', name: 'Calorie Burn', icon: '💪', path: '/calorie-burn' },
    { id: 'journal', name: 'Journal', icon: '📊', path: '/journal' },
    { id: 'ask-agent', name: 'Ask Agent', icon: '🤖', path: '/ask-agent' },
    { id: 'profile', name: 'Profile', icon: '👤', path: '/profile' },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🌱</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">FitTrack AI</h1>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food-detection" element={<FoodDetection />} />
              <Route path="/calorie-burn" element={<CalorieBurn />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/ask-agent" element={<AskAgent />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
