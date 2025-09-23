// "use client";
// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Heart, Gauge, Fuel, Settings, ArrowRight } from "lucide-react";
// import Link from "next/link";

// const VehicleCard = ({ 
//   vehicle, 
//   isActive, 
//   userLikedCars, 
//   handleLikeToggle, 
//   convertedValues, 
//   selectedCurrency, 
//   currency 
// }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const images = vehicle.imageUrls || [];
//   const hasMultipleImages = images.length > 1;

//   useEffect(() => {
//     if (!hasMultipleImages || !isActive) return;
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [hasMultipleImages, images.length, isActive]);

//   const nextImage = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const getVehicleTitle = () => {
//     const condition = vehicle.condition ? vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1).toLowerCase() : "";
//     const make = vehicle.make || "";
//     const model = vehicle.model || "";
//     if (condition && condition !== "Default") {
//       return `${condition} ${make} ${model}`.trim();
//     }
//     return `${make} ${model}`.trim();
//   };

//   return (
//     <Link href={`/car-detail/${vehicle.slug || vehicle._id}`}>
//       <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-gray-900/25 transition-shadow cursor-pointer">
//         <div className="relative aspect-[4/3] overflow-hidden">
//           {hasMultipleImages ? (
//             <div className="relative w-full h-full overflow-hidden">
//               <div 
//                 className="flex h-full transition-transform duration-500 ease-in-out"
//                 style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
//               >
//                 {images.map((image, index) => (
//                   <div key={index} className="w-full h-full flex-shrink-0">
//                     <img
//                       src={image || "/api/placeholder/400/300"}
//                       alt={`${getVehicleTitle()} - Image ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={prevImage}
//                 aria-label="Previous image"
//                 className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 dark:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 aria-label="Next image"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 dark:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//                 {images.map((_, index) => (
//                   <button
//                     key={index}
//                     aria-label={`Go to image ${index + 1}`}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       setCurrentImageIndex(index);
//                     }}
//                     className={`w-2 h-2 rounded-full transition-all ${
//                       index === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <img
//               src={images[0] || "/api/placeholder/400/300"}
//               alt={getVehicleTitle()}
//               className="w-full h-full object-cover"
//             />
//           )}
          
//           {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
//             <div className="absolute top-2 right-2 bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
//               {vehicle.tag.toUpperCase()}
//             </div>
//           )}
          
//           {vehicle.sold && (
//             <div className="absolute flex items-center gap-1 top-2 right-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
//               <span className="w-1 h-1 bg-red-600 dark:bg-red-500 rounded-full"></span>
//               <div className="font-semibold text-red-600 dark:text-red-400">SOLD</div>
//             </div>
//           )}
          
//           <button 
//           aria-label="Like this car"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleLikeToggle(vehicle._id);
//             }}
//             className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-sm"
//           >
//             {userLikedCars && Array.isArray(userLikedCars) && userLikedCars.includes(vehicle._id) ? (
//               <Heart className="w-4 h-4 text-red-500 fill-current" />
//             ) : (
//               <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//             )}
//           </button>
//         </div>
        
//         <div className="p-3">
//           <div className="flex justify-between items-start mb-2">
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
//                 {getVehicleTitle()}
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.modelYear}</p>
//             </div>
//             <div className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium whitespace-nowrap ml-2">
//               {selectedCurrency && selectedCurrency.symbol}{" "}
//               {Math.round(
//                 (vehicle && vehicle.price * ((selectedCurrency && selectedCurrency.value) || 1)) /
//                 ((currency && currency.value) || 1)
//               ).toLocaleString()}
//             </div>
//           </div>
          
//           <div className="grid grid-cols-3 gap-2 text-center">
//             <div className="flex flex-col items-center">
//               <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
//                 <Gauge className="w-3 h-3 text-white" />
//               </div>
//               <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{convertedValues?.kms || vehicle.kms}</div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">{convertedValues?.unit?.toUpperCase() || 'KMS'}</div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
//                 <Fuel className="w-3 h-3 text-white" />
//               </div>
//               <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{vehicle.fuelType}</div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">Fuel</div>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
//                 <Settings className="w-3 h-3 text-white" />
//               </div>
//               <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{vehicle.gearbox}</div>
//               <div className="text-xs text-gray-500 dark:text-gray-400">Trans</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// const VehicleCarousel = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [userLikedCars, setUserLikedCars] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [listingData, setListingData] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showAll, setShowAll] = useState(false);

