"use client";
import { useEffect, useState } from "react";
import { Trash2, Users, Crown, User } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation'

export default function Page() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  const router = useRouter();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);

  // Effect for checking user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        
        if (data.user.role !== 'superadmin') {
          router.replace('/admin/dashboard');
        } else {
          setIsSuperAdmin(true);
        }
      } catch (error) {
        router.replace('/admin/dashboard');
      } finally {
        setInitialCheck(false);
      }
    };

    fetchUserRole();
  }, [router]);

  // Effect for fetching users (only for superadmin)
  useEffect(() => {
    if (isSuperAdmin) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/users?page=${currentPage}&limit=${limit}`,
            { withCredentials: true }
          );
          setUsers(response.data.users || []);
          setTotalPages(response.data.totalPages || 1);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
          toast.error("Error fetching users.");
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [currentPage, isSuperAdmin, limit]);

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete("/api/users/delete", {
        data: { userId },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("User deleted successfully!");
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Loading and redirect states
  if (initialCheck) {
    return <div>Loading...</div>;
  }

  if (!isSuperAdmin) {
    return <div>Redirecting to dashboard...</div>;
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
     
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Active Users</h2>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {users.length} user{users.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-app-text">Loading users...</p>
            </div>
          )}

          {/* Table Container */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase tracking-wider">
                      User Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase tracking-wider">
                      Password
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-app-text uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-app-text uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr 
                        key={user._id} 
                        className={`hover:bg-slate-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(user.username || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-app-text">
                                {user.username || "No username found"}
                              </p>
                              <p className="text-sm text-slate-500">ID: {user._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-app-text font-medium">{user.email}</div>
                          {/* <div className="text-sm text-slate-500">Primary contact</div> */}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-sm">••••••••</span>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              Protected
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user?.role === "superadmin" ? (
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-3 py-2 rounded-full border border-amber-200">
                              <Crown className="h-4 w-4" />
                              <span className="font-semibold text-sm">Super Admin</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-gray-100 text-app-text px-3 py-2 rounded-full border border-slate-200">
                              <User className="h-4 w-4" />
                              <span className="font-medium text-sm">User</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-app-button hover:bg-app-button-hover text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-app-text mb-1">No users found</h3>
                            <p className="text-slate-500">There are currently no users to display</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-app-text">
                  Showing page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-slate-300 text-app-text rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm shadow-sm"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-app-text border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-slate-300 text-app-text rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
}