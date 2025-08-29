"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Car,
  Truck,
  Bus,
  CarFront,
  CarTaxiFront,
  Zap,
  Crown,
  Shield,
  Star,
  Gem,
  Award,
  Target,
  Flame,
  Bolt,
  Diamond
} from "lucide-react";

// Professional car brand icons - each brand gets a unique, professional icon
const getBrandIcon = (brandName) => {
  const iconMap = {
    // Luxury brands
    'BMW': Crown,
    'Mercedes': Gem,
    'Audi': Diamond,
    'Lexus': Star,
    'Acura': Award,
    'Infiniti': Shield,
    
    // Performance brands
    'Ferrari': Flame,
    'Lamborghini': Bolt,
    'Porsche': Target,
    'Maserati': Zap,
    
    // Premium brands
    'Volvo': Shield,
    'Cadillac': Crown,
    'Genesis': Star,
    'Lincoln': Gem,
    
    // Popular brands
    'Toyota': Car,
    'Honda': CarFront,
    'Nissan': CarTaxiFront,
    'Ford': Truck,
    'Chevrolet': Car,
    'Hyundai': CarFront,
    'Kia': CarTaxiFront,
    'Mazda': Car,
    'Subaru': CarFront,
    'Mitsubishi': CarTaxiFront,
    'Volkswagen': Car,
    'Jeep': Truck,
    'Ram': Truck,
    'GMC': Truck,
    'Buick': Car,
    'Chrysler': Car
  };
  
  // Return specific icon for known brands, or default Car for unknown brands
  return iconMap[brandName] || Car;
};

const BrandsList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setBrandData(result?.brandSection);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/Vehicle make and model data (2).json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const extractedBrands = data.Sheet1.map((item) => ({
          name: item.Maker.trim(),
          icon: getBrandIcon(item.Maker.trim()),
        }));
        setBrands(extractedBrands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Track screen width for responsive design
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive brands count
  let visibleBrandsCount = 12;
  if (screenWidth < 640) visibleBrandsCount = 6;
  else if (screenWidth < 768) visibleBrandsCount = 8;
  else if (screenWidth < 1024) visibleBrandsCount = 10;

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Loading vehicle brands...</p>
          </div>
        </div>
      </div>
    );
  }

  if (brandData?.status === "inactive") return null;

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            <Car className="w-4 h-4 mr-2" />
            Vehicle Brands
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {brandData?.heading || "Explore Premium"}
            <br />
            <span className="text-blue-600 dark:text-blue-400">Vehicle Brands</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {brandData?.description || "Discover our extensive collection of premium vehicle brands. Find the perfect car that matches your style and requirements."}
          </p>

          <Link href="/brands">
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="relative z-10">View All Brands</span>
              <div className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {brands.slice(0, visibleBrandsCount).map((brand, index) => {
            const IconComponent = brand.icon;
            return (
              <Link
                href={`/car-for-sale?make=${encodeURIComponent(brand.name)}`}
                key={`${brand.name}-${index}`}
                className="group block"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-2">
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon container */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-indigo-900/20 transition-all duration-300 group-hover:scale-110 shadow-inner">
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    
                    {/* Brand name */}
                    <h3 className="mt-4 text-center font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-sm md:text-base leading-tight">
                      {brand.name}
                    </h3>
                    
                    {/* Hover indicator */}
                    <div className="mt-2 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-8 transition-all duration-300"></div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Can't find your preferred brand?
          </p>
          <Link href="/brands">
            <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-200">
              Browse all available brands →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandsList;