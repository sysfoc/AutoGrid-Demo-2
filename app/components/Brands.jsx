"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ArrowUpRight,
  Search,
  Grid,
  List,
  ArrowLeft,
  LoaderPinwheelIcon as Spinner,
  Car,
  Truck,
  Bus,
  CarFront,
  CarTaxiFront,
  TruckIcon as TruckOpen,
} from "lucide-react" // Added all relevant vehicle icons

// Array of Lucide vehicle icons for random assignment
const vehicleIcons = [Car, Truck, Bus, CarFront, CarTaxiFront, TruckOpen]

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true) // New loading state
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [hoveredBrand, setHoveredBrand] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const brandsPerPage = 12

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/Vehicle make and model data (2).json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        // Extract only the 'Maker' name
        const extractedBrands = data.Sheet1.map((item) => ({
          name: item.Maker.trim(),
        }))
        setBrands(extractedBrands)
      } catch (error) {
        console.error("Failed to fetch brands:", error)
        // Optionally set an error state here
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage)
  const startIndex = (currentPage - 1) * brandsPerPage
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + brandsPerPage)

  useEffect(() => {
    // Reset to first page when search term or filters change
    setCurrentPage(1)
  }, [searchTerm]) // Removed selectedCategory as it's no longer used

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <Spinner aria-label="Loading brands" size="lg" className="text-blue-600" />
          <div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading brands...</span>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the automotive brands.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-40 h-96 w-96 animate-pulse rounded-full bg-blue-200/15 to-purple-200/15 blur-3xl dark:bg-blue-900/10 dark:to-purple-900/10"></div>
        <div className="absolute -bottom-32 -left-40 h-80 w-80 animate-pulse rounded-full bg-orange-200/15 to-red-200/15 blur-3xl delay-1000 dark:bg-orange-900/10 dark:to-red-900/10"></div>
      </div>
      <div className="relative mt-20">
        {/* Header Section */}
        <div className="border-b border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">All Brands</h1>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    Discover our complete collection of automotive brands
                  </p>
                </div>
              </div>
              {/* Removed category icons/counts */}
            </div>
          </div>
        </div>
        {/* Controls Section */}
        <div className="sticky top-0 z-40 border-b border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all duration-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                {/* Removed Category Filter */}
                {/* View Toggle */}
                <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-label="Switch to Grid View"
                    className={`rounded-md p-2 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-label="Switch to List View"
                    className={`rounded-md p-2 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Results Info */}
            <div className="mt-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {startIndex + 1}-{Math.min(startIndex + brandsPerPage, filteredBrands.length)} of{" "}
                {filteredBrands.length} brands
              </span>
              {totalPages > 1 && (
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Brands Grid/List */}
          {paginatedBrands.length > 0 ? (
            <div
              className={`
                ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              `}
            >
              {paginatedBrands.map((brand, index) => {
                const Icon = vehicleIcons[index % vehicleIcons.length] // Randomly select an icon
                return (
                  <Link href={`/car-for-sale?make=${encodeURIComponent(brand.name)}`} key={`${brand.name}-${index}`}>
                    <div
                      className={`
                        group relative cursor-pointer overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md
                        transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20
                        dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600
                        ${viewMode === "list" ? "flex items-center p-5" : "p-5"}
                      `}
                      onMouseEnter={() => setHoveredBrand(brand.name)}
                      onMouseLeave={() => setHoveredBrand(null)}
                    >
                      {/* Removed Category Badge */}
                      <div
                        className={`relative z-10 ${
                          viewMode === "list" ? "flex flex-1 items-center gap-4" : "text-center"
                        }`}
                      >
                        {/* Icon Container */}
                        <div
                          className={`
                            ${viewMode === "list" ? "h-16 w-16 flex-shrink-0" : "mx-auto mb-4 h-24 w-24"}
                            relative overflow-hidden rounded-lg bg-gray-100 p-2
                            transition-all duration-300 group-hover:scale-105 dark:bg-gray-700
                          `}
                        >
                          <Icon className="h-full w-full text-gray-500 dark:text-gray-300" />
                        </div>
                        {/* Brand Info */}
                        <div className={`${viewMode === "list" ? "min-w-0 flex-1" : ""}`}>
                          <h3
                            className={`${
                              viewMode === "list" ? "text-lg" : "text-xl"
                            } font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400`}
                          >
                            {brand.name}
                          </h3>
                          {/* Removed description, founded, country */}
                        </div>
                        {viewMode === "list" && (
                          <div className="flex flex-col items-end text-right text-xs text-gray-600 dark:text-gray-400">
                            {/* Removed founded, country */}
                          </div>
                        )}
                        {/* Hover Arrow */}
                        <div className={`${viewMode === "list" ? "" : "mt-2"} flex items-center justify-center`}>
                          <ArrowUpRight
                            className={`h-5 w-5 text-gray-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                              hoveredBrand === brand.name ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <Search className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No brands found</h3>
              <p className="mb-6 text-gray-700 dark:text-gray-400">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                }}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
              >
                Clear Search
              </button>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
