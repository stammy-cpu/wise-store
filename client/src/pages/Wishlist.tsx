import { apiFetch } from '@/lib/apiClient';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, WishlistItem } from "@shared/schema";

function getVisitorId(): string {
  let visitorId = localStorage.getItem("bigwise_visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("bigwise_visitor_id", visitorId);
  }
  return visitorId;
}

export default function Wishlist() {
  const visitorId = getVisitorId();
  const { toast } = useToast();

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ['/api/wishlist', visitorId],
    queryFn: async () => {
      const res = await apiFetch(`/api/wishlist/${visitorId}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch all products to get details
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await apiFetch('/api/products');
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Combine wishlist items with product details
  const wishlistWithDetails = wishlistItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product); // Filter out items where product not found

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiFetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove from wishlist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist', visitorId] });
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: { product: Product }) => {
      const res = await apiFetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images[0],
          size: null,
          color: null,
          userId: null,
        }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
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

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="grow pt-24 md:pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-heading font-bold mb-10">My Wishlist</h1>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Loading wishlist...</p>
            </div>
          ) : wishlistWithDetails.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistWithDetails.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden group">
                  <div className="aspect-3/4 bg-gray-800 relative">
                    <Link href={`/products/${item.product.id}`}>
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <button
                      onClick={() => removeFromWishlistMutation.mutate(item.id)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-6">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-heading font-bold text-lg mb-1 hover:text-purple-300 transition-colors">{item.product.name}</h3>
                    </Link>
                    <p className="text-purple-300 font-bold mb-4">{item.product.price}</p>
                    <Button
                      onClick={() => addToCartMutation.mutate(item)}
                      disabled={addToCartMutation.isPending}
                      className="w-full bg-white text-purple-950 hover:bg-gray-100 font-bold uppercase tracking-wider text-sm"
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-6">Your wishlist is empty.</p>
              <Link href="/collections">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
