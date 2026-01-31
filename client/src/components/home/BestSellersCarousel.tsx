import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export function BestSellersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data: bestSellers = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/bestsellers"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/products/bestsellers");
      return res.json();
    },
  });

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        let scrollTo = scrollLeft + 300;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollTo = 0;
        }
        
        scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 md:py-24 bg-[#1a1025] px-6 md:px-8 lg:px-12 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold mb-4">Top Rated</h2>
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-white">Best Sellers</h3>
            </div>
          </div>
          <div className="text-center text-gray-400">Loading best sellers...</div>
        </div>
      </section>
    );
  }

  if (bestSellers.length === 0) {
    return null; // Don't show section if no best sellers
  }

  return (
    <section className="py-20 md:py-24 bg-[#1a1025] px-6 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold mb-4">Top Rated</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-white">Best Sellers</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full border-white/10 hover:bg-white/5">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full border-white/10 hover:bg-white/5">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-0 md:px-0"
        >
          {bestSellers.map((item) => (
            <motion.div
              key={item.id}
              className="min-w-[280px] xs:min-w-[320px] md:min-w-[350px] snap-center md:snap-start group"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-6 border border-white/5">
                <img
                  src={item.images?.[0] || ''}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    localStorage.setItem('cart', JSON.stringify([...cart, { id: item.id, name: item.name, price: item.price, image: item.images?.[0] }]));
                    window.dispatchEvent(new Event('storage'));
                    alert(`${item.name} added to cart!`);
                  }}
                  className="absolute bottom-6 left-6 right-6 bg-white text-black hover:bg-purple-100 font-bold translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all z-20"
                >
                  <ShoppingCart size={16} className="mr-2" /> Add to Cart
                </Button>
              </div>
              <h4 className="text-xl font-bold mb-1">{item.name}</h4>
              <p className="text-green-400 font-medium">₦{item.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
