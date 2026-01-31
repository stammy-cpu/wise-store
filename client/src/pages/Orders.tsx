import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CreditCard, MapPin } from "lucide-react";
import { format } from "date-fns";

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

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/auth/session"],
    retry: false,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!session?.user,
  });

  if (sessionLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    setLocation("/auth");
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and track your order history</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => setLocation("/collections")}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Browse Collections
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const items: OrderItem[] = JSON.parse(order.items);
              const address = JSON.parse(order.shippingAddress);

              return (
                <Card key={order.id}>
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Total</div>
                          <div className="text-lg font-semibold">${order.total}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {item.size && <p>Size: {item.size}</p>}
                              {item.color && <p>Color: {item.color}</p>}
                              <p>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Shipping Address</div>
                          <div className="text-sm text-gray-600 mt-1">
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
                        <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Payment Method</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
