import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function FloatingChatButton() {
  return (
    <Link href="/chat">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30"
        data-testid="button-floating-chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </Link>
  );
}
