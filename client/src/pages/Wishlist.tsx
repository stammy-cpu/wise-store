import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import womenImage from "@assets/generated_images/female_fashion_model_elegance.png";

export default function Wishlist() {
  const wishlistItems = [
    { id: 1, name: "Velvet Evening Dress", price: 105000, image: womenImage },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-10">My Wishlist</h1>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden group">
                  <div className="aspect-[3/4] bg-gray-800 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-purple-300 font-bold mb-4">₦{item.price.toLocaleString()}</p>
                    <Button className="w-full bg-white text-purple-950 hover:bg-gray-100 font-bold uppercase tracking-wider text-sm">
                      <ShoppingBag size={16} className="mr-2" /> Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-6">Your wishlist is empty.</p>
              <Link href="/collections">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
