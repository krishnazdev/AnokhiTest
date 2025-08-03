import React, { useEffect, useState, useRef } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { motion, Variants } from "framer-motion"; 
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
 
const API_URL = 
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000"; 
 
const CategoryGrid = () => { 
  const navigate = useNavigate(); 
  const [categories, setCategories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null); 
 
  useEffect(() => { 
    const fetchCategories = async () => { 
      try { 
        const res = await axios.get(`${API_URL}/api/getAllData`, { 
          withCredentials: true, 
        }); 
        setCategories(res.data.data?.categories || []); 
        setError(null); 
      } catch (err) { 
        setError("Failed to load categories."); 
        setCategories([]); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchCategories(); 
  }, []);

  // Scroll functions for navigation arrows
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280,
        behavior: 'smooth'
      });
    }
  }; 
 
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Simple loading skeleton for round design
  const CategorySkeleton = () => (
    <div className="flex-shrink-0 flex flex-col items-center space-y-2 w-20 sm:w-24 md:w-28 lg:w-32">
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full" />
      <Skeleton className="h-3 w-12 sm:w-16 mx-auto" />
    </div>
  );
 
  if (loading) { 
    return ( 
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50"> 
        <div className="w-full max-w-7xl mx-auto"> 
          <div className="text-center mb-12 px-4">
            <Skeleton className="h-3 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 px-4 sm:px-6 lg:px-8" style={{ width: 'max-content' }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    ); 
  } 
 
  if (error) { 
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
        <div className="w-full max-w-4xl mx-auto px-4">
          <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base font-medium">
              {error} Please refresh the page to try again.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  } 
 
  return ( 
    <section className="pt-16 sm:pt-20 lg:pt-24 xl:pt-32 pb-12 sm:pb-16 lg:pb-20 xl:pb-24 mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 relative overflow-hidden"> 
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/2 via-transparent to-pink-500/2 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto relative"> 
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 lg:mb-20 xl:mb-24 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        > 
          <Badge 
            variant="secondary" 
            className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200/50 px-5 py-2 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Explore Our Collections
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-gray-900 leading-tight"> 
            Shop by{" "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2> 
          
          {/* Scroll indicator */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100/50 shadow-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm xl:text-base font-medium text-gray-600">Scroll to explore more collections</span>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" 
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div> 

        {/* Round Category Design with Extra Top Spacing to Prevent Overlap */}
        <div className="relative group mt-8 sm:mt-12 lg:mt-16">
          <motion.div 
            ref={scrollContainerRef}
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Fixed spacing and z-index container with extra padding */}
            <div 
              className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 px-4 sm:px-6 lg:px-8" 
              style={{ 
                width: 'max-content',
                position: 'relative',
                zIndex: 1,
                paddingTop: '12px' // Extra padding to prevent overlap
              }}
            >
              {categories.map((category, index) => ( 
                <motion.div
                  key={category._id} 
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.08,
                    y: -8, // Reduced upward movement to prevent overlap
                    zIndex: 10,
                    transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 flex flex-col items-center space-y-3 cursor-pointer group relative"
                  onClick={() => navigate(`/category/${category.slug}`)}
                  style={{ 
                    width: 'clamp(75px, 20vw, 140px)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {/* Round Category Image */}
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 ring-2 ring-purple-100/50 group-hover:ring-purple-300/70"> 
                      <img 
                        src={category.image || "/fallback.jpg"} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => { 
                          (e.currentTarget as HTMLImageElement).src = "/fallback.jpg"; 
                        }} 
                      /> 
                    </div>
                    
                    {/* Enhanced glow effect with fixed z-index */}
                    <div 
                      className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" 
                      style={{ zIndex: -1 }}
                    />
                  </div>
                  
                  {/* Category Name */}
                  <div className="text-center">
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-purple-700 capitalize transition-colors duration-300 leading-tight line-clamp-2"> 
                      {category.name} 
                    </h3>
                    
                    {/* Optional: Product count for larger screens */}
                    {category.productCount && (
                      <Badge variant="outline" className="mt-2 text-xs border-purple-200 text-purple-700 bg-purple-50/50 hidden md:inline-flex">
                        {category.productCount}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))} 
            </div> 
          </motion.div>

          {/* Navigation Arrows with Fixed Z-Index */}
          {categories.length > 4 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={scrollLeft}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md border-2 border-purple-200/50 text-purple-600 hover:bg-white hover:border-purple-400 hover:scale-110 transition-all duration-300 opacity-60 group-hover:opacity-100 rounded-full shadow-xl"
                style={{ zIndex: 20 }}
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={scrollRight}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/90 backdrop-blur-md border-2 border-purple-200/50 text-purple-600 hover:bg-white hover:border-purple-400 hover:scale-110 transition-all duration-300 opacity-60 group-hover:opacity-100 rounded-full shadow-xl"
                style={{ zIndex: 20 }}
                aria-label="Next categories"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </Button>
            </>
          )}
        </div>
      </div> 
    </section> 
  ); 
}; 
 
export default CategoryGrid;
