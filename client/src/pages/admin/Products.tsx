import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import type { Product } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductsPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoading } = useSession();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/auth");
    }
  }, [isAdmin, isLoading, setLocation]);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/products");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleSectionMutation = useMutation({
    mutationFn: async ({ productId, updates }: { productId: string; updates: Partial<Product> }) => {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");

      await apiRequest("PUT", `/api/products/${productId}`, {
        ...product,
        ...updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const handleToggleSection = (productId: string, field: keyof Product, currentValue: boolean) => {
    toggleSectionMutation.mutate({
      productId,
      updates: { [field]: !currentValue }
    });
  };

  if (isLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1025] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-heading font-bold">Product Listings</h1>
            <Link href="/admin/post-item">
              <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus size={18} />
                <span>Add New Product</span>
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 mb-4">No products found</p>
                <Link href="/admin/post-item">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Post Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-white/5 border-white/10 text-white hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 uppercase text-xs">Price</span>
                            <p className="text-green-400 font-bold">₦{product.price}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase text-xs">Category</span>
                            <p>{product.category || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase text-xs">Type</span>
                            <p>{product.type || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 uppercase text-xs">Sex</span>
                            <p>{product.sex || "N/A"}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          {product.sizes && product.sizes.length > 0 && (
                            <div>
                              <span className="text-gray-500 uppercase text-xs mr-2">Sizes:</span>
                              <div className="inline-flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                  <span
                                    key={size}
                                    className="px-2 py-1 bg-blue-600/20 border border-blue-600/40 rounded text-xs"
                                  >
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.colors && product.colors.length > 0 && (
                            <div>
                              <span className="text-gray-500 uppercase text-xs mr-2">Colors:</span>
                              <div className="inline-flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                  <span
                                    key={color}
                                    className="px-2 py-1 bg-purple-600/20 border border-purple-600/40 rounded text-xs"
                                  >
                                    {color}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.featured || false}
                              onChange={() => handleToggleSection(product.id, 'featured', product.featured || false)}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                            <span className="text-xs uppercase tracking-wider">Featured</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.bestSeller || false}
                              onChange={() => handleToggleSection(product.id, 'bestSeller', product.bestSeller || false)}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                            <span className="text-xs uppercase tracking-wider">Best Seller</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(product as any).trending || false}
                              onChange={() => handleToggleSection(product.id, 'trending' as keyof Product, (product as any).trending || false)}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                            <span className="text-xs uppercase tracking-wider">Trending</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.newArrival || false}
                              onChange={() => handleToggleSection(product.id, 'newArrival', product.newArrival || false)}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                            <span className="text-xs uppercase tracking-wider">New Arrival</span>
                          </label>
                          {product.isUpcoming && (
                            <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/40 rounded text-xs uppercase tracking-wider">
                              Upcoming
                            </span>
                          )}
                          {product.allowCustomization && (
                            <span className="px-3 py-1 bg-green-600/20 border border-green-600/40 rounded text-xs uppercase tracking-wider">
                              Customizable
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex md:flex-col gap-2">
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/10 hover:bg-white/10"
                          >
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                          className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1025] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
