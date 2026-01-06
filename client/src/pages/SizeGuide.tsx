import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, CheckCircle } from "lucide-react";

export default function SizeGuide() {
  const categories = [
    {
      name: "Tops & Jackets",
      sizes: [
        { label: "S", chest: "34-36\"", waist: "28-30\"" },
        { label: "M", chest: "38-40\"", waist: "32-34\"" },
        { label: "L", chest: "42-44\"", waist: "36-38\"" },
        { label: "XL", chest: "46-48\"", waist: "40-42\"" },
        { label: "XXL", chest: "50-52\"", waist: "44-46\"" },
      ]
    },
    {
      name: "Trousers & Jeans",
      sizes: [
        { label: "28", waist: "28\"", hips: "34\"" },
        { label: "30", waist: "30\"", hips: "36\"" },
        { label: "32", waist: "32\"", hips: "38\"" },
        { label: "34", waist: "34\"", hips: "40\"" },
        { label: "36", waist: "36\"", hips: "42\"" },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Size Guide</h1>
            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
              Find your perfect fit with our comprehensive sizing guide. Measurements are in inches unless specified.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {categories.map((category) => (
              <Card key={category.name} className="bg-white/5 border-white/10 text-white overflow-hidden">
                <CardHeader className="bg-purple-600/20 border-b border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <Ruler className="text-purple-400" />
                    <CardTitle className="font-heading text-xl">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          <th className="p-4 text-xs uppercase tracking-widest font-bold text-gray-400">Size</th>
                          {Object.keys(category.sizes[0]).filter(k => k !== 'label').map(key => (
                            <th key={key} className="p-4 text-xs uppercase tracking-widest font-bold text-gray-400">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {category.sizes.map((size, idx) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-purple-400">{size.label}</td>
                            {Object.entries(size).filter(([k]) => k !== 'label').map(([_, val]) => (
                              <td key={_} className="p-4 text-sm text-gray-300">{val as string}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <h3 className="font-heading text-2xl font-bold">How to Measure</h3>
                <div className="space-y-4">
                  {[
                    { title: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                    { title: "Waist", desc: "Measure around the narrowest part (typically where your body bends side to side)." },
                    { title: "Hips", desc: "Measure around the fullest part of your hips, keeping the tape horizontal." }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="mt-1"><CheckCircle size={18} className="text-purple-500" /></div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-widest mb-1">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-purple-600/10 rounded-2xl p-8 border border-purple-500/20 flex flex-col justify-center items-center text-center">
                <p className="text-lg font-heading font-bold mb-4">Still Not Sure?</p>
                <p className="text-sm text-gray-400 mb-6">Our support team is here to help you find the right size for your body type.</p>
                <button className="px-8 py-3 bg-purple-600 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-purple-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
