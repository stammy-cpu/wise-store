import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, Settings } from "lucide-react";

export default function Admin() {
  const [location, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      console.log("Checking admin auth:", user);
      if (!user || !user.isAdmin) {
        setLocation("/auth");
      } else {
        setIsAdmin(true);
      }
    };
    checkAuth();
    
    // Periodically verify auth to prevent silent logout
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, [setLocation]);

  if (!isAdmin) return null;

  const stats = [
    { title: "Total Revenue", value: "₦4,250,000", icon: LayoutDashboard, color: "text-green-400" },
    { title: "Orders", value: "156", icon: ShoppingCart, color: "text-blue-400" },
    { title: "Customers", value: "1,204", icon: Users, color: "text-purple-400" },
    { title: "Messages", value: "12", icon: MessageSquare, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold">Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-white/5 border-white/10 text-white hover-elevate">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-widest text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-heading">Sales Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <LayoutDashboard className="text-purple-400" />
                </div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs">Revenue Analytics</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Detailed sales charts and trend analysis will be available here as your store processes more transactions.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-heading">Visitor Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                  <Users className="text-blue-400" />
                </div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs">User Engagement</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Real-time visitor tracking and demographic data will populate here to help you understand your audience better.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
