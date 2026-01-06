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
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.isAdmin) {
      setLocation("/auth");
    } else {
      setIsAdmin(true);
    }
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card id="post-item" className="bg-white/5 border-white/10 text-white scroll-mt-24">
              <CardHeader>
                <CardTitle className="font-heading">Post New Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Product Name</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="e.g. Classic Purple Jacket" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Price (₦)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="35,000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500">
                      <option>Jackets</option>
                      <option>Dresses</option>
                      <option>Streetwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Sex</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500">
                      <option>Unisex</option>
                      <option>Men</option>
                      <option>Women</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Sizes (Comma separated)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="S, M, L, XL" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Colors (Comma separated)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="Purple, Black, White" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Upload Media (Photos & Videos)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                    <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Supports JPG, PNG, MP4</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-purple-600 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-purple-700 transition-colors mt-4">
                  Post Item
                </button>
              </CardContent>
            </Card>

            <Card id="orders" className="bg-white/5 border-white/10 text-white scroll-mt-24">
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

            <Card id="messages" className="bg-white/5 border-white/10 text-white scroll-mt-24">
              <CardHeader>
                <CardTitle className="font-heading">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">Manage your customer conversations.</p>
                  <Link href="/chat">
                    <button className="w-full py-3 bg-purple-600/20 border border-purple-500/30 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-purple-600/40 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={16} />
                      Open Chat Center
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
