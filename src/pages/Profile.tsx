import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/DataContext';

const AVATAR_BUCKET = 'avatars';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);
  const [daysActive, setDaysActive] = useState(0);
  const [weightLost, setWeightLost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);
      setProfile(profiles && profiles.length > 0 ? profiles[0] : null);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startISOString = startOfDay.toISOString();
    supabase
      .from('food_entries')
      .select('calories')
      .eq('user_id', user.id)
      .gte('created_at', startISOString)
      .then(({ data }) => {
        setTodayCalories(data ? data.reduce((sum, e) => sum + (e.calories || 0), 0) : 0);
      });
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    supabase
      .from('exercise_entries')
      .select('id, created_at')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .then(({ data }) => {
        setWeeklyWorkouts(data ? data.length : 0);
        if (data) {
          const days = new Set(data.map(e => new Date(e.created_at).toDateString()));
          setDaysActive(days.size);
        }
      });
  }, [user]);

  const calorieGoal = profile?.daily_calorie_goal || 2000;
  const calorieProgress = Math.min(100, Math.round((todayCalories / calorieGoal) * 100));
  const workoutGoal = 5;
  const workoutProgress = Math.min(100, Math.round((weeklyWorkouts / workoutGoal) * 100));
  const weightGoal = profile?.goal === 'lose' ? 'Lose weight' : profile?.goal === 'gain' ? 'Gain weight' : 'Maintain weight';

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert('Error uploading image');
      setUploading(false);
      return;
    }
    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
    // Update user_profiles
    await supabase.from('user_profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
    setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
    setUploading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30 mx-auto"
            />
          ) : (
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">👤</span>
            </div>
          )}
          <button
            className="absolute bottom-1 right-1 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md border border-gray-200"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            title="Upload profile image"
          >
            <span className="text-lg">📷</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
            disabled={uploading}
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{profile?.name || user?.email || 'User'}</h2>
        <p className="text-purple-100 mb-2">{profile?.email || user?.email}</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {profile?.age && <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Age: {profile.age}</div>}
          {profile?.gender && <div className="text-sm bg-white/20 px-3 py-1 rounded-full capitalize">Gender: {profile.gender}</div>}
          {profile?.height && <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Height: {profile.height} cm</div>}
          {profile?.weight && <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Weight: {profile.weight} kg</div>}
          {profile?.activity_level && <div className="text-sm bg-white/20 px-3 py-1 rounded-full capitalize">Activity: {profile.activity_level}</div>}
        </div>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-xl font-bold">{daysActive}</div>
            <div className="text-sm text-purple-100">Days Active</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{weeklyWorkouts}</div>
            <div className="text-sm text-purple-100">Workouts (this week)</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{weightLost !== null ? `${weightLost}kg` : '-'}</div>
            <div className="text-sm text-purple-100">Lost</div>
          </div>
        </div>
        {!profile && !loading && (
          <div className="mt-4 text-sm text-yellow-200 bg-yellow-600/30 rounded-lg p-3">
            Please complete your profile in settings to unlock all features.
          </div>
        )}
      </div>

      {/* Current Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Current Goals</h3>
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Daily Calorie Goal</div>
                  <div className="text-sm text-gray-600">{calorieGoal} kcal per day</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{calorieProgress}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${calorieProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💓</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Weekly Workouts</div>
                  <div className="text-sm text-gray-600">{workoutGoal} workouts per week</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{workoutProgress}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${workoutProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Weight Goal</div>
                  <div className="text-sm text-gray-600">{weightGoal}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">52%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{ width: `52%` }}
              ></div>
            </div>
          </div>
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