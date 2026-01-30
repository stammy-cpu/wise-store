import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Bigwise contact information
const WHATSAPP_NUMBER = "+2349055376301";
const CONTACT_PHONE = "0905 537 6301";
const CONTACT_EMAIL = "letstalkbigwise@gmail.com";
const PERSONAL_EMAIL = "wiseola598@gmail.com";
const PERSONAL_PHONE = "0903 713 4474";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

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
                    14 Admiralty Way,<br/>Lekki Phase 1,<br/>Lagos State<br/>Nigeria
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors">
                  <MapPin className="text-purple-400 mb-4 h-8 w-8" />
                  <h3 className="font-bold uppercase tracking-widest text-lg mb-2">Ile-Ife Store</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Opposite Christ The Owner Ministry,<br/>Ogunwusi Area, Fasina,<br/>Ile-Ife, Osun State<br/>Nigeria
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
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-lg hover:text-purple-400 transition-colors">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Call Us</h3>
                    <a href={`tel:${CONTACT_PHONE}`} className="text-lg hover:text-purple-400 transition-colors">
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Bigwise%2C%20I%27d%20like%20to%20get%20in%20touch`}
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-black/20 border-white/10 text-white h-12"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-black/20 border-white/10 text-white h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <Textarea
                    id="message"
                    placeholder="How can we help?"
                    className="bg-black/20 border-white/10 text-white min-h-[150px] resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-white text-purple-950 hover:bg-gray-100 rounded-lg"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>

          {/* How to Get Here Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How to Get to Bigwise Store</h2>
              <p className="text-purple-200 text-lg max-w-3xl mx-auto">
                Visit us at our physical location in Ile-Ife, Osun State
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Directions */}
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Directions</h3>
                    <p className="text-gray-400 text-sm">Easy to find from major landmarks</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="pl-4 border-l-2 border-purple-500/30">
                    <p className="text-gray-300 leading-relaxed">
                      From Old Landmark Street, proceed straight ahead. Take the right turn at the junction and continue down the road. The Bigwise store will be clearly visible along your route.
                    </p>
                  </div>

                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-bold text-purple-300 mb-1">Landmark Reference:</p>
                    <p className="text-gray-300 text-sm">
                      Located opposite Christ The Owner Ministry, Ogunwusi Area, Fasina, Ile-Ife
                    </p>
                  </div>

                  <div className="pt-4">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Bigwise%2C%20I%20need%20directions%20to%20your%20store`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-full font-bold uppercase tracking-wide">
                        <MessageCircle size={18} />
                        Need Help Finding Us?
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Store Details */}
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-6">Store Information</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Address</h4>
                    <p className="text-gray-300">
                      Opposite Christ The Owner Ministry<br/>
                      Ogunwusi Area, Fasina<br/>
                      Ile-Ife, Osun State<br/>
                      Nigeria
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Operating Hours</h4>
                    <div className="space-y-1 text-gray-300">
                      <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p>Sunday: 12:00 PM - 6:00 PM</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors">
                        <Phone size={16} />
                        <span>{CONTACT_PHONE}</span>
                      </a>
                      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                        <MessageCircle size={16} />
                        <span>WhatsApp: {WHATSAPP_NUMBER}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="w-full h-[450px] bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.1!2d4.5!3d7.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMzAnMDAuMCJOIDTCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bigwise Store Location - Opposite Christ The Owner Ministry, Ogunwusi Area, Fasina, Ile-Ife"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
