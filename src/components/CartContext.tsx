import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
  quantity?: number;
  _id?: string; // For database products
  Product_name?: string; // For your backend product structure
  Product_price?: number;
  Product_image?: string[];
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  loading: boolean;
  syncCartOnLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to safely parse stored cart data
const getStoredCart = (): Product[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

// Helper function to safely store cart data
const storeCart = (cart: Product[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  } catch (error) {
    console.error('Error storing cart to localStorage:', error);
  }
};

// Helper function to safely extract price from string
const extractPrice = (price: any): number => {
  if (!price) return 0;
  
  const priceString = typeof price === 'string' ? price : String(price);
  
  // ✅ FIXED: Check for 'undefined' string
  if (priceString === 'undefined' || priceString === 'null') return 0;
  
  const numericPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  
  return isNaN(numericPrice) ? 0 : numericPrice;
};

// ✅ IMPROVED: Helper function to normalize product data with better validation
const normalizeProduct = (product: any): Product => {
  // Validate required fields
  if (!product) {
    console.warn('Product is null or undefined');
    return {
      id: 0,
      name: 'Unknown Product',
      price: '₹0',
      originalPrice: '₹0',
      image: '',
      rating: 4.5,
      isNew: false,
      quantity: 1
    };
  }

  // ✅ FIXED: Better price handling with validation
  let price = '₹0';
  let originalPrice = '₹0';
  
  if (product.price && product.price !== 'undefined' && product.price !== 'null') {
    price = product.price;
  } else if (product.Product_price && typeof product.Product_price === 'number' && product.Product_price > 0) {
    price = `₹${product.Product_price}`;
  }
  
  if (product.originalPrice && product.originalPrice !== 'undefined') {
    originalPrice = product.originalPrice;
  } else if (product.Product_price && typeof product.Product_price === 'number' && product.Product_price > 0) {
    originalPrice = `₹${Math.round(product.Product_price * 1.2)}`;
  }

  return {
    id: product.id || parseInt(product._id?.slice(-8), 16) || 0,
    name: product.name || product.Product_name || 'Unknown Product',
    price: price,
    originalPrice: originalPrice,
    image: product.image || product.Product_image?.[0] || '',
    rating: product.rating || product.Product_rating || 4.5,
    isNew: product.isNew || false,
    quantity: product.quantity || 1,
    _id: product._id,
    Product_name: product.Product_name,
    Product_price: product.Product_price,
    Product_image: product.Product_image
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart based on authentication status
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cart/`, {
        withCredentials: true
      });
      
      if (response.data.cart && Array.isArray(response.data.cart)) {
        const normalizedCart = response.data.cart.map((item: any) => {
          // ✅ FIXED: Ensure we have productId data before normalizing
          if (!item.productId) {
            console.warn('Cart item missing productId:', item);
            return null;
          }
          
          return normalizeProduct({
            ...item.productId,
            quantity: item.quantity
          });
        }).filter(Boolean); // Remove null items
        
        setCart(normalizedCart);
      } else {
        setCart([]);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load cart from database:', error);
      // Fallback to localStorage
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    const storedCart = getStoredCart();
    // ✅ IMPROVED: Better validation for stored cart items
    const validCart = storedCart.filter(item => 
      item && 
      item.price && 
      item.price !== 'undefined' && 
      item.price !== 'null' &&
      (item.id || item._id)
    );
    setCart(validCart);
    setIsInitialized(true);
  };

  // Save cart to localStorage whenever cart changes (only for guest users)
  useEffect(() => {
    if (isInitialized && !user) {
      storeCart(cart);
    }
  }, [cart, isInitialized, user]);

  const addToCart = async (product: Product) => {
    // ✅ IMPROVED: Better validation
    if (!product) {
      console.error('Product is null or undefined');
      return;
    }

    // Check for either numeric ID or MongoDB ObjectId
    if (!product.id && !product._id) {
      console.error('Product missing both id and _id:', product);
      return;
    }

    // Check for valid price
    if (!product.price || product.price === 'undefined' || product.price === 'null') {
      if (!product.Product_price || product.Product_price <= 0) {
        console.error('Product missing valid price:', product);
        toast({
          title: "Error",
          description: "Product price is not available",
          variant: "destructive"
        });
        return;
      }
    }

    const normalizedProduct = normalizeProduct(product);

    if (user) {
      // Authenticated user - save to database
      setLoading(true);
      try {
        // ✅ FIXED: Prioritize MongoDB ObjectId
        const productIdToSend = product._id || product.id;
        
        if (!productIdToSend) {
          throw new Error('No valid product ID found');
        }

        console.log('Adding to cart with ID:', productIdToSend); // Debug log

        const response = await axios.post(`${API_URL}/cart/add`, {
          productId: productIdToSend,
          quantity: 1
        }, { withCredentials: true });

        if (response.data.cart) {
          const normalizedCart = response.data.cart.map((item: any) => {
            if (!item.productId) return null;
            return normalizeProduct({
              ...item.productId,
              quantity: item.quantity
            });
          }).filter(Boolean);
          
          setCart(normalizedCart);
          
          toast({
            title: "Added to cart",
            description: `${normalizedProduct.name} added to your cart`,
          });
        }
      } catch (error: any) {
        console.error('Failed to add to cart:', error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to add item to cart",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setCart((prevCart) => {
        const existingProductIndex = prevCart.findIndex((item) => 
          item.id === normalizedProduct.id || 
          (item._id && normalizedProduct._id && item._id === normalizedProduct._id)
        );
        
        if (existingProductIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex] = {
            ...updatedCart[existingProductIndex],
            quantity: (updatedCart[existingProductIndex].quantity || 1) + 1
          };
          return updatedCart;
        } else {
          return [...prevCart, { ...normalizedProduct, quantity: 1 }];
        }
      });

      toast({
        title: "Added to cart",
        description: `${normalizedProduct.name} added to your cart`,
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (user) {
      // Authenticated user - remove from database
      setLoading(true);
      try {
        // Find the product to get its database ID
        const productToRemove = cart.find(item => item.id === productId);
        const dbProductId = productToRemove?._id || productId;

        const response = await axios.delete(`${API_URL}/cart/remove/${dbProductId}`, {
          withCredentials: true
        });

        if (response.data.cart) {
          const normalizedCart = response.data.cart.map((item: any) => {
            if (!item.productId) return null;
            return normalizeProduct({
              ...item.productId,
              quantity: item.quantity
            });
          }).filter(Boolean);
          setCart(normalizedCart);
        } else {
          setCart([]);
        }

        toast({
          title: "Removed from cart",
          description: "Item removed from your cart",
        });
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        toast({
          title: "Error",
          description: "Failed to remove item from cart",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - remove from localStorage
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
  };

  const clearCart = async () => {
    if (user) {
      // Authenticated user - clear database cart
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/cart/clear`, {
          withCredentials: true
        });
        setCart([]);
        
        toast({
          title: "Cart cleared",
          description: "All items removed from your cart",
        });
      } catch (error) {
        console.error('Failed to clear cart on server:', error);
        toast({
          title: "Error",
          description: "Failed to clear cart",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - clear localStorage
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const newQuantity = Math.max(1, Math.floor(quantity));

    if (user) {
      // Authenticated user - update in database
      setLoading(true);
      try {
        const productToUpdate = cart.find(item => item.id === productId);
        const dbProductId = productToUpdate?._id || productId;

        const response = await axios.put(`${API_URL}/cart/update/${dbProductId}`, {
          quantity: newQuantity
        }, { withCredentials: true });

        if (response.data.cart) {
          const normalizedCart = response.data.cart.map((item: any) => {
            if (!item.productId) return null;
            return normalizeProduct({
              ...item.productId,
              quantity: item.quantity
            });
          }).filter(Boolean);
          setCart(normalizedCart);
        }
      } catch (error) {
        console.error('Failed to update quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update item quantity",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - update localStorage
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Sync localStorage cart to database when user logs in
  const syncCartOnLogin = async () => {
    if (!user) return;

    try {
      const localCart = getStoredCart();
      
      if (localCart.length > 0) {
        setLoading(true);
        
        // ✅ IMPROVED: Better validation for sync items
        const itemsToSync = localCart
          .filter(item => item && (item._id || item.id) && item.price && item.price !== 'undefined')
          .map(item => ({
            id: item._id || item.id,
            quantity: item.quantity || 1
          }));

        if (itemsToSync.length === 0) {
          console.log('No valid items to sync');
          await loadCartFromDatabase();
          return;
        }

        const response = await axios.post(`${API_URL}/cart/sync`, {
          items: itemsToSync
        }, { withCredentials: true });
        
        if (response.data.cart) {
          const normalizedCart = response.data.cart.map((item: any) => {
            if (!item.productId) return null;
            return normalizeProduct({
              ...item.productId,
              quantity: item.quantity
            });
          }).filter(Boolean);
          setCart(normalizedCart);
        }
        
        // Clear localStorage after successful sync
        localStorage.removeItem('cart');
        
        toast({
          title: "Cart restored",
          description: "Your cart items have been restored",
        });
      } else {
        // No local cart to sync, just load from database
        await loadCartFromDatabase();
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
      // Fallback to just loading from database
      await loadCartFromDatabase();
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => {
      if (!item) return total;
      return total + (item.quantity || 1);
    }, 0);
  };

  // ✅ IMPROVED: Better error handling in getCartTotal
  const getCartTotal = (): number => {
    return cart.reduce((sum, item) => {
      if (!item || !item.price || item.price === 'undefined' || item.price === 'null') {
        console.warn('Cart item missing or invalid price:', item);
        return sum;
      }
      
      const priceNumber = extractPrice(item.price);
      if (priceNumber <= 0) {
        console.warn('Invalid price extracted:', item.price, 'extracted:', priceNumber);
        return sum;
      }
      
      const quantity = item.quantity || 1;
      return sum + (priceNumber * quantity);
    }, 0);
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartCount,
    getCartTotal,
    loading,
    syncCartOnLogin
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
