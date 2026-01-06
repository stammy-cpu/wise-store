import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostItemPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="font-heading text-3xl">Post New Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Product Name</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="e.g. Classic Purple Jacket" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Price (₦)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="35,000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500">
                      <option>Jackets</option>
                      <option>Dresses</option>
                      <option>Streetwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Sex</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500">
                      <option>Unisex</option>
                      <option>Men</option>
                      <option>Women</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Sizes (Comma separated)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="S, M, L, XL" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Colors (Comma separated)</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" placeholder="Purple, Black, White" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Upload Media (Photos & Videos)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                    <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Supports JPG, PNG, MP4</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-purple-600 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-purple-700 transition-colors mt-4">
                  Post Item
                </button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
