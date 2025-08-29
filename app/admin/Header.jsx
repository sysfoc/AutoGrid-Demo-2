"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownHeader,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/UserContext";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = 'header_settings';

const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      
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
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === 'undefined') return;
      
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }
};

const Header = ({ isDarkMode }) => {
  const { user } = useAuth();
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // Professional logo fetch with cache-first approach
  const fetchLogo = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData) {
        setLogo(cachedData?.settings?.logo6 || "");
        setLoading(false);
        return;
      }

      // If no cache, make API request
      const response = await fetch("/api/settings/general", {
        next: { revalidate: 600 }
      });

      if (!response.ok) {
        throw new Error('Logo fetch failed');
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      const logoUrl = data?.settings?.logo6 || "";
      
      // Cache the logo URL
      CacheManager.set(CACHE_KEY, logoUrl);
      
      setLogo(logoUrl);
      
    } catch (error) {
      console.error("Failed to fetch logo:", error);
      
      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setLogo(data);
          }
        } catch (parseError) {
          console.warn('Failed to parse stale cache data:', parseError);
        }
      }
      
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    // Use requestIdleCallback for non-critical logo loading
    const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const taskId = scheduleTask(() => {
      fetchLogo();
    }, { timeout: 3000 });
    
    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchLogo]);

  // Handle logo error
  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  return (
    <Navbar
      fluid
      rounded
      className="min-h-[80px] border-b border-gray-300 dark:border-gray-700 dark:shadow-xl"
    >
      <NavbarBrand href="/admin/dashboard">
        <div className="flex items-center gap-0">
          <div className="flex h-16 w-20 items-center justify-center overflow-hidden md:h-16 md:w-24">
            {loading ? (
              <div className="h-12 w-16 rounded-md bg-gray-200 dark:bg-gray-700 md:h-14 md:w-20" />
            ) : logo && !logoError ? (
              <div className="relative h-16 w-16 md:h-20 md:w-20">
                <Image
                  src={logo}
                  alt="Logo"
                  fill
                  className="object-contain"
                  onError={handleLogoError}
                  priority
                  sizes="80px"
                />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="bg-gradient-to-r from-gray-800 via-red-600 to-gray-800 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:via-red-400 dark:to-white">
              WindScreen
            </span>
            <span className="text-xs font-medium text-app-text/60 dark:text-gray-400">
              Built to sell cars
            </span>
          </div>
        </div>
      </NavbarBrand>
      <div className="flex items-center gap-x-5 md:order-2">
        <div className="hidden md:block">
          <Button
            color="none"
            href="/"
            className="bg-app-text hover:bg-app-text/90 text-white border-app-text"
          >
            <FiLogOut fontSize={20} />
          </Button>
        </div>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={user?.profilePicture} rounded />
          }
          className="[&_.dropdown-header]:bg-slate-50 [&_.dropdown-header_.text-sm]:text-app-text [&_.dropdown-item]:text-app-text [&_.dropdown-item:hover]:text-app-button [&_.dropdown-item:hover]:bg-slate-50"
        >
          <DropdownHeader className="bg-slate-50">
            <span className="block text-sm text-app-text">{user?.username}</span>
            <span className="block truncate text-sm font-semibold text-app-text/80">
              {user?.email}
            </span>
          </DropdownHeader>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;