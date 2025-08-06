import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/DataContext';

const EXERCISES = {
  gym: [
    { name: 'Bench Press', icon: '🏋️‍♂️', met: 6, type: 'strength' },
    { name: 'Deadlifts', icon: '🎯', met: 7, type: 'strength' },
    { name: 'Squats', icon: '⚡', met: 7.5, type: 'strength' },
    { name: 'Pull-ups', icon: '🏋️‍♀️', met: 8, type: 'strength' },
    { name: 'Shoulder Press', icon: '💪', met: 6, type: 'strength' },
    { name: 'Bicep Curls', icon: '💪', met: 5, type: 'strength' },
    { name: 'Tricep Dips', icon: '💪', met: 5.5, type: 'strength' },
    { name: 'Leg Press', icon: '🦵', met: 6.5, type: 'strength' },
    { name: 'Lat Pulldown', icon: '🏋️', met: 6, type: 'strength' },
    { name: 'Chest Fly', icon: '🦅', met: 5.5, type: 'strength' },
    { name: 'Seated Row', icon: '🚣', met: 6, type: 'strength' },
    { name: 'Plank', icon: '🧘‍♂️', met: 3.3, type: 'strength' },
  ],
  cardio: [
    { name: 'Running (8 km/h)', icon: '🏃‍♂️', met: 8, type: 'cardio' },
    { name: 'Cycling (moderate)', icon: '🚴‍♂️', met: 7.5, type: 'cardio' },
    { name: 'Jump Rope', icon: '🤾‍♂️', met: 12.3, type: 'cardio' },
    { name: 'Rowing Machine', icon: '🚣‍♂️', met: 7, type: 'cardio' },
    { name: 'Elliptical', icon: '🚴', met: 5, type: 'cardio' },
    { name: 'Stair Climber', icon: '🧗‍♂️', met: 8.8, type: 'cardio' },
    { name: 'Swimming (leisure)', icon: '🏊‍♂️', met: 6, type: 'cardio' },
    { name: 'HIIT', icon: '🔥', met: 10, type: 'cardio' },
    { name: 'Walking (brisk)', icon: '🚶‍♂️', met: 4.3, type: 'cardio' },
  ],
  yoga: [
    { name: 'Hatha Yoga', icon: '🧘‍♂️', met: 2.5, type: 'flexibility' },
    { name: 'Vinyasa Yoga', icon: '🧘‍♀️', met: 5.5, type: 'flexibility' },
    { name: 'Power Yoga', icon: '💪', met: 4, type: 'flexibility' },
    { name: 'Restorative Yoga', icon: '🛌', met: 1.8, type: 'flexibility' },
    { name: 'Surya Namaskar', icon: '🌞', met: 3.8, type: 'flexibility' },
    { name: 'Yin Yoga', icon: '🧘', met: 2, type: 'flexibility' },
    { name: 'Ashtanga Yoga', icon: '🧘‍♂️', met: 4.5, type: 'flexibility' },
  ],
};

const CalorieBurn = () => {
  const { user } = useAuth();
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('gym');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState(70);
  const [duration, setDuration] = useState(30);
  const [estimatedBurn, setEstimatedBurn] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentExercises, setRecentExercises] = useState([]);

  const workoutTypes = [
    { id: 'gym', name: 'Gym Workouts', color: 'bg-green-500' },
    { id: 'cardio', name: 'Cardio', color: 'bg-blue-500' },
    { id: 'yoga', name: 'Yoga', color: 'bg-purple-500' }
  ];

  const exercises = EXERCISES[selectedWorkoutType];

  const fetchRecentExercises = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('exercise_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(2);
    if (!error && data) {
      setRecentExercises(data);
    }
  };

  const calculateBurn = () => {
    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    const met = exercise ? exercise.met : 5;
    const calculatedBurn = Math.round(met * weight * (duration / 60));
    setEstimatedBurn(calculatedBurn);
  };

  useEffect(() => {
    if (selectedExercise) {
      calculateBurn();
    } else {
      setEstimatedBurn(0);
    }
  }, [selectedExercise, weight, duration, selectedWorkoutType]);

  useEffect(() => {
    setSelectedExercise('');
  }, [selectedWorkoutType]);

  useEffect(() => {
    fetchRecentExercises();
    // eslint-disable-next-line
  }, [user]);

  const handleStartWorkout = async () => {
    if (!user) {
      setSuccessMsg('Please log in to save your workout.');
      return;
    }
    if (!selectedExercise) {
      setSuccessMsg('Please select an exercise.');
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg('');
    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    try {
      const { error } = await supabase.from('exercise_entries').insert({
        user_id: user.id,
        exercise_name: selectedExercise,
        calories_burned: estimatedBurn,
        duration_minutes: duration,
        exercise_type: exercise?.type || selectedWorkoutType,
      });
      if (error) {
        setSuccessMsg('Error saving workout.');
      } else {
        setSuccessMsg('Workout saved successfully!');
        fetchRecentExercises();
        setTimeout(() => setSuccessMsg(''), 2000);
      }
    } catch (e) {
      setSuccessMsg('Error saving workout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-4xl">💪</span>
          <h1 className="text-4xl font-bold text-gray-800">Professional Gym Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg">Track your gym performance with scientific precision.</p>
      </div>

      {/* Workout Type Filters */}
      <div className="flex justify-center space-x-4">
        {workoutTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedWorkoutType(type.id)}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedWorkoutType === type.id
                ? `${type.color} text-white`
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Exercise Calculator - 4 row rectangle */}
      <div className="bg-white rounded-xl p-8 shadow-sm max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Calculator</h2>
        <div className="space-y-6">
          {/* Row 1: Exercise Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Exercise</label>
            <div className="grid grid-cols-2 gap-4">
              {exercises.map((exercise) => (
                <button
                  key={exercise.name}
                  onClick={() => setSelectedExercise(exercise.name)}
                  className={`p-4 rounded-lg border-2 transition-colors w-full text-left ${
                    selectedExercise === exercise.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{exercise.icon}</span>
                    <span className="font-medium text-gray-800">{exercise.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Row 2: Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="70"
            />
          </div>
          {/* Row 3: Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              min={5}
              max={180}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="30"
            />
          </div>
          {/* Row 4: Estimated Burn + Start Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">{estimatedBurn}</div>
                  <div className="text-xs">kcal</div>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">Estimated Burn</div>
                <div className="text-xs text-gray-500">Based on your inputs</div>
              </div>
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              onClick={handleStartWorkout}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Start Workout'}
            </button>
          </div>
          {successMsg && (
            <div className={`text-center text-sm font-medium mt-2 ${successMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{successMsg}</div>
          )}
        </div>
      </div>

      {/* Recent Workouts Section */}
      {recentExercises.length > 0 && (
        <div className="max-w-xl mx-auto mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Workouts</h3>
          <div className="space-y-4">
            {recentExercises.map((ex, idx) => (
              <div key={ex.id || idx} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-semibold text-gray-800 text-base">{ex.exercise_name}</div>
                  <div className="text-xs text-gray-500 capitalize">{ex.exercise_type}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-green-600 font-bold text-lg">{ex.calories_burned} kcal</div>
                  <div className="text-xs text-gray-500">{new Date(ex.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieBurn;