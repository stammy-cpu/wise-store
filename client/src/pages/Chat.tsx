import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";
import type { Message } from "@shared/schema";
import { useSocket } from "@/hooks/useSocket";

function getVisitorId(): string {
  let visitorId = localStorage.getItem("bigwise_visitor_id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("bigwise_visitor_id", visitorId);
  }
  return visitorId;
}

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visitorId = getVisitorId();
  const { socket, isConnected } = useSocket();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/visitor/messages", visitorId],
    queryFn: async () => {
      const res = await apiFetch(`/api/visitor/messages/${visitorId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const usedWebSocket = socket && isConnected;

      if (usedWebSocket) {
        socket.emit("message:send", { visitorId, content });
        return Promise.resolve({ usedWebSocket: true });
      } else {
        const res = await apiFetch("/api/visitor/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            content,
          }),
        });
        if (!res.ok) throw new Error('Failed to send message');
        const data = await res.json();
        return { usedWebSocket: false, data };
      }
    },
    onSuccess: (result) => {
      setNewMessage("");
      // Stop typing indicator
      if (socket) {
        socket.emit("typing:stop", { visitorId, isTyping: false });
      }
      // Only invalidate queries if we used REST API fallback
      // WebSocket listener will handle cache update via setQueryData
      if (!result.usedWebSocket) {
        queryClient.invalidateQueries({ queryKey: ["/api/visitor/messages", visitorId] });
      }
    },
  });

  // Setup WebSocket event listeners
  useEffect(() => {
    if (!socket) return;

    // Join visitor room
    socket.emit("join:visitor", visitorId);

    // Listen for new messages
    socket.on("message:new", (message: Message) => {
      queryClient.setQueryData<Message[]>(
        ["/api/visitor/messages", visitorId],
        (old) => [...(old || []), message]
      );
    });

    // Listen for typing updates
    socket.on("typing:update", (data: { visitorId: string; isTyping: boolean; isAdmin: boolean }) => {
      if (data.visitorId === visitorId && data.isAdmin) {
        setIsAdminTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("message:new");
      socket.off("typing:update");
    };
  }, [socket, visitorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAdminTyping]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (socket && isConnected) {
      socket.emit("typing:start", { visitorId, isTyping: true });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing:stop", { visitorId, isTyping: false });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1025] to-[#251b35] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#1a1025]/95 backdrop-blur-md border-b border-purple-900/30 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-white">Message Bigwise</h1>
            <p className="text-sm text-purple-300">We typically reply within minutes</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-purple-300 mb-2">Welcome to Message Bigwise</p>
                <p className="text-purple-400/60 text-sm">
                  Send us a message and we'll get back to you shortly.
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-purple-300">Loading messages...</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromAdmin ? "justify-start" : "justify-end"}`}
                data-testid={`message-${message.id}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isFromAdmin
                      ? "bg-purple-900/40 text-purple-100"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            ))}

            {isAdminTyping && (
              <div className="flex justify-start">
                <div className="bg-purple-900/40 text-purple-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-purple-900/30">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-purple-900/20 border-purple-700/50 text-white placeholder:text-purple-400/60"
              data-testid="input-message"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-purple-700"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
