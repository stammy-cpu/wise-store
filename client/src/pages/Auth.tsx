import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useState("");
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/login", { username, password });
      const user = await res.json();
      
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      localStorage.setItem("user", JSON.stringify(user));

      if (user.isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-900/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Join the Bigwise community</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/20 p-1 rounded-xl mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Email</label>
                  <Input 
                    type="email" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="john@example.com" 
                    className="bg-black/20 border-white/10 text-white h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Password</label>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="bg-black/20 border-white/10 text-white h-12" 
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot password?</a>
                </div>
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full h-12 bg-white text-purple-950 hover:bg-gray-100 font-bold uppercase tracking-wider rounded-lg mt-4"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                  <Input placeholder="John Doe" className="bg-black/20 border-white/10 text-white h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Email</label>
                  <Input type="email" placeholder="john@example.com" className="bg-black/20 border-white/10 text-white h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Password</label>
                  <Input type="password" placeholder="Create a password" className="bg-black/20 border-white/10 text-white h-12" />
                </div>
                <Button className="w-full h-12 bg-purple-600 text-white hover:bg-purple-700 font-bold uppercase tracking-wider rounded-lg mt-4">
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
