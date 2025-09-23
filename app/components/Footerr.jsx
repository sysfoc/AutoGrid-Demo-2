"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LanguageSwitching from "./LanguageSwitching";
import { useTranslations } from "next-intl";
import { iconComponentsMap, allSocialPlatforms } from "../lib/social-icons";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEYS = {
  FOOTER_SETTINGS: "footer_settings",
  HOMEPAGE_DATA: "footer_homepage",
  SOCIAL_MEDIA: "footer_socials",
};

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
      console.warn("Cache retrieval failed for key:", key, error);
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
      console.warn("Cache storage failed for key:", key, error);
    }
  },

  clear: (key) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Cache clear failed for key:", key, error);
    }
  },
};

const DEFAULT_FOOTER_SETTINGS = {
  col1Heading: null,
  col2Heading: null,
  col3Heading: null,
};

const DEFAULT_HOMEPAGE_DATA = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
};

const Footerr = () => {
  const t = useTranslations("Footer");
  const mountedRef = useRef(true);

  const [footerSettings, setFooterSettings] = useState(DEFAULT_FOOTER_SETTINGS);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [homepageData, setHomepageData] = useState(DEFAULT_HOMEPAGE_DATA);
  const [fetchedSocials, setFetchedSocials] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tradingHours = useMemo(
    () => [
      { day: t("monday"), hours: homepageData?.monday || t("openingHours") },
      { day: t("tuesday"), hours: homepageData?.tuesday || t("openingHours") },
      {
        day: t("wednesday"),
        hours: homepageData?.wednesday || t("openingHours"),
      },
      {
        day: t("thursday"),
        hours: homepageData?.thursday || t("openingHours"),
      },
      { day: t("friday"), hours: homepageData?.friday || t("openingHours") },
      { day: t("saturday"), hours: homepageData?.saturday || t("closedHours") },
      { day: t("sunday"), hours: t("closedHours") },
    ],
    [homepageData, t],
  );

  const fetchHomepageData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const cachedData = CacheManager.get(CACHE_KEYS.HOMEPAGE_DATA);
      if (cachedData) {
        setHomepageData(cachedData);
        return;
      }

      const res = await fetch("/api/homepage", {
        next: { revalidate: 300 },
      });

      if (!res.ok) throw new Error("Homepage fetch failed");

      const data = await res.json();
      const footerData = data?.footer || DEFAULT_HOMEPAGE_DATA;

      if (mountedRef.current) {
        setHomepageData(footerData);
        CacheManager.set(CACHE_KEYS.HOMEPAGE_DATA, footerData);
      }
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);

      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEYS.HOMEPAGE_DATA);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setHomepageData(data);
          }
        } catch (parseError) {
          console.warn("Failed to parse stale homepage cache:", parseError);
        }
      }
    }
  }, []);

  // Enhanced social media fetch with professional caching
  const fetchSocialMedia = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEYS.SOCIAL_MEDIA);
      if (cachedData) {
        setFetchedSocials(cachedData);
        return;
      }

      const res = await fetch("/api/socials");

      if (!res.ok) throw new Error("Socials fetch failed");

      const json = await res.json();

      if (json.data && mountedRef.current) {
        const combinedSocials = json.data.map((social) => {
          if (social.iconType === "react-icon") {
            const platformDetails = allSocialPlatforms.find(
              (p) => p.name === social.iconValue,
            );
            return {
              ...social,
              color: platformDetails?.color || "from-gray-200 to-gray-300",
              textColor: platformDetails?.textColor || "text-gray-600",
            };
          }

          return {
            ...social,
            color: "from-gray-200 to-gray-300",
            textColor: "text-gray-600",
          };
        });

        setFetchedSocials(combinedSocials);
        CacheManager.set(CACHE_KEYS.SOCIAL_MEDIA, combinedSocials);
      }
    } catch (error) {
      console.error("Failed to fetch social media data:", error);

      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEYS.SOCIAL_MEDIA);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setFetchedSocials(data);
          }
        } catch (parseError) {
          console.warn("Failed to parse stale socials cache:", parseError);
        }
      }
    }
  }, []);

  // Enhanced settings fetch with professional cache handling
  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);

      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEYS.FOOTER_SETTINGS);
      if (cachedData) {
        setFooterSettings(cachedData.footer || DEFAULT_FOOTER_SETTINGS);
        setLogo(cachedData.logo6 || "");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/settings/general", {
        next: { revalidate: 300 },
      });

      if (!res.ok) throw new Error("Settings fetch failed");

      const data = await res.json();

      if (mountedRef.current) {
        const settings = data?.settings || {};

        // Cache the response
        CacheManager.set(CACHE_KEYS.FOOTER_SETTINGS, settings);

        const updates = {
          footerSettings: settings.footer || DEFAULT_FOOTER_SETTINGS,
          logo: settings.logo6 || "",
        };

        setFooterSettings(updates.footerSettings);
        setLogo(updates.logo);
      }
    } catch (error) {
      console.error("Failed to fetch footer settings:", error);

      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEYS.FOOTER_SETTINGS);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setFooterSettings(data.footer || DEFAULT_FOOTER_SETTINGS);
            setLogo(data.logo6 || "");
          }
        } catch (parseError) {
          console.warn("Failed to parse stale settings cache:", parseError);
        }
      }

      // Silently fall back to defaults
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Combined data fetch with proper error handling
  const fetchAllData = useCallback(async () => {
    const promises = [fetchHomepageData(), fetchSocialMedia(), fetchSettings()];

    await Promise.allSettled(promises);

    if (mountedRef.current) {
      setIsDataLoaded(true);
    }
  }, [fetchHomepageData, fetchSocialMedia, fetchSettings]);

  // Effect with proper cleanup and idle callback optimization
  useEffect(() => {
    mountedRef.current = true;

    // Use requestIdleCallback for non-critical footer data
    const scheduleTask =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    const taskId = scheduleTask(
      () => {
        fetchAllData();
      },
      { timeout: 5000 },
    );

    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchAllData]);

  // Handle logo error with callback optimization
  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  // Optimized skeleton without animations to prevent CLS
  const LogoSkeleton = useMemo(
    () => <div className="div-style-15 rounded bg-gray-300 dark:bg-gray-600" />,
    [],
  );

  // Professional logo component with fixed dimensions and error handling
  const LogoComponent = useMemo(() => {
    if (!isDataLoaded) return LogoSkeleton;

    if (logo && !logoError) {
      return (
        <div className="div-style-17">
          <Image
            src={logo}
            alt="Footer Logo"
            fill
            className="object-contain"
            onError={handleLogoError}
            sizes="180px"
            priority
          />
        </div>
      );
    }

    // Fallback text logo when no image available
    return (
      <div className="div-style-16 flex flex-col space-y-1">
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          FrontSeat
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Built to Sell Cars
        </span>
      </div>
    );
  }, [logo, logoError, isDataLoaded, LogoSkeleton, handleLogoError]);

  // Memoized social links with loading state
  const SocialLinks = useMemo(() => {
    if (!isDataLoaded) {
      return (
        <div className="flex space-x-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-600"
            />
          ))}
        </div>
      );
    }

    if (fetchedSocials.length === 0) {
      return (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No social media links configured yet.
        </p>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2 space-x-3">
        {fetchedSocials.map((platform, index) => {
          const IconComponent =
            platform.iconType === "react-icon"
              ? iconComponentsMap[platform.iconValue]
              : null;

          return (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Follow us on ${platform.iconValue}`}
              className="transform text-xl text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {IconComponent ? (
                <IconComponent className="h-5 w-5" />
              ) : platform.iconType === "svg-code" ? (
                <div
                  className="h-5 w-5"
                  dangerouslySetInnerHTML={{
                    __html: platform.iconValue,
                  }}
                />
              ) : (
                <div className="h-5 w-5 text-gray-500">?</div>
              )}
            </a>
          );
        })}
      </div>
    );
  }, [fetchedSocials, isDataLoaded]);

  // Memoized quick links - Now loads immediately (static content)
  const QuickLinks = useMemo(() => {
    return (
      <ul className="space-y-2">
        <li>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t("about")}
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t("contact")}
          </Link>
        </li>
        <li>
          <Link
            href="/terms"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t("terms")}
          </Link>
        </li>
        <li>
          <Link
            href="/privacy"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            {t("privacy")}
          </Link>
        </li>
      </ul>
    );
  }, [t]);

  // Memoized trading hours display - Days load immediately, hours show skeleton
  const TradingHoursDisplay = useMemo(() => {
    return (
      <div className="space-y-2">
        {tradingHours.map((schedule, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {schedule.day}
            </span>
            {!isDataLoaded ? (
              <div className="h-5 w-40 rounded bg-gray-300 dark:bg-gray-600" />
            ) : (
              <span
                className={`text-sm font-medium ${
                  schedule.hours === t("closedHours")
                    ? "text-red-700 dark:text-red-500"
                    : "text-green-800 dark:text-green-500"
                }`}
              >
                {schedule.hours}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }, [tradingHours, t, isDataLoaded]);

  return (
    <div className="relative mt-5">
      {/* Optimized SVG Wave */}
      <div className="absolute left-0 top-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-12 w-full transform-gpu md:h-16"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39c-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-gray-50 dark:fill-gray-800"
          />
        </svg>
      </div>

      <footer className="relative rounded-t-3xl bg-gray-200 pb-3 pt-8 shadow-inner dark:bg-gray-800">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo Column */}
            <div className="space-y-4">{LogoComponent}</div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h3
                className={`text-lg font-semibold text-gray-800 dark:text-gray-200 ${isLoading ? "opacity-75" : "opacity-100"}`}
              >
                {footerSettings?.col1Heading || t("quickLinks")}
              </h3>
              <div className="mb-2 h-0.5 w-10 rounded-full bg-blue-500"></div>
              {QuickLinks}
            </div>

            {/* Trading Hours Column */}
            <div className="space-y-4">
              <h3
                className={`text-lg font-semibold text-gray-800 dark:text-gray-200 ${isLoading ? "opacity-75" : "opacity-100"}`}
              >
                {footerSettings?.col2Heading || t("tradingHours")}
              </h3>
              <div className="mb-2 h-0.5 w-10 rounded-full bg-green-500"></div>
              {TradingHoursDisplay}
            </div>

            {/* Language & Socials Column */}
            <div className="space-y-4">
              <h3
                className={`text-lg font-semibold text-gray-800 dark:text-gray-200 ${isLoading ? "opacity-75" : "opacity-100"}`}
              >
                {footerSettings?.col3Heading || t("language")}
              </h3>
              <div className="mb-2 h-0.5 w-10 rounded-full bg-purple-500"></div>
              <div className="space-y-4">
                <LanguageSwitching />
                <div className="pt-2">
                  <h4 className="mb-3 text-sm font-medium text-black dark:text-gray-300">
                    Follow us:
                  </h4>
                  {SocialLinks}
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mb-3 mt-8 border-t border-gray-200 pt-6 dark:border-gray-700 sm:mb-2">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()}
                <Link
                  href="https://automotivewebsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {" "}
                  {t("copyright")}
                </Link>{" "}
                by
                <Link
                  href="https://sysfoc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {" "}
                  Sysfoc.
                </Link>{" "}
                All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footerr;
// "use client";
// import Link from "next/link";
// import { useEffect, useState, useMemo, useCallback, useRef } from "react";
// import LanguageSwitching from "./LanguageSwitching";
// import { useTranslations } from "next-intl";
// import { iconComponentsMap, allSocialPlatforms } from "../lib/social-icons";

// const CACHE_DURATION = 5 * 60 * 1000;
// const CACHE_KEYS = {
//   FOOTER_SETTINGS: "footer_settings",
//   HOMEPAGE_DATA: "footer_homepage",
//   SOCIAL_MEDIA: "footer_socials",
// };

// const CacheManager = {
//   get: (key) => {
//     try {
//       if (typeof window === "undefined") return null;

//       const cached = localStorage.getItem(key);
//       if (!cached) return null;

//       const { data, timestamp } = JSON.parse(cached);
//       const now = Date.now();

//       if (now - timestamp > CACHE_DURATION) {
//         localStorage.removeItem(key);
//         return null;
//       }

//       return data;
//     } catch (error) {
//       console.warn("Cache retrieval failed for key:", key, error);
//       return null;
//     }
//   },

//   set: (key, data) => {
//     try {
//       if (typeof window === "undefined") return;

//       const cacheData = {
//         data,
//         timestamp: Date.now(),
//       };

//       localStorage.setItem(key, JSON.stringify(cacheData));
//     } catch (error) {
//       console.warn("Cache storage failed for key:", key, error);
//     }
//   },

//   clear: (key) => {
//     try {
//       if (typeof window === "undefined") return;
//       localStorage.removeItem(key);
//     } catch (error) {
//       console.warn("Cache clear failed for key:", key, error);
//     }
//   },
// };

// const DEFAULT_FOOTER_SETTINGS = {
//   col1Heading: null,
//   col2Heading: null,
//   col3Heading: null,
// };

// const DEFAULT_HOMEPAGE_DATA = {
//   monday: null,
//   tuesday: null,
//   wednesday: null,
//   thursday: null,
//   friday: null,
//   saturday: null,
// };

// // Skeleton Components for dynamic content only
// const SkeletonText = ({ width = "100%", height = "16px", className = "" }) => (
//   <div
//     className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
//     style={{ width, height }}
//   />
// );

// const SkeletonSocialIcons = () => (
//   <div className="flex flex-wrap gap-3">
//     {[1, 2, 3, 4].map((i) => (
//       <div
//         key={i}
//         className="h-12 w-12 animate-pulse rounded-xl bg-background-secondary dark:bg-gray-800"
//       />
//     ))}
//   </div>
// );

// const Footerr = () => {
//   const t = useTranslations("Footer");
//   const mountedRef = useRef(true);

//   const [footerSettings, setFooterSettings] = useState(DEFAULT_FOOTER_SETTINGS);
//   const [logo, setLogo] = useState("");
//   const [logoLoading, setLogoLoading] = useState(true);
//   const [homepageData, setHomepageData] = useState(DEFAULT_HOMEPAGE_DATA);
//   const [fetchedSocials, setFetchedSocials] = useState([]);
  
//   // Loading states - only for dynamic content
//   const [isLoadingSettings, setIsLoadingSettings] = useState(true);
//   const [isLoadingHomepage, setIsLoadingHomepage] = useState(true);
//   const [isLoadingSocials, setIsLoadingSocials] = useState(true);

//   const tradingHours = useMemo(
//     () => [
//       { day: t("monday"), hours: homepageData?.monday || t("openingHours") },
//       { day: t("tuesday"), hours: homepageData?.tuesday || t("openingHours") },
//       {
//         day: t("wednesday"),
//         hours: homepageData?.wednesday || t("openingHours"),
//       },
//       {
//         day: t("thursday"),
//         hours: homepageData?.thursday || t("openingHours"),
//       },
//       { day: t("friday"), hours: homepageData?.friday || t("openingHours") },
//       { day: t("saturday"), hours: homepageData?.saturday || t("closedHours") },
//       { day: t("sunday"), hours: t("closedHours") },
//     ],
//     [homepageData, t],
//   );

//   const fetchHomepageData = useCallback(async () => {
//     if (!mountedRef.current) return;

//     try {
//       const cachedData = CacheManager.get(CACHE_KEYS.HOMEPAGE_DATA);
//       if (cachedData) {
//         setHomepageData(cachedData);
//         setIsLoadingHomepage(false);
//         return;
//       }

//       const res = await fetch("/api/homepage", {
//         next: { revalidate: 300 },
//       });

//       if (!res.ok) throw new Error("Homepage fetch failed");

//       const data = await res.json();
//       const footerData = data?.footer || DEFAULT_HOMEPAGE_DATA;

//       if (mountedRef.current) {
//         setHomepageData(footerData);
//         setIsLoadingHomepage(false);
//         CacheManager.set(CACHE_KEYS.HOMEPAGE_DATA, footerData);
//       }
//     } catch (error) {
//       console.error("Failed to fetch homepage data:", error);

//       const staleCache = localStorage.getItem(CACHE_KEYS.HOMEPAGE_DATA);
//       if (staleCache) {
//         try {
//           const { data } = JSON.parse(staleCache);
//           if (data && mountedRef.current) {
//             setHomepageData(data);
//           }
//         } catch (parseError) {
//           console.warn("Failed to parse stale homepage cache:", parseError);
//         }
//       }
      
//       if (mountedRef.current) {
//         setIsLoadingHomepage(false);
//       }
//     }
//   }, []);

//   const fetchSocialMedia = useCallback(async () => {
//     if (!mountedRef.current) return;

//     try {
//       const cachedData = CacheManager.get(CACHE_KEYS.SOCIAL_MEDIA);
//       if (cachedData) {
//         setFetchedSocials(cachedData);
//         setIsLoadingSocials(false);
//         return;
//       }

//       const res = await fetch("/api/socials");

//       if (!res.ok) throw new Error("Socials fetch failed");

//       const json = await res.json();

//       if (json.data && mountedRef.current) {
//         const combinedSocials = json.data.map((social) => {
//           if (social.iconType === "react-icon") {
//             const platformDetails = allSocialPlatforms.find(
//               (p) => p.name === social.iconValue,
//             );
//             return {
//               ...social,
//               color: platformDetails?.color || "from-gray-200 to-gray-300",
//               textColor: platformDetails?.textColor || "text-gray-600",
//             };
//           }

//           return {
//             ...social,
//             color: "from-gray-200 to-gray-300",
//             textColor: "text-gray-600",
//           };
//         });

//         setFetchedSocials(combinedSocials);
//         setIsLoadingSocials(false);
//         CacheManager.set(CACHE_KEYS.SOCIAL_MEDIA, combinedSocials);
//       }
//     } catch (error) {
//       console.error("Failed to fetch social media data:", error);

//       // Try to use stale cache as fallback
//       const staleCache = localStorage.getItem(CACHE_KEYS.SOCIAL_MEDIA);
//       if (staleCache) {
//         try {
//           const { data } = JSON.parse(staleCache);
//           if (data && mountedRef.current) {
//             setFetchedSocials(data);
//           }
//         } catch (parseError) {
//           console.warn("Failed to parse stale socials cache:", parseError);
//         }
//       }
      
//       if (mountedRef.current) {
//         setIsLoadingSocials(false);
//       }
//     }
//   }, []);

//   const fetchSettings = useCallback(async () => {
//     if (!mountedRef.current) return;

//     try {
//       setLogoLoading(true);

//       // Check cache first
//       const cachedData = CacheManager.get(CACHE_KEYS.FOOTER_SETTINGS);
//       if (cachedData) {
//         setFooterSettings(cachedData.footer || DEFAULT_FOOTER_SETTINGS);
//         setLogo(cachedData.logo5 || "");
//         setLogoLoading(false);
//         setIsLoadingSettings(false);
//         return;
//       }

//       const res = await fetch("/api/settings/general", {
//         next: { revalidate: 300 },
//       });

//       if (!res.ok) throw new Error("Settings fetch failed");

//       const data = await res.json();

//       if (mountedRef.current) {
//         const settings = data?.settings || {};

//         // Cache the response
//         CacheManager.set(CACHE_KEYS.FOOTER_SETTINGS, settings);

//         setFooterSettings(settings.footer || DEFAULT_FOOTER_SETTINGS);
//         setLogo(settings.logo5 || "");
//         setIsLoadingSettings(false);
//       }
//     } catch (error) {
//       console.error("Failed to fetch footer settings:", error);

//       // Try to use stale cache as fallback
//       const staleCache = localStorage.getItem(CACHE_KEYS.FOOTER_SETTINGS);
//       if (staleCache) {
//         try {
//           const { data } = JSON.parse(staleCache);
//           if (data && mountedRef.current) {
//             setFooterSettings(data.footer || DEFAULT_FOOTER_SETTINGS);
//             setLogo(data.logo5 || "");
//           }
//         } catch (parseError) {
//           console.warn("Failed to parse stale settings cache:", parseError);
//         }
//       }
      
//       if (mountedRef.current) {
//         setIsLoadingSettings(false);
//       }
//     } finally {
//       if (mountedRef.current) {
//         setLogoLoading(false);
//       }
//     }
//   }, []);

//   // Combined data fetch with proper error handling
//   const fetchAllData = useCallback(async () => {
//     const promises = [fetchHomepageData(), fetchSocialMedia(), fetchSettings()];

//     await Promise.allSettled(promises);
//   }, [fetchHomepageData, fetchSocialMedia, fetchSettings]);

//   // Effect with proper cleanup and idle callback optimization
//   useEffect(() => {
//     mountedRef.current = true;

//     // Use requestIdleCallback for non-critical footer data
//     const scheduleTask =
//       window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
//     const taskId = scheduleTask(
//       () => {
//         fetchAllData();
//       },
//       { timeout: 5000 },
//     );

//     return () => {
//       mountedRef.current = false;
//       if (window.cancelIdleCallback) {
//         window.cancelIdleCallback(taskId);
//       } else {
//         clearTimeout(taskId);
//       }
//     };
//   }, [fetchAllData]);

//   return (
//     <footer role="contentinfo" aria-label="Site footer">
//       <div className="bg-background dark:bg-background-dark">
//         {/* Main footer content */}
//         <div className="mx-auto max-w-6xl px-6 py-5">
//           <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
//             {/* Quick Links - Compact column */}
//             <div className="lg:col-span-3">
//               <div className="mb-8">
//                 <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg">
//                   {footerSettings?.col1Heading || t("quickLinks")}
//                 </h4>
                
//                 <nav className="space-y-3" aria-label="Quick links navigation">
//                   {[
//                     { href: "/about", label: t("about") },
//                     { href: "/contact", label: t("contact") },
//                     { href: "/terms", label: t("terms") },
//                     { href: "/privacy", label: t("privacy") },
//                   ].map((link) => (
//                     <Link
//                       key={link.href}
//                       href={link.href}
//                       className="block text-sm font-medium text-black transition-all duration-300 hover:translate-x-1 hover:text-primary dark:text-text-inverse dark:hover:text-primary"
//                       aria-label={`Go to ${link.label} page`}
//                     >
//                       {link.label}
//                     </Link>
//                   ))}
//                 </nav>
//               </div>
//             </div>

//             {/* Trading Hours - Wider column */}
//             <div className="lg:col-span-5">
//               <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg">
//                 {footerSettings?.col2Heading || t("tradingHours")}
//               </h4>
              
//               <div className="space-y-2" role="table" aria-label="Trading hours schedule">
//                 {tradingHours.map((schedule, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between rounded-lg px-3 transition-colors"
//                     role="row"
//                   >
//                     <span 
//                       className="text-sm font-medium text-text dark:text-text-inverse"
//                       role="rowheader"
//                     >
//                       {schedule.day}
//                     </span>
//                     <span className="flex items-center space-x-2" role="cell">
//                       {isLoadingHomepage ? (
//                         <SkeletonText width="60px" height="12px" />
//                       ) : (
//                         <>
//                           <div
//                             className={`h-2 w-2 rounded-full ${
//                               schedule.hours === t("closedHours")
//                                 ? "bg-red-400"
//                                 : "bg-primary"
//                             }`}
//                             aria-hidden="true"
//                           ></div>
//                           <span
//                             className={`text-xs font-semibold uppercase tracking-wide ${
//                               schedule.hours === t("closedHours")
//                                 ? "text-red-600 dark:text-red-400"
//                                 : "text-primary dark:text-primary"
//                             }`}
//                             aria-label={`${schedule.day}: ${schedule.hours === t("closedHours") ? "Closed" : schedule.hours}`}
//                           >
//                             {schedule.hours}
//                           </span>
//                         </>
//                       )}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Language & Social - Compact column */}
//             <div className="lg:col-span-4">
//               <div className="space-y-8">
//                 {/* Language Section - Always visible */}
//                 <section aria-labelledby="language-heading">
//                   <h4 
//                     id="language-heading"
//                     className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg"
//                   >
//                     {footerSettings?.col3Heading || t("language")}
//                   </h4>
//                   <div className="rounded-xl border border-gray-100 bg-background-secondary p-4 dark:border-gray-800 dark:bg-gray-800">
//                     <LanguageSwitching />
//                   </div>
//                 </section>

//                 {/* Social Media Section */}
//                 <section aria-labelledby="social-heading">
//                   <h4
//                     id="social-heading"
//                     className="mb-6 text-xs font-bold uppercase tracking-widest text-text dark:text-text-inverse"
//                   >
//                     Follow Us
//                   </h4>
                  
//                   {isLoadingSocials ? (
//                     <SkeletonSocialIcons />
//                   ) : (
//                     <ul className="flex flex-wrap gap-3" aria-label="Social media links">
//                       {fetchedSocials.length > 0 ? (
//                         fetchedSocials.map((platform, index) => {
//                           const IconComponent =
//                             platform.iconType === "react-icon"
//                               ? iconComponentsMap[platform.iconValue]
//                               : null;

//                           return (
//                             <li key={index}>
//                               <a
//                                 href={platform.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary dark:bg-gray-800 dark:text-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-primary dark:hover:bg-primary"
//                                 aria-label={`Follow us on ${platform.iconValue}`}
//                               >
//                                 {IconComponent ? (
//                                   <IconComponent 
//                                     className="h-5 w-5 text-text-secondary transition-colors duration-300 group-hover:text-text-inverse dark:text-white group-hover:dark:text-text-inverse" 
//                                     aria-hidden="true"
//                                   />
//                                 ) : (
//                                   <div 
//                                     className="h-5 w-5 rounded-full bg-text-secondary transition-colors duration-300 group-hover:bg-text-inverse dark:bg-text-secondary group-hover:dark:bg-text-inverse" 
//                                     aria-hidden="true"
//                                   />
//                                 )}
//                               </a>
//                             </li>
//                           );
//                         })
//                       ) : (
//                         <li
//                           className="text-sm italic text-text-secondary dark:text-text-secondary"
//                           role="status"
//                           aria-live="polite"
//                         >
//                           No socials available
//                         </li>
//                       )}
//                     </ul>
//                   )}
//                 </section>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Copyright section - Always visible */}
//         <div className="border-t border-gray-100 dark:border-gray-800">
//           <div className="mx-auto max-w-6xl px-6 py-3">
//             <div className="text-center">
//               <p 
//                 className="text-sm font-medium text-black dark:text-gray-200"
//                 role="contentinfo"
//                 aria-label="Copyright information"
//               >
//                 © {new Date().getFullYear()}
//                 <Link
//                   href="https://www.automotivewebsolutions.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:text-primary hover:underline"
//                   aria-label="Visit Automotive Web Solutions website"
//                 >
//                   {" "}{t("copyright")}
//                 </Link>
//                 <span>
//                   {" "}by{" "}
//                   <Link
//                     className="hover:underline hover:text-primary"
//                     href="https://sysfoc.com"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label="Visit Sysfoc website"
//                   >
//                     Sysfoc.
//                   </Link>{" "}
//                 </span>
//                 All rights reserved
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footerr;



