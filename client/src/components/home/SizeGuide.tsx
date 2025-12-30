import { motion } from "framer-motion";
import { Ruler, CheckCircle2 } from "lucide-react";

export function SizeGuide() {
  return (
    <section className="py-20 md:py-24 bg-[#251b35] px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-[2rem] border border-white/10 p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Ruler size={300} className="rotate-45" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Find Your Perfect Fit</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                We know fit matters. Our premium garments are designed with specific silhouettes in mind. Use our comprehensive guide to ensure your BIGWISE piece feels just as good as it looks.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Detailed measurements for every size",
                  "Fit notes from our design team",
                  "Model measurements for reference"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-purple-300">
                    <CheckCircle2 size={20} />
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
              
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95">
                View Size Chart
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-gray-400 uppercase tracking-widest text-sm">Chest (inches)</span>
                  <div className="flex gap-4 font-bold">
                    <span>S: 36-38</span>
                    <span>M: 38-40</span>
                    <span>L: 40-42</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-gray-400 uppercase tracking-widest text-sm">Waist (inches)</span>
                  <div className="flex gap-4 font-bold">
                    <span>S: 28-30</span>
                    <span>M: 30-32</span>
                    <span>L: 32-34</span>
                  </div>
                </div>
                <p className="text-xs text-purple-400 italic">
                  *Measurements are taken flat. If between sizes, we recommend sizing up for a modern relaxed fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
