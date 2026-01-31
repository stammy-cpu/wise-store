import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { Send, User as UserIcon, CheckCircle2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/hooks/useSession";
import { useSocket } from "@/hooks/useSocket";

type Conversation = {
  visitorId: string;
  lastMessage: Message;
  unreadCount: number;
  user?: {
    username: string;
    fullName: string;
    email: string;
  };
};

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [visitorTypingMap, setVisitorTypingMap] = useState<Map<string, boolean>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAdmin, isLoading } = useSession();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/auth");
    }
  }, [isAdmin, isLoading, setLocation]);

  const { data: conversations, isLoading: loadingConvs } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedVisitorId],
    enabled: !!selectedVisitorId,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedVisitorId) return { usedWebSocket: false };

      const usedWebSocket = socket && isConnected;

      if (usedWebSocket) {
        socket.emit("message:admin", {
          visitorId: selectedVisitorId,
          content,
          userId: user?.id,
        });
        return { usedWebSocket: true };
      } else {
        await apiRequest("POST", "/api/messages", {
          content,
          visitorId: selectedVisitorId,
          isFromAdmin: true,
          userId: user?.id,
        });
        return { usedWebSocket: false };
      }
    },
    onSuccess: (result) => {
      setReply("");
      if (socket && selectedVisitorId) {
        socket.emit("typing:admin", { visitorId: selectedVisitorId, isTyping: false });
      }
      // Only invalidate queries if we used REST API fallback
      // WebSocket listener will handle cache update via setQueryData
      if (!result?.usedWebSocket && selectedVisitorId) {
        queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedVisitorId] });
      }
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (visitorId: string) => {
      if (socket && isConnected) {
        socket.emit("messages:read", visitorId);
        return Promise.resolve();
      } else {
        await apiRequest("POST", `/api/messages/${visitorId}/read`, {});
      }
    },
  });

  // Setup WebSocket event listeners
  useEffect(() => {
    if (!socket) return;

    // Join admin room
    socket.emit("join:admin");

    // Listen for new messages
    socket.on("message:new", (message: Message) => {
      // Update messages for current conversation
      if (message.visitorId === selectedVisitorId) {
        queryClient.setQueryData<Message[]>(
          ["/api/messages", selectedVisitorId],
          (old) => [...(old || []), message]
        );
      }

      // Play notification sound for visitor messages
      if (!message.isFromAdmin) {
        playNotificationSound();
      }
    });

    // Listen for conversation updates
    socket.on("conversation:update", () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    });

    // Listen for typing updates
    socket.on("typing:update", (data: { visitorId: string; isTyping: boolean; isAdmin: boolean }) => {
      if (!data.isAdmin) {
        setVisitorTypingMap((prev) => new Map(prev).set(data.visitorId, data.isTyping));
      }
    });

    return () => {
      socket.off("message:new");
      socket.off("conversation:update");
      socket.off("typing:update");
    };
  }, [socket, selectedVisitorId]);

  useEffect(() => {
    if (selectedVisitorId) {
      markReadMutation.mutate(selectedVisitorId);
    }
  }, [selectedVisitorId]);

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Silent fail if audio context not supported
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReply(e.target.value);

    // Typing indicator logic
    if (socket && isConnected && selectedVisitorId) {
      socket.emit("typing:admin", { visitorId: selectedVisitorId, isTyping: true });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing:admin", { visitorId: selectedVisitorId, isTyping: false });
      }, 2000);
    }
  };

  if (isLoading) {
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
      <main className="grow pt-24 md:pt-32 pb-12 px-2 md:px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-4 md:mb-6 px-2">
            <h1 className="text-2xl md:text-4xl font-heading font-bold">Messages</h1>
          </div>

          <div className="h-[calc(100vh-12rem)] md:h-[70vh] flex flex-col md:flex-row gap-3 md:gap-6">
            {/* Sidebar - Conversations List */}
            <Card className={`${selectedVisitorId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-white/5 border-white/10 overflow-hidden flex-col`}>
              <div className="p-3 md:p-4 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-heading font-bold">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingConvs ? (
                  <div className="p-8 text-center text-gray-400">Loading...</div>
                ) : conversations?.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No conversations yet</div>
                ) : (
                  conversations?.map((conv) => (
                    <div
                      key={conv.visitorId}
                      onClick={() => setSelectedVisitorId(conv.visitorId)}
                      className={`p-3 md:p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 active:bg-white/10 ${
                        selectedVisitorId === conv.visitorId ? "bg-white/10" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm md:text-base truncate">
                          {conv.user?.username || conv.user?.fullName || "Guest User"}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-purple-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full ml-2 shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 truncate">
                        {visitorTypingMap.get(conv.visitorId) ? (
                          <span className="text-purple-400 italic">typing...</span>
                        ) : (
                          conv.lastMessage.content
                        )}
                      </p>
                      <span className="text-[10px] md:text-xs text-gray-500">
                        {format(new Date(conv.lastMessage.createdAt!), "MMM d, HH:mm")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Chat Window */}
            <Card className={`${selectedVisitorId ? 'flex' : 'hidden md:flex'} flex-1 bg-white/5 border-white/10 overflow-hidden flex-col`}>
              {selectedVisitorId ? (
                <>
                  <div className="p-3 md:p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => setSelectedVisitorId(null)}
                        className="md:hidden text-gray-400 hover:text-white mr-1"
                      >
                        ←
                      </button>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0">
                        <UserIcon className="text-purple-400 w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm md:text-base truncate">
                          {conversations?.find(c => c.visitorId === selectedVisitorId)?.user?.username || conversations?.find(c => c.visitorId === selectedVisitorId)?.user?.fullName || "Guest User"}
                        </h3>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">
                            {isConnected ? 'Real-time' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    <AnimatePresence initial={false}>
                      {messages?.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.isFromAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] md:max-w-[75%] p-2.5 md:p-3 rounded-2xl text-xs md:text-sm ${
                              msg.isFromAdmin
                                ? "bg-purple-600 text-white rounded-tr-none"
                                : "bg-white/10 text-gray-200 rounded-tl-none"
                            }`}
                          >
                            <p className="leading-relaxed break-words">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[10px]">
                              {format(new Date(msg.createdAt!), "HH:mm")}
                              {msg.isFromAdmin && <CheckCircle2 size={10} />}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {visitorTypingMap.get(selectedVisitorId) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white/10 text-gray-200 rounded-2xl rounded-tl-none p-2.5 md:p-3">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="p-2 md:p-4 border-t border-white/10 bg-white/5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (reply.trim()) sendMutation.mutate(reply);
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={reply}
                        onChange={handleInputChange}
                        placeholder="Type your reply..."
                        className="bg-black/20 border-white/10 text-white h-10 md:h-11 rounded-full px-3 md:px-4 text-sm"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={sendMutation.isPending || !reply.trim()}
                        className="bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 md:w-11 md:h-11 shrink-0"
                      >
                        <Send size={16} className="md:w-[18px] md:h-[18px]" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-12">
                  <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-white/10 mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">Select a Conversation</h3>
                  <p className="text-gray-400 max-w-xs text-xs md:text-sm">
                    Choose a chat from the sidebar to view messages and reply to your customers.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
