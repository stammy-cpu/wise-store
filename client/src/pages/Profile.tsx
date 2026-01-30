import { useSession } from "@/hooks/useSession";
import { useLocation } from "wouter";
import { User } from "lucide-react";
import { useEffect } from "react";

export default function Profile() {
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#251b35] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                <p className="text-purple-300 text-sm">Your Profile</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 block">
                  Username
                </label>
                <div className="bg-black/20 border border-white/10 rounded-lg p-3 text-white">
                  {user?.username}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-purple-300">
                  Profile editing features coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
