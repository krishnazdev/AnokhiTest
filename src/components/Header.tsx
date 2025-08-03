import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const profileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const lastScrollY = useRef(0);

  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const { clearWishlist, getTotalItems, getTotalUniqueItems } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Wishlist quantities
  const totalWishlistItems = getTotalItems(); // Total quantity including duplicates
  const uniqueWishlistItems = getTotalUniqueItems(); // Unique items count

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY <= lastScrollY.current || currentScrollY <= 60);
      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (isProfileMenuOpen || isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen, isMobileSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({ title: "Empty search", description: "Please enter a keyword to search." });
      return;
    }

    // You can customize this search logic based on your products
    const searchCategories = ["ring", "bracelet", "necklace", "bangle", "mangalsutra", "earrings", "pendant"];
    const match = searchCategories.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (match.length === 0) {
      toast({ title: "No results", description: "Try searching something else." });
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    
    setSuggestions([]);
  };

  const handleLogout = () => {
    logout();
    clearCart();
    clearWishlist();
    toast({ 
      title: "Logged out successfully", 
      description: "Come back soon!",
      variant: "default"
    });
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      // Dynamic suggestions based on search query
      const allSuggestions = [
        "Gold Ring", "Silver Bracelet", "Diamond Necklace", "Traditional Bangle", 
        "Mangalsutra", "Pearl Earrings", "Ruby Pendant", "Platinum Ring",
        "Antique Jewelry", "Bridal Collection", "Wedding Rings", "Chain",
        "Anklet", "Nose Pin", "Toe Ring", "Armlet"
      ];
      
      const filteredSuggestions = allSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer flex-shrink-0" 
              onClick={() => navigate("/")}
            > 
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                <span className="text-purple-600">Anokhi</span>{" "}
                <span className="text-gray-600">अदा</span>
              </h1>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="w-full relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Search for jewelry, collections..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 bg-white border border-gray-200 rounded-md w-full z-50 shadow-lg">
                    {suggestions.map((sug, i) => (
                      <li
                        key={i}
                        onClick={() => handleSuggestionClick(sug)}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer first:rounded-t-md last:rounded-b-md"
                      >
                        <Search className="inline mr-2" size={14} />
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              
              {/* Mobile Search Button */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                title="Search"
              >
                <Search size={20} />
              </button>

              {/* Admin Button - Desktop/Tablet */}
              {user?.role === "admin" && (
                <div className="relative group hidden sm:flex">
                  <button 
                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                    onClick={() => navigate("/admin")}
                  >
                    <LayoutDashboard size={18} className="inline-block mr-1" /> 
                    Admin
                  </button>
                  <div className="absolute top-full mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
                    <button 
                      onClick={() => navigate("/admin")} 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => navigate("/admin/products")} 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Manage Products
                    </button>
                    <button 
                      onClick={() => navigate("/admin/orders")} 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-md"
                    >
                      Manage Orders
                    </button>
                  </div>
                </div>
              )}

              {/* Wishlist with Quantity Badge */}
              <button 
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative" 
                onClick={() => navigate("/wishlist")}
                title={`Wishlist (${uniqueWishlistItems} items${totalWishlistItems !== uniqueWishlistItems ? `, ${totalWishlistItems} total` : ''})`}
              > 
                <Heart size={20} />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
                    {totalWishlistItems}
                  </span>
                )}
              </button>
              
              {/* Cart with Quantity Badge */}
              <button 
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative" 
                onClick={() => navigate("/cart")}
                title="Shopping Cart"
              > 
                <ShoppingCart size={20} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {/* Desktop Authentication */}
              <div className="hidden md:flex items-center">
                {!isAuthenticated ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate("/login")} 
                      className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => navigate("/signup")} 
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="relative" ref={profileMenuRef}>
                    <button 
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors" 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                      title={user.firstName || user.email}
                    >
                      <User size={20} />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }} 
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName || user.email}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <button 
                            onClick={() => { navigate("/profile"); setIsProfileMenuOpen(false); }} 
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Profile
                          </button>
                          <button 
                            onClick={() => { navigate("/orders"); setIsProfileMenuOpen(false); }} 
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Orders
                          </button>
                          {user?.role === "admin" && (
                            <button 
                              onClick={() => { navigate("/admin"); setIsProfileMenuOpen(false); }} 
                              className="w-full text-left px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-100"
                            >
                              Admin Panel
                            </button>
                          )}
                          <button 
                            onClick={handleLogout} 
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ✅ Removed the mobile info bar completely */}
        </div>
      </motion.header>

      {/* Mobile Search Bar - Toggleable */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 inset-x-0 bg-white z-40 shadow-lg border-b border-gray-200 md:hidden"
            ref={mobileSearchRef}
          >
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                      setIsMobileSearchOpen(false);
                    }
                  }}
                  placeholder="Search jewelry..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
                {suggestions.length > 0 && (
                  <ul className="absolute mt-1 bg-white border border-gray-200 rounded-md w-full z-50 shadow-lg">
                    {suggestions.map((sug, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          handleSuggestionClick(sug);
                          setIsMobileSearchOpen(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer first:rounded-t-md last:rounded-b-md"
                      >
                        <Search className="inline mr-2" size={14} />
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed inset-x-0 bg-white z-40 shadow-lg border-b border-gray-200 md:hidden ${
              isMobileSearchOpen ? 'top-[76px]' : 'top-16'
            }`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                
                {/* Navigation Links */}
                <div className="space-y-1">
                  <button 
                    onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Home
                  </button>
                </div>
                
                {/* Admin Section for Mobile */}
                {user?.role === "admin" && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="space-y-1">
                      <button 
                        onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                        className="block w-full text-left py-3 px-4 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                      >
                        <LayoutDashboard size={18} className="inline-block mr-2" />
                        Admin Dashboard
                      </button>
                      <button 
                        onClick={() => { navigate('/admin/products'); setIsMobileMenuOpen(false); }}
                        className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Manage Products
                      </button>
                      <button 
                        onClick={() => { navigate('/admin/orders'); setIsMobileMenuOpen(false); }}
                        className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Manage Orders
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Authentication Section */}
                <div className="pt-4 border-t border-gray-200">
                  {!isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                        className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
                      >
                        Create Account
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                        className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => { navigate("/orders"); setIsMobileMenuOpen(false); }}
                        className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => { 
                          handleLogout(); 
                          setIsMobileMenuOpen(false); 
                        }}
                        className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
