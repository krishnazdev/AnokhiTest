import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Search, SortAsc, Heart, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";

// ✅ UPDATED Interface with all required fields
interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_discription: string;
  Product_category: string;
  Product_image: string[];
  isNew?: boolean;
  Product_available?: boolean;
  Product_rating?: number;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/getproductsbycategory?category=${categoryName}`
        );
        setProducts(res.data.product || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.Product_price - b.Product_price;
      case 'price-high':
        return b.Product_price - a.Product_price;
      case 'name':
      default:
        return a.Product_name.localeCompare(b.Product_name);
    }
  });

  // Calculate discount percentage
  const calculateDiscount = (price: number, originalPrice: number): number => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    if (user) {
      const wishlistProduct = {
        _id: product._id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
        isNew: product.isNew,
        category: product.Product_category,
        description: product.Product_discription
      };
      
      const wasInWishlist = isInWishlist(product._id);
      toggleWishlist(wishlistProduct);
      
      toast({ 
        title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: wasInWishlist 
          ? `${product.Product_name} removed from your wishlist` 
          : `${product.Product_name} added to your wishlist`,
        duration: 2000 
      });
    } else {
      navigate("/login");
    }
  };

  // ✅ UPDATED handleAddToCart with all required fields
  const handleAddToCart = (product: Product): void => {
    if (user) {
      const cartProduct = {
        id: parseInt(product._id.slice(-8), 16),
        _id: product._id,
        name: product.Product_name,
        price: `₹${product.Product_price}`,
        originalPrice: `₹${Math.round(product.Product_price * 1.2)}`,
        image: product.Product_image[0] || '',
        rating: product.Product_rating || 4.5,
        isNew: product.isNew || false,
        quantity: 1,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image
      };
      
      addToCart(cartProduct);
      toast({ 
        title: "Added to cart", 
        description: `${product.Product_name} has been added to your cart`,
        duration: 3000 
      });
    } else {
      navigate("/login");
    }
  };

  // Handle product click
  const handleProductClick = (productId: string): void => {
    navigate(`/product/${productId}`);
  };

  // Enhanced skeleton component
  const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/40 backdrop-blur-md rounded-3xl border border-purple-200/40 shadow-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100"></div>
      <div className="p-4 sm:p-6">
        <div className="h-4 bg-purple-100 rounded mb-3"></div>
        <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-4"></div>
        <div className="h-10 bg-purple-100 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-pink-100/50">
      <AnnouncementBar />
      <Header />
      
      {/* Enhanced Hero Section */}
      <div className="pt-24 pb-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-800/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-5 py-2 rounded-full text-sm font-semibold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4" />
              Premium Collection
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 capitalize leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {categoryName} Collection
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our exquisite range of {categoryName} pieces, crafted with precision and passion
            </motion.p>
            
            {/* Enhanced stats */}
            {!loading && products.length > 0 && (
              <motion.div 
                className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-purple-100/50 rounded-full px-6 py-3 text-sm shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="text-purple-700 font-bold">
                  {products.length} Product{products.length !== 1 ? 's' : ''} Found
                </span>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600 font-medium">
                  Premium Quality
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ SIMPLIFIED Controls Section - Removed view toggle */}
      {!loading && products.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md border-y border-purple-100/50 sticky top-16 z-30 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Product count on left */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-semibold">
                  {products.length} Products
                </span>
              </div>

              {/* Sort dropdown on right */}
              <div className="flex items-center gap-3">
                <SortAsc className="w-4 h-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border-2 border-purple-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md min-w-[160px]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md mx-auto shadow-xl border border-purple-100/50">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any products in the {categoryName} category at the moment. Check back soon!
              </p>
              <Button
                variant="outline"
                className="rounded-full px-8 py-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                onClick={() => window.history.back()}
              >
                ← Go Back
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* ✅ SIMPLIFIED Products Grid - Single responsive grid layout */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {sortedProducts.map((product, index) => {
                const originalPrice = Math.round(product.Product_price * 1.2);
                const discount = calculateDiscount(product.Product_price, originalPrice);
                const isHovered = hoveredProduct === product._id;
                const inWishlist = isInWishlist(product._id);

                return (
                  <motion.div
                    key={product._id}
                    className="group bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/40 backdrop-blur-md rounded-3xl border border-purple-200/40 shadow-xl hover:shadow-2xl hover:shadow-purple-300/30 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2 hover:scale-[1.02]"
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Product Image */}
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-100/50 via-pink-50/40 to-purple-50/60 rounded-t-3xl"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={product.Product_image[0]}
                        alt={product.Product_name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                        {product.isNew && (
                          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                            ✨ New
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                            {discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border transition-all duration-300 ${
                            inWishlist
                              ? "bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400/50 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40"
                              : "bg-white/80 border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:border-rose-400/50 hover:text-white"
                          } ${isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'}`}
                          onClick={(e) => handleWishlistToggle(e, product)}
                        >
                          <Heart
                            size={14}
                            className="sm:w-[18px] sm:h-[18px]"
                            fill={inWishlist ? "currentColor" : "none"}
                          />
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-md border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-purple-400/50 transition-all duration-300 shadow-lg ${
                            isHovered ? 'scale-110 shadow-xl' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product._id);
                          }}
                        >
                          <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </Button>
                      </div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-6 flex-grow flex flex-col bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm">
                      <div className="mb-3 sm:mb-4">
                        <h3
                          className="font-bold text-sm sm:text-lg text-gray-800 line-clamp-2 leading-tight cursor-pointer hover:text-purple-700 transition-colors mb-3"
                          onClick={() => handleProductClick(product._id)}
                        >
                          {product.Product_name}
                        </h3>
                      </div>

                      <div className="mt-auto">
                        {/* Price Section */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ₹{product.Product_price.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through bg-gray-100/50 px-2 py-1 rounded-full">
                              ₹{originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          className="w-full rounded-2xl py-3 sm:py-4 text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/50 group border border-purple-400/20 backdrop-blur-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] mr-2 group-hover:scale-110 transition-transform" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced Results Summary */}
            <motion.div 
              className="text-center mt-16 pt-8 border-t border-purple-100/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-8 py-4 rounded-full text-sm font-bold shadow-lg">
                <Sparkles className="w-5 h-5" />
                Showing all {products.length} product{products.length !== 1 ? 's' : ''} in {categoryName}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
