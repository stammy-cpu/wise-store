import { Instagram, Heart, MessageCircle } from "lucide-react";
import instagramPost1 from "@assets/generated_images/product_fashion_item_close-up.png";
import instagramPost2 from "@assets/generated_images/fashion_model_in_casual_outfit.png";
import instagramPost3 from "@assets/generated_images/clothing_flat_lay_composition.png";
import instagramPost4 from "@assets/generated_images/fashion_model_close-up_portrait.png";

export function InstagramFeed() {
  const posts = [
    { id: 1, image: "https://i.pinimg.com/1200x/d2/3f/18/d23f1850719dcd2c9e2fcae2d147037d.jpg", likes: 1240, comments: 89, caption: "New season, new vibes 💜" },
    { id: 2, image: "https://i.pinimg.com/1200x/c3/ff/37/c3ff37f23f8617de65cb2315b5ad14e6.jpg", likes: 2156, comments: 156, caption: "Street style essentials" },
    { id: 3, image: "https://i.pinimg.com/1200x/9f/1a/94/9f1a940340d03a9932f4773ec06c252e.jpg", likes: 1890, comments: 120, caption: "Timeless pieces, endless possibilities" },
    { id: 4, image: "https://i.pinimg.com/1200x/b3/ac/e1/b3ace1065defbe98f937ca4160db9c1d.jpg", likes: 2345, comments: 201, caption: "Bold. Wise. Beautiful." },
  ];

  return (
    <section className="py-24 bg-[#251b35]">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram size={20} className="text-purple-400" />
            <a href="https://www.instagram.com/letstalkbigwise" target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest font-bold text-purple-300 hover:text-purple-200 transition-colors">
              @letstalkbigwise
            </a>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">On The Feed</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="aspect-square relative group overflow-hidden rounded-xl border border-white/10 cursor-pointer"
            >
              <img 
                src={post.image} 
                alt={post.caption} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-6">
                <div className="flex gap-8">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Heart size={20} fill="white" /> {post.likes}
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <MessageCircle size={20} /> {post.comments}
                  </div>
                </div>
                <p className="text-white text-center px-4 text-sm font-medium">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
