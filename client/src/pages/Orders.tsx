import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Package, Calendar, CreditCard, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "@/hooks/useSession";

interface OrderItem {
  name: string;
  price: string;
  size?: string;
  color?: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  items: string;
  total: string;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export default function Orders() {
  const [, setLocation] = useLocation();
  const { user, isLoading: sessionLoading } = useSession();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  if (sessionLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-[#1a1025] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1025] text-white font-sans">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">My Orders</h1>
            <p className="text-gray-400">View and track your order history</p>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 md:p-12 text-center border border-white/10">
              <Package className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => setLocation("/collections")}
                className="bg-white text-[#1a1025] px-6 md:px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const items: OrderItem[] = JSON.parse(order.items);
                const address = JSON.parse(order.shippingAddress);

                return (
                  <div key={order.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-white/5 p-4 md:p-6 border-b border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Total</div>
                            <div className="text-lg md:text-xl font-semibold">${order.total}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-4 md:p-6">
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {items.map((item, index) => (
                          <div key={index} className="flex gap-3 md:gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm md:text-base truncate">{item.name}</h4>
                              <div className="text-xs md:text-sm text-gray-400 space-y-1 mt-1">
                                {item.size && <p>Size: {item.size}</p>}
                                {item.color && <p>Color: {item.color}</p>}
                                <p>Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm md:text-base">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping & Payment Info */}
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-white/10">
                        <div className="flex gap-3">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold mb-1">Shipping Address</div>
                            <div className="text-sm text-gray-400 space-y-0.5">
                              <p>{address.fullName}</p>
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold mb-1">Payment Method</div>
                            <div className="text-sm text-gray-400">
                              {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
