"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTimes,
  FaCalculator,
  FaHandshake,
  FaCar,
  FaUser,
} from "react-icons/fa";
import { Heart, Sun, Moon, Menu, ChevronDown } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";
import Banner from "./Banner";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = "header_settings";

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

      const cacheData = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Cache storage failed:", error);
    }
  },
};

// Static fallback data to prevent loading states
const DEFAULT_SETTINGS = {
  hideDarkMode: false,
  hideFavourite: false,
  hideLogo: false,
};

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [topSettings, setTopSettings] = useState(DEFAULT_SETTINGS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const mountedRef = useRef(true);
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const { toggleSidebar } = useSidebar();

  const quickLinks = useMemo(
    () => [
      { name: "Car Valuation", href: "/cars/valuation", icon: FaCalculator },
      { name: "Car Financing", href: "/car-financing", icon: FaCalculator },
      { name: "Vehicle Services", href: "/cars/about-us", icon: FaHandshake },
    ],
    [],
  );

  const mobileLinks = useMemo(
    () => [
      { name: "Cars for Sale", href: "/car-for-sale", icon: FaCar },
      { name: "Lease Deals", href: "/cars/leasing", icon: FaCar },
      { name: "Car Valuation", href: "/cars/valuation", icon: FaCalculator },
      { name: "Car Financing", href: "/car-financing", icon: FaCalculator },
      { name: "Vehicle Services", href: "/cars/about-us", icon: FaHandshake },
    ],
    [],
  );

  const mobileMenuLinks = useMemo(
    () => [...quickLinks, { name: "Login", href: "/login", icon: FaUser }],
    [quickLinks],
  );

  useEffect(() => {
    // Check localStorage first for faster initialization
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);

    // Apply immediately to prevent flash
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Calculate hero section height (87vh)
      const heroHeight = window.innerHeight * 0.87;
      const scrollThreshold = heroHeight * 0.2; // 20% of hero section

      setIsVisible(currentScrollY > scrollThreshold);
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced settings fetch with cache integration
  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);

      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData) {
        setLogo(cachedData?.settings?.logo6 || "");
        setTopSettings({
          ...DEFAULT_SETTINGS,
          ...cachedData?.settings?.top,
        });
        setIsSettingsLoaded(true);
        setIsLoading(false);
        return;
      }

      // If no cache, make API request
      const response = await fetch("/api/settings/general", {
        next: { revalidate: 600 },
      });

      if (!response.ok) {
        throw new Error("Settings fetch failed");
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      // Cache the response
      CacheManager.set(CACHE_KEY, data);

      const updates = {
        logo: data?.settings?.logo6 || "",
        settings: {
          ...DEFAULT_SETTINGS,
          ...data?.settings?.top,
        },
      };

      setLogo(updates.logo);
      setTopSettings(updates.settings);
      setIsSettingsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch settings:", error);

      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.settings) {
            setLogo(data.settings.logo6 || "");
            setTopSettings({
              ...DEFAULT_SETTINGS,
              ...data.settings.top,
            });
          }
        } catch (parseError) {
          console.warn("Failed to parse stale cache data:", parseError);
        }
      }

      // Silently fall back to defaults
      setIsSettingsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Use requestIdleCallback for non-critical settings
    const scheduleTask =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const taskId = scheduleTask(
      () => {
        fetchSettings();
      },
      { timeout: 3000 },
    );

    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchSettings]);

  // Optimized dark mode toggle with persistence
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

  const toggleSearchSidebar = useCallback(() => {
    toggleSidebar(); // Use context function
  }, [toggleSidebar]);

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const navigateToLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  // Optimized skeleton without animations to prevent CLS
  const LogoSkeleton = useMemo(
    () => (
      <div className="custom-box flex items-center space-x-3">
        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex flex-col space-y-1">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    ),
    [],
  );

  // Memoized logo component with fixed dimensions
  const LogoComponent = useMemo(() => {
    if (topSettings.hideLogo) return null;

    if (!isSettingsLoaded) return LogoSkeleton;

    const logoContent = (
      <div className="flex items-center space-x-3">
        <div className="flex flex-col">
          <span className="bg-gradient-to-r from-gray-800 via-green-600 to-gray-800 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:via-green-400 dark:to-white">
            WindScreen
          </span>
          <span className="text-xs font-medium text-gray-600 transition-colors duration-300 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-400">
            Built to Sell Cars
          </span>
        </div>
      </div>
    );

    return (
      <Link href="/" className="group flex items-center space-x-3">
        <div className="custom-flex-box">
          {logo && !logoError ? (
            <>
              <div className="custom-size-box">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  fill
                  className="object-contain"
                  onError={handleLogoError}
                  priority
                  sizes="64px"
                />
              </div>
              {/* {logoContent} */}
            </>
          ) : null}
        </div>
      </Link>
    );
  }, [
    topSettings.hideLogo,
    isSettingsLoaded,
    logo,
    logoError,
    LogoSkeleton,
    handleLogoError,
  ]);

  return (
    <>
      <Banner />
      <nav
        className="fixed left-0 right-0 top-16 z-20 border-b border-gray-200 bg-white shadow-lg backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
          <div className="flex h-16 items-center justify-between">
            {LogoComponent}

            <div className="hidden items-center space-x-6 lg:flex">
              {/* Listings Dropdown */}
              <div className="group relative">
                <button className="group relative flex items-center space-x-2 rounded-xl border-2 border-transparent px-6 py-3 text-sm font-semibold text-[var(--text)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">
                  <FaCar className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--primary)]" />
                  <span className="transition-colors duration-300 group-hover:text-[var(--primary)]">Listings</span>
                  <ChevronDown className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-[var(--primary)]" />
                </button>

                <div
                  className="invisible absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border-2 border-gray-100 bg-white opacity-0 shadow-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800
                  group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 translate-y-2"
                >
                  <Link
                    href="/car-for-sale"
                    className="flex items-center rounded-t-xl px-5 py-4 text-[var(--text)] transition-all duration-200 hover:shadow-inner hover:shadow-[var(--primary)]/10 hover:bg-gradient-to-r hover:from-transparent hover:to-[var(--primary)]/5 hover:border-l-4 hover:border-l-[var(--primary)]"
                  >
                    <span className="font-medium">Cars for Sale</span>
                  </Link>
                  <Link
                    href="/cars/leasing"
                    className="flex items-center rounded-b-xl px-5 py-4 text-[var(--text)] transition-all duration-200 hover:shadow-inner hover:shadow-[var(--primary)]/10 hover:bg-gradient-to-r hover:from-transparent hover:to-[var(--primary)]/5 hover:border-l-4 hover:border-l-[var(--primary)]"
                  >
                    <span className="font-medium">Lease Deals</span>
                  </Link>
                </div>
              </div>

              {/* Other Links */}
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative flex items-center space-x-2 rounded-xl border-2 border-transparent px-6 py-3 text-sm font-semibold text-[var(--text)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                  >
                    <IconComponent className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--primary)]" />
                    <span className="transition-colors duration-300 group-hover:text-[var(--primary)]">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={navigateToLogin}
                aria-label="Sign Up"
                className={`group relative hidden items-center space-x-2 rounded-xl border-2 border-[var(--primary)] bg-gradient-to-r from-transparent to-[var(--primary)]/5 px-6 py-3 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 lg:flex ${isLoading ? "opacity-75" : "opacity-100"}`}
              >
                <FaUser className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Sign Up</span>
              </button>

              <button
                onClick={handleMobileMenuOpen}
                aria-label="Open Menu"
                className="group relative rounded-xl bg-gray-50 p-3 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 dark:bg-gray-800 lg:hidden"
              >
                <Menu className="h-5 w-5 text-[var(--text)] transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--primary)]" />
              </button>

              {!topSettings.hideFavourite && (
                <button
                  onClick={navigateToLikedCars}
                  aria-label="Liked Cars"
                  className={`group relative hidden rounded-xl bg-gradient-to-br from-amber-50 to-blue-50 p-3 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-200/50 focus:outline-none focus:ring-0 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:shadow-blue-400/20 md:flex ${isLoading ? "opacity-75" : "opacity-100"}`}
                >
                  <Heart className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500" />
                </button>
              )}

              <div className="hidden items-center space-x-3 md:flex">
                {!topSettings.hideDarkMode && (
                  <button
                    onClick={toggleDarkMode}
                    className={`group relative rounded-xl bg-gradient-to-br from-amber-50 to-blue-50 p-3 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-200/50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:shadow-blue-400/20 ${isLoading ? "opacity-75" : "opacity-100"}`}
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180 group-hover:text-amber-500 dark:text-amber-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-blue-500" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 md:hidden">
                {!topSettings.hideDarkMode && (
                  <button
                    onClick={toggleDarkMode}
                    className={`group relative rounded-xl bg-gradient-to-br from-amber-50 to-blue-50 p-3 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-200/50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:shadow-blue-400/20 ${isLoading ? "opacity-75" : "opacity-100"}`}
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180 group-hover:text-amber-500 dark:text-amber-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-blue-500" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Quick Links Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="custom-transform fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={handleMobileMenuClose}
        />
      )}

      <div
        className={`scrollbar-hide custom-mobile-menu fixed left-0 top-0 z-[60] h-full w-full max-w-xs transform overflow-y-auto border-r border-[var(--text-secondary)] bg-[var(--bg)] shadow-2xl lg:hidden ${
          isMobileMenuOpen ? "open" : "closed"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--text-secondary)] bg-[var(--bg-secondary)] p-4">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Quick Links
            </h2>
            <button
              onClick={handleMobileMenuClose}
              aria-label="Close Menu"
              className="group rounded-xl p-2 text-[var(--text-secondary)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <FaTimes className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </div>

          <div className="flex-1 space-y-2 p-4">
            {mobileLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleMobileMenuClose}
                  className="group flex items-center space-x-3 rounded-xl border-2 border-transparent px-4 py-3 text-base font-medium text-[var(--text)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md hover:shadow-[var(--primary)]/20 hover:bg-gradient-to-r hover:from-transparent hover:to-[var(--primary)]/5"
                >
                  <IconComponent className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--primary)]" />
                  <span className="transition-colors duration-300 group-hover:text-[var(--primary)]">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[var(--text-secondary)] p-4">
            <div className="text-center">
              <p className="text-xs text-[var(--text-secondary)]">
                Professional Car Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;