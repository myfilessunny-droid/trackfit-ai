import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Camera,
  Settings,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated! ✅",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    if (profile.newPassword !== profile.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password changed! 🔒",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="lg:ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Profile 👤
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Avatar */}
          <Card className="fitness-card p-6 text-center animate-scale-in">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 mx-auto shadow-glow">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
          </Card>

          {/* Settings Tabs */}
          <Card className="fitness-card p-6 animate-slide-up">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile Info</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Security</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="transition-base focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="transition-base focus:ring-primary"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="hero-button">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="current-password" className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Current Password</span>
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
                      className="transition-base focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={profile.newPassword}
                        onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
                        className="transition-base focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={profile.confirmPassword}
                        onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
                        className="transition-base focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleChangePassword} className="hero-button">
                  <Settings className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;