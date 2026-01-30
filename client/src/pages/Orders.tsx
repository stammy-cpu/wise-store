import { useSession } from "@/hooks/useSession";
import { useLocation } from "wouter";
import { Package } from "lucide-react";
import { useEffect } from "react";

export default function Orders() {
  const { user, isAuthenticated, isLoading } = useSession();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1025] to-[#251b35] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1025] to-[#251b35] pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Orders</h1>
            <p className="text-purple-300">View and track your order history</p>
          </div>

          <div className="bg-[#251b35] border border-white/10 rounded-2xl p-12 shadow-xl text-center">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-purple-300 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <a
              href="/collections"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider text-sm transition-colors"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
