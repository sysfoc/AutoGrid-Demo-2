"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPencilAlt, FaList, FaUser } from "react-icons/fa";
import { TiWorld } from "react-icons/ti";
import { HiChartPie } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaIdeal } from "react-icons/fa6";
import { MdAppSettingsAlt, MdLogout } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { ChevronDown, ChevronRight } from "lucide-react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { TbCalendarSearch } from "react-icons/tb";
import { MdOutlineSubtitles } from "react-icons/md";
import { BiMessageSquareEdit } from "react-icons/bi";

const AdminSidebar = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        } else {
          console.error("Failed to fetch user data");
          const token = Cookies.get("token");
          if (token) {
            const decoded = jwt.decode(token);
            setUserRole(decoded?.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const token = Cookies.get("token");
        if (token) {
          const decoded = jwt.decode(token);
          setUserRole(decoded?.role);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/users/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        Cookies.remove("token");
        localStorage.removeItem("cookie_consent");
        localStorage.removeItem("analytics_settings");
        if (typeof window.gtag === "function") {
          window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
          });
        }
        router.replace("/login");
      } else {
        console.error("Logout failed:", await response.text());
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleGroup = (groupLabel) => {
    setExpandedGroups((prev) => {
      const isCurrentlyExpanded = prev[groupLabel];
      // Close all groups and toggle current one
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      newState[groupLabel] = !isCurrentlyExpanded;
      return newState;
    });
  };

  const sidebarItems = [
    // { label: "Dashboard", href: "/admin/dashboard", icon: HiChartPie },
    { label: "Contact Submissions", href: "/admin/contact", icon: IoIosContact },
    { label: "Value Submissions", href: "/admin/valuation", icon: BiMessageSquareEdit },
    { label: "Car Enquiry", href: "/admin/enquiries", icon: TbCalendarSearch },
    { label: "Finance Enquiry", href: "/admin/finance", icon: TbCalendarSearch },
    // { label: "Dealers", href: "/admin/create-dealer", icon: FaIdeal },
    { label: "Meta Editor", href: "/admin/meta-editor", icon: MdOutlineSubtitles },
    { label: "Manage Blogs", href: "/admin/blog", icon: FaPencilAlt },
  ];

  const collapsibleItems = [
    ...(userRole === "superadmin"
      ? [
          {
            label: "Manage Users",
            icon: FaUser,
            links: [
              { label: "All users", href: "/admin/manage-users" },
              { label: "Create User", href: "/admin/createUser" },
            ],
          },
          {
            label: "Manage Dealers",
            icon: FaIdeal,
            links: [
              { label: "All Dealers", href: "/admin/view-dealer" },
              { label: "Create Dealers", href: "/admin/create-dealer" },
            ],
          },
        ]
      : []),
    {
      label: "Manage Listings",
      icon: FaList,
      links: [
        { label: "Listing Brands", href: "/admin/listing/brand" },
        { label: "Add Listings", href: "/admin/listing/add" },
        { label: "Listings", href: "/admin/listing/view" },
        { label: "Pending Listings", href: "/admin/listing/approved" },
      ],
    },
    {
      label: "Manage Website",
      icon: TiWorld,
      links: [
        { label: "FAQ", href: "/admin/manage-website/faq" },
        { label: "Testimonial", href: "/admin/manage-website/testimonial" },
      ],
    },
    {
      label: "Settings",
      icon: IoSettingsSharp,
      links: [
        { label: "General Settings", href: "/admin/setting/general" },
        { label: "Default Settings", href: "/admin/setting/default" },
        { label: "Currency", href: "/admin/setting/currency" },
        { label: "Social Media", href: "/admin/setting/social" },
      ],
    },
    {
      label: "Page Settings",
      icon: MdAppSettingsAlt,
      links: [
        { label: "Home", href: "/admin/setting/page/home" },
        { label: "Contact", href: "/admin/setting/page/contact" },
        { label: "Utility pages", href: "/admin/setting/page/about" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-64 border-r border-slate-200 bg-white p-4">
        <div className="animate-pulse">
          <div className="mb-6 h-8 rounded bg-slate-200"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
   <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-app-text to-slate-700">
            <HiChartPie className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-app-text">Admin Panel</h2>
            <p className="text-xs capitalize text-slate-500">
              {userRole || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Now with proper flex and min-height */}
      <div className="flex flex-1 flex-col overflow-hidden">
       <div className="flex-1 overflow-y-auto py-4 custom-min-height">
          <nav className="space-y-2 px-4">

             <a
    href="/admin/dashboard"
    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-app-text transition-colors duration-200 hover:bg-slate-50 hover:text-app-button"
  >
    <HiChartPie className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-app-button" />
    <span className="text-sm font-medium">Dashboard</span>
  </a>
            

            {/* Collapsible Groups */}
            {collapsibleItems.map((group) => (
              <div key={group.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-app-text transition-colors duration-200 hover:bg-slate-50 hover:text-app-button"
                >
                  <group.icon className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-app-button" />
                  <span className="flex-1 text-left text-sm font-medium">
                    {group.label}
                  </span>
                  {expandedGroups[group.label] ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-app-button" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-app-button" />
                  )}
                </button>

                {expandedGroups[group.label] && (
                  <div className="ml-4 space-y-1 border-l border-slate-200 pl-4">
                    {group.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm text-app-text/70 transition-colors duration-200 hover:bg-slate-50 hover:text-app-button"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sidebarItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-app-text transition-colors duration-200 hover:bg-slate-50 hover:text-app-button"
              >
                <item.icon className="h-5 w-5 text-slate-500 transition-colors duration-200 group-hover:text-app-button" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Logout Button - Always visible at bottom */}
        <div className="flex-shrink-0 border-t border-slate-200 p-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-app-button transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdLogout className="h-5 w-5" />
            <span className="text-sm font-medium">
              {isLoggingOut ? "Logging Out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;