"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sun, Moon, Search, Menu, X, ChevronDown } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import { FaTimes, FaCalculator, FaHandshake, FaCar } from "react-icons/fa";

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
        className={`focus:border-app-border focus:ring-app-bg hover:border-app-hover w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left text-black transition-colors duration-200 focus:outline-none focus:ring-2 ${
          disabled
            ? "cursor-not-allowed bg-gray-100"
            : "cursor-pointer"
        } ${className}`}
        disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <span
  className={`truncate ${
    value ? "text-gray-900" : "text-gray-500"
  }`}
>
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          {loading ? (
            <div className="border-app-bg h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-[50] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
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
  const [carSearchLoading, setCarSearchLoading] = useState(false);
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
      setCarSearchLoading(true);
      const response = await fetch("/Vehicle make and model data (2).json");
      const data = await response.json();
      setCarSearchData(data.Sheet1);
      const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))];
      setCarSearchMakes(uniqueMakes);
    } catch (error) {
      console.error("Error loading vehicle data:", error);
    } finally {
      setCarSearchLoading(false);
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
        if (cachedData?.settings?.logo5) {
          setLogo(cachedData.settings.logo5);
          return;
        }
        const response = await fetch("/api/settings/general");
        const data = await response.json();
        CacheManager.set("header_settings", data);
        setLogo(data?.settings?.logo5 || "");
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
      className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
        selected
          ? "bg-white text-purple-600 shadow-md"
          : "text-white/80 hover:bg-white/10 hover:text-white"
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
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={handleMobileMenuClose}
        >
          <div className="fixed left-0 top-0 h-full w-80 transform bg-background transition-transform duration-300 dark:bg-background-dark">
            <div className="p-6">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {logo && !logoError ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
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
                <Link
                  href="/car-for-sale"
                  className="block py-2 text-text hover:text-primary"
                >
                  Cars for Sale
                </Link>
                <Link
                  href="/cars/leasing"
                  className="block py-2 text-text hover:text-primary"
                >
                  Lease Deals
                </Link>
                <Link
                  href="/cars/valuation"
                  className="block py-2 text-text hover:text-primary"
                >
                  Car valuation
                </Link>
                <Link
                  href="/car-financing"
                  className="block py-2 text-text hover:text-primary"
                >
                  Car financing
                </Link>
                <Link
                  href="/cars/about-us"
                  className="block py-2 text-text hover:text-primary"
                >
                  Vehicle Services
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
      <div className="mx-auto max-w-7xl">
        {/* Header Navigation */}
        <header className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {logo && !logoError ? (
                <div className="relative h-14 w-16 overflow-hidden rounded-lg">
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
                <div className="h-8 w-8 rounded-lg bg-primary/20"></div>
              )}
              <span className="text-xl font-bold text-text dark:text-text-inverse">
                AutoGrid
              </span>
            </Link>

            <nav className="hidden items-center space-x-8 rounded-2xl lg:flex">
              <div className="group relative">
                <button className={navLinkClasses}>
                  <FaCar className="mr-1 h-4 w-4" />
                  Listings
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-text-secondary/10 bg-background opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:bg-background-dark">
                  <Link
                    href="/car-for-sale"
                    className="block rounded-t-lg px-4 py-3 text-text hover:bg-primary hover:text-white dark:text-text-inverse dark:hover:text-primary"
                  >
                    Cars for Sale
                  </Link>
                  <Link
                    href="/cars/leasing"
                    className="block rounded-b-lg px-4 py-3 text-text hover:bg-primary hover:text-white dark:text-text-inverse dark:hover:text-primary"
                  >
                    Lease Deals
                  </Link>
                </div>
              </div>
              <Link href="/cars/valuation" className={navLinkClasses}>
                <FaCalculator className="mr-1 h-4 w-4" />
                Car Valuation
              </Link>
              <Link href="/car-financing" className={navLinkClasses}>
                <FaCalculator className="mr-1 h-4 w-4" />
                Car Financing
              </Link>
              <Link href="/cars/about-us" className={navLinkClasses}>
                <FaHandshake className="mr-1 h-4 w-4" />
                Vehicle Services
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateToLogin}
                className="hidden items-center rounded-lg border-2 border-primary bg-background px-4 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-text-inverse lg:flex"
              >
                Sign Up
              </button>

              <div className="hidden items-center space-x-2 lg:flex">
                {!topSettings.hideFavourite && (
                  <button
                    onClick={navigateToLikedCars}
                    className="rounded-lg p-3 text-text transition-colors hover:bg-primary hover:text-text-inverse dark:text-text-inverse"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                )}
                {!topSettings.hideDarkMode && (
                  <button
                    onClick={toggleDarkMode}
                    className="rounded-lg p-3 text-text transition-colors hover:bg-primary hover:text-text-inverse dark:text-text-inverse"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuOpen}
                className="rounded-lg p-2 text-text hover:bg-primary/10 dark:text-text-inverse lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-6">
          <div className="rounded-3xl bg-background shadow-2xl dark:bg-background-dark">
            <div className="relative rounded-2xl bg-primary">
              <div className="relative px-8 py-14 lg:px-16 lg:py-16">
                <div className="flex items-center justify-between">
                  <div className="max-w-2xl">
                    <h1 className="mb-6 text-4xl font-bold leading-tight text-text-inverse lg:text-5xl">
                      {homepageData?.searchSection?.mainHeading || ""}
                    </h1>
                    <div className="rounded-2xl border border-text-inverse/20 bg-text-inverse/10 p-6 backdrop-blur-sm">
                      <div className="mb-6 flex space-x-2">
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
                        <div className="space-y-2">
                          <CustomSelect
                            id={`${idPrefix}-make`}
                            options={carSearchMakes.map((make) => {
                              const makeData = carSearchData.find(
                                (item) => item.Maker === make,
                              );
                              const modelString = makeData?.["model "];
                              const modelCount =
                                typeof modelString === "string"
                                  ? modelString.split(",").length
                                  : 0;

                              return {
                                value: make,
                                label: `${make} (${modelCount})`,
                              };
                            })}
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                            placeholder="Select Make"
                            disabled={carSearchLoading}
                            loading={carSearchLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <CustomSelect
                            id={`${idPrefix}-model`}
                            options={carSearchModels.map((model) => {
                              const modelCount = carsData.filter(
                                (car) =>
                                  car.model?.toLowerCase() ===
                                    model.toLowerCase() &&
                                  car.make?.toLowerCase() ===
                                    selectedMake.toLowerCase(),
                              ).length;

                              return {
                                value: model,
                                label: `${model} (${modelCount})`,
                              };
                            })}
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            placeholder="Select Model"
                            disabled={!selectedMake || carSearchLoading}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="h-12 w-full rounded-lg border border-text-inverse/30 bg-background/90 px-4 py-3 text-text focus:border-transparent focus:ring-2 focus:ring-text-inverse"
                          />
                        </div>

                        <div>
                          <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded-lg border border-text-inverse/30 bg-background/90 px-4 py-3 text-text [-moz-appearance:textfield] focus:border-transparent focus:ring-2 focus:ring-text-inverse [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </div>
                      </div>

                      {/* Search Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-text-inverse/80">
                          <span className="text-sm">
                            Featured & promoted Vehicles for your consideration
                          </span>
                        </div>

                        <button
                          onClick={handleCarSearch}
                          className="flex items-center space-x-2 rounded-lg bg-background px-8 py-3 font-medium text-primary transition-colors hover:bg-background-secondary"
                        >
                          <Search className="h-4 w-4" />
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative left-16 top-7 hidden lg:block">
                    <Image
                      src="/00085.png"
                      alt="Car"
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
