import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
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

// Mock Data with premium Pinterest images
const products = [
  { id: 1, name: "Premium Bomber", price: "₦45,000", category: "Men", image: best1 },
  { id: 2, name: "Midnight Velvet", price: "₦65,000", category: "Women", image: best2 },
  { id: 3, name: "Core Hoodie", price: "₦32,000", category: "Unisex", image: best3 },
  { id: 4, name: "Classic Denim", price: "₦38,000", category: "Men", image: best4 },
  { id: 5, name: "Urban Chinos", price: "₦28,000", category: "Women", image: best5 },
  { id: 6, name: "Luxury Tee", price: "₦15,000", category: "Unisex", image: best6 },
  { id: 7, name: "Gold Watch", price: "₦120,000", category: "Accessories", image: best7 },
  { id: 8, name: "Street Cargo", price: "₦34,000", category: "Men", image: best8 },
  { id: 9, name: "Evening Gown", price: "₦85,000", category: "Women", image: best9 },
  { id: 10, name: "Silk Scarf", price: "₦12,000", category: "Accessories", image: best10 },
];

export default function Collections() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">All Collections</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-medium text-gray-400">
              <span className="text-white cursor-pointer border-b border-purple-500">All</span>
              <span className="hover:text-white cursor-pointer transition-colors">Men</span>
              <span className="hover:text-white cursor-pointer transition-colors">Women</span>
              <span className="hover:text-white cursor-pointer transition-colors">Unisex</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-4 rounded-lg border border-white/10 group-hover:border-purple-500/50 transition-all">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Quick Add Overlay */}
                      <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center text-black">
                        <span className="text-xs uppercase font-bold">Add to Cart</span>
                        <span className="text-xs font-bold">{product.price}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <h3 className="text-base md:text-lg font-heading font-bold group-hover:text-purple-300 transition-colors line-clamp-2">{product.name}</h3>
                        <p className="text-xs md:text-sm text-gray-400">{product.category}</p>
                      </div>
                      <span className="text-sm md:text-base font-bold text-purple-300 flex-shrink-0">{product.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
