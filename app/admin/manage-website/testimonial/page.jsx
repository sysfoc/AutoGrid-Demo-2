"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonial");
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      setError(err.message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/testimonial/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      setTestimonials(testimonials.filter((t) => t._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The testimonial has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete testimonial.",
        icon: "error",
      });
    }
  };

if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-background-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-text-secondary font-medium">Loading testimonials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-background-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Testimonials</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
  <div className="bg-background rounded-2xl shadow-lg border border-background-secondary p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
          Testimonials Management
        </h1>
        <p className="text-text-secondary text-sm sm:text-base">
          Manage customer testimonials and reviews
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="text-center sm:text-right">
          <p className="text-sm text-text-secondary">Total Testimonials</p>
          <p className="text-xl sm:text-2xl font-bold text-text">{testimonials.length}</p>
        </div>
        <Link
          href="/admin/manage-website/testimonial/add"
          className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="whitespace-nowrap">Add New Testimonial</span>
        </Link>
      </div>
    </div>
  </div>
</div>

        {/* Content Section */}
        <div className="bg-background rounded-2xl shadow-lg border border-background-secondary overflow-hidden">
          {testimonials.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-background-secondary rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">No testimonials found</h3>
              <p className="text-text-secondary mb-6">Get started by adding your first customer testimonial.</p>
              <Link
                href="/admin/manage-website/testimonial/add"
                className="bg-primary hover:bg-primary-hover text-text-inverse font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Add First Testimonial
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="min-w-full">
                <TableHead className="bg-background-secondary">
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Customer</span>
                    </div>
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Customer Details
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Testimonial
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Date Added
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-background-secondary">
                  {testimonials.map((testimonial, index) => (
                    <TableRow
                      key={testimonial._id}
                      className="bg-background hover:bg-background-secondary transition-colors duration-200"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Image
                              src={testimonial.image}
                              width={60}
                              height={60}
                              alt={testimonial.name}
                              className="rounded-full object-cover shadow-md border-2 border-background-secondary"
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-text-inverse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-primary-light text-primary text-xs font-medium px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-text text-lg">
                            {testimonial.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.294a7.707 7.707 0 01-2-.286zM16 6H8v10l4 4 4-4V6z" />
                            </svg>
                            <span className="text-text-secondary font-medium">
                              {testimonial.designation}
                            </span>
                          </div>
                          {testimonial.rating && (
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-text-secondary'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6 max-w-xs">
                        <div className="relative">
                          <div className="absolute top-0 left-0 text-primary-light text-4xl leading-none">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                            </svg>
                          </div>
                          <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed pl-8 italic">
                            {testimonial.content || "No testimonial text provided"}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-9 4h10l2 8H5l2-8z" />
                          </svg>
                          <span className="text-text font-medium">
                            {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/admin/manage-website/testimonial/edit/${testimonial._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-text-inverse font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(testimonial._id)}
                            className="bg-primary hover:bg-primary-hover text-text-inverse font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
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
    </div>
  );
}