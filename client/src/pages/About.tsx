import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import studioImage from "@assets/generated_images/fashion_design_studio_interior.png";
import { Cpu, Brain, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16 md:mb-20"
          >
            <h1 className="text-3xl md:text-6xl font-heading font-bold mb-4 md:mb-6">The Bigwise Story</h1>
            <p className="text-base md:text-xl text-purple-200 leading-relaxed font-light">
              We believe fashion is more than just clothing. It's a statement, a lifestyle, and a reflection of who you are.
            </p>
          </motion.div>

          {/* Mission & Vision Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-20 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-full max-w-[320px] md:max-w-[450px]"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-lg" />
              <div className="relative z-10 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img 
                  src="https://i.pinimg.com/736x/06/1f/e9/061fe912f1974f95fcd86831260dbdf4.jpg" 
                  alt="Bigwise Inspiration" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4">Who We Are</h2>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Bigwise Clothings is a fashion-forward brand dedicated to creating premium, timeless pieces that celebrate individuality. We design for those who are confident, creative, and unafraid to express themselves through fashion.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 md:mb-3">Our Philosophy</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  Quality over quantity. Sustainability over trends. We believe in crafting clothing that lasts—both in durability and in style. Every piece tells a story of meticulous design and premium craftsmanship.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="relative py-16 md:py-20 border-t border-white/10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 md:mb-16 uppercase tracking-widest">Our Core Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 hover:border-purple-500/50 transition-all hover-elevate"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tighter">Premium Craftsmanship</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  We don't just make clothes; we engineer statements. Every stitch is a commitment to quality, ensuring that BIGWISE pieces aren't just worn—they're experienced.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 hover:border-purple-500/50 transition-all hover-elevate"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tighter">Bold Individuality</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  Fashion is your silent manifesto. We design for the unapologetic, the trendsetters, and the rebels who use their style to command the room without saying a word.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-10 hover:border-purple-500/50 transition-all hover-elevate"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tighter">The BIGWISE Culture</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  From the streets of Lagos to the world, we are more than a brand. We are a community of creatives and visionaries who believe in the power of premium African fashion.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-20">
            <div className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 text-center hover:border-purple-500/30 transition-colors">
              <span className="block text-2xl md:text-4xl font-bold text-purple-400 mb-2">5000+</span>
              <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Happy Customers</span>
            </div>
            <div className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 text-center hover:border-purple-500/30 transition-colors">
              <span className="block text-2xl md:text-4xl font-bold text-purple-400 mb-2">100%</span>
              <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Premium Quality</span>
            </div>
            <div className="bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 text-center hover:border-purple-500/30 transition-colors">
              <span className="block text-2xl md:text-4xl font-bold text-purple-400 mb-2">2020</span>
              <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">Year Founded</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
