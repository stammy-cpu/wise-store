import { useEffect } from "react";
import { useLocation } from "wouter";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function PostItemPage() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.isAdmin) {
      setLocation("/auth");
    }
  }, [setLocation]);

  const { toast } = useToast();
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
      isUpcoming: false,
      dropDate: null,
      allowCustomization: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Product posted successfully" });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Post New Item</CardTitle>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
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
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="bg-black/40 border-white/10" placeholder="e.g. Hoodie" />
                          </FormControl>
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
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Sizes (Comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value?.join(", ") || ""} 
                              onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="bg-black/40 border-white/10" 
                              placeholder="S, M, L, XL" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="colors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Colors (Comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value?.join(", ") || ""} 
                              onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="bg-black/40 border-white/10" 
                              placeholder="Purple, Black, White" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Image URLs (Comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value?.join(", ") || ""} 
                              onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="bg-black/40 border-white/10" 
                              placeholder="https://..." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="videos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Video URLs (Comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              value={field.value?.join(", ") || ""} 
                              onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="bg-black/40 border-white/10" 
                              placeholder="https://..." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Mark as Upcoming Drop</FormLabel>
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
                          <FormLabel className="text-xs uppercase font-bold tracking-widest text-gray-400">Enable Customization</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-purple-600 hover:bg-purple-700 rounded-full font-bold uppercase tracking-widest text-sm"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : "Post Item"}
                  </Button>
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
