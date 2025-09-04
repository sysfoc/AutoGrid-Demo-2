"use client"
import { useEffect, useState } from "react"
import { Button, Label, Select, TextInput } from "flowbite-react"
import Swal from "sweetalert2"

const MetaEditor = () => {
  const [type, setType] = useState("car-valuation")
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/meta-pages?type=${type}`, { cache: "no-store" })
        const result = await res.json()

        if (result?.data) {
          setFormData({
            metaTitle: result.data.metaTitle || "",
            metaDescription: result.data.metaDescription || "",
          })
        } else {
          setFormData({ metaTitle: "", metaDescription: "" })
        }
      } catch (error) {
        console.error("Meta Fetch error:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch meta data. Please try again.",
          icon: "error",
        })
        setFormData({ metaTitle: "", metaDescription: "" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const submitData = { type, ...formData }
      const res = await fetch("/api/meta-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })
      const data = await res.json()
      if (data.message) {
        Swal.fire({
          title: "Success!",
          text: "Meta data saved successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        throw new Error(data.error || "Failed to save meta data")
      }
    } catch (error) {
      console.error("Meta Submit error:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to save meta data. Please try again.",
        icon: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-background rounded-xl shadow-lg border border-background-secondary p-6">
            <h1 className="text-3xl font-bold text-text mb-2">SEO Meta Data Manager</h1>
            <p className="text-text-secondary">
              Manage meta titles and descriptions for specific pages like Car Valuation, Brands, Blog, Contact, and Car Financing.
            </p>
          </div>
        </div>
        {/* Form Section */}
        <div className="bg-background rounded-xl shadow-lg border border-background-secondary p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="type" className="block text-sm font-medium text-text mb-2">
                Select Page
              </Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border-background-secondary focus:border-primary focus:ring-primary"
                disabled={isLoading}
              >
                <option value="car-valuation">Car Valuation</option>
                {/* <option value="brands">Brands</option> */}
                <option value="blog">Blog</option>
                <option value="contact">Contact</option>
                <option value="leasing">Leasing</option>
                <option value="car-for-sale">Cars For Sale</option>
                <option value="about-us">Vehicle Services</option>
                <option value="car-financing">Car Financing</option>
              </Select>
              <p className="text-sm text-text-secondary mt-1">Choose the page to edit its SEO meta data</p>
            </div>
            <div>
              <Label htmlFor="metaTitle" className="block text-sm font-medium text-text mb-2">
                Meta Title
              </Label>
              <TextInput
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Enter meta title for SEO"
                className="rounded-lg border-background-secondary focus:border-primary focus:ring-primary"
                disabled={isLoading}
                required
              />
              <p className="text-sm text-text-secondary mt-1">
                The title that appears in search engine results and browser tabs.
              </p>
            </div>
            <div>
              <Label htmlFor="metaDescription" className="block text-sm font-medium text-text mb-2">
                Meta Description
              </Label>
              <TextInput
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Enter meta description for SEO"
                className="rounded-lg border-background-secondary focus:border-primary focus:ring-primary"
                disabled={isLoading}
                required
              />
              <p className="text-sm text-text-secondary mt-1">A brief summary of the page content for search engines.</p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-text-inverse"
                disabled={isSaving || isLoading}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-text-inverse"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Saving...
                  </>
                ) : (
                  "Save Updates"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MetaEditor