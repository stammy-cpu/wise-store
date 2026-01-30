import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/hooks/useSession";

export default function OrdersPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoading } = useSession();

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
              <div className="py-12 text-center">
                <p className="text-gray-400 text-sm">No orders yet. Orders will appear here once customers start purchasing.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
