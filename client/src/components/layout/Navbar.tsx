import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingBag, Search, User, Heart, LogOut, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/useSession";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated, logout } = useSession();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled || isOpen ? "bg-[#1a1025]/90 backdrop-blur-md border-white/10 py-4 shadow-lg shadow-purple-900/10" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Left Links */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-wider hover:text-purple-300 transition-colors font-medium",
                  location === link.href ? "text-purple-300 font-bold" : "text-white/90"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl md:text-3xl font-heading font-extrabold tracking-tighter text-center absolute left-1/2 -translate-x-1/2 md:static md:transform-none bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-white"
          >
            BIGWISE
          </Link>

          {/* Desktop Right Links */}
          <div className="hidden md:flex gap-6 items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <User className="w-5 h-5 cursor-pointer text-white/90 hover:text-purple-300 transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1025] border-white/10 text-white w-48">
                  <DropdownMenuLabel className="text-purple-300">
                    {user?.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                    onClick={() => setLocation("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                    onClick={() => setLocation("/orders")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <User className="w-5 h-5 cursor-pointer text-white/90 hover:text-purple-300 transition-colors" />
              </Link>
            )}
            <Link href="/wishlist">
               <Heart className="w-5 h-5 cursor-pointer text-white/90 hover:text-purple-300 transition-colors" />
            </Link>
            <div className="relative">
              <Link href="/cart">
                <ShoppingBag className="w-5 h-5 cursor-pointer text-white/90 hover:text-purple-300 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Cart */}
          <div className="flex md:hidden gap-4 text-white relative">
            <Link href="/cart">
              <ShoppingBag className="w-5 h-5 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
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
                  className="text-lg uppercase tracking-wider font-medium hover:text-purple-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/profile"
                    className="text-lg uppercase tracking-wider font-medium hover:text-purple-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="text-lg uppercase tracking-wider font-medium hover:text-purple-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}
              <div className="flex gap-6 mt-4 pt-6 border-t border-white/10 w-full justify-center">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="hover:text-purple-300 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>Login</Link>
                )}
                <Link href="/wishlist" onClick={() => setIsOpen(false)}>Wishlist</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

