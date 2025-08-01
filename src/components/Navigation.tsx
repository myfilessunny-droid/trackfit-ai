import { Button } from "@/components/ui/button";
import { 
  Home, 
  Camera, 
  Activity, 
  BookOpen, 
  User, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Food Detection", icon: Camera, path: "/food-detection" },
    { name: "Calorie Burn", icon: Activity, path: "/calorie-burn" },
    { name: "Journal", icon: BookOpen, path: "/journal" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Help", icon: HelpCircle, path: "/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <nav className={`fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-border/50 shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white">
              <span className="font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitTrack AI
            </h1>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 h-12 transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted hover:scale-105"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};