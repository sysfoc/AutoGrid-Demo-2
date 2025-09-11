"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sun, Moon, Search, Menu, X, ChevronDown } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import { FaCar, FaCalculator, FaHandshake } from "react-icons/fa";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  className = "",
  id,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue, optionLabel) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`focus:border-app-border hover:border-app-hover w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left text-black transition-colors duration-200 focus:outline-none focus:ring-2 ${
          disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
        } ${className}`}
        disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${value ? "text-gray-900" : "text-gray-500"}`}
          >
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-52 overflow-auto py-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option.value, option.label)}
                className="w-full px-4 py-2 text-left text-sm text-gray-900 transition-colors duration-150 hover:bg-primary hover:text-white focus:bg-primary focus:text-white focus:outline-none "
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CACHE_KEY = "homepage_data";
const CACHE_DURATION = 300000;
const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null;
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.warn("Cache retrieval failed:", error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === "undefined") return;
      const cacheData = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Cache storage failed:", error);
    }
  },

  clear: (key) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Cache clear failed:", error);
    }
  },
};

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600",
  },
});

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [imageCached, setImageCached] = useState(false);
  const [homepageData, setHomepageData] = useState(null);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [topSettings, setTopSettings] = useState({
    hideDarkMode: false,
    hideFavourite: false,
    hideLogo: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const mountedRef = useRef(true);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [carSearchData, setCarSearchData] = useState(null);
  const [carSearchMakes, setCarSearchMakes] = useState([]);
  const [carSearchModels, setCarSearchModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const idPrefix = useRef(Date.now().toString(36)).current;
  const [carsData, setCarsData] = useState([]);
  const heroImage = "/autogrid.avif";

  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  const navigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const navigateToLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const fetchCarSearchData = useCallback(async () => {
    try {
      const response = await fetch("/Vehicle make and model data (2).json");
      const data = await response.json();
      setCarSearchData(data.Sheet1);
      const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))];
      setCarSearchMakes(uniqueMakes);
    } catch (error) {
      console.error("Error loading vehicle data:", error);
    }
  }, []);

  const fetchCarsData = useCallback(async () => {
    try {
      const response = await fetch("/api/cars");
      const data = await response.json();
      setCarsData(data.cars);
    } catch (error) {
      console.error("Error fetching cars data:", error);
      setCarsData([]);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Persist preference
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    // Apply immediately
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const preloadAndCacheImage = useCallback(async (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        setImageCached(true);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.crossOrigin = "anonymous";
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Check cache first
        const cachedData = CacheManager.get(CACHE_KEY);
        if (cachedData) {
          setHomepageData(cachedData);
          return;
        }

        // Fetch from API if no cache
        const response = await apiClient.get("/api/homepage");
        CacheManager.set(CACHE_KEY, response.data);
        setHomepageData(response.data);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      }
    };
    fetchHomepageData();
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const cachedData = CacheManager.get("header_settings");
        if (cachedData?.settings?.logo6) {
          setLogo(cachedData.settings.logo6);
          return;
        }
        const response = await fetch("/api/settings/general");
        const data = await response.json();
        CacheManager.set("header_settings", data);
        setLogo(data?.settings?.logo6 || "");
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    if (selectedMake && carSearchData) {
      const makeData = carSearchData.find(
        (item) => item.Maker === selectedMake,
      );
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "]
          .split(",")
          .map((model) => model.trim());
        setCarSearchModels(modelArray);
      } else {
        setCarSearchModels([]);
      }
      setSelectedModel("");
    }
  }, [selectedMake, carSearchData]);

  const navLinkClasses =
    "text-text dark:text-text-inverse hover:text-text-inverse hover:bg-primary text-sm px-4 py-3 rounded-lg transition-colors flex items-center space-x-2";

  const handleCarSearch = useCallback(async () => {
    if (!selectedMake && !maxPrice && !location) {
      alert("Please select at least one search criterion.");
      return;
    }

    try {
      const queryParams = [];
      if (selectedMake)
        queryParams.push(`make=${encodeURIComponent(selectedMake)}`);
      if (selectedModel)
        queryParams.push(`model=${encodeURIComponent(selectedModel)}`);
      if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
      if (location)
        queryParams.push(`location=${encodeURIComponent(location)}`);
      if (selectedCondition !== "all")
        queryParams.push(`condition=${encodeURIComponent(selectedCondition)}`);

      const queryString = queryParams.join("&");
      router.push(`/car-for-sale?${queryString}`);
    } catch (error) {
      console.error("Error searching cars:", error);
      alert("An error occurred. Please try again.");
    }
  }, [
    selectedMake,
    selectedModel,
    maxPrice,
    location,
    selectedCondition,
    router,
  ]);

  useEffect(() => {
    fetchCarSearchData();
    fetchCarsData();
  }, [fetchCarSearchData]);

  const ConditionTab = ({ condition, label, selected, onClick }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        console.log(`Clicking ${condition} tab`);
        onClick();
      }}
      className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        selected
          ? "scale-105 bg-gradient-to-r from-primary to-blue-700 text-white shadow-lg shadow-primary/25"
          : "bg-gray-100 text-slate-600 hover:bg-gray-200 hover:text-primary dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-blue-400"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={handleMobileMenuClose}
        >
          <div
            className="fixed left-0 top-0 h-full w-80 transform bg-background/95 backdrop-blur-md transition-transform duration-300 ease-out dark:bg-background-dark/95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {logo && !logoError ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image
                        src={logo || "/placeholder.svg"}
                        alt="Logo"
                        fill
                        className="object-contain"
                        onError={handleLogoError}
                        priority
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-primary"></div>
                  )}
                  <span className="text-sm font-semibold text-text dark:text-text-inverse">
                    AutoGrid
                  </span>
                </div>
                <button onClick={handleMobileMenuClose} className="p-2">
                  <X className="h-5 w-5 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setListingsDropdownOpen(!listingsDropdownOpen)
                    }
                    className="flex w-full items-center justify-between py-2 text-text hover:text-primary"
                  >
                    <div className="flex items-center space-x-2">
                      <FaCar className="h-4 w-4" />
                      <span>Listings</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${listingsDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {listingsDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      <Link
                        href="/car-for-sale"
                        className="block py-1 text-sm text-text-secondary hover:bg-primary hover:text-white"
                      >
                        Cars for Sale
                      </Link>
                      <Link
                        href="/cars/leasing"
                        className="block py-1 text-sm text-text-secondary hover:bg-primary hover:text-white"
                      >
                        Lease Deals
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href="/cars/valuation"
                  className="flex items-center space-x-2 py-2 text-text hover:text-primary"
                >
                  <FaCalculator className="h-4 w-4" />
                  <span>Car Valuation</span>
                </Link>

                <Link
                  href="/car-financing"
                  className="flex items-center space-x-2 py-2 text-text hover:text-primary"
                >
                  <FaCalculator className="h-4 w-4" />
                  <span>Car Financing</span>
                </Link>

                <Link
                  href="/cars/about-us"
                  className="flex items-center space-x-2 py-2 text-text hover:text-primary"
                >
                  <FaHandshake className="h-4 w-4" />
                  <span>Vehicle Services</span>
                </Link>
              </div>

              <div className="mt-8 border-t border-text-secondary/20 pt-8">
                <button
                  onClick={navigateToLogin}
                  className="mb-4 w-full rounded-lg bg-primary px-4 py-2 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
                >
                  Sign Up
                </button>
                <div className="flex space-x-2">
                  {!topSettings.hideFavourite && (
                    <button
                      onClick={navigateToLikedCars}
                      className="flex-1 rounded-lg border border-text-secondary/20 p-2 transition-colors hover:bg-background-secondary"
                    >
                      <Heart className="mx-auto h-4 w-4 text-text-secondary" />
                    </button>
                  )}
                  {!topSettings.hideDarkMode && (
                    <button
                      onClick={toggleDarkMode}
                      className="flex-1 rounded-lg border border-text-secondary/20 p-2 transition-colors hover:bg-background-secondary"
                    >
                      {darkMode ? (
                        <Sun className="mx-auto h-4 w-4 text-text-secondary" />
                      ) : (
                        <Moon className="mx-auto h-4 w-4 text-text-secondary" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-400 mt-16 via-blue-500 to-blue-600">

        {/* Main Content */}
        <main className="relative z-10 px-4">
          <div className="mx-auto max-w-7xl py-8">
            {/* Car Images Row */}
            <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="order-2 text-center lg:order-1 lg:text-left">
                <h1 className="mb-4 text-3xl font-bold leading-tight text-white lg:text-5xl">
                  {homepageData?.searchSection?.mainHeading ||
                    "Your Journey, Your Car, Your Way"}
                </h1>
                <p className="mb-4 text-lg leading-relaxed text-blue-100">
                  {homepageData?.searchSection?.subheading ||
                    homepageData?.searchSection?.descriptionText ||
                    "The Point Of Using Lorem Ipsum Is That It Has A More-Or-Less Normal Distribution Of Letters, As Opposed To Using 'Content Here, Content Here."}
                </p>
                <Link href="/car-for-sale">
                  <button className="rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-gray-800 dark:text-slate-200 hover:shadow-lg">
                    Explore Our Vehicles
                  </button>
                </Link>
              </div>

              {/* Car Image */}
              <div className="order-1 flex justify-center lg:order-2 lg:justify-center">
                <Image
                  src="aCar_11zon.webp"
                  alt="Blue Luxury Car"
                  width={500}
                  height={300}
                  className="h-auto w-full max-w-md object-contain"
                  priority
                />
              </div>
            </div>

            {/* Search Section with Professional Dark Mode */}
            <div className="mx-auto max-w-4xl overflow-visible">
              <div className="rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-800 dark:shadow-slate-900/50">
                {/* Condition Tabs */}
                <div className="mb-8 flex justify-center space-x-2">
                  <ConditionTab
                    condition="all"
                    label="All Cars"
                    selected={selectedCondition === "all"}
                    onClick={() => setSelectedCondition("all")}
                  />
                  <ConditionTab
                    condition="new"
                    label="New Cars"
                    selected={selectedCondition === "new"}
                    onClick={() => setSelectedCondition("new")}
                  />
                  <ConditionTab
                    condition="used"
                    label="Used Cars"
                    selected={selectedCondition === "used"}
                    onClick={() => setSelectedCondition("used")}
                  />
                </div>

                {/* Search Fields */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <CustomSelect
                    id={`${idPrefix}-make`}
                    options={carSearchMakes.map((make) => ({
                      value: make,
                      label: make,
                    }))}
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    placeholder="Make"
                    disabled={carSearchData ? false : true}
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
                  />
                  <CustomSelect
                    id={`${idPrefix}-model`}
                    options={carSearchModels.map((model) => ({
                      value: model,
                      label: model,
                    }))}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="Model"
                    disabled={!selectedMake}
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400"
                  />
                </div>

                {/* Search Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCarSearch}
                    className="flex items-center space-x-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Cars</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HeroSection;
