import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axios, { AxiosResponse, AxiosError } from "axios";

// Environment variable with proper typing
const API_URL: string =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// Interface definitions
interface Banner {
  _id: string;
  BannerUrl: string;
  BannerTitle?: string;
  BannerDescription?: string;
  BannerLink?: string;
}

interface BannerApiResponse {
  banners: Banner[];
  success?: boolean;
  message?: string;
}

interface BannerSliderProps {
  className?: string;
  headerHeight?: number;
  autoplayDelay?: number;
  showPlayPause?: boolean;
}

// Loading skeleton component
const BannerSkeleton: React.FC<{
  className?: string;
  headerHeight?: number;
}> = ({ className, headerHeight }) => (
  <motion.div
    className={`w-full relative ${className || ""} pt-16`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="w-full relative overflow-hidden bg-gray-100">
      <Skeleton className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" style={{ aspectRatio: '16/9', maxHeight: '550px' }} />
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-2 h-2 rounded-full bg-white/60" />
        ))}
      </div>
    </div>
  </motion.div>
);

// Error state component
const BannerError: React.FC<{
  className?: string;
  headerHeight?: number;
  onRetry?: () => void;
}> = ({ className, headerHeight, onRetry }) => (
  <div className={`w-full relative ${className || ""} pt-16`}>
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="p-8 text-center bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-100">
        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Unable to load banners
        </h3>
        <p className="text-gray-600 mb-4">
          Please check your connection and try again
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Try Again
          </Button>
        )}
      </Card>
    </div>
  </div>
);

const BannerSlider: React.FC<BannerSliderProps> = ({
  className = "",
  headerHeight = 80,
  autoplayDelay = 4000,
  showPlayPause = true,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const fetchBanners = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(false);

      const res: AxiosResponse<BannerApiResponse> = await axios.get(
        `${API_URL}/api/getbanners`,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      if (res.data.success !== false && res.data.banners) {
        setBanners(res.data.banners);
      } else {
        throw new Error(res.data.message || "Failed to fetch banners");
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      setError(true);
      setBanners([]);

      // Log detailed error information
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.error("Axios error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const togglePlayPause = useCallback((): void => {
    if (!swiperInstance) return;

    if (isPlaying) {
      swiperInstance.autoplay.stop();
    } else {
      swiperInstance.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  }, [swiperInstance, isPlaying]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = "/fallback-banner.jpg";
      target.onerror = null; // Prevent infinite loop
    },
    []
  );

  const handleSwiperInit = useCallback((swiper: SwiperType): void => {
    setSwiperInstance(swiper);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType): void => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  const handleBannerClick = useCallback((banner: Banner): void => {
    if (banner.BannerLink) {
      window.open(banner.BannerLink, "_blank", "noopener,noreferrer");
    }
  }, []);

  // Loading state
  if (loading) {
    return <BannerSkeleton className={className} headerHeight={headerHeight} />;
  }

  // Error state
  if (error) {
    return (
      <BannerError
        className={className}
        headerHeight={headerHeight}
        onRetry={fetchBanners}
      />
    );
  }

  // No banners state
  if (!banners.length) {
    return null;
  }

  return (
    <motion.section
      className={`w-full relative ${className} pt-16`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Optional header with controls */}
      {showPlayPause && (
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-4">
          {/* Slide counter */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-white/80 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="font-medium text-white">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span>/</span>
            <span>{String(banners.length).padStart(2, "0")}</span>
          </div>

          {/* Play/Pause button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}
            className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="text-xs">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
        </div>
      )}

      {/* Main banner slider - full width with clean design */}
      <div className="w-full relative overflow-hidden bg-gray-100">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={banners.length > 1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white/70 !w-2 !h-2 !rounded-full",
            bulletActiveClass:
              "swiper-pagination-bullet-active !bg-white !w-8 !h-2 !rounded-full",
            renderBullet: (index: number, className: string): string => {
              return `<span class="${className} transition-all duration-300 cursor-pointer hover:!bg-white/90" aria-label="Go to slide ${
                index + 1
              }"></span>`;
            },
          }}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          className="w-full group banner-slider"
          style={{ aspectRatio: '16/9' }}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id} className="relative">
              <div
                className="relative w-full h-full overflow-hidden cursor-pointer banner-slide"
                onClick={() => handleBannerClick(banner)}
              >
                {/* Clean Banner Image - No text overlays */}
                <img
                  src={banner.BannerUrl}
                  alt={banner.BannerTitle || `Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-[5000ms] hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={handleImageError}
                  style={{
                    objectPosition: 'center center',
                    minHeight: '100%',
                    minWidth: '100%'
                  }}
                />

                {/* Subtle shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        {banners.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="swiper-button-prev-custom absolute left-6 md:left-10 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 opacity-60 hover:opacity-100 rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-7 h-7" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="swiper-button-next-custom absolute right-6 md:right-10 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 opacity-60 hover:opacity-100 rounded-full"
              aria-label="Next slide"
            >
              <ChevronRight className="w-7 h-7" />
            </Button>
          </>
        )}
      </div>

      {/* Removed thumbnail navigation section completely */}

      {/* Simplified banner styles - Mobile Responsive */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .banner-slider {
          aspect-ratio: 16/9;
          max-height: 550px;
        }
        .banner-slider .swiper-pagination {
          bottom: 20px !important;
          z-index: 10;
        }
        .banner-slider .swiper-pagination-bullet {
          transition: all 0.4s ease !important;
          margin: 0 4px !important;
          opacity: 0.7;
        }
        .banner-slider .swiper-pagination-bullet:hover {
          transform: scale(1.3) !important;
          opacity: 1;
        }
        .banner-slider .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }
        .banner-slide {
          position: relative;
          aspect-ratio: 16/9;
        }
        .banner-slider .swiper-slide img {
          filter: brightness(1) contrast(1.02) saturate(1.05);
          object-fit: cover;
          object-position: center center;
          width: 100%;
          height: 100%;
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 640px) {
          .banner-slider {
            aspect-ratio: 3/2;
            max-height: 300px;
            min-height: 250px;
          }
          .banner-slide {
            aspect-ratio: 3/2;
          }
          .banner-slider .swiper-pagination {
            bottom: 15px !important;
          }
          .banner-slider .swiper-pagination-bullet {
            margin: 0 3px !important;
            width: 6px !important;
            height: 6px !important;
          }
        }
        
        /* Extra small phones */
        @media (max-width: 480px) {
          .banner-slider {
            aspect-ratio: 4/3;
            max-height: 280px;
            min-height: 220px;
          }
          .banner-slide {
            aspect-ratio: 4/3;
          }
        }
        
        /* Very small phones */
        @media (max-width: 360px) {
          .banner-slider {
            max-height: 250px;
            min-height: 200px;
          }
        }
      `,
        }}
      />
    </motion.section>
  );
};

export default BannerSlider;
