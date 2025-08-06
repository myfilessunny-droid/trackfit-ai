import React, { useState } from 'react';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: 'wellness' | 'nutrition' | 'fitness' | 'mindfulness';
  color: string;
}

const SuggestionsBar = () => {
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const suggestions: Suggestion[] = [
    {
      id: 1,
      title: "Mindful Eating",
      description: "Take 3 deep breaths before each meal to practice mindful eating",
      icon: "🧘",
      category: "mindfulness",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Hydration Reminder",
      description: "Drink a glass of water - you're 60% water, stay hydrated!",
      icon: "💧",
      category: "wellness",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Quick Stretch",
      description: "Stand up and stretch for 2 minutes every hour",
      icon: "🤸",
      category: "fitness",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      title: "Protein Boost",
      description: "Add some nuts or Greek yogurt to your next snack",
      icon: "🥜",
      category: "nutrition",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      title: "Gratitude Practice",
      description: "Write down 3 things you're grateful for today",
      icon: "🙏",
      category: "mindfulness",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const nextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const currentSuggestion = suggestions[currentSuggestionIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Navigation Buttons */}
          <button
            onClick={prevSuggestion}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-gray-600">‹</span>
          </button>

          {/* Main Suggestion Card */}
          <div className="flex-1 mx-4">
            <div className={`bg-gradient-to-r ${currentSuggestion.color} rounded-xl p-4 text-white shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{currentSuggestion.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{currentSuggestion.title}</h3>
                  <p className="text-white text-opacity-90 text-sm">{currentSuggestion.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={nextSuggestion}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-gray-600">›</span>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-3 space-x-2">
          {suggestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSuggestionIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSuggestionIndex ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionsBar; 