"use client"

import { useState, useEffect } from "react"
import {
  Car,
  CarFront,
  CaravanIcon as Van,
  BatteryCharging,
  Wrench,
} from "lucide-react"

const getColumnCount = () => {
  if (typeof window !== "undefined") {
    const width = window.innerWidth
    if (width < 640) return 2
    if (width < 768) return 2
    if (width < 1024) return 3
    return 4
  }
  return 4
}

const BrowseCars = () => {
  const allItems = [
    { category: "Automatic Cars", icon: <Car />, count: 245, popular: true },
    { category: "Family Cars", icon: <CarFront />, count: 189, popular: true },
    { category: "Sports Cars", icon: <Car />, count: 78, popular: false },
    { category: "Electric Cars", icon: <BatteryCharging />, count: 156, popular: true },
    { category: "5 Seaters", icon: <Van />, count: 234, popular: false },
    { category: "Small Cars", icon: <Car />, count: 167, popular: false },
    { category: "Classic Cars", icon: <Van />, count: 45, popular: false },
    { category: "AWD/4WD", icon: <Van />, count: 123, popular: false },
    { category: "SUV", icon: <Car />, count: 198, popular: true },
    { category: "Commercial", icon: <Car />, count: 89, popular: false },
    { category: "5 Doors", icon: <Car />, count: 201, popular: false },
    { category: "Low Priced Cars", icon: <Car />, count: 178, popular: true },
    { category: "Low Mileage Cars", icon: <CarFront />, count: 134, popular: false },
    { category: "Hybrid Cars", icon: <Car />, count: 92, popular: false },
    { category: "Diesel Cars", icon: <Car />, count: 145, popular: false },
    { category: "7 Seaters", icon: <Van />, count: 87, popular: false },
    { category: "Modified Cars", icon: <Wrench />, count: 34, popular: false },
    { category: "Vintage Models", icon: <Car />, count: 23, popular: false },
  ]

  const [filteredItems, setFilteredItems] = useState(allItems)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [columnCount, setColumnCount] = useState(getColumnCount())

  useEffect(() => {
    const updateCounts = () => {
      const cols = getColumnCount()
      setColumnCount(cols)
      setVisibleCount(cols * 2)
    }

    updateCounts()
    window.addEventListener("resize", updateCounts)
    return () => window.removeEventListener("resize", updateCounts)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setFilteredItems(allItems)
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const CategoryCard = ({ item }) => (
    <div className="relative flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 p-5 text-center shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 dark:hover:shadow-xl">
      {item.popular && (
        <div className="absolute top-2 right-2 h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
      )}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/50 dark:to-red-800/50">
        <div className="text-3xl text-gray-700 dark:text-red-400">{item.icon}</div>
      </div>
      <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        {item.category}
      </h4>
      <p className="text-xs text-gray-600 dark:text-gray-400">{item.count} available</p>
    </div>
  )

  return (
    <section className="relative mx-2 sm:mx-4 my-8 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-4 sm:px-8 py-10 shadow-xl">
      <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/20 dark:bg-blue-900/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-app-text dark:text-white md:text-4xl">
            Cars Categories
          </h2>
          <p className="mb-3 max-w-xl mx-auto text-sm text-app-text/80 dark:text-gray-300">
            Find the perfect vehicle from our curated collection
          </p>
          <div className="w-16 h-1.5 mx-auto rounded-full bg-red-600"></div>
        </div>

        <div className="mb-5 text-sm text-app-text dark:text-gray-300 text-center">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
              Loading categories...
            </span>
          ) : (
            `${filteredItems.length} categories available`
          )}
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.slice(0, visibleCount).map((item, index) => (
            <CategoryCard key={`${item.category}-${index}`} item={item} />
          ))}
        </div>

        {filteredItems.length > columnCount * 2 && (
          <div className="mt-8 text-center">
            <button
              onClick={() =>
                visibleCount >= filteredItems.length
                  ? setVisibleCount(columnCount * 2)
                  : setVisibleCount((prev) => prev + columnCount)
              }
              className="rounded-lg bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-medium text-white transition-colors duration-300"
            >
              {visibleCount >= filteredItems.length ? "See Less" : "See More"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default BrowseCars
