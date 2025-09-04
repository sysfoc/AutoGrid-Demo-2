"use client"
import { useState, useEffect } from "react"
import { FaEnvelope, FaLock, FaUserTag, FaKey, FaUserPlus, FaChevronDown, FaRandom, FaInfoCircle } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function CreateUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    pin: "",
  })
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [userRole, setUserRole] = useState("")

  useEffect(() => generateRandomPin(), [])

  const generateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString()
    setFormData((prev) => ({ ...prev, pin: randomPin }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pin" ? value.replace(/\D/g, "") : value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!formData.role) {
      newErrors.role = "Please select a role"
    }
    if (!/^\d{4,6}$/.test(formData.pin)) {
      newErrors.pin = "PIN must be 4-6 digits"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const submitData = JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        pin: formData.pin,
      })

      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: submitData,
      })

      const data = await response.json()

      if (!response.ok) {
        const serverErrors = {}
        const errorMessage = data.error.toLowerCase()

        if (errorMessage.includes("email")) serverErrors.email = data.error
        else if (errorMessage.includes("password")) serverErrors.password = data.error
        else if (errorMessage.includes("role")) serverErrors.role = data.error
        else if (errorMessage.includes("pin")) serverErrors.pin = data.error
        else serverErrors.general = data.error
        setErrors(serverErrors)
        return
      }

      setIsSuccess(true)
      setFormData({ email: "", password: "", role: "", pin: "" })
      generateRandomPin()

      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      setErrors({ general: "Failed to connect to server. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      const res = await fetch("/api/users/me")
      const data = await res.json()

      if (data.user.role !== "superadmin") {
        router.replace("/admin/dashboard")
      } else {
        setUserRole(data.user.role)
      }
    }
    fetchUserRole()
  }, [router])

  if (!userRole) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background-secondary">
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="bg-background rounded-lg p-8 shadow-lg w-full max-w-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Create New User</h1>
        <p className="text-text-secondary">Add new users to the dealership management system</p>
      </div>
      {errors.general && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errors.general}</span>
        </div>
      )}

      {isSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> User created successfully.</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field - Full Width */}
          <div className="form-group md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                placeholder="user@example.com"
              />
            </div>
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          {/* Password Field - Full Width */}
          <div className="form-group md:col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>

          {/* Role Selection - Left Column */}
          <div className="form-group">
            <label htmlFor="role" className="block text-sm font-medium text-text mb-1">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserTag className="text-gray-400" />
              </div>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className={`w-full border ${errors.role ? "border-red-500" : "border-gray-300"} rounded-md pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-background`}
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="superadmin">Super Admin</option>
                <option value="user">User</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaChevronDown className="text-gray-400" />
              </div>
            </div>
            {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
          </div>

          {/* PIN Input - Right Column */}
          <div className="form-group">
            <label htmlFor="pin" className="block text-sm font-medium text-text mb-1">
              PIN (For Internal Use)
              <span className="inline-block ml-1 text-text-secondary">
                <FaInfoCircle size={14} title="This PIN is auto-generated" />
              </span>
            </label>
            <div className="relative flex group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input
                type="text"
                id="pin"
                name="pin"
                required
                value={formData.pin}
                onChange={handleChange}
                className={`w-full border ${errors.pin ? "border-red-500" : "border-gray-300"} rounded-l-md pl-10 pr-3 py-3 focus:outline-none focus:ring-inset focus:ring-1 focus:ring-primary`}
                placeholder="Auto-generated PIN"
                maxLength={6}
              />
              <button
                type="button"
                onClick={generateRandomPin}
                className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r-md border-y border-r border-gray-300 flex items-center justify-center focus:outline-none"
                title="Generate new PIN"
              >
                <FaRandom className="text-gray-600" />
              </button>
            </div>
            {errors.pin && <div className="text-red-500 text-sm mt-1">{errors.pin}</div>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-text-inverse py-3 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <FaUserPlus className="mr-2" />
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  )
}

export const dynamic = "force-dynamic"
