import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function OrdersPage() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.isAdmin) {
      setLocation("/auth");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 text-sm">
                  {[1, 2, 3, 4, 5].map((order) => (
                    <div key={order} className="flex justify-between items-center p-6 rounded-lg bg-black/20 border border-white/5">
                      <div>
                        <p className="font-bold text-lg">Order #00{order}</p>
                        <p className="text-gray-400 text-sm">2 hours ago • Customer: Fatah Tammy</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₦35,000</p>
                        <p className="text-green-400 text-sm font-bold uppercase tracking-widest">Delivered</p>
                      </div>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
