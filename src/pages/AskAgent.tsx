import React, { useState } from "react";
import { PaperclipButton } from "@/components/ui/PaperclipButton";

const AskAgent = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm your personal AI health assistant. I can help analyze your intake and output data, provide personalized recommendations, and answer any health-related questions. To get started, please share your basic information, and feel free to ask me anything!`,
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const quickQuestions = [
    "Analyze my calorie intake vs burn",
    "Suggest healthy meal options",
    "Create a workout plan for me",
    "Am I meeting my fitness goals?",
  ];

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const userMsg = {
      sender: "user",
      text: prompt,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "The app is present a beta (testing) phase. This feature will be implemented according to user response.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 400);
  };

  // Handler for file upload (for paperclip button)
  const handleChooseFile = () => {
    // You can implement file input logic here, e.g. open a hidden file input
    alert("File upload coming soon!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-600">
          ASK Your AI Health Agent
        </h1>
        <p className="text-gray-600">
          Your personal agentic doctor for intake & output analysis
        </p>
      </div>

      {/* AI Health Consultation Only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📹</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              AI Health Consultation
            </h2>
          </div>
          <div className="space-y-4">
            {/* AI Message List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-4 ${
                    msg.sender === "ai"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-50 text-green-900 ml-auto"
                  }`}
                  style={{ maxWidth: "90%" }}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>
            {/* Input Area */}
            <form className="flex space-x-2" onSubmit={handlePromptSubmit}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about your nutrition, exercise routine, or health goals..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <span className="text-lg">📤</span>
              </button>
              <PaperclipButton onClick={handleChooseFile} />
            </form>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Quick Questions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              onClick={() => setPrompt(question)}
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
