// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { Star, Heart, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/components/CartContext";
// import { toast } from "@/hooks/use-toast";

// interface Product {
//   _id: string;
//   Product_name: string;
//   Product_discription: string;
//   Product_price: number;
//   Product_image: string[];
//   Product_category: {
//     category: string;
//     slug: string;
//   };
//   Product_available?: boolean;
// }

// const ProductDetailPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`/api/getproductbyid?id=${productId?.trim()}`);
//         setProduct(res.data.product);
//         setSelectedImage(res.data.product.Product_image[0]);
//       } catch (error) {
//         console.error("Failed to load product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   if (loading) {
//     return <div className="text-center py-10 text-gray-500 text-lg">Loading product...</div>;
//   }

//   if (!product) {
//     return <div className="text-center py-10 text-red-600 text-lg">Product not found.</div>;
//   }

//   return (
//     <section className="py-16 px-4 max-w-6xl mx-auto">
//       {/* Breadcrumb */}
//       <div className="mb-6 text-sm text-gray-500 flex items-center space-x-2">
//         <Link to="/" className="hover:underline text-purple-600 font-medium">Home</Link>
//         <ChevronRight size={16} />
//         <Link to={`/category/${product.Product_category.slug}`} className="hover:underline text-purple-600 font-medium">
//           {product.Product_category.category}
//         </Link>
//         <ChevronRight size={16} />
//         <span className="text-gray-800">{product.Product_name}</span>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12">
//         {/* Images */}
//         <div>
//           <div className="rounded-xl overflow-hidden shadow-md border border-gray-100">
//             <img
//               src={selectedImage || "/fallback.jpg"}
//               alt={product.Product_name}
//               className="w-full h-[400px] object-cover transition-all"
//               onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
//             />
//           </div>

//           <div className="flex gap-4 mt-4 overflow-x-auto">
//             {product.Product_image.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Thumbnail ${idx}`}
//                 className={`h-20 w-20 rounded-md object-cover border-2 cursor-pointer transition-all duration-300 ${
//                   selectedImage === img ? "border-purple-600" : "border-transparent"
//                 }`}
//                 onClick={() => setSelectedImage(img)}
//                 onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-start">
//             <h1 className="text-3xl font-bold text-gray-900">{product.Product_name}</h1>
//             <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-100 rounded-full">
//               <Heart />
//             </Button>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="flex items-center text-amber-500 font-semibold text-sm bg-amber-50 px-2 py-1 rounded">
//               <Star size={16} className="fill-amber-400 stroke-none mr-1" />
//               4.8
//             </div>
//             {product.Product_available ? (
//               <span className="text-green-600 text-sm font-medium">In Stock</span>
//             ) : (
//               <span className="text-red-600 text-sm font-medium">Out of Stock</span>
//             )}
//           </div>

//           <div className="text-2xl font-semibold text-purple-600">
//             ₹{product.Product_price}
//           </div>

//           <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//             {product.Product_discription}
//           </p>

