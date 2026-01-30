import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Upload, ChevronDown } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import type { Product } from "@shared/schema";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];
const AVAILABLE_COLORS = [
  "Black", "White", "Gray", "Beige", "Brown",
  "Red", "Pink", "Orange", "Yellow",
  "Green", "Blue", "Navy", "Purple", "Burgundy"
];

export default function EditProductPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/products/edit/:id");
  const productId = params?.id;
  const { isAdmin, isLoading: sessionLoading } = useSession();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!sessionLoading && !isAdmin) {
      setLocation("/auth");
    }
  }, [isAdmin, sessionLoading, setLocation]);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const res = await apiRequest("GET", `/api/products/${productId}`);
      return res.json();
    },
    enabled: !!productId,
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      images: [],
      videos: [],
      sizes: [],
      colors: [],
      type: "Streetwear",
      category: "Jackets",
      sex: "Unisex",
      featured: false,
      bestSeller: false,
      newArrival: false,
      isUpcoming: false,
      dropDate: null,
      allowCustomization: false,
    },
  });

  // Update form when product data loads
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images || [],
        videos: product.videos || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        type: product.type || "Streetwear",
        category: product.category || "Jackets",
        sex: product.sex || "Unisex",
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        newArrival: product.newArrival || false,
        isUpcoming: product.isUpcoming || false,
        dropDate: product.dropDate || null,
        allowCustomization: product.allowCustomization || false,
      });

      // Set image previews
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      }
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (!productId) throw new Error("Product ID is required");
      const res = await apiRequest("PUT", `/api/products/${productId}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Product updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}`] });
      setLocation("/admin/products");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const res = await apiRequest("POST", "/api/upload", formData);
      const data = await res.json();

      // Update form with uploaded image URLs
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...data.urls]);

      // Create preview URLs
      const newPreviews = data.urls;
      setImagePreviews(prev => [...prev, ...newPreviews]);

      toast({ title: "Success", description: `${files.length} image(s) uploaded successfully` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to upload images", variant: "destructive" });
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages);

    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data: InsertProduct) => {
    mutation.mutate(data);
  };

  if (sessionLoading || productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1025] text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1025] text-white">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Edit Product</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/40 border-white/10" placeholder="e.g. Classic Purple Jacket" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Price (₦)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black/40 border-white/10" placeholder="35,000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Description</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-black/40 border-white/10" placeholder="Product details..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-black/40 border-white/10">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Jackets">Jackets</SelectItem>
                              <SelectItem value="Dresses">Dresses</SelectItem>
                              <SelectItem value="Streetwear">Streetwear</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Sex</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-black/40 border-white/10">
                                <SelectValue placeholder="Select Sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Unisex">Unisex</SelectItem>
                              <SelectItem value="Men">Men</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger className="bg-black/40 border-white/10">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hoodie">Hoodie</SelectItem>
                              <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                              <SelectItem value="Sweater">Sweater</SelectItem>
                              <SelectItem value="Pants">Pants</SelectItem>
                              <SelectItem value="Shorts">Shorts</SelectItem>
                              <SelectItem value="Jacket">Jacket</SelectItem>
                              <SelectItem value="Coat">Coat</SelectItem>
                              <SelectItem value="Dress">Dress</SelectItem>
                              <SelectItem value="Skirt">Skirt</SelectItem>
                              <SelectItem value="Hat">Hat</SelectItem>
                              <SelectItem value="Bag">Bag</SelectItem>
                              <SelectItem value="Shoes">Shoes</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sizes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">
                            Sizes
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <button
                                  type="button"
                                  className="w-full flex items-center justify-between px-3 py-2 bg-black/40 border border-white/10 rounded-md text-left hover:bg-black/60 transition-colors"
                                >
                                  <span className="text-sm">
                                    {field.value && field.value.length > 0
                                      ? `${field.value.length} size(s) selected`
                                      : "Select sizes"}
                                  </span>
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full bg-[#1a1025] border-white/10 p-4">
                              <div className="space-y-2">
                                {AVAILABLE_SIZES.map((size) => (
                                  <div key={size} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`size-${size}`}
                                      checked={field.value?.includes(size)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, size]);
                                        } else {
                                          field.onChange(current.filter((s) => s !== size));
                                        }
                                      }}
                                      className="border-white/20"
                                    />
                                    <label
                                      htmlFor={`size-${size}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {size}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((size) => (
                                <span
                                  key={size}
                                  className="px-2 py-1 bg-purple-600/20 border border-purple-600/40 rounded text-xs"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="colors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">
                            Colors
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <button
                                  type="button"
                                  className="w-full flex items-center justify-between px-3 py-2 bg-black/40 border border-white/10 rounded-md text-left hover:bg-black/60 transition-colors"
                                >
                                  <span className="text-sm">
                                    {field.value && field.value.length > 0
                                      ? `${field.value.length} color(s) selected`
                                      : "Select colors"}
                                  </span>
                                  <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full bg-[#1a1025] border-white/10 p-4 max-h-[300px] overflow-y-auto">
                              <div className="space-y-2">
                                {AVAILABLE_COLORS.map((color) => (
                                  <div key={color} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`color-${color}`}
                                      checked={field.value?.includes(color)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, color]);
                                        } else {
                                          field.onChange(current.filter((c) => c !== color));
                                        }
                                      }}
                                      className="border-white/20"
                                    />
                                    <label
                                      htmlFor={`color-${color}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {color}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value.map((color) => (
                                <span
                                  key={color}
                                  className="px-2 py-1 bg-purple-600/20 border border-purple-600/40 rounded text-xs"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Product Images</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <label className="flex-1">
                                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
                                    <Upload size={18} />
                                    <span className="text-sm font-medium">
                                      {isUploadingImages ? "Uploading..." : "Upload More Images"}
                                    </span>
                                  </div>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                    disabled={isUploadingImages}
                                  />
                                </label>
                                <span className="text-xs text-gray-400">
                                  {field.value?.length || 0} image(s)
                                </span>
                              </div>

                              {/* Image Previews */}
                              {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                          </FormControl>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Featured</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bestSeller"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                          </FormControl>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Best Seller</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newArrival"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                          </FormControl>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">New Arrival</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isUpcoming"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                          </FormControl>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Upcoming Drop</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowCustomization"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value || false}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-white/10 bg-black/40"
                            />
                          </FormControl>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Customization</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/admin/products")}
                      className="flex-1 py-6 border-white/10 hover:bg-white/10 rounded-full font-bold uppercase tracking-widest text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-6 bg-purple-600 hover:bg-purple-700 rounded-full font-bold uppercase tracking-widest text-sm"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? <Loader2 className="animate-spin" /> : "Update Product"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
