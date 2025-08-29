"use client"
import { useEffect, useState, Suspense } from "react"
import { Button, Label, Textarea, TextInput } from "flowbite-react"
import dynamic from "next/dynamic"
import Swal from "sweetalert2"

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

const ContactPageModal = () => {
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    email: "",
    workingHours: "",
    address: "",
    phone: "",
    map: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/settings/contactPage")
        const data = await res.json()
        if (data.success && data.contact) {
          setFormData(data.contact)
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch contact data. Please try again.",
          icon: "error",
        })
      }
    }
    fetchContact()
  }, [])

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 500,
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/settings/contactPage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Contact information saved successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        throw new Error(data.error || "Failed to save")
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save contact information. Please try again.",
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Page Settings</h1>
            <p className="text-gray-600">Manage and update your contact page details</p>
          </div>
        </div>
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-2">
                Heading
              </Label>
              <TextInput
                id="heading"
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="Enter contact page heading"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be displayed as the main heading on the contact page
              </p>
            </div>
            <div>
              <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </Label>
              <Suspense fallback={<p className="text-gray-500">Loading editor...</p>}>
                <LazyJoditEditor
                  config={config}
                  value={formData.content}
                  onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
                  onChange={() => {}}
                />
              </Suspense>
              <p className="text-sm text-gray-500 mt-1">Enter the main content for the contact page</p>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Label>
              <TextInput
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter contact email"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">The contact email address</p>
            </div>
            <div>
              <Label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </Label>
              <TextInput
                id="workingHours"
                value={formData.workingHours}
                onChange={handleInputChange}
                placeholder="Enter working hours"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">The business working hours</p>
            </div>
            <div>
              <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </Label>
              <TextInput
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter contact address"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">The physical address for contact</p>
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Label>
              <TextInput
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-1">The contact phone number</p>
            </div>
            <div>
              <Label htmlFor="map" className="block text-sm font-medium text-gray-700 mb-2">
                Map (iFrame Code)
              </Label>
              <Textarea
                id="map"
                rows={5}
                value={formData.map}
                onChange={handleInputChange}
               placeholder='<iframe class="custom-map-placeholder" src="https://www.google.com/maps/embed?pb=..." width="600" height="450" allowfullscreen></iframe>'
               className="rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">Paste your Google Maps iframe code to display your location</p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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
                  "Save Contact Info"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPageModal
