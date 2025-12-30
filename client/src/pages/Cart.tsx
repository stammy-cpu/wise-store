import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import menImage from "@assets/generated_images/male_fashion_model_urban_style.png";

export default function Cart() {
  const cartItems = [
    { id: 1, name: "Bigwise Urban Bomber", size: "M", color: "Purple", price: 50000, image: menImage },
    { id: 2, name: "Classic White Tee", size: "M", color: "White", price: 18000, image: menImage },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-10">Your Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-full sm:w-24 h-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <h3 className="font-heading font-bold text-lg">{item.name}</h3>
                      <span className="font-bold text-purple-300">₦{item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mb-4">Size: {item.size} • Color: {item.color}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xs">-</button>
                        <span className="text-sm font-bold">1</span>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xs">+</button>
                      </div>
                      <button className="text-red-400 hover:text-red-300 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/collections">
                <a className="inline-flex items-center gap-2 text-purple-300 hover:text-white mt-4 font-medium transition-colors text-sm">
                  <ArrowRight size={16} className="rotate-180" /> Continue Shopping
                </a>
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 sticky top-24">
                <h3 className="font-heading font-bold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-300 text-sm md:text-base">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm md:text-base">
                    <span>Shipping</span>
                    <span>₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between font-bold text-lg md:text-xl text-white">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full h-12 md:h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold uppercase tracking-wider mb-4 shadow-lg shadow-purple-600/20 text-sm md:text-base">
                  Checkout
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock size={12} /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
