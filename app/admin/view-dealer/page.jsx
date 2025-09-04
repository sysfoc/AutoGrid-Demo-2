"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaUserTag,
  FaMapMarkerAlt,
  FaPhone,
  FaFileAlt,
  FaBuilding,
  FaMap,
  FaSave,
  FaTimes,
  FaUsers,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function ViewDealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDealer, setEditingDealer] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
        router.replace("/login");
      }
    };
    fetchUserRole();
  }, [router]);

  // Fetch dealers
  useEffect(() => {
    if (userRole) {
      fetchDealers();
    }
  }, [userRole]);

  const fetchDealers = async () => {
    try {
      const response = await fetch("/api/dealor");
      const data = await response.json();
      setDealers(data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertEmbedToRegularUrl = (embedUrl) => {
    if (!embedUrl) return null;

    try {
      // If it's already a regular maps URL, return as-is
      if (
        embedUrl.includes("/maps/place/") ||
        embedUrl.includes("/maps/dir/") ||
        embedUrl.includes("/maps/@")
      ) {
        return embedUrl;
      }

      // If it's an embed URL, convert it
      if (embedUrl.includes("/maps/embed")) {
        // Extract the pb parameter which contains the location data
        const pbMatch = embedUrl.match(/pb=([^&]+)/);
        if (pbMatch) {
          // Create a regular Google Maps URL with the same location data
          return `https://www.google.com/maps?pb=${pbMatch[1]}`;
        }

        // Fallback: try to extract coordinates if pb parameter fails
        const coordMatch = embedUrl.match(/!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
        if (coordMatch) {
          const lng = coordMatch[1];
          const lat = coordMatch[2];
          return `https://www.google.com/maps/@${lat},${lng},15z`;
        }
      }

      return embedUrl; // Return original if no conversion possible
    } catch (error) {
      console.error("Error converting embed URL:", error);
      return embedUrl;
    }
  };

  const isValidGoogleMapsUrl = (url) => {
    if (!url || url.trim() === "") return true;
    const googleMapsPatterns = [
      /^https:\/\/maps\.google\.com\//,
      /^https:\/\/www\.google\.com\/maps\//,
      /^https:\/\/goo\.gl\/maps\//,
      /^https:\/\/maps\.app\.goo\.gl\//,
      /^https:\/\/google\.com\/maps\//,
      /^https:\/\/www\.google\.com\/maps\/embed/,
    ];

    return googleMapsPatterns.some((pattern) => pattern.test(url.trim()));
  };

  const handleEdit = (dealer) => {
    setEditingDealer(dealer);
    setEditFormData({
      name: dealer.name,
      address: dealer.address,
      contact: dealer.contact,
      licence: dealer.licence,
      abn: dealer.abn,
      map: dealer.map || "",
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingDealer(null);
    setEditFormData({});
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear map error when user starts typing
    if (name === "map" && errors.map) {
      setErrors((prev) => ({
        ...prev,
        map: "",
      }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name?.trim()) {
      newErrors.name = "Dealer name is required";
    }
    if (!editFormData.address?.trim()) {
      newErrors.address = "Address is required";
    }
    if (!editFormData.contact?.trim()) {
      newErrors.contact = "Contact number is required";
    }
    if (!editFormData.licence?.trim()) {
      newErrors.licence = "Licence number is required";
    }
    if (!editFormData.abn?.trim()) {
      newErrors.abn = "ABN is required";
    }

    // Validate Google Maps URL
    if (editFormData.map && editFormData.map.trim() !== "") {
      if (!isValidGoogleMapsUrl(editFormData.map)) {
        newErrors.map = "Please enter a valid Google Maps URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dealor/${editingDealer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        await fetchDealers();
        setEditingDealer(null);
        setEditFormData({});
        setErrors({});
      } else {
        const data = await response.json();
        setErrors({ general: data.error || "Failed to update dealer" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (dealerId) => {
    try {
      const response = await fetch(`/api/dealor/${dealerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchDealers();
        setDeleteConfirm(null);
      } else {
        console.error("Failed to delete dealer");
      }
    } catch (error) {
      console.error("Error deleting dealer:", error);
    }
  };

  if (!userRole || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading Dealers...</span>
          </div>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-background-secondary via-primary-light to-primary-light p-8">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header Section - Made Compact */}
        <div className="bg-background rounded-xl shadow-lg border border-background-secondary overflow-hidden">
  <div className="bg-primary text-white px-4 sm:px-6 py-4">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
      <div className="flex items-center space-x-3 flex-1">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
          <FaUsers className="text-base sm:text-lg text-text-inverse" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-text-inverse">Dealer Management</h1>
          <p className="text-text-inverse/80 text-xs">Manage dealership records</p>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 self-start sm:self-auto">
        <div className="text-text-inverse/80 text-xs">Total</div>
        <div className="text-base sm:text-lg font-bold text-text-inverse">{dealers.length}</div>
      </div>
    </div>
  </div>
</div>

        {/* Error Display */}
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-primary rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-text-inverse text-xs font-bold">!</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-text font-semibold">Error Occurred</div>
                <div className="text-text/80 mt-1">{errors.general}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-background rounded-xl shadow-lg border border-background-secondary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-background-secondary to-background-secondary border-b border-background-secondary">
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaUserTag className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Dealer Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Address</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaPhone className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Contact</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaFileAlt className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Licence</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaBuilding className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">ABN</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaMap className="text-text-secondary text-sm" />
                      <span className="text-xs font-semibold text-text uppercase tracking-wider">Map</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-text uppercase tracking-wider">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-secondary">
                {dealers.map((dealer, index) => (
                  <tr
                    key={dealer._id}
                    className={`hover:bg-background-secondary/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-background" : "bg-background-secondary/25"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-text to-text rounded-lg flex items-center justify-center text-text-inverse font-bold text-xs">
                          {dealer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-text text-sm">{dealer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text/80 text-sm leading-relaxed max-w-xs">{dealer.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-background-secondary rounded-md px-2 py-1 inline-block">
                        <div className="text-text font-medium text-sm">{dealer.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-blue-50 text-blue-700 rounded-md px-2 py-1 inline-block">
                        <div className="font-medium text-sm">{dealer.licence}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-primary-light text-primary rounded-md px-2 py-1 inline-block">
                        <div className="font-medium text-sm">{dealer.abn}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dealer.map && isValidGoogleMapsUrl(dealer.map) ? (
                        <a
                          href={dealer.map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <FaEye className="text-xs" />
                          <span>View Map</span>
                        </a>
                      ) : dealer.map ? (
                        <div className="inline-flex items-center space-x-1 bg-red-50 text-primary px-3 py-1 rounded-md text-sm font-medium">
                          <FaExclamationTriangle className="text-xs" />
                          <span>Invalid URL</span>
                        </div>
                      ) : (
                        <div className="text-text-secondary text-sm italic">No map</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(dealer)}
                          className="bg-gradient-to-r from-text to-text hover:from-text/80 hover:to-text/80 text-text-inverse px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <FaEdit className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(dealer._id)}
                          className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-red-700 text-text-inverse px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <FaTrash className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dealers.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-text-secondary" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-text">No dealers found</div>
                <div className="text-text/60 text-sm">There are currently no dealers in the system.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Edit Modal */}
      {editingDealer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-text to-text px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FaEdit className="text-text-inverse text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-inverse">Edit Dealer</h3>
                    <p className="text-text-inverse/80 text-sm">Update dealer information</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-text-inverse/80 hover:text-text-inverse transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dealer Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-text">
                    <FaUserTag className="inline mr-2 text-text-secondary" />
                    Dealer Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.name ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200`}
                    placeholder="Enter dealer name"
                  />
                  {errors.name && <div className="text-primary text-xs font-medium">{errors.name}</div>}
                </div>

                {/* Contact */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-text">
                    <FaPhone className="inline mr-2 text-text-secondary" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={editFormData.contact}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.contact ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200`}
                    placeholder="Enter contact number"
                  />
                  {errors.contact && <div className="text-primary text-xs font-medium">{errors.contact}</div>}
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-text">
                    <FaMapMarkerAlt className="inline mr-2 text-text-secondary" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    rows="2"
                    className={`w-full border-2 ${errors.address ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200 resize-none`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <div className="text-primary text-xs font-medium">{errors.address}</div>}
                </div>

                {/* Licence */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-text">
                    <FaFileAlt className="inline mr-2 text-text-secondary" />
                    Licence Number
                  </label>
                  <input
                    type="text"
                    name="licence"
                    value={editFormData.licence}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.licence ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200`}
                    placeholder="Enter licence number"
                  />
                  {errors.licence && <div className="text-primary text-xs font-medium">{errors.licence}</div>}
                </div>

                {/* ABN */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-text">
                    <FaBuilding className="inline mr-2 text-text-secondary" />
                    ABN
                  </label>
                  <input
                    type="text"
                    name="abn"
                    value={editFormData.abn}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.abn ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200`}
                    placeholder="Enter ABN"
                  />
                  {errors.abn && <div className="text-primary text-xs font-medium">{errors.abn}</div>}
                </div>

                {/* Map Link */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-text">
                    <FaMap className="inline mr-2 text-text-secondary" />
                    Google Maps URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="map"
                    value={editFormData.map}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.map ? "border-primary bg-red-50" : "border-background-secondary bg-background"} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-all duration-200`}
                    placeholder="https://maps.google.com/..."
                  />
                  {errors.map && <div className="text-primary text-xs font-medium">{errors.map}</div>}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-background-secondary">
                <button
                  onClick={handleCancelEdit}
                  className="bg-background-secondary hover:bg-background-secondary/80 text-text px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-text to-text hover:from-text/80 hover:to-text/80 text-text-inverse px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FaSave className="text-sm" />
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-hover px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaTrash className="text-text-inverse text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-inverse">Confirm Deletion</h3>
                  <p className="text-text-inverse/80 text-sm">This action is irreversible</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-text/80 text-base leading-relaxed mb-8">
                Are you sure you want to permanently delete this dealer? All associated data will be lost and this
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-background-secondary hover:bg-background-secondary/80 text-text px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-red-700 text-text-inverse px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}