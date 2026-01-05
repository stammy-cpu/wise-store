import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const stats = [
    { title: "Total Revenue", value: "₦4,250,000", icon: LayoutDashboard, color: "text-green-400" },
    { title: "Orders", value: "156", icon: ShoppingCart, color: "text-blue-400" },
    { title: "Customers", value: "1,204", icon: Users, color: "text-purple-400" },
    { title: "Messages", value: "12", icon: MessageSquare, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold">Admin Dashboard</h1>
            <Link href="/chat">
              <div className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                <MessageSquare size={20} />
                <span className="font-bold uppercase tracking-widest text-sm">Customer Chat</span>
              </div>
            </Link>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-heading">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex justify-between items-center p-4 rounded-lg bg-black/20">
                      <div>
                        <p className="font-bold">Order #00{order}</p>
                        <p className="text-gray-400 text-xs">2 hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦35,000</p>
                        <p className="text-green-400 text-xs">Delivered</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                  <ShoppingCart size={24} className="text-purple-400" />
                  <span className="text-xs uppercase font-bold tracking-tighter">Manage Products</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                  <Users size={24} className="text-blue-400" />
                  <span className="text-xs uppercase font-bold tracking-tighter">View Customers</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                  <Settings size={24} className="text-gray-400" />
                  <span className="text-xs uppercase font-bold tracking-tighter">Store Settings</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                  <LayoutDashboard size={24} className="text-green-400" />
                  <span className="text-xs uppercase font-bold tracking-tighter">Sales Reports</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
