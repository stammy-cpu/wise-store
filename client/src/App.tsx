import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Collections from "@/pages/Collections";
import Contact from "@/pages/Contact";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import Wishlist from "@/pages/Wishlist";
import Chat from "@/pages/Chat";
import Admin from "@/pages/Admin";
import PostItemPage from "@/pages/admin/PostItem";
import OrdersPage from "@/pages/admin/Orders";
import MessagesPage from "@/pages/admin/Messages";
import SizeGuide from "@/pages/SizeGuide";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { useLocation } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/collections" component={Collections} />
      <Route path="/contact" component={Contact} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/auth" component={Auth} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/chat" component={Chat} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/post-item" component={PostItemPage} />
      <Route path="/admin/orders" component={OrdersPage} />
      <Route path="/admin/messages" component={MessagesPage} />
      <Route path="/size-guide" component={SizeGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const showFloatingChat = location !== "/chat";

  return (
    <>
      <Router />
      {showFloatingChat && <FloatingChatButton />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
