import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user, isAuthenticated } = useSession();

  const visitorId = localStorage.getItem("bigwise_visitor_id") || `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  useEffect(() => {
    if (!localStorage.getItem("bigwise_visitor_id")) {
      localStorage.setItem("bigwise_visitor_id", visitorId);
    }
  }, [visitorId]);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", visitorId],
    enabled: isOpen && !!user,
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Please login to message support");
      return apiRequest("POST", "/api/messages", {
        content,
        visitorId,
        userId: user.id,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", visitorId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 bg-[#251b35] border-white/10 text-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          <CardHeader className="bg-purple-600 p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-white">Message Bigwise</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {!user ? (
              <div className="p-8 text-center space-y-4">
                <p className="text-sm text-gray-400">Please sign in to message our support team.</p>
                <Link href="/auth">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 font-bold rounded-full">
                    Login / Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Start a conversation</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.isFromAdmin ? "self-start" : "self-end ml-auto"
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        msg.isFromAdmin ? "bg-white/10 rounded-tl-none" : "bg-purple-600 rounded-tr-none text-white"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                        {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && message.trim() && mutation.mutate(message)}
                    placeholder="Type your message..."
                    className="flex-grow bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <Button 
                    size="icon" 
                    className="rounded-full bg-purple-600 hover:bg-purple-700"
                    disabled={mutation.isPending || !message.trim()}
                    onClick={() => mutation.mutate(message)}
                  >
                    <MessageCircle size={18} />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-500 shadow-xl hover:scale-110 active:scale-95 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
}
