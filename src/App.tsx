import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import FoodDetection from './pages/FoodDetection';
import CalorieBurn from './pages/CalorieBurn';
import Journal from './pages/Journal';
import AskAgent from './pages/AskAgent';
import Profile from './pages/Profile';
import Login from './pages/Login';
import TestDashboard from './pages/TestDashboard';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/DataContext';
import './App.css';

function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', path: '/' },
    { id: 'food-detection', name: 'Food Detection', icon: '📷', path: '/food-detection' },
    { id: 'calorie-burn', name: 'Calorie Burn', icon: '💪', path: '/calorie-burn' },
    { id: 'journal', name: 'Journal', icon: '📊', path: '/journal' },
    { id: 'ask-agent', name: 'Ask Agent', icon: '🤖', path: '/ask-agent' },
    { id: 'profile', name: 'Profile', icon: '👤', path: '/profile' },
    { id: 'test-dashboard', name: 'Test Dashboard', icon: '🧪', path: '/test' },
  ];

  const getActivePage = () => {
    const currentPath = location.pathname;
    const activeItem = navigationItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'dashboard';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌱</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">FitTrack AI</h1>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = getActivePage() === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        {user && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg">🌱</span>
          </div>
          <p className="text-gray-600">Loading FitTrack AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/food-detection" element={<ProtectedRoute><FoodDetection /></ProtectedRoute>} />
            <Route path="/calorie-burn" element={<ProtectedRoute><CalorieBurn /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/ask-agent" element={<ProtectedRoute><AskAgent /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  );
}

export default App;
