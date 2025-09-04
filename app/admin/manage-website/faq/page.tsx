"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface FAQ {
  _id: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
}

export default function Page() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("/api/faq");
        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data = await response.json();
        setFaqs(data.faqs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This FAQ will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });

      if (res.ok) {
        setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The FAQ has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the FAQ.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-secondary to-primary-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-text-secondary font-medium">Loading FAQs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-secondary to-primary-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading FAQs</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-secondary to-primary-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
       <div className="mb-8">
  <div className="bg-background rounded-2xl shadow-lg border border-text-secondary/20 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
          FAQ Management
        </h1>
        <p className="text-text-secondary text-sm sm:text-base">
          Manage frequently asked questions and help content
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="text-center sm:text-right">
          <p className="text-sm text-text-secondary">Total FAQs</p>
          <p className="text-xl sm:text-2xl font-bold text-text">{faqs.length}</p>
        </div>
        <Link
          href="/admin/manage-website/faq/add"
          className="bg-primary hover:bg-primary-hover text-text-inverse font-semibold px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="whitespace-nowrap">Add New FAQ</span>
        </Link>
      </div>
    </div>
  </div>
</div>
        {/* Content Section */}
        <div className="bg-background rounded-2xl shadow-lg border border-text-secondary/20 overflow-hidden">
          {faqs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-background-secondary rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">No FAQs found</h3>
              <p className="text-text-secondary mb-6">Get started by creating your first FAQ entry.</p>
              <Link
                href="/admin/manage-website/faq/add"
                className="bg-primary hover:bg-primary-hover text-text-inverse font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Create First FAQ
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="min-w-full">
                <TableHead className="bg-background-secondary">
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span>Order</span>
                    </div>
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    FAQ Details
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Description
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Created Date
                  </TableHeadCell>
                  <TableHeadCell className="text-text font-semibold py-4 px-6">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-text-secondary/20">
                  {faqs
                    .sort((a, b) => a.order - b.order)
                    .map((faq, index) => (
                    <TableRow
                      key={faq._id}
                      className="bg-background hover:bg-background-secondary transition-colors duration-200"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <span className="bg-primary-light text-primary text-sm font-semibold px-3 py-1 rounded-full">
                            #{faq.order}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-text text-lg leading-tight">
                            {faq.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-text-secondary font-medium">
                              FAQ #{index + 1}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6 max-w-xs">
                        <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
                          {faq.description || "No description provided"}
                        </p>
                      </TableCell>
                      
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-9 4h10l2 8H5l2-8z" />
                          </svg>
                          <span className="text-text font-medium">
                            {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString('en-US', {
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
                            href={`/admin/manage-website/faq/edit/${faq._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-text-inverse font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(faq._id)}
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