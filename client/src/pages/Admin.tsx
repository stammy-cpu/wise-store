import { apiFetch } from '@/lib/apiClient';
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, Settings } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoading } = useSession();

  // Fetch admin stats
  const { data: adminStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await apiFetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: isAdmin,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/auth");
    }
  }, [isAdmin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1025] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const stats = [
    { title: "Total Revenue", value: "₦0", icon: LayoutDashboard, color: "text-green-400" },
    { title: "Orders", value: String(adminStats?.orders || 0), icon: ShoppingCart, color: "text-blue-400" },
    { title: "Customers", value: String(adminStats?.customers || 0), icon: Users, color: "text-purple-400" },
    { title: "Messages", value: String(adminStats?.messages || 0), icon: MessageSquare, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="grow pt-24 md:pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold">Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-white/5 border-white/10 text-white hover-elevate">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-3 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="font-heading text-lg md:text-xl">Sales Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-48 md:h-64 flex flex-col items-center justify-center text-center px-4 md:px-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-600/20 flex items-center justify-center mb-3 md:mb-4">
                  <LayoutDashboard className="text-purple-400 w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs">Revenue Analytics</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Detailed sales charts and trend analysis will be available here as your store processes more transactions.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="font-heading text-lg md:text-xl">Visitor Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-48 md:h-64 flex flex-col items-center justify-center text-center px-4 md:px-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3 md:mb-4">
                  <Users className="text-blue-400 w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h4 className="font-bold mb-2 uppercase tracking-widest text-xs">User Engagement</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Real-time visitor tracking and demographic data will populate here to help you understand your audience better.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
