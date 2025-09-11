"use client"
import { useState, useEffect } from "react"
import ChooseUs from "./ChooseUs"
import { TextInput } from "flowbite-react"
import { AiOutlineDollar } from "react-icons/ai"
import { MdSell } from "react-icons/md"
import { FaExchangeAlt, FaShieldAlt, FaClock } from "react-icons/fa"
import Swal from "sweetalert2"

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    make: "",
    model: "",
    valuationType: "",
  })
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [jsonData, setJsonData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/Vehicle make and model data (2).json")
        const data = await response.json()
        setJsonData(data.Sheet1)
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
    if (selectedMake && jsonData.length > 0) {
      const makeData = jsonData.find((item) => item.Maker === selectedMake)
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "].split(",").map((model) => model.trim())
        setModels(modelArray)
      } else {
        setModels([])
      }
      setSelectedModel("")
      setFormData((prev) => ({
        ...prev,
        make: selectedMake,
        model: "",
      }))
    }
  }, [selectedMake, jsonData])

  useEffect(() => {
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        model: selectedModel,
      }))
    }
  }, [selectedModel])

  const handleValuationType = (type) => {
    setFormData((prev) => ({ ...prev, valuationType: type }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.make || !formData.model || !formData.valuationType) {
      Swal.fire("Validation Error", "Please complete all required fields.", "warning")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        Swal.fire("Success", "Valuation request submitted successfully! We will get back to you soon.", "success")
        setFormData({
          name: "",
          email: "",
          make: "",
          model: "",
          valuationType: "",
        })
        setSelectedMake("")
        setSelectedModel("")
        setModels([])
      } else {
        throw new Error(data.error || "Failed to submit valuation request")
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong!", "error")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <>
    <section 
      className="relative min-h-screen w-full overflow-hidden mt-16"
      aria-labelledby="valuation-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat custom-bg"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-app-text/90 via-app-text/85 to-app-button/90" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 mt-14 text-center">
              <h1 id="valuation-heading" className="mb-3 text-3xl font-bold leading-tight text-white md:text-4xl">
                Get Your Cars
                <span className="bg-gradient-to-r from-app-button to-app-button-hover bg-clip-text text-transparent">
                  True Value
                </span>
              </h1>
            </div>
            <div className="mx-auto max-w-xl">
              <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-xl font-bold text-app-text dark:text-white">Free Car Valuation</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">What type of valuation do you need?</p>
                </div>
                <div className="mb-6">
                  <fieldset>
                    <legend className="sr-only">Select valuation type</legend>
                    <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Valuation type options">
                      <button
                        type="button"
                        onClick={() => handleValuationType("Selling")}
                        className={`flex items-center rounded-xl border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-button/50 ${
                          formData.valuationType === "Selling"
                            ? "border-app-button bg-app-button text-white shadow-md"
                            : "border-gray-200 bg-white text-app-text hover:border-app-button-hover dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                        role="radio"
                        aria-checked={formData.valuationType === "Selling"}
                        aria-label="I'm selling my car - select this for selling valuation"
                      >
                        <AiOutlineDollar className="mr-2 text-lg" aria-hidden="true" />
                        I&apos;m Selling
                      </button>
                      <button
                        type="button"
                        onClick={() => handleValuationType("Buying")}
                        className={`flex items-center rounded-xl border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-button/50 ${
                          formData.valuationType === "Buying"
                            ? "border-app-button bg-app-button text-white shadow-md"
                            : "border-gray-200 bg-white text-app-text hover:border-app-button-hover dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                        role="radio"
                        aria-checked={formData.valuationType === "Buying"}
                        aria-label="I'm buying a car - select this for buying valuation"
                      >
                        <MdSell className="mr-2 text-lg" aria-hidden="true" />
                        I&apos;m Buying
                      </button>
                      <button
                        type="button"
                        onClick={() => handleValuationType("Trading")}
                        className={`flex items-center rounded-xl border px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-button/50 ${
                          formData.valuationType === "Trading"
                            ? "border-app-button bg-app-button text-white shadow-md"
                            : "border-gray-200 bg-white text-app-text hover:border-app-button-hover dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                        role="radio"
                        aria-checked={formData.valuationType === "Trading"}
                        aria-label="I'm trading my car - select this for trading valuation"
                      >
                        <FaExchangeAlt className="mr-2 text-lg" aria-hidden="true" />
                        I&apos;m Trading
                      </button>
                    </div>
                  </fieldset>
                </div>
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  aria-label="Car valuation form"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-app-text dark:text-gray-300"
                    >
                      Full Name *
                    </label>
                    <TextInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      required
                      aria-describedby="name-error"
                      aria-invalid={!formData.name && isSubmitting ? 'true' : 'false'}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-app-text dark:text-gray-300"
                    >
                      Email Address *
                    </label>
                    <TextInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                      aria-describedby="email-error"
                      aria-invalid={!formData.email && isSubmitting ? 'true' : 'false'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="make"
                        className="mb-2 block text-sm font-semibold text-app-text dark:text-gray-300"
                      >
                        Make *
                      </label>
                      <div className="relative">
                        <select
                          value={selectedMake}
                          name="make"
                          id="make"
                          onChange={(e) => setSelectedMake(e.target.value)}
                          aria-label="Select car make"
                          autoComplete="off"
                          className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-app-text transition-all duration-200 hover:border-app-button-hover focus:border-app-button focus:ring-2 focus:ring-app-button/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-app-button-hover dark:focus:border-app-button dark:focus:ring-app-button/20"
                          disabled={loading}
                          required
                          aria-describedby="make-error"
                          aria-invalid={!selectedMake && isSubmitting ? 'true' : 'false'}
                        >
                          <option value="">Select Make</option>
                          {makes.map((make, index) => (
                            <option key={index} value={make}>
                              {make}
                            </option>
                          ))}
                        </select>
                        {loading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                            <div 
                              className="h-4 w-4 animate-spin rounded-full border-2 border-app-button border-t-transparent"
                              role="status"
                              aria-label="Loading car makes"
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="model"
                        className="mb-2 block text-sm font-semibold text-app-text dark:text-gray-300"
                      >
                        Model *
                      </label>
                      <div className="relative">
                        <select
                          value={selectedModel}
                          aria-label="Select car model"
                          name="model"
                          id="model"
                          autoComplete="off"
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-app-text transition-all duration-200 hover:border-app-button-hover focus:border-app-button focus:ring-2 focus:ring-app-button/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-app-button-hover dark:focus:border-app-button dark:focus:ring-app-button/20"
                          disabled={!selectedMake || loading}
                          required
                          aria-describedby="model-error model-help"
                          aria-invalid={!selectedModel && isSubmitting ? 'true' : 'false'}
                        >
                          <option value="">Select Model</option>
                          {models.map((model, index) => (
                            <option key={index} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                        <div id="model-help" className="sr-only">
                          {!selectedMake ? "Please select a make first" : "Choose your car model"}
                        </div>
                        {loading && selectedMake && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                            <div 
                              className="h-4 w-4 animate-spin rounded-full border-2 border-app-button border-t-transparent"
                              role="status"
                              aria-label="Loading car models"
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-gradient-to-r from-app-button to-app-button-hover px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-app-button-hover hover:to-app-button hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-app-button/30"
                      aria-describedby="submit-help"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">
                            <svg
                              className="inline h-5 w-5 animate-spin text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              role="status"
                              aria-label="Submitting form"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </span>
                          <span aria-live="polite">Submitting...</span>
                        </>
                      ) : (
                        "Get My Valuation"
                      )}
                    </button>
                    <div id="submit-help" className="sr-only">
                      Submit the form to receive your free car valuation
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div 
                      className="flex justify-center space-x-6 text-center text-sm text-gray-600 dark:text-gray-300"
                      role="list"
                      aria-label="Service benefits"
                    >
                      <span className="flex items-center" role="listitem">
                        <FaClock className="mr-1 text-app-button" aria-hidden="true" />
                        Quick
                      </span>
                      <span className="flex items-center" role="listitem">
                        <AiOutlineDollar className="mr-1 text-green-500" aria-hidden="true" />
                        Free
                      </span>
                      <span className="flex items-center" role="listitem">
                        <FaShieldAlt className="mr-1 text-app-button-hover" aria-hidden="true" />
                        No Obligation
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <ChooseUs />
  </>
)
}