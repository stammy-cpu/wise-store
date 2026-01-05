import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stories = [
  { id: 1, type: "video", url: "https://v1.pinimg.com/videos/iht/expMp4/d8/a7/01/d8a70142f6a3b8501237b91a37e327e1_720w.mp4" },
  { id: 2, type: "image", url: "https://i.pinimg.com/736x/eb/3b/6d/eb3b6d50b93ec19122cabba0948d2a75.jpg" },
  { id: 3, type: "video", url: "https://v1.pinimg.com/videos/iht/expMp4/3e/90/73/3e9073c0d09c79f9c8b8996b3582d2f1_540w.mp4" },
  { id: 4, type: "image", url: "https://i.pinimg.com/736x/d1/d5/10/d1d510cff6447268bce3efbefc104d33.jpg" },
  { id: 5, type: "image", url: "https://i.pinimg.com/736x/f4/2f/62/f42f62ce9e38d1c892640e8fc9e8c2fb.jpg" },
  { id: 6, type: "video", url: "https://v1.pinimg.com/videos/iht/expMp4/44/45/35/444535a3b398e1fb9d7d1383f869392a_720w.mp4" },
  { id: 7, type: "image", url: "https://i.pinimg.com/736x/25/0c/7a/250c7a9b44dfd6f1de34cdfa0f7c498d.jpg" },
  { id: 8, type: "image", url: "https://i.pinimg.com/736x/eb/3f/2b/eb3f2be004e29df77f1f21b565c7b910.jpg" },
  { id: 9, type: "video", url: "https://v1.pinimg.com/videos/iht/expMp4/a6/1f/d2/a61fd27f64e5bdc544436ef4bbcf83ff_720w.mp4" },
  { id: 10, type: "image", url: "https://i.pinimg.com/736x/71/ce/d1/71ced16b2d3e1c69c2dadd07a61b5919.jpg" },
  { id: 11, type: "image", url: "https://i.pinimg.com/736x/9a/da/5d/9ada5dd31c8b945852f272c8e6830fc0.jpg" },
  { id: 12, type: "image", url: "https://i.pinimg.com/736x/af/65/1a/af651ac7c8940a18ca0f5920f003add7.jpg" },
  { id: 13, type: "image", url: "https://i.pinimg.com/736x/76/f5/ad/76f5ad3d030e1723b5db2370439bf0cc.jpg" },
  { id: 14, type: "image", url: "https://i.pinimg.com/736x/3f/b1/f2/3fb1f20ab66f1569b7891e5804e8327d.jpg" },
  { id: 15, type: "image", url: "https://i.pinimg.com/736x/fd/70/3a/fd703a27960079bdb882340ab731c1d8.jpg" },
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
    const story = stories[currentIndex];
    const duration = story.type === "video" ? 12000 : 5000;
    const timer = setInterval(nextStory, duration);
    return () => clearInterval(timer);
  }, [nextStory, currentIndex]);

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
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white">BIGWISE GALLERY</h3>
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
              const story = stories[idx];
              return (
                <motion.div
                  key={`${story.id}-${i}`}
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
                  {story.type === "video" ? (
                    <video 
                      src={story.url} 
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img 
                      src={story.url} 
                      alt="Story" 
                      className="w-full h-full object-cover"
                    />
                  )}
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
