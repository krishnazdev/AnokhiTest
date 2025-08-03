import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin, 
  CreditCard,
  Eye,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// Type definitions
interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
}

interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Status configurations
const orderStatusConfig = {
  pending: {
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    label: "Order Placed"
  },
  processing: {
    icon: Package,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    label: "Processing"
  },
  shipped: {
    icon: Truck,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    label: "Shipped"
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    label: "Delivered"
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    label: "Cancelled"
  }
};

const paymentStatusConfig = {
  pending: { color: "bg-yellow-500", label: "Payment Pending" },
  paid: { color: "bg-green-500", label: "Paid" },
  failed: { color: "bg-red-500", label: "Payment Failed" }
};

const Orders = () => {
  const { user }: { user: User | null } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Safe date formatting function
  const formatDate = useCallback((dateString: string | undefined, formatString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders/user`, {
        withCredentials: true
      });
      setOrders(res.data.orders || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Get order status progress
  const getOrderProgress = (status: string) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyOrders = () => (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-purple-100/50">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          No Orders Yet
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your jewelry collection is waiting! Explore our beautiful pieces and place your first order.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Start Shopping
        </button>
      </div>
    </motion.div>
  );

  // Order Details Modal/Card
  const OrderDetails = ({ order }: { order: Order }) => {
    const statusConfig = orderStatusConfig[order.orderStatus];
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-6 md:p-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Order Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-purple-100">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.textColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.createdAt, 'MMM d, yyyy - h:mm a')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusConfig.color} text-white px-4 py-2 rounded-full font-semibold`}>
              {statusConfig.label}
            </Badge>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{order.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {order.orderStatus !== 'cancelled' && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Order Progress</span>
              <span>{Math.round(getOrderProgress(order.orderStatus))}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getOrderProgress(order.orderStatus)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        )}

        {/* Tracking Information */}
        {order.trackingNumber && (
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 rounded-2xl border border-purple-100/50 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Tracking Information</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
            </p>
            {order.estimatedDelivery && (
              <p className="text-sm text-gray-600">
                Estimated Delivery: {formatDate(order.estimatedDelivery, 'MMM d, yyyy')}
              </p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div 
                key={item._id}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-2xl border border-purple-100/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-purple-100 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="font-semibold text-gray-900 mb-1">{item.name}</h5>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </span>
                    <span className="font-bold text-purple-700">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Shipping Address</h4>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </p>
              <p className="mt-2">
                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Payment Details</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="bg-white px-3 py-1 rounded-full border border-purple-200 text-sm font-semibold">
                  {order.paymentMethod.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={`${paymentStatusConfig[order.paymentStatus].color} text-white px-3 py-1 rounded-full`}>
                  {paymentStatusConfig[order.paymentStatus].label}
                </Badge>
              </div>
              
              <div className="pt-3 border-t border-purple-100">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
          <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Please Login
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You need to be logged in to view your orders.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-16 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
        {/* Background Decorations */}
        <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />
        <div className="fixed bottom-40 right-10 w-48 h-48 rounded-full bg-pink-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="fixed top-1/2 right-1/4 w-24 h-24 rounded-full bg-purple-300/15 blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <Package className="w-4 h-4" />
              Order Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4">
              My Orders
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Track your jewelry orders and view order history
            </p>
            
            {/* Back to Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center gap-2 mt-6 text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
          </motion.div>

          {/* Orders Summary */}
          {!loading && orders.length > 0 && (
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-6 md:p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                  <p className="text-gray-600">
                    You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
                  </p>
                </div>
                
                <div className="flex gap-4 text-center">
                  {Object.entries(
                    orders.reduce((acc, order) => {
                      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => {
                    const statusConfig = orderStatusConfig[status as keyof typeof orderStatusConfig];
                    return (
                      <div key={status} className="text-center">
                        <div className={`w-8 h-8 ${statusConfig.bgColor} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                          <statusConfig.icon className={`w-4 h-4 ${statusConfig.textColor}`} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-600 capitalize">{status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders List */}
          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <OrderDetails order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
