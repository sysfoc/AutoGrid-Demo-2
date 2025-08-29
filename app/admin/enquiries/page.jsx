"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  TextInput,
  Textarea,
  Button,
  Spinner,
  Badge,
} from "flowbite-react";
import {
  Eye,
  Reply,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Car,
  User,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react";

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 2;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDeleteModal = (enquiry) => {
    setEnquiryToDelete(enquiry);
    setShowDeleteModal(true);
  };

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/enquiry");
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleReply = async () => {
    if (!adminReply.trim()) return;

    setReplying(true);
    setReplyMessage("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: selectedEnquiry._id,
          adminReply: adminReply,
          repliedBy: "Admin",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setReplyMessage("Reply sent successfully and customer notified!");
        setAdminReply("");

        setEnquiries((prev) =>
          prev.map((enq) =>
            enq._id === selectedEnquiry._id
              ? { ...enq, status: "answered", adminReply: adminReply }
              : enq,
          ),
        );

        setTimeout(() => {
          setShowReplyModal(false);
          setReplyMessage("");
          setSelectedEnquiry(null);
        }, 2000);
      } else {
        setReplyMessage(result.error || "Failed to send reply.");
      }
    } catch (error) {
      console.error("Reply error:", error);
      setReplyMessage("Something went wrong. Please try again.");
    } finally {
      setReplying(false);
    }
  };

  const openReplyModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setAdminReply(enquiry.adminReply || "");
    setShowReplyModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      answered: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      resolved: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color}`}
      >
        <IconComponent size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

    const handleDelete = async () => {
      if (!enquiryToDelete) return;

      setDeleting(true);
      try {
        const response = await fetch("/api/enquiry", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enquiryId: enquiryToDelete._id,
          }),
        });

        if (response.ok) {
          setEnquiries((prev) =>
            prev.filter((enq) => enq._id !== enquiryToDelete._id),
          );
          setShowDeleteModal(false);
          setEnquiryToDelete(null);
        } else {
          console.error("Failed to delete enquiry");
        }
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setDeleting(false);
      }
    };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (filter === "all") return true;
    return enquiry.status === filter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);
  const startIndex = (currentPage - 1) * enquiriesPerPage;
  const endIndex = startIndex + enquiriesPerPage;
  const currentEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    answered: enquiries.filter((e) => e.status === "answered").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-3 font-medium text-slate-600">
              Loading enquiries...
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {/* Header Section */}
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-text">
            Customer Enquiries
          </h1>
          {/* <p className="text-lg text-gray-600">Manage and respond to customer enquiries efficiently</p> */}
        </div>
      </div>
    </div>

    <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-blue-100 p-2 sm:p-3">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-app-text">
              {stats.total}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500">
              Total Enquiries
            </p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-app-button custom-width"></div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-amber-100 p-2 sm:p-3">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">
              {stats.pending}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-emerald-100 p-2 sm:p-3">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {stats.answered}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Answered</p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
        </div>
      </div>
    </div>

    {/* Filter Tabs */}
    <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap border-b border-gray-200">
        {[
          { key: "all", label: "All Enquiries", count: stats.total },
          { key: "pending", label: "Pending", count: stats.pending },
          { key: "answered", label: "Answered", count: stats.answered },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`border-b-2 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
              filter === tab.key
                ? "border-app-button bg-red-50 text-app-button"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Enquiries List */}
    <div className="space-y-6">
      {currentEnquiries.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-app-text">
            No enquiries found
          </h3>
          <p className="text-gray-500">
            There are no enquiries matching your current filter.
          </p>
        </div>
      ) : (
        currentEnquiries.map((enquiry) => (
          <div
            key={enquiry._id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="mb-5 flex flex-col justify-between lg:flex-row lg:items-center">
                <div className="mb-4 flex items-center gap-4 lg:mb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-app-button to-app-button-hover">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-app-text">
                      {enquiry.firstName} {enquiry.lastName}
                    </div>
                    <p className="text-xs text-gray-500">
                      Enquiry ID: {enquiry._id.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(enquiry.status)}
                  <button
                    onClick={() => openDeleteModal(enquiry)}
                    className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-200"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                  <button
                    onClick={() => openReplyModal(enquiry)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      enquiry.status === "pending"
                        ? "bg-app-button text-white shadow-md hover:bg-app-button-hover hover:shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Reply size={14} />
                    {enquiry.status === "pending" ? "Reply" : "Edit Reply"}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Email
                      </p>
                      <p className="truncate text-sm font-medium text-app-text">
                        {enquiry.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-app-text">
                        {enquiry.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Car ID
                      </p>
                      <p className="text-sm truncate font-medium text-app-text">
                        {enquiry.carId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Date
                      </p>
                      <p className="text-sm font-medium text-app-text">
                        {new Date(enquiry.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              <div className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <p className="text-sm font-medium text-app-text">
                    Customer Message
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {enquiry.message || "No message provided"}
                  </p>
                </div>
              </div>

              {/* Admin Reply */}
              {enquiry.adminReply && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Reply className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-medium text-app-text">
                      Admin Reply
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {enquiry.adminReply}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Pagination */}
    {filteredEnquiries.length > 0 && totalPages > 1 && (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, filteredEnquiries.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{filteredEnquiries.length}</span>{" "}
            enquiries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentPage === pageNumber
                        ? "bg-app-button text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  <Modal
    dismissible
    show={showReplyModal}
    onClose={() => setShowReplyModal(false)}
    size="2xl"
    className="backdrop-blur-sm"
  >
    <ModalHeader className="border-b border-gray-200 pb-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-app-button to-app-button-hover">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-app-text">
            Reply to {selectedEnquiry?.firstName}{" "}
            {selectedEnquiry?.lastName}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {selectedEnquiry?.email}
          </p>
        </div>
      </div>
    </ModalHeader>

    <ModalBody className="p-6">
      <div className="space-y-6">
        {replyMessage && (
          <div
            className={`rounded-xl p-4 text-sm font-medium ${
              replyMessage.includes("success")
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {replyMessage}
          </div>
        )}

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-app-text">
            <MessageSquare className="h-4 w-4" />
            Customer&apos;s Message
          </label>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="leading-relaxed text-gray-700">
              {selectedEnquiry?.message || "No message provided"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-app-text">
            <Reply className="h-4 w-4" />
            Your Reply <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            rows={6}
            placeholder="Type your response to the customer here..."
            className="resize-none rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
            required
            disabled={replying}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowReplyModal(false)}
              className="rounded-xl bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
              disabled={replying}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReply}
              disabled={replying || !adminReply.trim()}
              className={`rounded-xl px-6 py-2 font-semibold transition-all duration-200 ${
                replying || !adminReply.trim()
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-app-button text-white shadow-md hover:bg-app-button-hover hover:shadow-lg"
              }`}
            >
              {replying ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Sending...
                </div>
              ) : (
                "Send Reply"
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <Modal
    dismissible
    show={showDeleteModal}
    onClose={() => setShowDeleteModal(false)}
    size="md"
    className="backdrop-blur-sm"
  >
    <ModalHeader className="border-b border-gray-200 pb-4">
      <div className="text-xl font-bold text-app-text">Delete Enquiry</div>
    </ModalHeader>
    <ModalBody className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-app-text">
              Are you sure you want to delete this enquiry?
            </p>
            <p className="text-sm text-gray-600">
              From: {enquiryToDelete?.firstName} {enquiryToDelete?.lastName}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          This action cannot be undone. The enquiry will be permanently removed from the system.
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-xl bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-6 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {deleting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
</div>
  );
};

export default AdminEnquiriesPage;
