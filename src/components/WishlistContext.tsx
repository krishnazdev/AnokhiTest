import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Updated interface to match your API product structure with quantity
interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
  category?: string;
  description?: string;
}

// Legacy product interface for backward compatibility
interface LegacyProduct {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
}

// Wishlist item with quantity
interface WishlistItem {
  product: Product;
  quantity: number;
  dateAdded: string;
}

// Legacy wishlist item with quantity
interface LegacyWishlistItem {
  product: LegacyProduct;
  quantity: number;
  dateAdded: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  legacyWishlist: LegacyWishlistItem[];
  toggleWishlist: (product: Product | LegacyProduct, quantity?: number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  getQuantity: (productId: string | number) => number;
  isInWishlist: (productId: string | number) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
  getTotalUniqueItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [legacyWishlist, setLegacyWishlist] = useState<LegacyWishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedLegacyWishlist = localStorage.getItem('legacyWishlist');
      
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Handle migration from old format (without quantity) to new format
        const migratedWishlist = parsedWishlist.map((item: any) => {
          if (item.product) {
            // Already new format
            return item;
          } else {
            // Old format - migrate to new format
            return {
              product: item,
              quantity: 1,
              dateAdded: new Date().toISOString()
            };
          }
        });
        setWishlist(migratedWishlist);
      }

      if (savedLegacyWishlist) {
        const parsedLegacyWishlist = JSON.parse(savedLegacyWishlist);
        // Handle migration for legacy wishlist
        const migratedLegacyWishlist = parsedLegacyWishlist.map((item: any) => {
          if (item.product) {
            return item;
          } else {
            return {
              product: item,
              quantity: 1,
              dateAdded: new Date().toISOString()
            };
          }
        });
        setLegacyWishlist(migratedLegacyWishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('legacyWishlist', JSON.stringify(legacyWishlist));
    } catch (error) {
      console.error('Error saving legacy wishlist to localStorage:', error);
    }
  }, [legacyWishlist]);

  // Helper function to check if product is new API format
  const isNewProduct = (product: Product | LegacyProduct): product is Product => {
    return '_id' in product;
  };

  const toggleWishlist = (product: Product | LegacyProduct, quantity: number = 1) => {
    if (isNewProduct(product)) {
      // Handle new API format
      setWishlist((prevWishlist) => {
        const existingIndex = prevWishlist.findIndex((item) => item.product._id === product._id);
        
        if (existingIndex !== -1) {
          // Remove from wishlist
          return prevWishlist.filter((item) => item.product._id !== product._id);
        } else {
          // Add to wishlist with quantity
          const newItem: WishlistItem = {
            product: product,
            quantity: Math.max(1, quantity),
            dateAdded: new Date().toISOString()
          };
          return [...prevWishlist, newItem];
        }
      });
    } else {
      // Handle legacy format
      setLegacyWishlist((prevWishlist) => {
        const existingIndex = prevWishlist.findIndex((item) => item.product.id === product.id);
        
        if (existingIndex !== -1) {
          // Remove from wishlist
          return prevWishlist.filter((item) => item.product.id !== product.id);
        } else {
          // Add to wishlist with quantity
          const newItem: LegacyWishlistItem = {
            product: product,
            quantity: Math.max(1, quantity),
            dateAdded: new Date().toISOString()
          };
          return [...prevWishlist, newItem];
        }
      });
    }
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    const newQuantity = Math.max(1, Math.min(99, quantity)); // Limit between 1-99

    if (typeof productId === 'string') {
      // Update new API format
      setWishlist((prevWishlist) => 
        prevWishlist.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      // Update legacy format
      setLegacyWishlist((prevWishlist) => 
        prevWishlist.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getQuantity = (productId: string | number): number => {
    if (typeof productId === 'string') {
      const item = wishlist.find((item) => item.product._id === productId);
      return item ? item.quantity : 0;
    } else {
      const item = legacyWishlist.find((item) => item.product.id === productId);
      return item ? item.quantity : 0;
    }
  };

  const isInWishlist = (productId: string | number): boolean => {
    if (typeof productId === 'string') {
      return wishlist.some((item) => item.product._id === productId);
    } else {
      return legacyWishlist.some((item) => item.product.id === productId);
    }
  };

  const getTotalItems = (): number => {
    const wishlistTotal = wishlist.reduce((total, item) => total + item.quantity, 0);
    const legacyTotal = legacyWishlist.reduce((total, item) => total + item.quantity, 0);
    return wishlistTotal + legacyTotal;
  };

  const getTotalUniqueItems = (): number => {
    return wishlist.length + legacyWishlist.length;
  };

  const clearWishlist = () => {
    setWishlist([]);
    setLegacyWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      legacyWishlist,
      toggleWishlist, 
      updateQuantity,
      getQuantity,
      isInWishlist, 
      clearWishlist,
      getTotalItems,
      getTotalUniqueItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
