import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import best1 from "@assets/best_1.jpg";
import best2 from "@assets/best_2.jpg";
import best3 from "@assets/best_3.jpg";
import best4 from "@assets/best_4.jpg";
import best5 from "@assets/best_5.jpg";
import best6 from "@assets/best_6.jpg";
import best7 from "@assets/best_7.jpg";
import best8 from "@assets/best_8.jpg";
import best9 from "@assets/best_9.jpg";
import best10 from "@assets/best_10.jpg";

const bestSellers = [
  { id: 1, name: "Street Cargo", price: "₦34,000", image: "https://i.pinimg.com/736x/69/af/14/69af14a75cf43e67e3a892aa48dadccc.jpg" },
  { id: 2, name: "Bucket Hat", price: "₦12,000", image: "https://i.pinimg.com/736x/c4/84/a9/c484a94a27438cf10c3d076987f67d54.jpg" },
  { id: 3, name: "Premium Jacket", price: "₦65,000", image: "https://i.pinimg.com/736x/77/2b/db/772bdb67cbf7c977bd66020f9aa36228.jpg" },
  { id: 4, name: "Top", price: "₦25,000", image: "https://i.pinimg.com/736x/e9/6d/b7/e96db7813854e5c4e284281ec62fb447.jpg" },
  { id: 5, name: "Head Warmer", price: "₦8,000", image: "https://i.pinimg.com/736x/dd/69/f4/dd69f464a0cb9b2b8a37ea568bf90443.jpg" },
  { id: 6, name: "Tank Top", price: "₦15,000", image: "https://i.pinimg.com/736x/41/0e/73/410e737427270a5b51d741c6755e85d0.jpg" },
  { id: 7, name: "Short", price: "₦22,000", image: "https://i.pinimg.com/736x/69/af/14/69af14a75cf43e67e3a892aa48dadccc.jpg" },
  { id: 8, name: "Hoodie", price: "₦32,000", image: "https://i.pinimg.com/736x/0a/21/80/0a21808c859872850e8eefd2ff52e6e8.jpg" },
  { id: 9, name: "Skirt", price: "₦28,000", image: "https://i.pinimg.com/736x/60/da/ec/60daec25c85953c8f4f8501ee1481f00.jpg" },
  { id: 10, name: "Tank Singlet", price: "₦12,000", image: "https://i.pinimg.com/736x/0b/aa/8b/0baa8bf774f8adb40c6d19e1fd79d5ab.jpg" },
];

export function BestSellersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-4 -mx-4 md:px-0 md:mx-0"
        >
          {bestSellers.map((item) => (
            <motion.div 
              key={item.id}
              className="min-w-[260px] md:min-w-[350px] snap-start group"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-6 border border-white/5">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    localStorage.setItem('cart', JSON.stringify([...cart, item]));
                    window.dispatchEvent(new Event('storage'));
                    alert(`${item.name} added to cart!`);
                  }}
                  className="absolute bottom-6 left-6 right-6 bg-white text-black hover:bg-purple-100 font-bold translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all z-20"
                >
                  <ShoppingCart size={16} className="mr-2" /> Add to Cart
                </Button>
              </div>
              <h4 className="text-xl font-bold mb-1">{item.name}</h4>
              <p className="text-purple-400 font-medium">{item.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
