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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-8">
                <h3 className="font-heading text-2xl font-bold border-l-4 border-purple-600 pl-4 text-white">How to Measure</h3>
                <div className="space-y-6">
                  {[
                    { title: "Chest", desc: "Wrap the tape measure around the fullest part of your chest. Make sure the tape is level all the way around and not too tight." },
                    { title: "Waist", desc: "Measure around your natural waistline, which is the narrowest part of your torso. For a more comfortable fit, keep one finger between the tape and your body." },
                    { title: "Hips", desc: "Stand with your heels together and measure around the fullest part of your hips. This is usually about 8 inches below your waist." },
                    { title: "Sleeve Length", desc: "With your arm slightly bent, measure from the center back of your neck, across your shoulder, and down to your wrist." },
                    { title: "Inseam", desc: "Measure from the crotch point down to the ankle. This is best done with a pair of pants that fit you well." }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 group">
                      <div className="mt-1 transition-transform group-hover:scale-110"><CheckCircle size={20} className="text-purple-500" /></div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-[0.2em] mb-2 text-white">{item.title}</p>
                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="font-heading text-2xl font-bold border-l-4 border-purple-600 pl-4 text-white">Pro Tips for Fitting</h3>
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-purple-400 uppercase tracking-widest">Between Sizes?</p>
                    <p className="text-sm text-gray-300">If your measurements are between two sizes, we recommend choosing the larger size for a more relaxed streetwear fit, or the smaller size for a tighter, more tailored look.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-purple-400 uppercase tracking-widest">Fabric Considerations</p>
                    <p className="text-sm text-gray-300">Keep in mind that some materials like denim may feel stiffer initially and stretch slightly with wear, while our premium cotton blends offer more natural flexibility.</p>
                  </div>
                  <div className="pt-4 flex flex-col items-center text-center border-t border-white/10">
                    <p className="text-lg font-heading font-bold mb-4 text-white">Need Personalized Help?</p>
                    <p className="text-sm text-gray-400 mb-6">Our support team can provide specific recommendations based on your height and weight.</p>
                    <button className="w-full py-4 bg-purple-600 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-purple-700 transition-all hover-elevate">
                      Chat with a Stylist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
