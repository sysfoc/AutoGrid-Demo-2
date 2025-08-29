"use client"
import { useEffect, useState, Suspense } from "react"
import { Button, Label, Select, TextInput } from "flowbite-react"
import dynamic from "next/dynamic"
import Swal from "sweetalert2"

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

const PageEditor = () => {
  const [type, setType] = useState("about")
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    metaTitle: "", // Added metaTitle
    metaDescription: "", // Added metaDescription
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 500,
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/pages?type=${type}`, { next: { revalidate: 3600 } })
        const result = await res.json()
        if (result?.data) {
          setFormData({
            name: result.data.name || "",
            content: result.data.content || "",
            metaTitle: result.data.metaTitle || "", // Populate metaTitle
            metaDescription: result.data.metaDescription || "", // Populate metaDescription
          })
        } else {
          setFormData({ name: "", content: "", metaTitle: "", metaDescription: "" })
        }
      } catch (error) {
        console.error("Fetch error:", error)
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch page data. Please try again.",
          icon: "error",
        })
        setFormData({ name: "", content: "", metaTitle: "", metaDescription: "" })
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
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })
      const data = await res.json()
      if (data.message) {
        Swal.fire({
          title: "Success!",
          text: "Page saved successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        throw new Error(data.error || "Failed to save")
      }
    } catch (error) {
      console.error("Submit error:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to save page. Please try again.",
        icon: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Static Pages Manager</h1>
            <p className="text-gray-600">Edit and update content for your website static pages</p>
          </div>
        </div>
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Select Page
              </Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
              >
                <option value="about">About Us</option>
                <option value="privacy">Privacy Policy</option>
                <option value="terms">Terms & Conditions</option>
              </Select>
              <p className="text-sm text-gray-500 mt-1">Choose the page you want to edit</p>
            </div>
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Page Name
              </Label>
              <TextInput
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter page name"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
                required
              />
              <p className="text-sm text-gray-500 mt-1">The title or name of the page</p>
            </div>
            {/* New: Meta Title Input */}
            <div>
              <Label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </Label>
              <TextInput
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Enter meta title for SEO"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                The title that appears in search engine results and browser tabs.
              </p>
            </div>
            {/* New: Meta Description Input */}
            <div>
              <Label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </Label>
              <TextInput
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Enter meta description for SEO"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">A brief summary of the page content for search engines.</p>
            </div>
            <div>
              <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Page Content
              </Label>
              {isLoading ? (
                <div className="h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Loading editor...</p>
                </div>
              ) : (
                <Suspense fallback={<p className="text-gray-500">Loading editor...</p>}>
                  <LazyJoditEditor
                    config={config}
                    value={formData.content}
                    onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
                    onChange={() => {}}
                  />
                </Suspense>
              )}
              <p className="text-sm text-gray-500 mt-1">Enter the main content for the selected page</p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                disabled={isSaving || isLoading}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

export default PageEditor
