import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Journal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [foodEntries, setFoodEntries] = useState([]);
  const [exerciseEntries, setExerciseEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // {type, id}
  const [deleting, setDeleting] = useState(false);

  // Fetch entries from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchEntries = async () => {
      setLoading(true);
      let fromDate = new Date();
      if (selectedPeriod === 'day') {
        fromDate.setHours(0, 0, 0, 0);
      } else if (selectedPeriod === 'week') {
        fromDate.setDate(fromDate.getDate() - 6);
        fromDate.setHours(0, 0, 0, 0);
      } else if (selectedPeriod === 'month') {
        fromDate.setDate(1);
        fromDate.setHours(0, 0, 0, 0);
      }
      const fromISOString = fromDate.toISOString();
      // Food entries
      const { data: food } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', fromISOString)
        .order('created_at', { ascending: false });
      // Exercise entries
      const { data: exercise } = await supabase
        .from('exercise_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', fromISOString)
        .order('created_at', { ascending: false });
      setFoodEntries(food || []);
      setExerciseEntries(exercise || []);
      setLoading(false);
    };
    fetchEntries();
  }, [user, selectedPeriod]);

  // Group entries by date
  const groupEntriesByDate = () => {
    const allEntries = [
      ...foodEntries.map(e => ({
        ...e,
        type: 'food',
        calories: e.calories,
        time: e.created_at,
        icon: '🍎',
        color: 'bg-green-50 border border-green-200',
        title: e.food_name,
        description: e.quantity || '',
      })),
      ...exerciseEntries.map(e => ({
        ...e,
        type: 'workout',
        calories: -e.calories_burned,
        time: e.created_at,
        icon: '💪',
        color: 'bg-orange-50 border border-orange-200',
        title: e.exercise_name,
        description: `${e.duration_minutes} min • ${e.exercise_type}`,
      })),
    ];
    // Sort by time descending
    allEntries.sort((a, b) => new Date(b.time) - new Date(a.time));
    // Group by date
    const grouped = {};
    allEntries.forEach(entry => {
      const dateStr = new Date(entry.time).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(entry);
    });
    return grouped;
  };

  const groupedEntries = groupEntriesByDate();
  const hasEntries = Object.keys(groupedEntries).length > 0;

  // Delete entry handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { type, id } = deleteTarget;
    const table = type === 'food' ? 'food_entries' : 'exercise_entries';
    await supabase.from(table).delete().eq('id', id);
    // Remove from UI
    if (type === 'food') {
      setFoodEntries(prev => prev.filter(e => e.id !== id));
    } else {
      setExerciseEntries(prev => prev.filter(e => e.id !== id));
    }
    setDeleteTarget(null);
    setDeleting(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">📊</span>
          <h1 className="text-3xl font-bold text-gray-800">Health Journal</h1>
        </div>
        <p className="text-gray-600">Track your progress and view detailed analytics</p>
      </div>

      {/* Time Period Filter */}
      <div className="flex justify-center space-x-2">
        {['Day', 'Week', 'Month'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period.toLowerCase())}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === period.toLowerCase()
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : hasEntries ? (
          Object.entries(groupedEntries).map(([date, entries], dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{date}</h3>
              <div className="space-y-4">
                {entries.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className={`relative group p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${entry.color}`}
                  >
                    {/* Delete button (visible on hover or if this is the delete target) */}
                    <button
                      className={`absolute top-3 right-3 z-10 p-1 rounded-full bg-white border border-gray-300 shadow-sm text-gray-500 hover:text-red-600 hover:border-red-400 transition-opacity duration-150 ${deleteTarget && deleteTarget.id === entry.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      onClick={() => setDeleteTarget({ type: entry.type, id: entry.id })}
                      tabIndex={-1}
                      aria-label="Delete entry"
                    >
                      🗑️
                    </button>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-lg">{entry.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-lg">{entry.title}</div>
                          <div className="text-sm text-gray-600">{entry.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className={`font-semibold text-lg ${entry.calories > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {entry.calories > 0 ? `+${entry.calories}` : `${entry.calories}`} kcal
                        </div>
                      </div>
                    </div>
                    {/* Delete confirmation */}
                    {deleteTarget && deleteTarget.id === entry.id && (
                      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl z-20">
                        <div className="mb-2 text-gray-800 font-semibold">Delete this entry?</div>
                        <div className="flex space-x-3">
                          <button
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                            onClick={handleDelete}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting...' : 'Yes'}
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : null}
      </div>

      {/* Add Entry Buttons */}
      <div className="text-center flex flex-col md:flex-row gap-4 justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          onClick={() => navigate('/food-detection')}
        >
          <span className="text-lg">🍎</span>
          <span>Add Food Calories</span>
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
          onClick={() => navigate('/calorie-burn')}
        >
          <span className="text-lg">🔥</span>
          <span>Add Burned Calories</span>
        </button>
      </div>
    </div>
  );
};

export default Journal;