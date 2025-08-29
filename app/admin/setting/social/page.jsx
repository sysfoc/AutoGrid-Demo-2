"use client"
import { Button, Label, Select, TextInput, Radio, Textarea } from "flowbite-react" // Import Radio and Textarea
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { availableIconOptions } from "../../../lib/social-icons"

const SocialMediaForm = () => {
  const [formData, setFormData] = useState({ url: "", iconType: "react-icon", iconValue: "", order: 0 })
  const [list, setList] = useState([])
  const [selectedIconOption, setSelectedIconOption] = useState("") // Stores the selected predefined icon name
  const [iconSource, setIconSource] = useState("predefined") // 'predefined' or 'custom-svg'
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/socials")
      const json = await res.json()
      setList(json.data || [])
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to load social media settings. Please try again.",
        icon: "error",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchData()
      setLoading(false)
    }
    loadData()
  }, [])

  // Handle selection from dropdown or pre-filling form when an existing item is selected
  const handleIconSelect = (value) => {
    setSelectedIconOption(value)
    // Find existing entry based on iconType and iconValue
    const selected = list.find((item) => item.iconValue === value && item.iconType === "react-icon")

    if (selected) {
      setFormData({
        url: selected.url || "",
        iconType: selected.iconType,
        iconValue: selected.iconValue || "",
        order: selected.order || 0,
      })
      setIconSource(selected.iconType === "react-icon" ? "predefined" : "custom-svg")
    } else {
      // If a new predefined icon is selected, or no match found, reset URL and order
      setFormData({ url: "", iconType: "react-icon", iconValue: value || "", order: 0 })
      setIconSource("predefined")
    }
  }

  // Handle changes for custom SVG input
  const handleCustomSvgChange = (e) => {
    setFormData({ ...formData, iconType: "svg-code", iconValue: e.target.value })
  }

  // Handle source change (predefined vs custom SVG)
  const handleIconSourceChange = (source) => {
    setIconSource(source)
    if (source === "predefined") {
      setFormData({ ...formData, iconType: "react-icon", iconValue: selectedIconOption || "" })
    } else {
      setFormData({ ...formData, iconType: "svg-code", iconValue: "" }) // Clear iconValue for custom SVG
      setSelectedIconOption("") // Clear predefined selection
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.message) {
        Swal.fire({
          title: "Success!",
          text: "Social media settings saved successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        // Reset form after successful save
        setFormData({ url: "", iconType: "react-icon", iconValue: "", order: 0 })
        setSelectedIconOption("")
        setIconSource("predefined")
        await fetchData() // Re-fetch data to update the list
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save social media settings. Please try again.",
        icon: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading social media settings...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-600 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Social Media Settings</h1>
            <p className="text-gray-600">Manage your social media links and display order</p>
          </div>
        </div>
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 mb-2">Choose Icon Source</Label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Radio
                  id="predefined-icon"
                  name="iconSource"
                  value="predefined"
                  checked={iconSource === "predefined"}
                  onChange={() => handleIconSourceChange("predefined")}
                />
                <Label htmlFor="predefined-icon">Predefined Icon</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="custom-svg-icon"
                  name="iconSource"
                  value="custom-svg"
                  checked={iconSource === "custom-svg"}
                  onChange={() => handleIconSourceChange("custom-svg")}
                />
                <Label htmlFor="custom-svg-icon">Custom SVG Code</Label>
              </div>
            </div>
          </div>

          {iconSource === "predefined" && (
            <div className="mb-6">
              <Label htmlFor="selectIcon" className="block text-sm font-medium text-gray-700 mb-2">
                Select Predefined Icon
              </Label>
              <Select
                id="selectIcon"
                value={selectedIconOption}
                onChange={(e) => handleIconSelect(e.target.value)}
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Select a Platform --</option>
                {availableIconOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.displayName}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-gray-500 mt-1">Choose from a list of pre-installed social media icons.</p>
            </div>
          )}

          {iconSource === "custom-svg" && (
            <div className="mb-6">
              <Label htmlFor="customSvgCode" className="block text-sm font-medium text-gray-700 mb-2">
                Custom SVG Icon Code
              </Label>
              <Textarea
                id="customSvgCode"
                value={formData.iconValue}
                onChange={handleCustomSvgChange}
                placeholder={`<svg viewBox="0 0 24 24" fill="currentColor" ...>...</svg>`}
                rows={5}
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Paste the full SVG code for your custom icon. Ensure it&apos;s from a trusted source to avoid security
                risks.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media URL
              </Label>
              <TextInput
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">Enter the URL of your social media page</p>
            </div>
            <div>
              <Label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </Label>
              <TextInput
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">Enter a number to set the display order</p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                disabled={isSaving}
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
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaForm
