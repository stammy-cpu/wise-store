import { Instagram } from "lucide-react";
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
              <a href="https://www.tiktok.com/@letstalkbigwise" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://snapchat.com/t/BTgvLyOY" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors" aria-label="Snapchat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.868.056-.345.045-.704.06-1.048.06-1.573 0-2.995-.732-4.77-2.42-1.857 1.736-3.642 2.42-5.277 2.42-.27 0-.52-.015-.748-.045-.36-.045-.689-.06-1.048-.06-.51 0-.915.06-1.275.135-.255.044-.405.074-.539.074-.016 0-.031 0-.045-.015-.285 0-.479-.134-.555-.405-.06-.193-.12-.374-.15-.553-.029-.195-.089-.479-.164-.57-1.856-.284-2.904-.702-3.146-1.271-.03-.076-.045-.15-.045-.225-.015-.24.165-.465.42-.509 3.264-.539 4.73-3.879 4.791-4.014l.016-.015c.18-.345.209-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.044-.24-.09-.346-.119-.823-.33-1.227-.719-1.212-1.168 0-.36.285-.69.734-.839.15-.06.327-.09.51-.09.12 0 .299.016.463.105.375.18.735.285 1.034.3.193 0 .326-.044.401-.09-.009-.164-.019-.33-.03-.51l-.002-.06c-.105-1.628-.23-3.654.298-4.847 1.583-3.545 4.94-3.821 5.93-3.821z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/letstalkbigwise" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
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
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
            Designed by <a href="https://stammy.org" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">STAMMY</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
