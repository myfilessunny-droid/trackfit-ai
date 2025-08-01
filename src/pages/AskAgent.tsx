import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  Brain, 
  Heart, 
  Activity,
  Scale,
  Ruler,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  height: string;
  weight: string;
  gender: string;
  age: string;
}

interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const AskAgent = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    height: "",
    weight: "",
    gender: "",
    age: ""
  });
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'agent',
      content: "Hello! I'm your personal AI health assistant. 🩺 I can help analyze your intake and output data, provide personalized recommendations, and answer any health-related questions. To get started, please share your basic information, and feel free to ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    // Simulate AI response (in real app, this would call an AI API)
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        role: 'agent',
        content: `Based on your query about "${message}", here's my analysis: I recommend tracking your daily intake and calorie burn more closely. With your current stats (${userStats.height || 'height not provided'}, ${userStats.weight || 'weight not provided'}, ${userStats.gender || 'gender not provided'}), you should focus on maintaining a balanced approach. Would you like specific recommendations for your meal planning or exercise routine?`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleStatsUpdate = () => {
    toast({
      title: "Stats updated! 📊",
      description: "Your health profile has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="lg:ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ask Your AI Health Agent 🤖
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal agentic doctor for intake & output analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Stats Panel */}
            <Card className="fitness-card p-6 animate-slide-up">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Your Health Profile
              </h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4" />
                    <span>Height (cm)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="170"
                    value={userStats.height}
                    onChange={(e) => setUserStats({...userStats, height: e.target.value})}
                    className="transition-base focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Scale className="w-4 h-4" />
                    <span>Weight (kg)</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={userStats.weight}
                    onChange={(e) => setUserStats({...userStats, weight: e.target.value})}
                    className="transition-base focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Gender</span>
                  </Label>
                  <Select value={userStats.gender} onValueChange={(value) => setUserStats({...userStats, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Age</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={userStats.age}
                    onChange={(e) => setUserStats({...userStats, age: e.target.value})}
                    className="transition-base focus:ring-primary"
                  />
                </div>

                <Button onClick={handleStatsUpdate} className="hero-button w-full">
                  <Brain className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </Card>

            {/* Chat Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chat History */}
              <Card className="fitness-card p-6 animate-scale-in">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-primary" />
                  AI Health Consultation
                </h3>

                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={msg.role === 'agent' ? 'bg-gradient-primary text-white' : 'bg-muted'}>
                            {msg.role === 'agent' ? '🤖' : '👤'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <span className="text-xs opacity-70">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-primary text-white">🤖</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="animate-pulse">Analyzing your data...</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex space-x-3">
                  <Textarea
                    placeholder="Ask about your nutrition, exercise routine, or health goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[60px] transition-base focus:ring-primary"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    className="hero-button self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="fitness-card p-6 animate-fade-in">
                <h4 className="font-semibold mb-4">💡 Quick Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Analyze my calorie intake vs burn",
                    "Suggest healthy meal options",
                    "Create a workout plan for me",
                    "Am I meeting my fitness goals?"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start hover:bg-muted transition-bounce"
                      onClick={() => setMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAgent;