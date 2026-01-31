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
import ProductsPage from "@/pages/admin/Products";
import PostItemPage from "@/pages/admin/PostItem";
import EditProductPage from "@/pages/admin/EditProduct";
import AdminOrdersPage from "@/pages/admin/Orders";
import MessagesPage from "@/pages/admin/Messages";
import SizeGuide from "@/pages/SizeGuide";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
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
      <Route path="/profile" component={Profile} />
      <Route path="/orders" component={Orders} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/products" component={ProductsPage} />
      <Route path="/admin/post-item" component={PostItemPage} />
      <Route path="/admin/products/edit/:id" component={EditProductPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
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
