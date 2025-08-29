"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "../../../context/CurrencyContext";

export default function Listing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const { currency, selectedCurrency } = useCurrency();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCars(cars.filter((car) => car._id !== id));
        alert("Car deleted successfully!");
      } else {
        alert("Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data.cars || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-3 font-medium text-slate-600">
              Loading vehicles...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-800">
              No Vehicles Found
            </h3>
            <p className="mb-8 text-slate-600">
              Start building your inventory by adding your first vehicle.
            </p>
            <Link
              href="/admin/listing/add"
              className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Vehicle
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-app-text">
                Vehicle Inventory
              </h1>
              <p className="text-slate-600">
                Manage your vehicle listings and inventory
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/listing/add"
                className="inline-flex items-center justify-center rounded-xl bg-app-button px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-app-button-hover hover:shadow-xl"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Vehicle
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by make or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-app-button"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">View:</span>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Switch to Grid View"
                  className={`rounded-md p-2 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-app-button shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`rounded-md p-2 transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white text-app-button shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredCars.length} of {cars.length} vehicles
            </p>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={car.imageUrls?.[0] || "/Luxury SUV.webp"}
                    fill
                    alt={`${car.make} ${car.model}`}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 flex flex-col gap-2">
                    <div className="rounded-lg bg-white/90 px-3 py-1 backdrop-blur-sm">
                      <span className="text-sm font-bold text-app-text">
                        {car.modelYear}
                      </span>
                    </div>
                    {car.sold && (
                      <div className="rounded-lg bg-red-500/90 px-3 py-1 backdrop-blur-sm">
                        <span className="text-sm font-bold text-white">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-1 text-xl font-bold text-app-text">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-2xl font-bold text-app-button">
                      {selectedCurrency?.symbol} {car.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="mb-6 space-y-2">
                    <div className="flex items-start text-sm text-slate-600">
                      <svg
                        className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="min-w-0 break-all">
                        User ID: {car.userId?.toString()}
                      </span>
                    </div>
                    <div className="flex items-start text-sm text-slate-600">
                      <svg
                        className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span className="min-w-0 break-all">{car.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/listing/edit/${car._id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-slate-100 px-4 py-2 font-medium text-app-text transition-all duration-200 hover:bg-slate-200"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
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
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Vehicle
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Make & Model
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-app-text">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCars.map((car) => (
                    <tr
                      key={car._id}
                      className="transition-colors duration-200 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                            <Image
                              src={car.imageUrls?.[0] || "/Luxury SUV.webp"}
                              fill
                              alt={`${car.make} ${car.model}`}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-app-text">
                            {car.make}
                          </p>
                          <p className="text-sm text-slate-600">{car.model}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-app-button">
                          {selectedCurrency?.symbol}{" "}
                          {car.price?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-app-text">
                            {car.modelYear}
                          </span>
                          {car.sold && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              SOLD
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600">
                          {car.userId?.toString().slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {car.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/listing/edit/${car._id}`}
                            className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-app-text transition-all duration-200 hover:bg-slate-200"
                          >
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(car._id)}
                            className="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
                          >
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
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