//   // Responsive items configuration
// const getResponsiveConfig = () => {
//   if (typeof window !== 'undefined') {
//     const width = window.innerWidth;
//     if (width >= 1024) return { type: 'carousel', itemsPerRow: 3, showCarousel: true };
//     if (width >= 768) return { type: 'grid', itemsPerRow: 3, showCarousel: false };
//     if (width >= 640) return { type: 'grid', itemsPerRow: 2, showCarousel: false };
//     if (width >= 425) return { type: 'grid', itemsPerRow: 2, showCarousel: false };
//     return { type: 'grid', itemsPerRow: 1, showCarousel: false };
//   }
//   return { type: 'carousel', itemsPerRow: 3, showCarousel: true };
// };

//   const [responsiveConfig, setResponsiveConfig] = useState(getResponsiveConfig());

//   // Update responsive config on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setResponsiveConfig(getResponsiveConfig());
//       setCurrentIndex(0); // Reset carousel when screen size changes
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const maxIndex = Math.max(0, vehicles.length - responsiveConfig.itemsPerRow);
//   const itemsToShow = responsiveConfig.itemsPerRow;

//   // Fetch listing data
//   const fetchListingData = async () => {
//     try {
//       const response = await fetch("/api/homepage");
//       const result = await response.json();
//       if (response.ok) {
//         setListingData(result?.listingSection);
//       }
//     } catch (error) {
//       console.error("Error fetching listing data:", error);
//     }
//   };

