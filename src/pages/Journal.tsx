import React, { useState } from 'react';

const Journal = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const weeklyStats = [
    {
      icon: '🍎',
      value: '1,050',
      label: 'Consumed kcal this week',
      color: 'text-green-600'
    },
    {
      icon: '💡',
      value: '530',
      label: 'Burned kcal this week',
      color: 'text-orange-600'
    },
    {
      icon: '📊',
      value: '5',
      label: 'Entries logs this week',
      color: 'text-blue-600'
    }
  ];

  const journalEntries = [
    {
      date: 'Saturday, March 15, 2025',
      entries: [
        {
          type: 'food',
          icon: '🍳',
          title: 'Breakfast Bowl',
          description: 'Oatmeal with fruits and nuts',
          time: '6:46 PM',
          calories: '+450 kcal',
          color: 'bg-green-100'
        },
        {
          type: 'workout',
          icon: '🏃‍♂️',
          title: 'Morning Run',
          description: '5km in 30 minutes',
          time: '6:46 PM',
          calories: '-350 kcal',
          color: 'bg-orange-100'
        }
      ]
    },
    {
      date: 'Friday, March 14, 2025',
      entries: [
        {
          type: 'food',
          icon: '🥗',
          title: 'Chicken Salad',
          description: 'Grilled chicken with mixed greens',
          time: '7:30 PM',
          calories: '+320 kcal',
          color: 'bg-green-100'
        },
        {
          type: 'workout',
          icon: '🧘‍♀️',
          title: 'Yoga Session',
          description: '45 minutes of Hatha yoga',
          time: '6:15 PM',
          calories: '-180 kcal',
          color: 'bg-purple-100'
        }
      ]
    }
  ];

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍎';
      case 'workout': return '💪';
      case 'yoga': return '🧘‍♀️';
      default: return '📝';
    }
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

      {/* Weekly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weeklyStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </div>
        ))}
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
        {journalEntries.map((dayEntry, dayIndex) => (
          <div key={dayIndex} className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{dayEntry.date}</h3>
            
            <div className="space-y-4">
              {dayEntry.entries.map((entry, entryIndex) => (
                <div key={entryIndex} className={`p-4 rounded-lg ${entry.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg">{entry.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{entry.title}</div>
                        <div className="text-sm text-gray-600">{entry.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{entry.time}</div>
                      <div className={`font-semibold ${
                        entry.calories.startsWith('+') ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {entry.calories}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Button */}
      <div className="text-center">
        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto">
          <span className="text-lg">➕</span>
          <span>Add New Entry</span>
        </button>
      </div>
    </div>
  );
};

export default Journal;