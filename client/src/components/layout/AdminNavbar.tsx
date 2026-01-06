import { Link, useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNavbar() {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const navLinks = [
    { name: "HOME", href: "/admin" },
    { name: "POST ITEM", href: "/admin#post-item" },
    { name: "MESSAGES", href: "/admin#messages" },
    { name: "ORDERS", href: "/admin#orders" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1a1025] border-b border-white/10 py-4 shadow-lg">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-widest hover:text-purple-400 transition-colors font-bold",
                location === link.href.split('#')[0] ? "text-purple-400" : "text-white/70"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="text-xl font-heading font-extrabold tracking-tighter text-white">
          BIGWISE ADMIN
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} />
          <span>LOGOUT</span>
        </button>
      </div>
    </nav>
  );
}
