// "use client";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LanguageSwitching from "../components/LanguageSwitching";
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
  const [logoLoading, setLogoLoading] = useState(true);
  const [homepageData, setHomepageData] = useState(DEFAULT_HOMEPAGE_DATA);
  const [fetchedSocials, setFetchedSocials] = useState([]);

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

  const fetchSocialMedia = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
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

  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLogoLoading(true);

      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEYS.FOOTER_SETTINGS);
      if (cachedData) {
        setFooterSettings(cachedData.footer || DEFAULT_FOOTER_SETTINGS);
        setLogo(cachedData.logo5 || "");
        setLogoLoading(false);
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

        setFooterSettings(settings.footer || DEFAULT_FOOTER_SETTINGS);
        setLogo(settings.logo5 || "");
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
            setLogo(data.logo5 || "");
          }
        } catch (parseError) {
          console.warn("Failed to parse stale settings cache:", parseError);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLogoLoading(false);
      }
    }
  }, []);

  // Combined data fetch with proper error handling
  const fetchAllData = useCallback(async () => {
    const promises = [fetchHomepageData(), fetchSocialMedia(), fetchSettings()];

    await Promise.allSettled(promises);
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

  return (
    <footer className="relative mt-10">
      <div className="bg-background dark:bg-background-dark">
        {/* Main footer content */}
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            {/* Quick Links - Compact column */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg">
                  {footerSettings?.col1Heading || t("quickLinks")}
                </h4>
                <nav className="space-y-3">
                  {[
                    { href: "/about", label: t("about") },
                    { href: "/contact", label: t("contact") },
                    { href: "/terms", label: t("terms") },
                    { href: "/privacy", label: t("privacy") },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm font-medium text-black transition-all duration-300 hover:translate-x-1 hover:text-primary dark:text-text-inverse dark:hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Trading Hours - Wider column */}
            <div className="lg:col-span-5">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg">
                {footerSettings?.col2Heading || t("tradingHours")}
              </h4>
              <div className="space-y-2">
                {tradingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg px-3 transition-colors"
                  >
                    <span className="text-sm font-medium text-text dark:text-text-inverse">
                      {schedule.day}
                    </span>
                    <span className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          schedule.hours === t("closedHours")
                            ? "bg-red-400"
                            : "bg-primary"
                        }`}
                      ></div>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          schedule.hours === t("closedHours")
                            ? "text-red-600 dark:text-red-400"
                            : "text-primary dark:text-primary"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language & Social - Compact column */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Language Section */}
                <div>
                  <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-text dark:text-text-inverse sm:text-lg">
                    {footerSettings?.col3Heading || t("language")}
                  </h4>
                  <div className="rounded-xl border border-gray-100 bg-background-secondary p-4 dark:border-gray-800 dark:bg-gray-800">
                    <LanguageSwitching />
                  </div>
                </div>

                <div>
                  <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-text dark:text-text-inverse">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {fetchedSocials.length > 0 ? (
                      fetchedSocials.map((platform, index) => {
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
                            className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary dark:bg-gray-800 dark:text-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-primary dark:hover:bg-primary"
                            aria-label={`${platform.iconValue} social link`}
                          >
                            {IconComponent ? (
                              <IconComponent className="h-5 w-5 text-text-secondary transition-colors duration-300 group-hover:text-text-inverse dark:text-white group-hover:dark:text-text-inverse" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-text-secondary transition-colors duration-300 group-hover:bg-text-inverse dark:bg-text-secondary group-hover:dark:bg-text-inverse" />
                            )}
                          </a>
                        );
                      })
                    ) : (
                      <div className="text-sm italic text-text-secondary dark:text-text-secondary">
                        No socials available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-6xl px-6 py-3">
            <div className="text-center">
              <p className="text-xs font-medium text-text-secondary dark:text-text-secondary">
                © {new Date().getFullYear()}
                <Link
                  href="https://www.automotivewebsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {t("copyright")}
                </Link>
                <span className="mx-2 text-text-secondary dark:text-text-secondary">
                  •
                </span>
                <span className="">
                  by{" "}
                  <Link
                    className="hover:underline hover:text-primary"
                    href="https://sysfoc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sysfoc
                  </Link>{" "}
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">
                  •
                </span>
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footerr;