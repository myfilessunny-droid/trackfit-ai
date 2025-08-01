import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Camera, Brain, Sunrise } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroFoodDetection from "@/assets/hero-food-detection.jpg";
import heroAiBrain from "@/assets/hero-ai-brain.jpg";
import heroWellnessJourney from "@/assets/hero-wellness-journey.jpg";

const slides = [
  {
    id: 1,
    title: "Your Health, Tracked by AI",
    subtitle: "Snap your meals, track your health.",
    image: heroFoodDetection,
    icon: Camera,
  },
  {
    id: 2,
    title: "Smart Insights, Infinite Motivation",
    subtitle: "Smart calorie + burn estimation.",
    image: heroAiBrain,
    icon: Brain,
  },
  {
    id: 3,
    title: "Welcome to Your Wellness Journey",
    subtitle: "Your AI-powered wellness journey starts here.",
    image: heroWellnessJourney,
    icon: Sunrise,
  },
];

export const WelcomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewedSlides, setViewedSlides] = useState(new Set([0]));
  const navigate = useNavigate();

  const nextSlide = () => {
    const next = Math.min(currentSlide + 1, slides.length - 1);
    setCurrentSlide(next);
    setViewedSlides(prev => new Set(prev).add(next));
  };

  const prevSlide = () => {
    setCurrentSlide(Math.max(currentSlide - 1, 0));
  };

  const allSlidesViewed = viewedSlides.size === slides.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
      <Card className="max-w-4xl w-full p-8 rounded-2xl shadow-xl fitness-card animate-fade-in">
        <div className="relative overflow-hidden">
          {/* Main Content */}
          <div className="flex transition-transform duration-500 ease-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={slide.id} className="w-full flex-shrink-0 text-center">
                <div className="mb-8">
                  <div className="relative mb-6">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    <div className="absolute bottom-4 right-4 p-3 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
                      <slide.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="rounded-full h-12 w-12 shadow-md transition-bounce hover:scale-110 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Progress Dots */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary shadow-glow scale-125' 
                      : viewedSlides.has(index)
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="rounded-full h-12 w-12 shadow-md transition-bounce hover:scale-110 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* CTA Button */}
          {allSlidesViewed && (
            <div className="mt-8 text-center animate-bounce-in">
              <Button
                onClick={() => navigate('/login')}
                className="hero-button text-lg px-8 py-3 rounded-full shadow-xl animate-pulse-glow"
                size="lg"
              >
                Let's Begin ✨
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};