import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart, Share2, MessageCircle, Phone, Truck, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import best1 from "@assets/best_1.jpg";
import best2 from "@assets/best_2.jpg";
import best3 from "@assets/best_3.jpg";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock product data
  const product = {
    name: "Bigwise Premium Bomber",
    price: "₦45,000",
    description: "Designed for the modern urban lifestyle. This premium bomber jacket features water-resistant fabric, our signature purple-tinted hardware, and impeccable tailoring. Perfect for layering in any season. The jacket combines street style aesthetics with refined craftsmanship.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Purple", "Black", "Olive"],
    images: [best1, best2, best3],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <Link href="/collections">
            <a className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-8 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Collections
            </a>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
            {/* Image Slider */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group">
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                
                {/* Navigation Buttons */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-purple-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-purple-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-sm text-white">
                  {currentImageIndex + 1} / {product.images.length}
                </div>

                {/* Wishlist Button */}
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                >
                  <Heart size={20} className={cn("transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-white")} />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      currentImageIndex === i 
                        ? "border-purple-500 shadow-lg shadow-purple-600/20" 
                        : "border-white/10 hover:border-purple-500/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-heading font-bold mb-2">{product.name}</h1>
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">{product.price}</div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-8 border-b border-white/10 pb-8 text-sm md:text-base">
                {product.description}
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <span className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">Select Size</span>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-lg border flex items-center justify-center font-bold transition-all text-sm",
                          selectedSize === size 
                            ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30" 
                            : "border-white/20 hover:border-white/50 text-gray-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">Color</span>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-900 border-2 border-white ring-2 ring-purple-500 cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-black border-2 border-transparent hover:border-white cursor-pointer" />
                    <div className="w-8 h-8 rounded-full bg-stone-700 border-2 border-transparent hover:border-white cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button className="flex-1 h-12 md:h-14 bg-white text-purple-950 hover:bg-gray-100 rounded-full font-bold text-sm md:text-lg uppercase tracking-wide">
                  Add to Cart
                </Button>
                <Button variant="outline" className="h-12 md:h-14 w-12 md:w-14 rounded-full border-white/20 hover:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Share2 size={20} />
                </Button>
              </div>

              {/* Direct Contact Options */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                <h3 className="font-heading font-bold text-lg">Have questions? Talk to us.</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 justify-start gap-3 text-sm">
                    <MessageCircle size={18} /> WhatsApp Us
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 justify-start gap-3 text-sm">
                    <MessageCircle size={18} /> Direct Message
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/5 justify-start gap-3 text-sm">
                    <Phone size={18} /> Call Sales
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Truck size={20} className="text-purple-400 flex-shrink-0" />
                  <span>Fast & Secure Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <ShieldCheck size={20} className="text-purple-400 flex-shrink-0" />
                  <span>Authentic Quality Guaranteed</span>
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
