import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Trash2, 
  Edit3, 
  Apple, 
  Activity,
  Clock,
  Filter
} from "lucide-react";
import { format, subDays } from "date-fns";

interface JournalEntry {
  id: string;
  type: 'meal' | 'activity';
  name: string;
  calories: number;
  time: Date;
  category?: string;
  details?: string;
}

const Journal = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  // Mock data - replace with real data
  const mockEntries: JournalEntry[] = [
    {
      id: '1',
      type: 'meal',
      name: 'Breakfast Bowl',
      calories: 450,
      time: new Date(),
      category: 'Breakfast',
      details: 'Oatmeal with fruits and nuts'
    },
    {
      id: '2',
      type: 'activity',
      name: 'Morning Run',
      calories: 350,
      time: subDays(new Date(), 0),
      category: 'Cardio',
      details: '5km in 30 minutes'
    },
    {
      id: '3',
      type: 'meal',
      name: 'Chicken Salad',
      calories: 320,
      time: subDays(new Date(), 1),
      category: 'Lunch',
      details: 'Grilled chicken with mixed greens'
    },
    {
      id: '4',
      type: 'activity',
      name: 'Yoga Session',
      calories: 180,
      time: subDays(new Date(), 1),
      category: 'Flexibility',
      details: '45 minutes of Hatha yoga'
    },
    {
      id: '5',
      type: 'meal',
      name: 'Protein Smoothie',
      calories: 280,
      time: subDays(new Date(), 2),
      category: 'Snack',
      details: 'Banana, protein powder, almond milk'
    },
  ];

  const groupedEntries = mockEntries.reduce((acc, entry) => {
    const dateKey = format(entry.time, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  const totalCaloriesConsumed = mockEntries
    .filter(entry => entry.type === 'meal')
    .reduce((sum, entry) => sum + entry.calories, 0);

  const totalCaloriesBurned = mockEntries
    .filter(entry => entry.type === 'activity')
    .reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Here's what you ate and burned 🍛🏃
            </h1>
            <p className="text-lg text-muted-foreground">
              Swipe through your health archive.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="fitness-card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-600">Consumed</h3>
              <p className="text-2xl font-bold">{totalCaloriesConsumed}</p>
              <p className="text-sm text-muted-foreground">kcal this week</p>
            </Card>

            <Card className="fitness-card p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-orange-600">Burned</h3>
              <p className="text-2xl font-bold">{totalCaloriesBurned}</p>
              <p className="text-sm text-muted-foreground">kcal this week</p>
            </Card>

            <Card className="fitness-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-600">Entries</h3>
              <p className="text-2xl font-bold">{mockEntries.length}</p>
              <p className="text-sm text-muted-foreground">logs this week</p>
            </Card>
          </div>

          {/* Filter Controls */}
          <Card className="fitness-card p-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">View:</span>
              </div>
              <div className="flex space-x-2">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="capitalize transition-base"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <div className="space-y-8 animate-fade-in">
            {Object.entries(groupedEntries)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, entries]) => (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {format(new Date(date), 'd')}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {format(new Date(date), 'EEEE')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Entries for the day */}
                  <div className="ml-6 border-l-2 border-muted pl-6 space-y-4">
                    {entries.map((entry) => (
                      <Card key={entry.id} className="fitness-card p-4 group hover:shadow-lg transition-slow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              entry.type === 'meal' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              {entry.type === 'meal' ? (
                                <Apple className="w-5 h-5" />
                              ) : (
                                <Activity className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold">{entry.name}</h4>
                                {entry.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {entry.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {entry.details}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{format(entry.time, 'h:mm a')}</span>
                                </div>
                                <div className="font-semibold text-primary">
                                  {entry.type === 'meal' ? '+' : '-'}{entry.calories} kcal
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-base">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {mockEntries.length === 0 && (
            <Card className="fitness-card p-12 text-center animate-fade-in">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No logs yet</h3>
              <p className="text-muted-foreground mb-6">
                Your health archive starts now!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="hero-button">
                  <Apple className="w-4 h-4 mr-2" />
                  Log a Meal
                </Button>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;