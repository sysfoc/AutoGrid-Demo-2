"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaCar, FaFilter, FaArrowRight } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

const SearchCallToAction = () => {
  const [searchData, setSearchData] = useState(null);
  const { openSidebar } = useSidebar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setSearchData(result?.searchSection);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchClick = () => {
    openSidebar();
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-50 py-10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/10"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleSearchClick}
              className="group relative overflow-hidden rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400/50 dark:focus:ring-red-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center space-x-3 z-10">
                <FaSearch className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Search Vehicles Now</span>
                <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="absolute inset-0 -bottom-1 -top-1 -skew-x-12 bg-white/10 opacity-0 transition-all duration-700 group-hover:animate-pulse group-hover:opacity-100"></div>
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use our advanced filters to find exactly what you&apos;re looking for
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "Filter by Make & Model",
              "Price Range Selection",
              "Color Preferences",
              "Condition Options",
              "Instant Results",
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-300 dark:ring-gray-700"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchCallToAction;
