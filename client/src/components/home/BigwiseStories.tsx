import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stories = [
  { id: 1, type: "image", url: "https://i.pinimg.com/736x/06/1f/e9/061fe912f1974f95fcd86831260dbdf4.jpg" },
  { id: 2, type: "image", url: "https://i.pinimg.com/736x/a7/9a/7a/a79a7a3fb993fa0ee749a9d39f2c0dc8.jpg" },
  { id: 3, type: "image", url: "https://i.pinimg.com/736x/69/af/14/69af14a75cf43e67e3a892aa48dadccc.jpg" },
  { id: 4, type: "image", url: "https://i.pinimg.com/736x/c4/84/a9/c484a94a27438cf10c3d076987f67d54.jpg" },
  { id: 5, type: "image", url: "https://i.pinimg.com/736x/77/2b/db/772bdb67cbf7c977bd66020f9aa36228.jpg" },
  { id: 6, type: "image", url: "https://i.pinimg.com/736x/e9/6d/b7/e96db7813854e5c4e284281ec62fb447.jpg" },
  { id: 7, type: "image", url: "https://i.pinimg.com/736x/dd/69/f4/dd69f464a0cb9b2b8a37ea568bf90443.jpg" },
  { id: 8, type: "image", url: "https://i.pinimg.com/736x/41/0e/73/410e737427270a5b51d741c6755e85d0.jpg" },
  { id: 9, type: "image", url: "https://i.pinimg.com/736x/0a/21/80/0a21808c859872850e8eefd2ff52e6e8.jpg" },
  { id: 10, type: "image", url: "https://i.pinimg.com/736x/60/da/ec/60daec25c85953c8f4f8501ee1481f00.jpg" },
  { id: 11, type: "image", url: "https://i.pinimg.com/736x/0b/aa/8b/0baa8bf774f8adb40c6d19e1fd79d5ab.jpg" },
];

export function BigwiseStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, []);

  const prevStory = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextStory, 5000);
    return () => clearInterval(timer);
  }, [nextStory]);

  const getVisibleIndices = () => {
    const left = (currentIndex - 1 + stories.length) % stories.length;
    const center = currentIndex;
    const right = (currentIndex + 1) % stories.length;
    return [left, center, right];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-20 bg-[#1a1025] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold mb-4">Live Updates</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white">Bigwise Stories</h3>
        </div>

        <div className="relative flex items-center justify-center gap-4 md:gap-8 h-[500px] md:h-[700px]">
          <div className="absolute left-4 z-20">
            <Button variant="ghost" size="icon" onClick={prevStory} className="rounded-full bg-white/10 hover:bg-white/20 text-white h-12 w-12">
              <ChevronLeft size={32} />
            </Button>
          </div>
          
          <div className="absolute right-4 z-20">
            <Button variant="ghost" size="icon" onClick={nextStory} className="rounded-full bg-white/10 hover:bg-white/20 text-white h-12 w-12">
              <ChevronRight size={32} />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-12 w-full max-w-6xl">
            {visibleIndices.map((idx, i) => {
              const isCenter = i === 1;
              return (
                <motion.div
                  key={`${stories[idx].id}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.4, 
                    scale: isCenter ? 1 : 0.85,
                    filter: isCenter ? "blur(0px)" : "blur(8px)",
                    zIndex: isCenter ? 10 : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex-shrink-0 w-[250px] md:w-[400px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${!isCenter ? 'hidden md:block' : ''}`}
                >
                  <img 
                    src={stories[idx].url} 
                    alt="Story" 
                    className="w-full h-full object-cover"
                  />
                  {isCenter && (
                    <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                      {stories.map((_, dotIdx) => (
                        <div 
                          key={dotIdx} 
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${dotIdx === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
