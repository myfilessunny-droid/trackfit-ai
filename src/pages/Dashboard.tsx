import { Navigation } from "@/components/Navigation";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="lg:ml-64">
        <DashboardComponent />
      </div>
    </div>
  );
};

export default Dashboard;