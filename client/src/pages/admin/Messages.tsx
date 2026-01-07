import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
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

type Conversation = {
  visitorId: string;
  lastMessage: Message;
  unreadCount: number;
};

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.isAdmin) {
      setLocation("/auth");
    } else {
      setIsAdmin(true);
    }
  }, [setLocation]);

  const { data: conversations, isLoading: loadingConvs } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    refetchInterval: 3000,
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedVisitorId],
    enabled: !!selectedVisitorId,
    refetchInterval: 2000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedVisitorId) return;
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await apiRequest("POST", "/api/messages", {
        content,
        visitorId: selectedVisitorId,
        isFromAdmin: true,
        userId: user?.id,
      });
    },
    onSuccess: () => {
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedVisitorId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (visitorId: string) => {
      await apiRequest("POST", `/api/messages/${visitorId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  useEffect(() => {
    if (selectedVisitorId) {
      markReadMutation.mutate(selectedVisitorId);
    }
  }, [selectedVisitorId]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <AdminNavbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto h-[70vh] flex flex-col md:flex-row gap-6">
          {/* Sidebar - Conversations List */}
          <Card className="w-full md:w-1/3 bg-white/5 border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-heading font-bold">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : conversations?.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations?.map((conv) => (
                  <div
                    key={conv.visitorId}
                    onClick={() => setSelectedVisitorId(conv.visitorId)}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                      selectedVisitorId === conv.visitorId ? "bg-white/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm truncate">
                        Visitor {conv.visitorId.slice(0, 8)}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage.content}</p>
                    <span className="text-[10px] text-gray-500">
                      {format(new Date(conv.lastMessage.createdAt!), "MMM d, HH:mm")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="flex-1 bg-white/5 border-white/10 overflow-hidden flex flex-col">
            {selectedVisitorId ? (
              <>
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <UserIcon className="text-purple-400 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Visitor {selectedVisitorId.slice(0, 8)}</h3>
                      <span className="text-[10px] text-green-400 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence initial={false}>
                    {messages?.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isFromAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                            msg.isFromAdmin
                              ? "bg-purple-600 text-white rounded-tr-none"
                              : "bg-white/10 text-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[10px]">
                            {format(new Date(msg.createdAt!), "HH:mm")}
                            {msg.isFromAdmin && <CheckCircle2 size={10} />}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (reply.trim()) sendMutation.mutate(reply);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="bg-black/20 border-white/10 text-white h-10 rounded-full px-4"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={sendMutation.isPending || !reply.trim()}
                      className="bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 shrink-0"
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <MessageSquare className="w-16 h-16 text-white/10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a Conversation</h3>
                <p className="text-gray-500 max-w-xs text-sm">
                  Choose a chat from the sidebar to view messages and reply to your customers.
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
