import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to welcome page on app load
    navigate("/welcome");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <span className="font-bold text-white text-xl">F</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Loading FitTrack AI...
        </h1>
      </div>
    </div>
  );
};

export default Index;
