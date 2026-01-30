import { apiFetch } from '@/lib/apiClient';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Heart, Share2, MessageCircle, Phone, Truck, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

function getVisitorId(): string {
  let visitorId = localStorage.getItem("bigwise_visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("bigwise_visitor_id", visitorId);
  }
  return visitorId;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id;
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const visitorId = getVisitorId();
  const { toast } = useToast();

  // Fetch product from API
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const res = await apiFetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
    enabled: !!productId,
  });

  // Check if product is in wishlist
  const { data: wishlistStatus } = useQuery({
    queryKey: ['/api/wishlist/check', visitorId, productId],
    queryFn: async () => {
      const res = await apiFetch(`/api/wishlist/${visitorId}/${productId}`);
      if (!res.ok) return { isInWishlist: false };
      return res.json();
    },
    enabled: !!productId,
  });

  // Update local wishlist state when query data changes
  useEffect(() => {
    if (wishlistStatus) {
      setIsWishlisted(wishlistStatus.isInWishlist);
    }
  }, [wishlistStatus]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;

      const res = await apiFetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size: selectedSize || null,
          color: selectedColor || null,
          userId: null,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: `${product?.name} has been added to your cart.`,
      });
      window.dispatchEvent(new Event('storage')); // Trigger cart update
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Toggle wishlist mutation
  const toggleWishlistMutation = useMutation({
    mutationFn: async (shouldAdd: boolean) => {
      if (!product) return;

      if (shouldAdd) {
        // Add to wishlist
        const res = await apiFetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            productId: product.id,
            userId: null,
          }),
        });
        if (!res.ok) throw new Error('Failed to add to wishlist');
        return res.json();
      } else {
        // Remove from wishlist - need to get the wishlist item ID first
        const wishlistRes = await apiFetch(`/api/wishlist/${visitorId}`);
        if (!wishlistRes.ok) throw new Error('Failed to fetch wishlist');
        const wishlistItems = await wishlistRes.json();
        const item = wishlistItems.find((i: any) => i.productId === product.id);

        if (item) {
          const res = await apiFetch(`/api/wishlist/${item.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to remove from wishlist');
        }
      }
    },
    onSuccess: (_, shouldAdd) => {
      setIsWishlisted(shouldAdd);
      toast({
        title: shouldAdd ? "Added to Wishlist" : "Removed from Wishlist",
        description: shouldAdd
          ? `${product?.name} has been added to your wishlist.`
          : `${product?.name} has been removed from your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    },
  });

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product, selectedSize, selectedColor]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
        <Navbar />
        <main className="grow pt-24 md:pt-32 pb-20 px-4">
          <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-xl">Loading product...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
        <Navbar />
        <main className="grow pt-24 md:pt-32 pb-20 px-4">
          <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-2xl font-bold">Product not found</div>
            <Link href="/collections">
              <a className="text-purple-400 hover:text-purple-300">← Back to Collections</a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <Link href="/collections">
            <a className="inline-flex items-center gap-2 text-purple-300 hover:text-white mb-8 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Collections
            </a>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Image Slider */}
            <div className="space-y-3">
              <div className="aspect-3/4 max-w-md mx-auto rounded-lg overflow-hidden bg-white/5 border border-white/10 relative group">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-purple-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-purple-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-2.5 py-0.5 rounded-full text-xs text-white">
                  {currentImageIndex + 1} / {product.images.length}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlistMutation.mutate(!isWishlisted)}
                  disabled={toggleWishlistMutation.isPending}
                  className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <Heart size={18} className={cn("transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-white")} />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn(
                      "aspect-square rounded-md overflow-hidden border-2 transition-all",
                      currentImageIndex === i
                        ? "border-purple-500 shadow-lg shadow-purple-600/20"
                        : "border-white/10 hover:border-purple-500/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <h1 className="text-xl md:text-3xl font-heading font-bold mb-2">{product.name}</h1>
                <div className="text-2xl md:text-3xl font-bold text-green-500 mb-3">₦{product.price}</div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-5 text-sm">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-white/10">
                {product.category && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</span>
                    <p className="text-sm text-white mt-0.5">{product.category}</p>
                  </div>
                )}
                {product.type && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Type</span>
                    <p className="text-sm text-white mt-0.5">{product.type}</p>
                  </div>
                )}
                {product.sex && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">For</span>
                    <p className="text-sm text-white mt-0.5">{product.sex}</p>
                  </div>
                )}
              </div>

              <div className="space-y-5 mb-6">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Select Size</span>
                      <Link href="/size-guide">
                        <a className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                          Not sure about size? View size chart →
                        </a>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "w-10 h-10 rounded-md border flex items-center justify-center font-bold transition-all text-sm",
                            selectedSize === size
                              ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30"
                              : "border-white/20 hover:border-white/50 text-gray-300"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Select Color</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "px-3 py-1.5 rounded-md border font-medium text-sm transition-all",
                            selectedColor === color
                              ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30"
                              : "border-white/20 hover:border-white/50 text-gray-300"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => addToCartMutation.mutate()}
                    disabled={addToCartMutation.isPending}
                    className="h-12 bg-white text-purple-950 hover:bg-gray-100 rounded-full font-bold text-sm uppercase tracking-wide"
                  >
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={() => {
                      const message = `Hi Bigwise, I want to buy ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ''}${selectedColor ? ` (Color: ${selectedColor})` : ''}. Price: ${product.price}`;
                      window.open(`https://wa.me/+2349055376301?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-sm uppercase tracking-wide"
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Call Bigwise WhatsApp Button */}
                <Button
                  onClick={() => {
                    window.open('https://wa.me/+2349055376301?text=Hi%20Bigwise%2C%20I%27m%20interested%20in%20' + encodeURIComponent(product.name), '_blank');
                  }}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Call Bigwise
                </Button>
              </div>

              {/* Share Button */}
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  className="h-10 px-6 rounded-full border-white/20 hover:bg-white/10 flex items-center gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share2 size={16} />
                  <span className="text-sm">Share Product</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Truck size={18} className="text-purple-400 shrink-0" />
                  <span>Fast & Secure Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={18} className="text-purple-400 shrink-0" />
                  <span>Authentic Quality Guaranteed</span>
                </div>
              </div>

              {/* Videos Section */}
              {product.videos && product.videos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-base font-bold mb-3">Product Videos</h3>
                  <div className="space-y-3">
                    {product.videos.map((videoUrl, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black/40">
                        <iframe
                          src={videoUrl}
                          title={`${product.name} video ${index + 1}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
