import { motion } from "framer-motion";

const ambassadors = [
  { name: "ED Visuals", role: "Photographer", image: "https://i.pinimg.com/736x/51/e2/ef/51e2ef57015e3b9510c8a87520c0a646.jpg" },
  { name: "yung clef", role: "Fashion Enthusiast", image: "https://i.pinimg.com/474x/5e/7b/3d/5e7b3dfba8cd062663e24e4e6ba4e922.jpg" },
  { name: "Ayo Santos", role: "Brand PR", image: "https://i.pinimg.com/736x/92/5c/63/925c639c709c610a0f8ed4c493df99ab.jpg" },
];

export function Ambassadors() {
  return (
    <section className="py-20 md:py-24 bg-[#1a1025] px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold mb-4">The Community</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold">Brand Ambassadors</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ambassadors.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative h-[500px] rounded-3xl overflow-hidden border border-white/5"
            >
              <img 
                src={person.image} 
                alt={person.name} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h4 className="text-2xl font-bold text-white mb-1">{person.name}</h4>
                <p className="text-purple-400 font-medium tracking-widest uppercase text-xs">{person.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
