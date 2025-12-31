import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import best1 from "@assets/best_1.jpg";
import best2 from "@assets/best_2.jpg";
import best3 from "@assets/best_3.jpg";
import { Button } from "@/components/ui/button";

const collections = [
  {
    id: 1,
    title: "Jackets & Outerwear",
    image: best1,
    link: "/collections",
    description: "Premium urban layers crafted for style and comfort."
  },
  {
    id: 2,
    title: "Dresses & Formal",
    image: best2,
    link: "/collections",
    description: "Elegant pieces for every occasion."
  },
  {
    id: 3,
    title: "Streetwear Essentials",
    image: best3,
    link: "/collections",
    description: "Contemporary pieces that define your vibe."
  }
];

export function FeaturedCollections() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1025] to-[#251b35] px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 md:mb-4">Featured Collections</h2>
            <p className="text-purple-200 max-w-md text-sm md:text-base">Discover our latest arrivals, designed to elevate your everyday wardrobe with premium materials and timeless cuts.</p>
          </div>
          <Link href="/collections" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-purple-300 transition-colors">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5 mb-4 md:mb-6 rounded-xl border border-white/10 group-hover:border-purple-500/50 transition-all">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-bold mb-2">{collection.title}</h3>
              <p className="text-sm md:text-base text-purple-200 mb-4">{collection.description}</p>
              <Button 
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                  localStorage.setItem('cart', JSON.stringify([...cart, { ...collection, name: collection.title, price: '₦0' }]));
                  window.dispatchEvent(new Event('storage'));
                  alert(`${collection.title} added to cart!`);
                }} 
                className="inline-block h-auto p-0 text-sm uppercase tracking-widest font-bold border-b border-white rounded-none pb-1 hover:text-purple-300 hover:border-purple-300 transition-all text-white no-underline hover:no-underline"
              >
                  Shop Now
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/collections">
            <Button variant="outline" className="w-full bg-white text-black hover:bg-gray-100">View All Collections</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
