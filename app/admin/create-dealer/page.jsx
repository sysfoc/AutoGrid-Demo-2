"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserPlus,
  FaUserTag,
  FaMapMarkerAlt,
  FaPhone,
  FaFileAlt,
  FaBuilding,
  FaMap,
} from "react-icons/fa"; // Using react-icons/fa for consistency

export default function CreateDealer() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    licence: "",
    abn: "",
    map: "", // Optional field
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  // Fetch user role for access control
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data.user.role !== "superadmin") {
          router.replace("/admin/dashboard");
        } else {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        router.replace("/login"); // Example: redirect to login if role fetch fails
      }
    };
    fetchUserRole();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidGoogleMapsInput = (input) => {
    if (!input || input.trim() === "") return true;

    const trimmedInput = input.trim();

    if (
      trimmedInput.includes("<iframe") &&
      trimmedInput.includes("google.com/maps/embed")
    ) {
      return true;
    }

    const googleMapsPatterns = [
      /^https:\/\/maps\.google\.com\//,
      /^https:\/\/www\.google\.com\/maps\//,
      /^https:\/\/goo\.gl\/maps\//,
      /^https:\/\/maps\.app\.goo\.gl\//,
      /^https:\/\/google\.com\/maps\//,
      /^https:\/\/www\.google\.com\/maps\/embed/,
    ];

    return googleMapsPatterns.some((pattern) => pattern.test(trimmedInput));
  };

  const processMapInput = (input) => {
    if (!input || input.trim() === "") return "";

    const trimmedInput = input.trim();

    if (
      trimmedInput.includes("<iframe") &&
      trimmedInput.includes("google.com/maps/embed")
    ) {
      const srcMatch = trimmedInput.match(/src="([^"]*)"/);
      return srcMatch ? srcMatch[1] : "";
    }

    return trimmedInput;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Dealer name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    }
    if (!formData.licence.trim()) {
      newErrors.licence = "Licence number is required";
    }
    if (!formData.abn.trim()) {
      newErrors.abn = "ABN is required";
    }

    // Updated map validation
    if (formData.map && formData.map.trim() !== "") {
      if (!isValidGoogleMapsInput(formData.map)) {
        newErrors.map = "Please enter a valid Google Maps URL or embed code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      // Process the map input to extract URL if it's an iframe
      const processedFormData = {
        ...formData,
        map: processMapInput(formData.map),
      };

      const response = await fetch("/api/dealor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        const serverErrors = {};
        const errorMessage = data.error
          ? data.error.toLowerCase()
          : "An unknown error occurred.";

        if (errorMessage.includes("name")) serverErrors.name = data.error;
        else if (errorMessage.includes("address"))
          serverErrors.address = data.error;
        else if (errorMessage.includes("contact"))
          serverErrors.contact = data.error;
        else if (errorMessage.includes("licence"))
          serverErrors.licence = data.error;
        else if (errorMessage.includes("abn")) serverErrors.abn = data.error;
        else if (errorMessage.includes("map")) serverErrors.map = data.error;
        else serverErrors.general = data.error || "Failed to create dealer.";

        setErrors(serverErrors);
        return;
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        address: "",
        contact: "",
        licence: "",
        abn: "",
        map: "",
      });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: "Failed to connect to server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <span className="ml-3 font-medium text-slate-600">
              Loading Dealer...
            </span>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="flex min-h-screen bg-background-secondary">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-lg bg-background p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-text">
              Create New Dealer
            </h1>
            <p className="text-text-secondary">Add new dealership to the system</p>
          </div>
          {errors.general && (
            <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errors.general}</span>
            </div>
          )}
          {isSuccess && (
            <div className="relative mb-6 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Dealer created successfully.
              </span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name Field */}
              <div className="form-group md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUserTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="Dealer Name"
                  />
                </div>
                {errors.name && (
                  <div className="mt-1 text-sm text-red-500">{errors.name}</div>
                )}
              </div>

              {/* Address Field */}
              <div className="form-group md:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                {errors.address && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.address}
                  </div>
                )}
              </div>

              {/* Contact Field */}
              <div className="form-group">
                <label
                  htmlFor="contact"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Contact
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full border ${errors.contact ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="+1234567890"
                  />
                </div>
                {errors.contact && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.contact}
                  </div>
                )}
              </div>

              {/* Licence Field */}
              <div className="form-group">
                <label
                  htmlFor="licence"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Licence
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaFileAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="licence"
                    name="licence"
                    required
                    value={formData.licence}
                    onChange={handleChange}
                    className={`w-full border ${errors.licence ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="DL123456"
                  />
                </div>
                {errors.licence && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.licence}
                  </div>
                )}
              </div>

              {/* ABN Field */}
              <div className="form-group">
                <label
                  htmlFor="abn"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  ABN
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="abn"
                    name="abn"
                    required
                    value={formData.abn}
                    onChange={handleChange}
                    className={`w-full border ${errors.abn ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="12 345 678 901"
                  />
                </div>
                {errors.abn && (
                  <div className="mt-1 text-sm text-red-500">{errors.abn}</div>
                )}
              </div>

              {/* Map Field (Optional) */}

              {/* Map Field (Optional) */}
              <div className="form-group">
                <label
                  htmlFor="map"
                  className="mb-1 block text-sm font-medium text-text"
                >
                  Map (Optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-0 top-3 flex items-start pl-3">
                    <FaMap className="text-gray-400" />
                  </div>
                  <textarea
                    id="map"
                    name="map"
                    rows="3"
                    value={formData.map}
                    onChange={handleChange}
                    className={`w-full border ${errors.map ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary`}
                    placeholder="Enter Google Maps URL or paste iframe embed code..."
                  />
                </div>
                {errors.map && (
                  <div className="mt-1 text-sm text-red-500">{errors.map}</div>
                )}
                <div className="mt-1 text-xs text-text-secondary">
                  You can paste either a Google Maps URL or the full iframe
                  embed code
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-text-inverse transition duration-200 hover:bg-primary-hover disabled:opacity-50"
              >
                <FaUserPlus className="mr-2" />
                {isSubmitting ? "Creating..." : "Create Dealer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
