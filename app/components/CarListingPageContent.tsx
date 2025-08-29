"use client";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import SidebarFilters from "./SidebarFilters";
import CardetailCard from "./CardetailCard";

const CarListingPageContent = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileFiltersOpen(false);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFiltersOpen]);

  return (
    <div className="relative mt-20">
      {/* Desktop: Always visible horizontal filters */}

      <div className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl lg:text-4xl">
          Filter Vehicles
        </h1>
      </div>

      <div className="mb-6 hidden md:block">
        <SidebarFilters />
      </div>

      {/* Mobile: Filter toggle button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="fixed right-6 top-28 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 md:hidden"
        >
          {isMobileFiltersOpen ? (
            <HiX className="h-5 w-5" />
          ) : (
            <HiMenu className="h-5 w-5" />
          )}
          Filters
        </button>
      )}

      {/* Mobile: Overlay filters */}
      {isMobile && (
        <div
          className={`fixed left-0 top-0 z-50 h-screen w-full transform overflow-y-auto bg-white shadow-xl transition-all duration-300 ${
            isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <SidebarFilters />
          </div>
        </div>
      )}

      {/* Main content area - now full width since no sidebar */}
      <div
        className={`mt-10 w-full sm:mt-10 md:mt-0 ${isMobileFiltersOpen ? "opacity-30 md:opacity-100" : ""}`}
      >
        <CardetailCard />
      </div>

      {/* Mobile overlay backdrop */}
      {isMobile && isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </div>
  );
};

export default CarListingPageContent;
