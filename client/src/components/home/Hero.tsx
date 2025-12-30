import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/fashion_brand_hero_banner_with_diverse_models.png";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Deep Purple Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Bigwise Fashion Hero" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1025]/90 via-[#1a1025]/60 to-[#2a1b3d]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1025]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 md:px-8 lg:px-12 flex flex-col justify-center items-start pt-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl text-white"
        >
          <h2 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 text-purple-300">
            Est. 2025 • Ile-Ife & Lagos
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-tight mb-6">
            Fashion for the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Bold & Wise</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed font-light">
            Elevate your wardrobe with our premium collection. Designed for those who lead, inspire, and stand out.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/collections">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-14 px-10 text-sm uppercase tracking-widest font-bold transition-all shadow-lg shadow-purple-600/30 hover:scale-105"
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/collections?category=new">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 hover:border-white rounded-full h-14 px-10 text-sm uppercase tracking-widest font-bold bg-transparent backdrop-blur-sm"
              >
                New Arrivals
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-purple-200">Explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-purple-400 to-transparent" />
      </motion.div>
    </section>
  );
}
