import { Link, useLocation } from "wouter";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";
import { useState } from "react";

export function AdminNavbar() {
  const [location] = useLocation();
  const { user, logout } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "/admin" },
    { name: "PRODUCTS", href: "/admin/products" },
    { name: "POST ITEM", href: "/admin/post-item" },
    { name: "MESSAGES", href: "/admin/messages" },
    { name: "ORDERS", href: "/admin/orders" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1a1025] border-b border-white/10 py-4 shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <a
                  className={cn(
                    "text-xs uppercase tracking-widest hover:text-purple-400 transition-colors font-bold",
                    location === link.href ? "text-purple-400" : "text-white/70"
                  )}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </div>

          {/* Logo - centered on mobile, normal on desktop */}
          <div className="text-lg md:text-xl font-heading font-extrabold tracking-tighter text-white absolute left-1/2 -translate-x-1/2 md:static md:transform-none">
            BIGWISE ADMIN
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-2 md:gap-4">
            {user && (
              <span className="hidden md:block text-xs text-white/50">
                {user.username}
              </span>
            )}
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 md:gap-2 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1025] border-b border-white/10 animate-in slide-in-from-top-5">
            <div className="flex flex-col p-6 gap-6 items-center text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <a
                    className={cn(
                      "text-lg uppercase tracking-wider font-medium hover:text-purple-300",
                      location === link.href ? "text-purple-400" : "text-white/90"
                    )}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
              {user && (
                <div className="pt-4 border-t border-white/10 w-full text-center">
                  <span className="text-xs text-white/50">
                    Logged in as {user.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
