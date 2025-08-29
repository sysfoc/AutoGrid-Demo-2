"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleStatusChange = async (carId, newStatus) => {
    try {
      const response = await fetch("/api/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(data.message);
      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId ? { ...car, status: newStatus } : car,
        ),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 font-medium">Loading car listings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-app-text mb-2">
                  Manage Car Listings
                </h1>
                <p className="text-slate-600">
                  Review and manage car listing approvals
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Listings</p>
                  <p className="text-2xl font-bold text-app-button">{cars.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {cars.filter(car => car.status === 1).length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {cars.filter(car => car.status === 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {cars.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-app-text mb-2">No car listings found</h3>
              <p className="text-slate-500">There are currently no cars pending approval.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="min-w-full">
                <TableHead className="bg-slate-50">
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    Featured Photo
                  </TableHeadCell>
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    Vehicle Details
                  </TableHeadCell>
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    Location
                  </TableHeadCell>
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    User Info
                  </TableHeadCell>
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    Status
                  </TableHeadCell>
                  <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-slate-200">
                  {cars.map((car) => (
                    <TableRow
                      key={car._id}
                      className="bg-white hover:bg-slate-50 transition-colors duration-200"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="relative">
                          <Image
                            src={car.imageUrls?.[0]}
                            width={100}
                            height={75}
                            alt="Car Image"
                            className="rounded-xl object-cover shadow-md border border-slate-200"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-app-text text-lg">
                            {car.model}
                          </h4>
                          <p className="text-slate-600 font-medium">
                            {car.make}
                          </p>
                          <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">
                            {car.slug}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-app-text font-medium">
                            {car.location || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {car.userId?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="text-app-text font-mono text-sm">
                            {car.userId}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        {car.status === 1 ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                              Approved
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm">
                              Pending
                            </span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-x-3">
                          {car.status === 1 ? (
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => handleStatusChange(car._id, 0)}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                              </svg>
                              Unapprove
                            </Button>
                          ) : (
                            <Button
                              color="success"
                              size="sm"
                              onClick={() => handleStatusChange(car._id, 1)}
                              className="bg-app-button hover:bg-app-button-hover text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
