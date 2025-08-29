"use client"

import { useState, useEffect, useId } from "react"
import { useRouter } from "next/navigation"
import { FaSearch } from "react-icons/fa"

const CarSearchHorizontal = () => {
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [location, setLocation] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [jsonData, setJsonData] = useState(null)
  const router = useRouter()
  const idPrefix = useId()

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/Vehicle make and model data (2).json")
        const data = await response.json()
        setJsonData(data.Sheet1)
        // Extract unique makes
        const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))]
        setMakes(uniqueMakes)
      } catch (error) {
        console.error("Error loading vehicle data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJsonData()
  }, [])

  useEffect(() => {
    if (selectedMake && jsonData) {
      const makeData = jsonData.find((item) => item.Maker === selectedMake)
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "].split(",").map((model) => model.trim())
        setModels(modelArray)
      } else {
        setModels([])
      }
      setSelectedModel("")
    }
  }, [selectedMake, jsonData])

  const handleSearch = async () => {
    if (!selectedMake && !maxPrice && !location) {
      alert("Please select at least one search criterion.")
      return
    }

    setSearchLoading(true)
    try {
      const queryParams = []
      
      if (selectedMake) {
        queryParams.push(`make=${encodeURIComponent(selectedMake)}`)
      }
      if (selectedModel) {
        queryParams.push(`model=${encodeURIComponent(selectedModel)}`)
      }
      if (maxPrice) {
        queryParams.push(`maxPrice=${maxPrice}`)
      }
      if (location) {
        queryParams.push(`location=${encodeURIComponent(location)}`)
      }
      if (selectedCondition !== "all") {
        queryParams.push(`condition=${encodeURIComponent(selectedCondition)}`)
      }

      const queryString = queryParams.join("&")
      router.push(`/car-for-sale?${queryString}`)
    } catch (error) {
      console.error("Error searching cars:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSearchLoading(false)
    }
  }

  const ConditionTab = ({ condition, label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
        selected
          ? "text-[#DC3C22] border-[#DC3C22] bg-white"
          : "text-gray-600 border-transparent hover:text-[#DC3C22] hover:border-[#DC3C22]/30 bg-gray-50"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="w-full relative -top-32 max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Condition Tabs */}
      <div className="flex justify-center border-b border-gray-200 bg-gray-50">
        <ConditionTab
          condition="all"
          label="All Condition"
          selected={selectedCondition === "all"}
          onClick={() => setSelectedCondition("all")}
        />
        <ConditionTab
          condition="new"
          label="New"
          selected={selectedCondition === "new"}
          onClick={() => setSelectedCondition("new")}
        />
        <ConditionTab
          condition="used"
          label="Used"
          selected={selectedCondition === "used"}
          onClick={() => setSelectedCondition("used")}
        />
      </div>

      {/* Search Form */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Make Selection */}
          <div className="space-y-2">
            <label htmlFor={`${idPrefix}-make`} className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <div className="relative">
              <select
                id={`${idPrefix}-make`}
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#DC3C22] focus:border-[#DC3C22] transition-colors duration-200"
                disabled={loading}
              >
                <option value="">Select Make</option>
                {makes.map((make, index) => (
                  <option key={index} value={make}>
                    {make}
                  </option>
                ))}
              </select>
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#DC3C22] border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label htmlFor={`${idPrefix}-model`} className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <select
              id={`${idPrefix}-model`}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#DC3C22] focus:border-[#DC3C22] transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedMake || loading}
            >
              <option value="">Select Model</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Input */}
          <div className="space-y-2">
            <label htmlFor={`${idPrefix}-price`} className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              id={`${idPrefix}-price`}
              type="number"
              placeholder="Enter max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#DC3C22] focus:border-[#DC3C22] transition-colors duration-200"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label htmlFor={`${idPrefix}-location`} className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id={`${idPrefix}-location`}
              type="text"
              placeholder="Enter a location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#DC3C22] focus:border-[#DC3C22] transition-colors duration-200"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="w-full px-6 py-3 bg-[#DC3C22] text-white font-medium rounded-md hover:bg-[#DC3C22]/90 focus:ring-2 focus:ring-[#DC3C22] focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {searchLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarSearchHorizontal