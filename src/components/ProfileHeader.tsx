import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => navigate("/profile")}
        variant="outline"
        size="icon"
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-glow transition-all duration-200 hover:scale-105"
      >
        <Avatar className="w-6 h-6">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="text-xs bg-gradient-primary text-white">
            <User className="w-3 h-3" />
          </AvatarFallback>
        </Avatar>
      </Button>
    </div>
  );
};