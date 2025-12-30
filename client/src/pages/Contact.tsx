import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get In Touch</h1>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Visit our stores in Ile-Ife and Lagos, or send us a message directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors">
                  <MapPin className="text-purple-400 mb-4 h-8 w-8" />
                  <h3 className="font-bold uppercase tracking-widest text-lg mb-2">Lagos Store</h3>
                  <p className="text-gray-400 leading-relaxed">
                    14 Admiralty Way,<br/>Lekki Phase 1, Lagos<br/>Nigeria
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors">
                  <MapPin className="text-purple-400 mb-4 h-8 w-8" />
                  <h3 className="font-bold uppercase tracking-widest text-lg mb-2">Ile-Ife Store</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Shop 24, OAU Campus Complex,<br/>Ile-Ife, Osun State<br/>Nigeria
                  </p>
                </div>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-purple-500/30">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Us</h3>
                    <p className="text-lg">hello@bigwiseclothings.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Call Us</h3>
                    <p className="text-lg">+234 (80) 1234 5678</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white border-none h-14 px-8 rounded-full w-full sm:w-auto font-bold uppercase tracking-wide shadow-lg shadow-green-500/20">
                    <MessageCircle size={22} />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
                  <Input id="name" placeholder="John Doe" className="bg-black/20 border-white/10 text-white h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-black/20 border-white/10 text-white h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <Textarea id="message" placeholder="How can we help?" className="bg-black/20 border-white/10 text-white min-h-[150px] resize-none" />
                </div>
                <Button type="submit" className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-white text-purple-950 hover:bg-gray-100 rounded-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-[400px] bg-gray-800 rounded-2xl overflow-hidden relative border border-white/10">
             <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-purple-900/20">
               <MapPin size={48} className="text-purple-400 animate-bounce" />
               <p className="text-white/60 font-medium">Interactive Map Loading...</p>
             </div>
             {/* In a real app, embed Google Maps iframe here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
