"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Page() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brand");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (brandId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this brand?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/brand/${brandId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete brand");
      } else {
        toast.success("Brand deleted successfully!");
        setBrands((prevBrands) =>
          prevBrands.filter((brand) => brand._id !== brandId)
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading brands...</span>
          </div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Brands Found</h3>
            <p className="text-slate-600 mb-8">Create your first brand to get started with your automotive marketplace.</p>
            <Link
              href="/admin/listing/brand/add"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add First Brand
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Brand Management</h1>
              <p className="text-slate-600">Manage automotive brands and their information</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/listing/brand/add"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Brand
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 font-medium">View:</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Switch to Grid View"
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "table" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredBrands.length} of {brands.length} brands
            </p>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          /* Grid View */
          // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand, index) => (
              <div key={brand._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-32 flex items-center justify-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md">
                    <Image
                      src={brand.logo}
                      fill
                      alt={brand.name}
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="absolute top-3 left-3 bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">{brand.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/listing/brand/edit/${brand._id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteBrand(brand._id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all duration-200 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">#</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Logo</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Brand Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Slug</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBrands.map((brand, index) => (
                    <tr key={brand._id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative w-16 h-16 bg-slate-50 rounded-lg overflow-hidden">
                          <Image
                            src={brand.logo}
                            fill
                            alt={brand.name}
                            className="object-contain p-2"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-800">{brand.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {brand.slug}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/listing/brand/edit/${brand._id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteBrand(brand._id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
