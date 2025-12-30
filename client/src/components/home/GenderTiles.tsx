import { motion } from "framer-motion";
import maleImg from "@assets/male_fashion_narrow.jpg";
import femaleImg from "@assets/female_fashion_narrow.jpg";
import { Link } from "wouter";

export function GenderTiles() {
  return (
    <section className="py-24 bg-[#1a1025] px-6 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
          <Link href="/collections?gender=male" className="relative group overflow-hidden rounded-xl w-full max-w-[400px] aspect-[2/3] shadow-2xl">
            <img 
              src={maleImg} 
              alt="Male Fashion" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase italic drop-shadow-2xl">
                MALE
              </h2>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white border-b-2 border-white pb-1 font-bold tracking-widest uppercase text-xs">Shop Collection</span>
            </div>
          </Link>

          <Link href="/collections?gender=female" className="relative group overflow-hidden rounded-xl w-full max-w-[400px] aspect-[2/3] shadow-2xl">
            <img 
              src={femaleImg} 
              alt="Female Fashion" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase italic drop-shadow-2xl">
                FEMALE
              </h2>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white border-b-2 border-white pb-1 font-bold tracking-widest uppercase text-xs">Shop Collection</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
