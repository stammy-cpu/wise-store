import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { GenderTiles } from "@/components/home/GenderTiles";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BestSellersCarousel } from "@/components/home/BestSellersCarousel";
import { SizeGuide } from "@/components/home/SizeGuide";
import { Ambassadors } from "@/components/home/Ambassadors";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { MessageCircle, Star, ArrowRight, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import trendingImg1 from "@assets/best_1.jpg";
import trendingImg2 from "@assets/best_2.jpg";
import trendingImg3 from "@assets/best_3.jpg";
import trendingImg4 from "@assets/best_4.jpg";

// Placeholder for Trending Items
const trendingItems = [
  { id: 1, name: "Urban Bomber", price: "₦35,000", image: trendingImg1 },
  { id: 2, name: "Velvet Dress", price: "₦50,000", image: trendingImg2 },
  { id: 3, name: "Street Hoodie", price: "₦27,000", image: trendingImg3 },
  { id: 4, name: "Classic Tee", price: "₦14,500", image: trendingImg4 },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />

        {/* Gender Tiles */}
        <GenderTiles />
        
        {/* Best Sellers */}
        <BestSellersCarousel />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Size Guide */}
        <SizeGuide />
        
        {/* Trending Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-[#1a1025] to-[#251b35] px-6 md:px-8 lg:px-12">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold">Trending Now</h2>
              <Link href="/collections" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm uppercase tracking-wider font-bold">
                  View All <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trendingItems.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${item.id}`} className="block">
                      <div className="aspect-[3/4] rounded-lg mb-4 overflow-hidden relative bg-gray-800 border border-white/10 group-hover:border-purple-500/50 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                              localStorage.setItem('cart', JSON.stringify([...cart, item]));
                              window.dispatchEvent(new Event('storage'));
                              alert(`${item.name} added to cart!`);
                            }}
                            className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-none text-xs uppercase tracking-widest"
                          >
                            Quick Add
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm md:text-lg mb-1 group-hover:text-purple-300 transition-colors truncate">{item.name}</h3>
                      <p className="text-purple-300 font-medium text-sm md:text-base">{item.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ambassadors */}
        <Ambassadors />

        {/* Become Our Model Section */}
        <section className="py-20 md:py-24 bg-gradient-to-r from-purple-900/30 to-blue-900/30 px-6 md:px-8 lg:px-12">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex justify-center mb-6">
                  <Camera className="w-16 h-16 md:w-20 md:h-20 text-purple-400" />
                </div>
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Become Our Model</h2>
                <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                  Love fashion? We're looking for passionate individuals to represent the Bigwise brand. Showcase your style and join our growing community of content creators and brand ambassadors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="w-full sm:w-auto bg-white text-purple-950 hover:bg-gray-100 font-bold text-base md:text-lg px-8 py-3 rounded-full h-auto">
                    Apply Here
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-bold text-base md:text-lg px-8 py-3 rounded-full h-auto">
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-24 relative overflow-hidden px-6 md:px-8 lg:px-12">
          <div className="absolute inset-0 bg-purple-900/10 -skew-y-3 transform origin-left scale-110" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 md:mb-16">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { name: "Sarah J.", text: "Omo, the quality follow! I wear the velvet dress go gala and people no gree let me rest with compliments.", loc: "Lagos" },
                { name: "Michael T.", text: "Finally, a brand that understands modern African street style. Bigwise is the future.", loc: "Ile-Ife" },
                { name: "Amara K.", text: "Fast delivery and the packaging was so premium. Felt like opening a gift to myself.", loc: "Abuja" }
              ].map((t, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed text-sm md:text-base">"{t.text}"</p>
                  <div>
                    <h4 className="font-bold text-sm md:text-base">{t.name}</h4>
                    <span className="text-xs text-purple-400 uppercase tracking-widest">{t.loc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 md:py-24 bg-purple-900 text-white relative overflow-hidden px-6 md:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="container mx-auto text-center relative z-10">
            <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 text-purple-300" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Join the Bigwise Circle</h2>
            <p className="max-w-xl mx-auto text-purple-200 mb-10 text-base md:text-lg">
              Be the first to know about new drops, exclusive events, and member-only sales.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow bg-white/10 border border-white/20 rounded-full px-4 md:px-6 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm md:text-base"
              />
              <Button className="bg-white text-purple-900 hover:bg-gray-100 rounded-full px-6 md:px-8 font-bold w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        <InstagramFeed />
      </main>
      <Footer />
      
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} fill="white" />
        </a>
      </div>
    </div>
  );
}