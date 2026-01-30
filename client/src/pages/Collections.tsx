import { apiFetch } from '@/lib/apiClient';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";

export default function Collections() {
  // Get gender from URL params and set initial filter
  const urlParams = new URLSearchParams(window.location.search);
  const genderParam = urlParams.get("gender");

  // Map URL gender param to filter value
  const getInitialFilter = () => {
    if (genderParam === "male") return "Men";
    if (genderParam === "female") return "Women";
    return "All";
  };

  const [selectedFilter, setSelectedFilter] = useState<string>(getInitialFilter());

  // Fetch products from API
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await apiFetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  // Filter products based on selected category
  const filteredProducts = products.filter(product => {
    if (selectedFilter === "All") return true;
    return product.sex === selectedFilter || product.category === selectedFilter;
  });
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">All Collections</h1>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-medium text-gray-400">
              {['All', 'Men', 'Women', 'Unisex', 'Accessories'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`cursor-pointer transition-colors ${
                    selectedFilter === filter
                      ? 'text-white border-b border-purple-500'
                      : 'hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="text-xl">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-xl text-gray-400">No products found</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map((product, index) => (
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
                      <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-2 rounded-md border border-white/10 group-hover:border-purple-500/50 transition-all">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        {/* Quick Add Overlay */}
                        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center text-black">
                          <span className="text-[10px] md:text-xs uppercase font-bold">Add to Cart</span>
                          <span className="text-[10px] md:text-xs font-bold text-green-600">₦{product.price}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm md:text-base font-heading font-bold group-hover:text-purple-300 transition-colors line-clamp-2">{product.name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-400">{product.category || product.sex || 'Product'}</p>
                        <span className="text-sm md:text-base font-bold text-green-500 mt-1">₦{product.price}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
