import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#2a1b3d] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-heading font-bold tracking-tighter">BIGWISE</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Modern fashion for the bold and wise. We create timeless pieces that elevate your everyday style with precision and grace.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white/70 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white/70 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white/70 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/collections" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex gap-2 w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-b border-white/20 py-2 px-0 w-full focus:outline-none focus:border-white text-sm text-white placeholder:text-white/40 text-center md:text-left"
              />
              <button className="text-sm uppercase font-bold tracking-widest hover:text-white/70">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Bigwise Clothings. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
