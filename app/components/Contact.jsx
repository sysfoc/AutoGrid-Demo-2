"use client"
import { Button, Label, Textarea, TextInput } from "flowbite-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [contactInfo, setContactInfo] = useState({
    heading: "Contact Us",
    content:
      "Have questions or want to work with us? Fill out the form below, and we'll get back to you as soon as possible.",
    address: "123 Main Street, City, State 12345",
    phone: "+1 (555) 123-4567",
   map: '<iframe class="custom-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093775!2d144.95373531520247!3d-37.81720974202198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5771f65c7df2a0!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1615187682734!5m2!1sen!2sau" allowfullscreen="" loading="lazy"></iframe>',
   email: "contact@yourcompany.com",
    workingHours: "Monday - Friday: 9:00 AM - 6:00 PM",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch contact page settings
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/settings/contactPage")
        const data = await response.json()

        if (data.success && data.contact) {
          setContactInfo(data.contact)
        }
      } catch (error) {
        console.error("Error fetching contact info:", error)
        toast.error("Failed to load contact information")
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      toast.info("Sending your message...")
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit contact message")
      }
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      const errorMessage = error.message || "Failed to submit contact message. Please try again."
      console.error("Contact form error:", error)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 mt-28 md:mt-32 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading contact information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 mt-28 md:mt-32 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800 dark:text-white">{contactInfo.heading}</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Get in Touch</h2>
            <div
              className="mb-6 text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: contactInfo.content }}
            />
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </Label>
                <TextInput
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <TextInput
                  type="email"
                  id="email"
                  placeholder="john@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows="4"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></Textarea>
              </div>
              <Button type="submit" color="blue" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    </span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">Contact Information</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              You can also reach us through the following contact methods.
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">{contactInfo.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">{contactInfo.address}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Working Hours</h3>
              <p className="text-gray-600 dark:text-gray-300">{contactInfo.workingHours}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Find Us Here</h2>
          <div className="overflow-hidden rounded-lg shadow-md">
            <div dangerouslySetInnerHTML={{ __html: contactInfo.map }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
