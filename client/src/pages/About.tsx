import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import studioImage from "@assets/generated_images/fashion_design_studio_interior.png";
import { Cpu, Brain, Heart, Sparkles, Award, Shield, Camera, CheckCircle, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// WhatsApp number for model applications
const WHATSAPP_NUMBER = "+2349055376301";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 px-6 md:px-8 lg:px-12">
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

          {/* Core Principles - Enhanced */}
          <div className="relative py-16 md:py-20 border-t border-white/10 overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent pointer-events-none" />

            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 uppercase tracking-widest relative z-10"
            >
              Our Core Principles
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center text-purple-200 mb-12 md:mb-16 max-w-2xl mx-auto"
            >
              The foundation of everything we create
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-10 overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated icon container */}
                <motion.div
                  className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="w-7 h-7 md:w-10 md:h-10 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </motion.div>

                <h3 className="relative text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tight group-hover:text-purple-200 transition-colors">
                  Premium Craftsmanship
                </h3>
                <p className="relative text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                  We don't just make clothes; we engineer statements. Every stitch is a commitment to quality, ensuring that BIGWISE pieces aren't just worn—they're experienced.
                </p>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-pink-600/30 to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Brain className="w-7 h-7 md:w-10 md:h-10 text-pink-300 group-hover:text-pink-200 transition-colors" />
                </motion.div>

                <h3 className="relative text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tight group-hover:text-pink-200 transition-colors">
                  Bold Individuality
                </h3>
                <p className="relative text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                  Fashion is your silent manifesto. We design for the unapologetic, the trendsetters, and the rebels who use their style to command the room without saying a word.
                </p>

                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-600/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-blue-600/30 to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Heart className="w-7 h-7 md:w-10 md:h-10 text-blue-300 group-hover:text-blue-200 transition-colors" />
                </motion.div>

                <h3 className="relative text-xl md:text-2xl font-heading font-bold mb-4 uppercase tracking-tight group-hover:text-blue-200 transition-colors">
                  The BIGWISE Culture
                </h3>
                <p className="relative text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                  From the streets of Lagos to the world, we are more than a brand. We are a community of creatives and visionaries who believe in the power of premium African fashion.
                </p>

                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="py-16 md:py-20 border-t border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 uppercase tracking-widest">
                Why Choose Bigwise?
              </h2>
              <p className="text-purple-200 max-w-2xl mx-auto">
                We're not just another clothing brand. Here's what sets us apart.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Award,
                  title: "Premium Quality Materials",
                  description: "Only the finest fabrics make it into our collections. We source premium materials to ensure durability and comfort.",
                  color: "purple"
                },
                {
                  icon: Shield,
                  title: "Authentic African Fashion",
                  description: "Proudly African, globally recognized. We celebrate African creativity while maintaining international standards.",
                  color: "blue"
                },
                {
                  icon: Sparkles,
                  title: "Unique Designs",
                  description: "Stand out from the crowd. Our designs are carefully crafted to make you unforgettable.",
                  color: "pink"
                },
                {
                  icon: CheckCircle,
                  title: "Customer Satisfaction",
                  description: "5000+ happy customers can't be wrong. We prioritize your satisfaction above all else.",
                  color: "green"
                },
                {
                  icon: Star,
                  title: "Limited Edition Drops",
                  description: "Exclusive pieces in limited quantities. When you wear Bigwise, you're part of an elite community.",
                  color: "yellow"
                },
                {
                  icon: MessageCircle,
                  title: "Direct Support",
                  description: "Have questions? We're always here. Reach out via WhatsApp for instant assistance.",
                  color: "purple"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all hover-elevate"
                >
                  <div className={`w-12 h-12 bg-${item.color}-600/20 rounded-lg flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Become a Model Section */}
          <div className="py-16 md:py-20 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-wide">
                    Become a Bigwise Model
                  </h2>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  Are you bold, confident, and passionate about fashion? Join the Bigwise family as a brand model and showcase our premium collections to the world.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Requirements</h4>
                      <p className="text-gray-400 text-sm">
                        Open to all genders, ages 18-35. Must be passionate about fashion, confident on camera, and available for shoots in Lagos or Ile-Ife.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Benefits</h4>
                      <p className="text-gray-400 text-sm">
                        Get featured on our platforms, receive exclusive Bigwise pieces, build your portfolio, and earn compensation for shoots.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">How to Apply</h4>
                      <p className="text-gray-400 text-sm">
                        Send us 2-3 photos (full body and close-up), your name, age, location, and a brief introduction via WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Bigwise%2C%20I%27d%20like%20to%20apply%20to%20become%20a%20model.%20Here%20are%20my%20details%3A`,
                      '_blank'
                    );
                  }}
                  className="w-full sm:w-auto gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 px-8 rounded-full font-bold uppercase tracking-wide shadow-lg shadow-purple-500/20"
                >
                  <Camera size={20} />
                  Apply to Become a Model
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative max-w-xs mx-auto lg:mx-0 lg:ml-auto"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 blur-2xl" />
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src="https://i.pinimg.com/736x/71/ed/79/71ed798e9f2f5a0c945cf7b3d5266e84.jpg"
                    alt="Bigwise Model"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <p className="text-white font-bold text-xl mb-2">Join Our Community</p>
                    <p className="text-gray-200 text-sm">Be the face of premium African fashion</p>
                  </div>
                </div>
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