//           <div className="flex items-center space-x-4">
//             <label htmlFor="quantity" className="text-gray-700 font-medium">
//               Quantity:
//             </label>
//             <input
//               type="number"
//               id="quantity"
//               min={1}
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <Button
//             className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
//             onClick={() => {
//               for (let i = 0; i < quantity; i++) {
//                 addToCart(product);
//               }
//               toast({ title: "Added to cart", duration: 3000 });
//             }}
//           >
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductDetailPage;

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Star,
  Heart,
  ChevronRight,
  X,
  Truck,
  Shield,
  RotateCcw,
  ZoomIn,
  Check,
  Package,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useAuth } from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  Product_name: string;
  Product_discription: string;
  Product_price: number;
  Product_image: string[];
  Product_category: {
    category: string;
    slug: string;
  };
  Product_available?: boolean;
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Transform product shape to match wishlist format
  const transformProductForWishlist = (prod: Product) => ({
    _id: prod._id,
    Product_name: prod.Product_name,
    Product_price: prod.Product_price,
    Product_image: prod.Product_image,
    category: prod.Product_category?.category,
    description: prod.Product_discription,
    Product_available: prod.Product_available,
  });

  // Transform product for cart usage
  const transformProductForCart = (prod: Product) => {
    const numericId = parseInt(prod._id.slice(-8), 16);
    return {
      id: numericId,
      name: prod.Product_name,
      price: `₹${prod.Product_price}`,
      originalPrice: `₹${Math.round(prod.Product_price * 1.3)}`,
      image: prod.Product_image[0] || "",
      rating: 4.8,
      isNew: false,
    };
  };

  // Wishlist toggle handler
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

    if (user) {
      const wasInWishlist = isInWishlist(product._id);
      const transformedProduct = transformProductForWishlist(product);
      toggleWishlist(transformedProduct);

      toast({
        title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: wasInWishlist
          ? `${product.Product_name} removed from your wishlist`
          : `${product.Product_name} added to your wishlist`,
        duration: 2000,
      });
    } else {
      navigate("/login");
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = transformProductForCart(product);

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.Product_name} added to your cart`,
      duration: 3000,
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/getproductbyid?id=${productId?.trim()}`);
        setProduct(res.data.product);
        setSelectedImage(res.data.product.Product_image[0]);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const originalPrice = product ? Math.round(product.Product_price * 1.3) : 0;
  const discount = product
    ? Math.round(((originalPrice - product.Product_price) / originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900">Product Not Found</h2>
            <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Zoom Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-14 right-0 text-white hover:text-gray-300 transition-colors bg-black/50 backdrop-blur-sm rounded-full p-3 z-10"
            >
              <X size={24} />
            </button>

            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage!}
                alt="Zoomed product image"
                className="max-w-full max-h-[85vh] object-contain"
                onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
              />
            </div>

            <div className="flex justify-center mt-6 space-x-3 max-w-full overflow-x-auto">
              {product.Product_image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all ${
                    selectedImage === img
                      ? "border-purple-500 ring-4 ring-purple-300/50"
                      : "border-white/50 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-purple-600 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/category/${product.Product_category.slug}`}
            className="hover:text-purple-600 transition-colors font-medium"
          >
            {product.Product_category.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{product.Product_name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Images Section */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg bg-white">
              <div className="relative group aspect-square">
                <img
                  src={selectedImage || "/fallback.jpg"}
                  alt={product.Product_name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                />

                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="opacity-0 group-hover:opacity-100 bg-white/95 hover:bg-white p-4 rounded-full shadow-lg transition-all duration-300 transform scale-90 group-hover:scale-100"
                  >
                    <ZoomIn size={24} className="text-purple-600" />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-3 py-1 shadow-lg">
                      {discount}% OFF
                    </Badge>
                  )}
                  {product.Product_available && (
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-3 py-1 shadow-lg">
                      <Check size={14} className="mr-1" />
                      In Stock
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.Product_image.map((img, idx) => (
                <Card
                  key={idx}
                  className={`overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    selectedImage === img
                      ? "border-purple-500 ring-2 ring-purple-200 shadow-lg"
                      : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="aspect-square">
                    <img
                      src={img}
                      alt={`Product view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            <Card className="p-8 border-0 shadow-lg bg-white">
              <CardContent className="p-0 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3 text-purple-700 border-purple-200">
                      {product.Product_category.category}
                    </Badge>
                    <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                      {product.Product_name}
                    </h1>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={`flex-shrink-0 w-12 h-12 rounded-full transition-all duration-200 ${
                      product && isInWishlist(product._id)
                        ? "text-rose-500 bg-rose-100 hover:bg-rose-200"
                        : "text-gray-400 hover:text-rose-500 hover:bg-rose-100"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={`transition-all duration-200 ${
                        product && isInWishlist(product._id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Price Section */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-purple-600">
                      ₹{product.Product_price.toLocaleString()}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                        <Badge className="bg-green-100 text-green-800 font-semibold">
                          Save ₹{(originalPrice - product.Product_price).toLocaleString()}
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Inclusive of all taxes</p>
                </div>

                {/* Description */}
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.Product_discription}
                  </p>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <label className="text-gray-700 font-medium text-sm">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-6 py-2 bg-white border-x border-gray-300 font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        disabled={quantity >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.Product_available}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {product.Product_available ? (
                      <>
                        <Package className="mr-2" size={20} />
                        Add to Cart
                      </>
                    ) : (
                      "Currently Unavailable"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="p-6 border-0 shadow-lg bg-white">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      title: "Free Shipping",
                      icon: <Truck size={18} />,
                      desc: "Free delivery on orders above ₹500",
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      title: "Quality Guarantee",
                      icon: <Award size={18} />,
                      desc: "1 year manufacturer warranty",
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      title: "Easy Returns",
                      icon: <RotateCcw size={18} />,
                      desc: "Hassle-free 7-day return policy",
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      title: "Secure Payment",
                      icon: <Shield size={18} />,
                      desc: "100% secure payment processing",
                      color: "text-orange-600 bg-orange-50",
                    },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{feature.title}</p>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="mt-16 border-0 shadow-lg bg-white overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { key: "description", label: "Description" },
                { key: "specs", label: "Specifications" },
                { key: "care", label: "Care Instructions" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-8 py-4 font-medium text-sm transition-all duration-300 relative ${
                    activeTab === tab.key
                      ? "text-purple-700 bg-purple-50 border-b-2 border-purple-600"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <CardContent className="p-8">
            {activeTab === "description" && (
              <div className="prose prose-gray max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Description
                </h3>
                <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {product.Product_discription}
                </div>
                <div className="mt-8 p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                  <p className="text-purple-800">
                    <strong>Quality Guarantee:</strong> This product comes with our quality
                    guarantee and customer satisfaction promise.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {[
                      { label: "Product ID", value: product._id },
                      { label: "Category", value: product.Product_category.category },
                      { label: "Price", value: `₹${product.Product_price}`, highlight: true },
                      { 
                        label: "Availability", 
                        value: product.Product_available ? "In Stock" : "Out of Stock",
                        status: product.Product_available ? "success" : "error"
                      },
                    ].map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-600">{spec.label}:</span>
                        <span className={`font-semibold ${
                          spec.highlight ? "text-purple-600" :
                          spec.status === "success" ? "text-green-600" :
                          spec.status === "error" ? "text-red-600" :
                          "text-gray-900"
                        }`}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Total Images", value: `${product.Product_image.length} photos` },
                      { label: "Warranty", value: "1 Year" },
                      { label: "Return Policy", value: "7 Days" },
                      { label: "Shipping", value: "Free above ₹500" },
                    ].map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-600">{spec.label}:</span>
                        <span className="font-semibold text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Care Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">General Care</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Handle with care to maintain product quality
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Store in a clean, dry place when not in use
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Avoid exposure to extreme temperatures
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Keep away from direct sunlight for extended periods
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Maintenance Tips</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Clean gently with appropriate materials
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Inspect regularly for any wear or damage
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Follow manufacturer's specific guidelines
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Contact support for any concerns
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;

