import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User, Mail, LogOut, Package, Heart, ShoppingCart } from "lucide-react";
import { useSession } from "@/hooks/useSession";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoading, logout } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1025] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your account information</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Profile Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 md:w-6 md:h-6" />
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 uppercase tracking-wide">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-white text-lg">{user.username}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <button
                  onClick={() => setLocation("/orders")}
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setLocation("/wishlist")}
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setLocation("/cart")}
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
