import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Package } from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/auth/session"],
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    setLocation("/auth");
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-gray-900">{user.username}</p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setLocation("/orders")}
                variant="outline"
                className="w-full justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
              <Button
                onClick={() => setLocation("/wishlist")}
                variant="outline"
                className="w-full justify-start"
              >
                View Wishlist
              </Button>
              <Button
                onClick={() => setLocation("/cart")}
                variant="outline"
                className="w-full justify-start"
              >
                View Cart
              </Button>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
