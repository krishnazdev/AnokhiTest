import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false); // ✅ Now controls modal visibility
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  // Delivery charge logic
  const subtotal = getCartTotal();
  const deliveryCharge = subtotal < 500 ? 80 : 0;
  const totalPrice = subtotal + deliveryCharge;
  const freeDeliveryThreshold = 500;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
        variant: "default"
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // ✅ UPDATED: Handle checkout with delivery charge
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Validate shipping address
    const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof typeof shippingAddress].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping address fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        productId: item._id || item.Product_name,
        name: item.name || item.Product_name,
        quantity: item.quantity || 1,
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0,
        image: item.image || (item.Product_image && item.Product_image[0])
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: "cod",
        totalAmount: totalPrice,
        deliveryCharge: deliveryCharge,
        subtotal: subtotal
      };

      await axios.post(`${API_URL}/orders/create`, orderData, {
        withCredentials: true
      });

      clearCart();
      setIsCheckingOut(false); // ✅ Close modal on success
      toast({
        title: "Order placed successfully!",
        description: "Your jewelry is on its way. Track your order in your profile.",
        variant: "default"
      });
      navigate("/orders");
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getItemTotal = (item: any) => {
    if (!item || !item.price) {
      console.warn('Item missing price:', item);
      return 0;
    }
    
    const priceString = typeof item.price === 'string' ? item.price : String(item.price);
    const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
    
    if (isNaN(priceNumber)) {
      console.warn('Could not parse price:', item.price);
      return 0;
    }
    
    const quantity = item.quantity || 1;
    return priceNumber * quantity;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 sm:px-6 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md w-full"
        >
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-100">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Your Jewellery Cart is Empty</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Looks like you haven't added any beautiful pieces to your cart yet. Discover our collection of handcrafted jewelry.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/")}
                className="rounded-full px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                Explore Collection
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-white pt-20 sm:pt-24 pb-8 sm:pb-16 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 px-2">
              Your <span className="text-purple-600">Jewellery</span> Cart
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
              Review your selected pieces before checkout
            </p>
          </motion.div>

          {/* Free delivery banner */}
          {amountForFreeDelivery > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-xs sm:text-sm text-orange-800 font-medium">
                  Add ₹{amountForFreeDelivery} more for <span className="font-bold">FREE DELIVERY</span>
                </span>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100 p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`cart-item-${item._id || item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="py-3 sm:py-4 border-b border-purple-100 last:border-0"
                    >
                      {/* Horizontal layout - Image left, Info right */}
                      <div className="flex gap-3 sm:gap-4">
                        {/* Product Image - Left side */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-purple-100 flex-shrink-0">
                          <img 
                            src={item.image || (item.Product_image && item.Product_image[0])} 
                            alt={item.name || item.Product_name} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-jewelry.jpg';
                            }}
                          />
                        </div>

                        {/* Product Info - Right side */}
                        <div className="flex-1 min-w-0">
                          {/* Product name and remove button */}
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                                {item.name || item.Product_name}
                              </h3>
                              <p className="text-base sm:text-lg font-semibold text-purple-600 mt-1">
                                {item.price}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-gray-500 hover:text-red-500 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name || item.Product_name} from cart`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </div>

                          {/* Quantity controls and total */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-purple-200 rounded-full">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                aria-label="Decrease quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </Button>
                              <span className="px-2 sm:px-3 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                                {item.quantity || 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                aria-label="Increase quantity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </Button>
                            </div>
                            
                            <div className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Total:</span> ₹{getItemTotal(item).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-100 flex flex-col gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto rounded-full px-4 sm:px-6 py-2 sm:py-3 border-purple-600 text-purple-600 hover:bg-purple-50 text-sm sm:text-base"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="destructive" 
                      className="flex-1 sm:flex-none rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                      onClick={() => {
                        clearCart();
                        toast({
                          title: "Cart cleared",
                          description: "All items have been removed from your cart",
                          variant: "default"
                        });
                      }}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      className="flex-1 sm:flex-none rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-sm sm:text-base"
                      onClick={() => setIsCheckingOut(true)} // ✅ Opens modal instead of expanding form
                      disabled={cart.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary - ✅ Simplified, no longer contains checkout form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100 p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {cart.map((item, index) => (
                    <div 
                      key={`summary-${item._id || item.id}-${index}`}
                      className="flex justify-between text-xs sm:text-sm"
                    >
                      <span className="text-gray-600 truncate mr-2">
                        {item.name || item.Product_name} × {item.quantity || 1}
                      </span>
                      <span className="font-medium">₹{getItemTotal(item).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-3 sm:pt-4 border-t border-purple-100">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                    <span className="font-medium text-sm sm:text-base">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-gray-600 text-sm sm:text-base">Delivery</span>
                    {deliveryCharge > 0 ? (
                      <span className="font-medium text-orange-600 text-sm sm:text-base">₹{deliveryCharge}</span>
                    ) : (
                      <span className="font-medium text-green-600 text-sm sm:text-base">Free</span>
                    )}
                  </div>
                  
                  {/* Free delivery progress */}
                  {amountForFreeDelivery > 0 && (
                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm text-orange-800 font-medium">Free Delivery Progress</span>
                        <span className="text-xs sm:text-sm text-orange-600">₹{amountForFreeDelivery} to go</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-orange-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-100">
                    <span>Total</span>
                    <span className="text-purple-600">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden sm:block absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
      </div>

      {/* ✅ NEW: Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCheckingOut(false)} // Click outside to close
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-purple-100 w-full max-w-md max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-100">
                <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                <button
                  onClick={() => setIsCheckingOut(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close checkout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Order Summary in Modal */}
                <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 mb-3">
                    {cart.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate mr-2">
                          {item.name || item.Product_name} × {item.quantity || 1}
                        </span>
                        <span className="font-medium">₹{getItemTotal(item).toFixed(2)}</span>
                      </div>
                    ))}
                    {cart.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{cart.length - 2} more items
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-purple-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Delivery</span>
                      <span className={deliveryCharge > 0 ? "text-orange-600" : "text-green-600"}>
                        {deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-purple-200">
                      <span>Total</span>
                      <span className="text-purple-600">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pinCode" className="text-sm font-medium text-gray-700">
                      PIN Code *
                    </Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      value={shippingAddress.pinCode}
                      onChange={handleInputChange}
                      required
                      className="mt-1 py-3 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="PIN Code"
                    />
                  </div>

                  {/* Modal Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        `Place Order - ₹${totalPrice.toFixed(2)}`
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Cash on Delivery • Secure Payment
                        </span>
                        {deliveryCharge > 0 && (
                          <>
                            <br />
                            <span className="text-orange-600 font-medium">Delivery charge: ₹{deliveryCharge}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartPage;