//   // Fetch vehicles data
//   const fetchVehicles = async () => {
//     try {
//       const response = await fetch("/api/cars");
//       if (!response.ok) throw new Error("Failed to fetch vehicles");
//       const data = await response.json();
//       const filteredCars = data.cars.filter(
//         (car) => car.status === 1 || car.status === "1"
//       );
//       setVehicles(filteredCars);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Fetch user data
//   const fetchUserData = async () => {
//     try {
//       const response = await fetch("/api/users/me");
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         setUserLikedCars(
//           Array.isArray(data.user?.likedCars) ? data.user.likedCars : []
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   // Handle like toggle
//   const handleLikeToggle = async (carId) => {
//     try {
//       const response = await fetch("/api/users/liked-cars", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ carId }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUserLikedCars(Array.isArray(data.likedCars) ? data.likedCars : []);
//       } else {
//         console.error("Failed to update liked cars");
//       }
//     } catch (error) {
//       console.error("Error updating liked cars:", error);
//     }
//   };

//   // Carousel navigation
//   const nextSlide = () => {
//     setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchListingData();
//     fetchVehicles();
//     fetchUserData();
//   }, []);

//   // Don't render if listing section is inactive
//   if (listingData && listingData.status === "inactive") {
//     return null;
//   }

//   if (loading) {
//     return (
//       <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:py-8">
//         <div className="mb-6 px-4 md:px-6">
//           <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
//             <div className="flex-1">
//               <div className="h-6 md:h-10 w-48 md:w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
//               <div className="h-1 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
//             </div>
//             <div className="h-10 md:h-12 w-24 md:w-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
//           </div>
//         </div>
        
//         <div className="px-4 md:px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             {[...Array(itemsToShow)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/3] rounded-lg"></div>
//                 <div className="mt-4 space-y-2">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
//                   <div className="grid grid-cols-3 gap-2 mt-4">
//                     {[...Array(3)].map((_, j) => (
//                       <div key={j} className="flex flex-col items-center">
//                         <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-1"></div>
//                         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
//                         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
//         <div className="text-center text-red-500 dark:text-red-400 p-8">
//           Error: {error}
//         </div>
//       </section>
//     );
//   }

//   if (!vehicles || vehicles.length === 0) {
//     return (
//       <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
//         <div className="text-center text-gray-500 dark:text-gray-400 p-8">
//           No vehicles available
//         </div>
//       </section>
//     );
//   }

//   // For grid layouts (small/medium screens), show responsive grid
//   if (!responsiveConfig.showCarousel) {
//     const itemsPerPage = responsiveConfig.itemsPerRow === 3 ? 9 : 6; // 3x3 = 9, 2x3 = 6
//     const displayVehicles = showAll ? vehicles : vehicles.slice(0, itemsPerPage);
    
//     return (
//       <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
//         {/* Header */}
//         <div className="mb-6 px-2">
//           <div className="mb-6 md:mb-10 flex flex-col items-start justify-between gap-4 md:gap-6 md:flex-row md:items-center">
//             <div className="flex-1">
//               <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-blue-600 dark:text-blue-400">
//                 {listingData?.heading || "Featured Vehicles"}
//               </h2>
//               <div className="mt-2 h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-400"></div>
//             </div>

//             <div className="flex items-center gap-4">
//               <Link href={"/car-for-sale"}>
//                 <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 px-4 md:px-6 py-2 md:py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-2xl dark:hover:shadow-blue-900/25 text-sm md:text-base">
//                   <span>View All</span>
//                   <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Responsive Grid Layout */}
//         <div className="px-4 md:px-6">
//           <div className={`grid gap-3 md:gap-4 lg:gap-6 ${
//   responsiveConfig.itemsPerRow === 3 ? 'grid-cols-3' : 
//   responsiveConfig.itemsPerRow === 2 ? 'grid-cols-2' : 
//   'grid-cols-1'
// }`}>
//             {displayVehicles.map((vehicle) => (
//               <div key={vehicle._id} className="group">
//                 <VehicleCard 
//                   vehicle={vehicle} 
//                   isActive={true}
//                   userLikedCars={userLikedCars}
//                   handleLikeToggle={handleLikeToggle}
//                   convertedValues={vehicle}
//                   selectedCurrency={{ symbol: '$', value: 1 }}
//                   currency={{ value: 1 }}
//                 />
//               </div>
//             ))}
//           </div>
          
//           {/* Show More/Less Button */}
//           {vehicles.length > itemsPerPage && (
//             <div className="text-center mt-6 md:mt-8">
//               <button
//                 onClick={() => setShowAll(!showAll)}
//                 className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm md:text-base"
//               >
//                 {showAll ? 'Show Less' : `Show More (${vehicles.length - itemsPerPage})`}
//                 <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     );
//   }

//   // For large screens, show carousel layout
//   return (
//     <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
//       {/* Header */}
//       <div className="mb-6 px-4 md:px-6">
//         <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
//           <div className="flex-1">
//             <h2 className="text-4xl font-bold leading-tight text-blue-600 dark:text-blue-400 md:text-5xl">
//               {listingData?.heading || "Featured Vehicles"}
//             </h2>
//             <div className="mt-2 h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-400"></div>
//           </div>

//           <div className="flex items-center gap-4">
//             <Link href={"/car-for-sale"}>
//               <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-2xl dark:hover:shadow-blue-900/25">
//                 <span>View All</span>
//                 <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Carousel for large screens */}
//       <div className="relative px-4 sm:px-6">
//         <div className="relative overflow-hidden">
//           <div 
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
//           >
//             {vehicles.map((vehicle, index) => (
//               <div key={vehicle._id} className="w-1/3 flex-shrink-0 px-3 group">
//                 <VehicleCard 
//                   vehicle={vehicle} 
//                   isActive={Math.abs(index - currentIndex) < itemsToShow}
//                   userLikedCars={userLikedCars}
//                   handleLikeToggle={handleLikeToggle}
//                   convertedValues={vehicle}
//                   selectedCurrency={{ symbol: '$', value: 1 }}
//                   currency={{ value: 1 }}
//                 />
//               </div>
//             ))}
//           </div>
          
//           {vehicles.length > itemsToShow && (
//             <>
//               <button
//                 onClick={prevSlide}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
//               >
//                 <ChevronLeft className="w-5 h-5 text-white" />
//               </button>
              
//               <button
//                 onClick={nextSlide}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
//               >
//                 <ChevronRight className="w-5 h-5 text-white" />
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VehicleCarousel;

"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight, Heart, Gauge, Fuel, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

// Memoized VehicleCard component
const VehicleCard = memo(({ 
  vehicle, 
  isActive, 
  userLikedCars, 
  handleLikeToggle, 
  convertedValues, 
  selectedCurrency, 
  currency 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const images = useMemo(() => vehicle.imageUrls || [], [vehicle.imageUrls]);
  const hasMultipleImages = images.length > 1;

  // Debounced image transition for active cards only
  useEffect(() => {
    if (!hasMultipleImages || !isActive) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length, isActive]);

  // Optimized image navigation handlers
  const nextImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const setImageIndex = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  }, []);

  // Memoized vehicle title
  const vehicleTitle = useMemo(() => {
    const condition = vehicle.condition ? vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1).toLowerCase() : "";
    const make = vehicle.make || "";
    const model = vehicle.model || "";
    if (condition && condition !== "Default") {
      return `${condition} ${make} ${model}`.trim();
    }
    return `${make} ${model}`.trim();
  }, [vehicle.condition, vehicle.make, vehicle.model]);

  // Memoized price calculation
  const formattedPrice = useMemo(() => {
    return Math.round(
      (vehicle && vehicle.price * ((selectedCurrency && selectedCurrency.value) || 1)) /
      ((currency && currency.value) || 1)
    ).toLocaleString();
  }, [vehicle.price, selectedCurrency?.value, currency?.value]);

  // Memoized like status
  const isLiked = useMemo(() => {
    return userLikedCars && Array.isArray(userLikedCars) && userLikedCars.includes(vehicle._id);
  }, [userLikedCars, vehicle._id]);

  // Handle like with useCallback
  const onLikeClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    handleLikeToggle(vehicle._id);
  }, [handleLikeToggle, vehicle._id]);

  // Handle image load/error
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <Link href={`/car-detail/${vehicle.slug || vehicle._id}`} prefetch={false}>
      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-gray-900/25 transition-shadow cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          {hasMultipleImages ? (
            <div className="relative w-full h-full overflow-hidden">
              <div 
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0">
                    {!imageLoaded && (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                    <img
                      src={imageError ? "/api/placeholder/400/300" : (image || "/api/placeholder/400/300")}
                      alt={`${vehicleTitle} - Image ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 dark:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 dark:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to image ${index + 1}`}
                    onClick={(e) => setImageIndex(e, index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {!imageLoaded && (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}
              <img
                src={imageError ? "/api/placeholder/400/300" : (images[0] || "/api/placeholder/400/300")}
                alt={vehicleTitle}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                onLoad={handleImageLoad}
                onError={handleImageError}
                decoding="async"
              />
            </div>
          )}
          
          {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
            <div className="absolute top-2 right-2 bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              {vehicle.tag.toUpperCase()}
            </div>
          )}
          
          {vehicle.sold && (
            <div className="absolute flex items-center gap-1 top-2 right-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              <span className="w-1 h-1 bg-red-600 dark:bg-red-500 rounded-full"></span>
              <div className="font-semibold text-red-600 dark:text-red-400">SOLD</div>
            </div>
          )}
          
          <button 
            aria-label="Like this car"
            onClick={onLikeClick}
            className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-sm"
          >
            {isLiked ? (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            ) : (
              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                {vehicleTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.modelYear}</p>
            </div>
            <div className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium whitespace-nowrap ml-2">
              {selectedCurrency && selectedCurrency.symbol}{" "}
              {formattedPrice}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
                <Gauge className="w-3 h-3 text-white" />
              </div>
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{convertedValues?.kms || vehicle.kms}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{convertedValues?.unit?.toUpperCase() || 'KMS'}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
                <Fuel className="w-3 h-3 text-white" />
              </div>
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{vehicle.fuelType}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Fuel</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mb-1">
                <Settings className="w-3 h-3 text-white" />
              </div>
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{vehicle.gearbox}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Trans</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

VehicleCard.displayName = 'VehicleCard';

// Loading skeleton component
const LoadingSkeleton = memo(({ itemsToShow }) => (
  <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:py-8">
    <div className="mb-6 px-4 md:px-6">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="h-6 md:h-10 w-48 md:w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-1 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div className="h-10 md:h-12 w-24 md:w-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
      </div>
    </div>
    
    <div className="px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(itemsToShow)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/3] rounded-lg"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const VehicleCarousel = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingData, setListingData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Memoized responsive configuration
  const getResponsiveConfig = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1024) return { type: 'carousel', itemsPerRow: 3, showCarousel: true };
      if (width >= 768) return { type: 'grid', itemsPerRow: 3, showCarousel: false };
      if (width >= 640) return { type: 'grid', itemsPerRow: 2, showCarousel: false };
      if (width >= 425) return { type: 'grid', itemsPerRow: 2, showCarousel: false };
      return { type: 'grid', itemsPerRow: 1, showCarousel: false };
    }
    return { type: 'carousel', itemsPerRow: 3, showCarousel: true };
  }, []);

  const [responsiveConfig, setResponsiveConfig] = useState(() => getResponsiveConfig());

  // Throttled resize handler
  const throttledHandleResize = useMemo(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setResponsiveConfig(getResponsiveConfig());
        setCurrentIndex(0);
      }, 150);
    };
  }, [getResponsiveConfig]);

  // Update responsive config on resize
  useEffect(() => {
    window.addEventListener('resize', throttledHandleResize);
    return () => {
      window.removeEventListener('resize', throttledHandleResize);
    };
  }, [throttledHandleResize]);

  // Memoized calculations
  const maxIndex = useMemo(() => Math.max(0, vehicles.length - responsiveConfig.itemsPerRow), [vehicles.length, responsiveConfig.itemsPerRow]);
  const itemsToShow = responsiveConfig.itemsPerRow;

  // Cache for API responses
  const apiCache = useMemo(() => new Map(), []);

  // Optimized fetch with caching and error handling
  const fetchWithCache = useCallback(async (url, cacheKey) => {
    if (apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      apiCache.set(cacheKey, data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, [apiCache]);

  // Optimized fetch functions
  const fetchListingData = useCallback(async () => {
    try {
      const result = await fetchWithCache("/api/homepage", 'homepage');
      setListingData(result?.listingSection);
    } catch (error) {
      console.error("Error fetching listing data:", error);
    }
  }, [fetchWithCache]);

  const fetchVehicles = useCallback(async () => {
    try {
      const data = await fetchWithCache("/api/cars", 'cars');
      const filteredCars = data.cars.filter(
        (car) => car.status === 1 || car.status === "1"
      );
      setVehicles(filteredCars);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await fetchWithCache("/api/users/me", 'user');
      setUser(data.user);
      setUserLikedCars(
        Array.isArray(data.user?.likedCars) ? data.user.likedCars : []
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchWithCache]);

  // Optimized like toggle with optimistic updates
  const handleLikeToggle = useCallback(async (carId) => {
    // Optimistic update
    const isCurrentlyLiked = userLikedCars.includes(carId);
    const newLikedCars = isCurrentlyLiked
      ? userLikedCars.filter(id => id !== carId)
      : [...userLikedCars, carId];
    
    setUserLikedCars(newLikedCars);

    try {
      const response = await fetch("/api/users/liked-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserLikedCars(Array.isArray(data.likedCars) ? data.likedCars : []);
      } else {
        // Revert optimistic update on error
        setUserLikedCars(userLikedCars);
        console.error("Failed to update liked cars");
      }
    } catch (error) {
      // Revert optimistic update on error
      setUserLikedCars(userLikedCars);
      console.error("Error updating liked cars:", error);
    }
  }, [userLikedCars]);

  // Optimized carousel navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  }, [maxIndex]);

  // Memoized currency objects
  const selectedCurrency = useMemo(() => ({ symbol: '$', value: 1 }), []);
  const currency = useMemo(() => ({ value: 1 }), []);

  // Fetch data on component mount with Promise.all for parallel loading
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.allSettled([
          fetchListingData(),
          fetchVehicles(),
          fetchUserData()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchListingData, fetchVehicles, fetchUserData]);

  // Memoized grid calculations
  const gridConfig = useMemo(() => {
    const itemsPerPage = responsiveConfig.itemsPerRow === 3 ? 9 : 6;
    const displayVehicles = showAll ? vehicles : vehicles.slice(0, itemsPerPage);
    return { itemsPerPage, displayVehicles };
  }, [responsiveConfig.itemsPerRow, showAll, vehicles]);

  // Early returns for different states
  if (listingData && listingData.status === "inactive") {
    return null;
  }

  if (loading) {
    return <LoadingSkeleton itemsToShow={itemsToShow} />;
  }

  if (error) {
    return (
      <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
        <div className="text-center text-red-500 dark:text-red-400 p-8">
          Error: {error}
        </div>
      </section>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          No vehicles available
        </div>
      </section>
    );
  }

  // Memoized header component
  const HeaderComponent = useMemo(() => (
    <div className="mb-6 px-2">
      <div className="mb-6 md:mb-10 flex flex-col items-start justify-between gap-4 md:gap-6 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-blue-600 dark:text-blue-400">
            {listingData?.heading || "Featured Vehicles"}
          </h2>
          <div className="mt-2 h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-400"></div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={"/car-for-sale"} prefetch={false}>
            <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 px-4 md:px-6 py-2 md:py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-2xl dark:hover:shadow-blue-900/25 text-sm md:text-base">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  ), [listingData?.heading]);

  // For grid layouts (small/medium screens)
  if (!responsiveConfig.showCarousel) {
    const { itemsPerPage, displayVehicles } = gridConfig;
    
    return (
      <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
        {HeaderComponent}

        <div className="px-4 md:px-6">
          <div className={`grid gap-3 md:gap-4 lg:gap-6 ${
            responsiveConfig.itemsPerRow === 3 ? 'grid-cols-3' : 
            responsiveConfig.itemsPerRow === 2 ? 'grid-cols-2' : 
            'grid-cols-1'
          }`}>
            {displayVehicles.map((vehicle) => (
              <div key={vehicle._id} className="group">
                <VehicleCard 
                  vehicle={vehicle} 
                  isActive={true}
                  userLikedCars={userLikedCars}
                  handleLikeToggle={handleLikeToggle}
                  convertedValues={vehicle}
                  selectedCurrency={selectedCurrency}
                  currency={currency}
                />
              </div>
            ))}
          </div>
          
          {vehicles.length > itemsPerPage && (
            <div className="text-center mt-6 md:mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm md:text-base"
              >
                {showAll ? 'Show Less' : `Show More (${vehicles.length - itemsPerPage})`}
                <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // For large screens, show carousel layout
  return (
    <section className="my-10 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 py-6 sm:mx-8 md:my-16 md:py-8">
      <div className="mb-6 px-4 md:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-tight text-blue-600 dark:text-blue-400 md:text-5xl">
              {listingData?.heading || "Featured Vehicles"}
            </h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          </div>

          <div className="flex items-center gap-4">
            <Link href={"/car-for-sale"} prefetch={false}>
              <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 px-6 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-2xl dark:hover:shadow-blue-900/25">
                <span>View All</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative px-4 sm:px-6">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
          >
            {vehicles.map((vehicle, index) => (
              <div key={vehicle._id} className="w-1/3 flex-shrink-0 px-3 group">
                <VehicleCard 
                  vehicle={vehicle} 
                  isActive={Math.abs(index - currentIndex) < itemsToShow}
                  userLikedCars={userLikedCars}
                  handleLikeToggle={handleLikeToggle}
                  convertedValues={vehicle}
                  selectedCurrency={selectedCurrency}
                  currency={currency}
                />
              </div>
            ))}
          </div>
          
          {vehicles.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous vehicles"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={nextSlide}
                aria-label="Next vehicles"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VehicleCarousel;