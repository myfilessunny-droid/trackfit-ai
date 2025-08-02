import React, { useState } from 'react';

const CalorieBurn = () => {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('gym');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState(70);
  const [duration, setDuration] = useState(30);
  const [estimatedBurn, setEstimatedBurn] = useState(350);

  const workoutTypes = [
    { id: 'gym', name: 'Gym Workouts', color: 'bg-green-500' },
    { id: 'cardio', name: 'Cardio', color: 'bg-blue-500' },
    { id: 'yoga', name: 'Yoga', color: 'bg-purple-500' }
  ];

  const quickWorkouts = [
    {
      id: 1,
      name: 'Morning HIIT',
      duration: '25 min',
      calories: '350 kcal',
      intensity: 'High',
      intensityColor: 'bg-red-500',
      image: '🏃‍♂️'
    },
    {
      id: 2,
      name: 'Strength Training',
      duration: '45 min',
      calories: '280 kcal',
      intensity: 'Medium',
      intensityColor: 'bg-orange-500',
      image: '💪'
    },
    {
      id: 3,
      name: 'Yoga Flow',
      duration: '30 min',
      calories: '150 kcal',
      intensity: 'Low',
      intensityColor: 'bg-green-500',
      image: '🧘‍♀️'
    }
  ];

  const exercises = [
    { name: 'Bench Press', icon: '🏋️‍♂️' },
    { name: 'Deadlifts', icon: '🎯' },
    { name: 'Squats', icon: '⚡' },
    { name: 'Pull-ups', icon: '🏋️‍♀️' }
  ];

  const calculateBurn = () => {
    // Simple calculation - in real app, use more sophisticated formulas
    const baseBurn = selectedExercise === 'Bench Press' ? 8 : 
                    selectedExercise === 'Deadlifts' ? 10 :
                    selectedExercise === 'Squats' ? 9 :
                    selectedExercise === 'Pull-ups' ? 7 : 8;
    
    const calculatedBurn = Math.round((baseBurn * weight * duration) / 60);
    setEstimatedBurn(calculatedBurn);
  };

  React.useEffect(() => {
    if (selectedExercise) {
      calculateBurn();
    }
  }, [selectedExercise, weight, duration]);

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

      {/* Quick Start Workouts */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Start Workouts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickWorkouts.map((workout) => (
            <div key={workout.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{workout.image}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${workout.intensityColor}`}>
                  {workout.intensity}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2">{workout.name}</h3>
              <div className="text-sm text-gray-600 mb-4">
                {workout.duration} • {workout.calories}
              </div>
              
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors">
                Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Calculator */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Calculator</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Exercise Selection and Inputs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Exercise</h3>
              <div className="grid grid-cols-2 gap-4">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.name}
                    onClick={() => setSelectedExercise(exercise.name)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedExercise === exercise.name
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{exercise.icon}</div>
                      <div className="font-medium text-gray-800">{exercise.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-800">{duration} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Estimated Burn */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{estimatedBurn}</div>
                  <div className="text-sm">kcal</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Estimated burn</h3>
              <p className="text-gray-600 mb-6">Based on your inputs</p>
              
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Start Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieBurn;