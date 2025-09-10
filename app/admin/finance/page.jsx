"use client"
import { useState, useEffect } from "react"
import {
  Eye,
  Reply,
  Clock,
  CheckCircle,
  Mail,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Send,
  RefreshCw,
  Calculator,
  Phone,
} from "lucide-react"
import { MdCancel } from "react-icons/md"

// Custom Modal Components
const Modal = ({ show, onClose, children, size = "md" }) => {
  if (!show) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl",
    "3xl": "max-w-[90rem]",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-2 sm:p-4">
      <div
        className={`relative w-full rounded-2xl bg-white shadow-xl ${sizeClasses[size]} mx-auto max-h-[95vh] overflow-hidden`}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 sm:right-4 sm:top-4 z-50 cursor-pointer text-black hover:text-gray-500"
        >
          <MdCancel size={24} className="sm:w-8 sm:h-8" />
        </button>
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ children }) => (
  <div className="sticky top-0 z-10 rounded-t-2xl border-b border-gray-200 bg-white p-3 sm:p-6">{children}</div>
)

const ModalBody = ({ children, className = "" }) => (
  <div className={`max-h-[70vh] sm:max-h-[80vh] overflow-y-auto p-3 sm:p-6 ${className}`}>{children}</div>
)

// Spinner Component
const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-3",
    lg: "h-8 w-8 border-4",
  }

  return (
    <div
      className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-solid border-blue-600 border-t-transparent`}
    />
  )
}

const DeleteConfirmModal = ({ show, onClose, onConfirm, loading }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div className="relative mx-auto w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-100">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Rate Request</h3>
              <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <p className="mb-6 text-sm sm:text-base text-gray-600">
            Are you sure you want to delete this rate request? This will permanently remove it from your system.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Deleting...
                </>
              ) : (
                "Delete Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdminRateRequestsPage = () => {
  const [rateRequests, setRateRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [adminReply, setAdminReply] = useState("")
  const [replying, setReplying] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [filter, setFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const requestsPerPage = 5
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchRateRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/rate-requests")
      if (!response.ok) {
        throw new Error("Failed to fetch rate requests")
      }
      const data = await response.json()
      setRateRequests(data)
    } catch (error) {
      console.error("Error fetching rate requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRateRequests()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchTerm])

  const handleReply = async () => {
    if (!adminReply.trim()) return

    setReplying(true)
    setReplyMessage("")

    try {
      const response = await fetch("/api/rate-requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          adminReply: adminReply,
          repliedBy: "Admin",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send reply")
      }

      setReplyMessage("Reply sent successfully and customer notified!")
      setAdminReply("")

      // Update the local state
      setRateRequests((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id
            ? {
                ...req,
                status: "answered",
                adminReply: adminReply,
                repliedAt: new Date().toISOString(),
                repliedBy: "Admin",
              }
            : req,
        ),
      )

      setTimeout(() => {
        setShowReplyModal(false)
        setReplyMessage("")
        setSelectedRequest(null)
        fetchRateRequests()
      }, 2000)
    } catch (error) {
      console.error("Reply error:", error)
      setReplyMessage(`Something went wrong: ${error.message}. Please try again.`)
    } finally {
      setReplying(false)
    }
  }

  const openReplyModal = (request) => {
    setSelectedRequest(request)
    setAdminReply(request.adminReply || "")
    setShowReplyModal(true)
  }

  const openViewModal = (request) => {
    setSelectedRequest(request)
    setShowViewModal(true)
  }

  const getStatusBadge = (status) => {
    if (!status) {
    status = 'pending';
  }
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      answered: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold ${config.color}`}
      >
        <IconComponent size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
  // Filter and search logic
  const filteredRequests = rateRequests
    .filter((request) => {
      if (filter === "all") return true
      return request.status === filter
    })
    .filter((request) => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return (
        request.name.toLowerCase().includes(search) ||
        request.email.toLowerCase().includes(search) ||
        request.mobile.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt)
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage)
  const startIndex = (currentPage - 1) * requestsPerPage
  const endIndex = startIndex + requestsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const stats = {
    total: rateRequests.length,
    pending: rateRequests.filter((req) => req.status === "pending").length,
    answered: rateRequests.filter((req) => req.status === "answered").length,
  }

  const handleDeleteRequest = async () => {
    setDeleting(true)
    try {
      const response = await fetch("/api/rate-requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: requestToDelete }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete request")
      }

      setRateRequests((prev) => prev.filter((req) => req._id !== requestToDelete))
      setShowDeleteModal(false)
      setRequestToDelete(null)
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="text-base sm:text-lg font-medium text-slate-600">Loading rate requests...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-8 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rate Requests</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Manage and respond to vehicle finance rate requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRateRequests}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-app-button hover:bg-app-button-hover px-3 py-2 sm:px-4 text-sm font-medium text-white transition-colors"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:scale-[1.015] hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-primary-light p-2 sm:p-3">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:scale-[1.015] hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="rounded-xl bg-amber-100 p-2 sm:p-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:scale-[1.015] hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Answered</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.answered}</p>
              </div>
              <div className="rounded-xl bg-primary-light p-2 sm:p-3">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: stats.total },
                { key: "pending", label: "Pending", count: stats.pending },
                { key: "answered", label: "Answered", count: stats.answered },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? "border-2 border-app-border bg-primary-light text-primary"
                      : "border-2 border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {currentRequests.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100">
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">No requests found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No rate requests have been received yet."}
              </p>
            </div>
          ) : (
            currentRequests.map((request) => (
              <div
                key={request._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-lg"
              >
                <div className="p-4 sm:p-6">
                  {/* Header Row */}
                  <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-app-dark flex-shrink-0">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{request.name}</h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <Mail size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="truncate">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                          <span className="truncate"> {request.mobile}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {getStatusBadge(request.status)}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openViewModal(request)}
                          className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => openReplyModal(request)}
                          className={`flex items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                            request.status === "pending"
                              ? "bg-app-button text-white hover:bg-app-button-hover"
                              : "bg-primary text-white hover:bg-primary-hover"
                          }`}
                        >
                          <Reply size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">
                            {request.status === "pending" ? "Reply" : "Edit Reply"}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setRequestToDelete(request._id)
                            setShowDeleteModal(true)
                          }}
                          className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg border border-red-300 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <X size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Summary */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-gray-500">Car Price</p>
                        <p className="text-sm font-semibold">${request.calculationData?.carPrice?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Loan Amount</p>
                        <p className="text-sm font-semibold">
                          ${request.calculationData?.loanAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="text-sm font-semibold">
                          ${request.calculationData?.periodicPayment?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Term</p>
                        <p className="text-sm font-semibold">{request.calculationData?.loanTerm} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col justify-between gap-2 text-xs text-gray-500 sm:flex-row sm:items-center">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {request.repliedAt && (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={12} />
                          Replied {new Date(request.repliedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">ID: {request._id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-6 shadow-sm sm:flex-row">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length}{" "}
                requests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-app-button text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        <Modal show={showReplyModal} onClose={() => setShowReplyModal(false)} size="lg">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary-light">
                <Reply className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedRequest?.status === "pending" ? "Reply to Rate Request" : "Edit Reply"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {selectedRequest?.name} • {selectedRequest?.email}
                </p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4 sm:mb-6 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <h4 className="mb-2 text-xs sm:text-sm font-medium text-gray-700">Rate Request Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500">Car Price:</span>
                  <span className="ml-2 font-medium">
                    ${selectedRequest?.calculationData?.carPrice?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Car Year:</span>
                  <span className="ml-2 font-medium">{selectedRequest?.calculationData?.carYear}</span>
                </div>
                <div>
                  <span className="text-gray-500">Loan Amount:</span>
                  <span className="ml-2 font-medium">
                    ${selectedRequest?.calculationData?.loanAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment:</span>
                  <span className="ml-2 font-medium">
                    ${selectedRequest?.calculationData?.periodicPayment?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-900">Your Reply</label>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Type your reply here..."
              />
            </div>
            {replyMessage && (
              <div
                className={`mb-4 rounded-lg p-3 text-xs sm:text-sm ${
                  replyMessage.includes("successfully")
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {replyMessage}
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!adminReply.trim() || replying}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-app-button hover:bg-app-button-hover px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {replying ? (
                  <>
                    <Spinner size="sm" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </ModalBody>
        </Modal>

        {/* View Modal */}
        <Modal show={showViewModal} onClose={() => setShowViewModal(false)} size="3xl">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-100">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Rate Request Details</h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">ID: {selectedRequest?._id}</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="space-y-4 sm:space-y-6">
            {selectedRequest && (
              <>
                {/* Customer Info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <h4 className="mb-2 text-sm sm:text-base font-medium text-gray-900">Customer Information</h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <User size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-medium truncate">{selectedRequest.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{selectedRequest.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📱</span>
                        <span className="truncate">{selectedRequest.mobile}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <h4 className="mb-2 text-sm sm:text-base font-medium text-gray-900">Request Status</h4>
                    <div className="space-y-2">
                      {getStatusBadge(selectedRequest.status)}
                      <div className="text-xs text-gray-500">
                        <div>Created: {new Date(selectedRequest.createdAt).toLocaleString()}</div>
                        {selectedRequest.repliedAt && (
                          <div>Replied: {new Date(selectedRequest.repliedAt).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Details */}
                <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
                  <h4 className="mb-3 text-sm sm:text-base font-medium text-gray-900">Calculation Details</h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Car Price:</span>
                      <p className="font-medium">${selectedRequest.calculationData?.carPrice?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Car Year:</span>
                      <p className="font-medium">{selectedRequest.calculationData?.carYear}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deposit:</span>
                      <p className="font-medium">${selectedRequest.calculationData?.depositAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Amount:</span>
                      <p className="font-medium">${selectedRequest.calculationData?.loanAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Term:</span>
                      <p className="font-medium">{selectedRequest.calculationData?.loanTerm} years</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <p className="font-medium">
                        ${selectedRequest.calculationData?.periodicPayment?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Interest Rate:</span>
                      <p className="font-medium">{selectedRequest.calculationData?.interestRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Interest:</span>
                      <p className="font-medium">${selectedRequest.calculationData?.totalInterest?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Reply */}
                {selectedRequest.adminReply && (
                  <div className="rounded-lg border border-app-border bg-primary-light p-3 sm:p-4">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <h4 className="text-sm sm:text-base font-medium text-app-dark">Admin Reply</h4>
                      {selectedRequest.repliedBy && (
                        <span className="text-xs text-primary">by {selectedRequest.repliedBy}</span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-xs sm:text-sm text-app-dark">
                      {selectedRequest.adminReply}
                    </p>
                  </div>
                )}
              </>
            )}
          </ModalBody>
        </Modal>

        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setRequestToDelete(null)
          }}
          onConfirm={handleDeleteRequest}
          loading={deleting}
        />
      </div>
    </div>
  )
}

export default AdminRateRequestsPage