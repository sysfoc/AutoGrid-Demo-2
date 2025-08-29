"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/UserContext";
import { IoLockClosedOutline, IoMail, IoCopyOutline } from "react-icons/io5";
import { MdFiberPin, MdAdminPanelSettings, MdPerson } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
    pin: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCredential, setActiveCredential] = useState<
    "superadmin" | "user"
  >("superadmin");
  const { refreshUser } = useAuth();

  const onLogin = async () => {
    try {
      setError("");
      setLoading(true);
      toast.info("Authenticating your credentials...");
      const response = await axios.post("/api/users/login", user, {
        withCredentials: true,
      });

      toast.success(
        `${response.data.role.charAt(0).toUpperCase() + response.data.role?.slice(1)} Login successful!`,
      );

      const receivedRole = response.data.role?.toLowerCase()?.trim();
      if (!receivedRole) {
        throw new Error("No role received from server");
      }
      await refreshUser();
      router.push(
        receivedRole === "superadmin" ? "/admin/dashboard" : "/admin/dashboard",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  useEffect(() => {
    setButtonDisabled(!user.email || !user.password);
  }, [user]);

  const demoCredentials: {
    superadmin: {
      email: string;
      password: string;
      pin: string;
      role: string;
    };
    user: {
      email: string;
      password: string;
      pin: string;
      role: string;
    };
  } = {
    superadmin: {
      email: "sysfoc_admin@gmail.com",
      password: "sysfoc_admin",
      pin: "123456",
      role: "superadmin",
    },
    user: {
      email: "Sysfoc_User@gmail.com",
      password: "Sysfoc_User@gmail.com",
      pin: "123456",
      role: "user",
    },
  };

  const currentCredentials = demoCredentials[activeCredential];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex mt-16 lg:mt-14">
      
      {/* Left Sidebar - Demo Credentials */}
      <div className="hidden lg:flex lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2H9m12 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6a2 2 0 012-2h12zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Demo Access</h3>
          </div>
          
          {/* Role Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveCredential("superadmin")}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeCredential === "superadmin"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <MdAdminPanelSettings className="w-4 h-4 mr-1" />
              Admin
            </button>
            <button
              onClick={() => setActiveCredential("user")}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeCredential === "user"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <MdPerson className="w-4 h-4 mr-1" />
              Staff
            </button>
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="space-y-4">
            {[
              { label: "Email", value: currentCredentials.email, icon: IoMail },
              { label: "Password", value: currentCredentials.password, icon: IoLockClosedOutline },
              { label: "PIN", value: currentCredentials.pin, icon: MdFiberPin }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</label>
                  <button
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
                  >
                    <IoCopyOutline className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <item.icon className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="font-mono text-sm text-gray-900 dark:text-white truncate">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setUser(currentCredentials)}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Auto-Fill Form
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {loading ? "Signing In..." : "Welcome Back"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-5 shadow-lg">
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoMail className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                      setError("");
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <input
                    type="password"
                    value={user.password}
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                      setError("");
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* PIN Field */}
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Security PIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdFiberPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    value={user.pin || ""}
                    onChange={(e) => {
                      setUser({ ...user, pin: e.target.value });
                      setError("");
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your PIN"
                  />
                </div>
              </div>

              {/* Quick Access Buttons - Mobile */}
              <div className="lg:hidden border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setUser(demoCredentials.superadmin)}
                    className="flex items-center justify-center px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-md text-sm font-medium border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    <MdAdminPanelSettings className="w-4 h-4 mr-1" />
                    Admin
                  </button>
                  <button
                    onClick={() => setUser(demoCredentials.user)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium border border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MdPerson className="w-4 h-4 mr-1" />
                    Staff
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={onLogin}
                disabled={buttonDisabled || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}